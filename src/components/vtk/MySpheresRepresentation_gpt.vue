<script setup lang="ts">
import { inject, nextTick, onMounted, onUnmounted, toRefs, watch } from 'vue';
import { VtkViewContext } from '@/src/components/vtk/context';
import type { Vector3 } from '@kitware/vtk.js/types';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkGlyph3DMapper from '@kitware/vtk.js/Rendering/Core/Glyph3DMapper';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkArrowSource from '@kitware/vtk.js/Filters/Sources/ArrowSource';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';

import {
  useSetPointsEvents,
  useSetPointsColorArrowEvents,
  useClearPointsEvents,
  useChangeNearValueEvents,
} from '@/src/components/App.vue';

interface Props {
  id: string; // ObliqueCoronal / ObliqueSagittal / ObliqueAxial
  planeOrigin: number[]; // 十字线中心点
}

type PointWithDirection = Vector3 | [Vector3, Vector3];
type PointsByColor = Record<string, PointWithDirection[]>;

interface CachedGlyphItem {
  position: Vector3;
  transformed: [number, number, number]; // 预先转到另一个坐标系，后续只做距离判断
  color255: [number, number, number];
  direction?: Vector3;
}

const props = defineProps<Props>();
const { id, planeOrigin } = toRefs(props);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

let isMounted = false;
let renderRaf: number | null = null;

let spherePolyData!: vtkPolyData;
let arrowPolyData!: vtkPolyData;

let sphereActor!: vtkActor;
let arrowActor!: vtkActor;

let sphereSource!: vtkSphereSource;
let arrowSource!: vtkArrowSource;

let sphereMapper!: vtkGlyph3DMapper;
let arrowMapper!: vtkGlyph3DMapper;

// 缓存所有输入点：数据进入时就把坐标系转换好
let cachedItems: CachedGlyphItem[] = [];
let currentRadius = 2.8;

function scheduleRender() {
  if (!view) return;

  if (renderRaf !== null) {
    cancelAnimationFrame(renderRaf);
  }

  renderRaf = requestAnimationFrame(() => {
    view.renderWindow.render();
    renderRaf = null;
  });
}

function normalizeColor255(inputColor: string): [number, number, number] {
  const colorMap: Record<string, string> = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    white: '#ffffff',
    black: '#000000',
    yellow: '#ffff00',
    cyan: '#00ffff',
    magenta: '#ff00ff',
  };

  let hexColor = colorMap[inputColor] || inputColor;

  if (!/^#[0-9A-Fa-f]{3}$/.test(hexColor) && !/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
    throw new Error(`Invalid color format: ${inputColor}`);
  }

  if (/^#[0-9A-Fa-f]{3}$/.test(hexColor)) {
    hexColor = `#${hexColor
      .slice(1)
      .split('')
      .map((c) => c + c)
      .join('')}`;
  }

  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ];
}

function pushRGBA(dst: number[], rgb255: [number, number, number], alpha = 255) {
  dst.push(rgb255[0], rgb255[1], rgb255[2], alpha);
}

function isClearPlaceholder(positionList: Vector3[]) {
  return (
    Array.isArray(positionList) &&
    positionList.length === 1 &&
    Array.isArray(positionList[0]) &&
    positionList[0][0] === 1000 &&
    positionList[0][1] === 1000 &&
    positionList[0][2] === 1000
  );
}

function parsePointItem(item: PointWithDirection): {
  position: Vector3;
  direction?: Vector3;
} {
  if (
    Array.isArray(item) &&
    item.length === 2 &&
    Array.isArray(item[0]) &&
    Array.isArray(item[1])
  ) {
    return {
      position: item[0] as Vector3,
      direction: item[1] as Vector3,
    };
  }

  return {
    position: item as Vector3,
  };
}

// 你原来的矩阵变换逻辑保留：先把世界坐标转成另一个坐标系，再去判断和切片距离
function getNewPosition(position: number[]): [number, number, number] {
  const worldToIndex = (window as any).worldToIndex as number[] | undefined;
  const spacing = (window as any).spacing as number[] | undefined;

  if (!worldToIndex || !spacing || worldToIndex.length < 16 || spacing.length < 3) {
    return [position[0], position[1], position[2]];
  }

  const x =
    worldToIndex[0] * position[0] +
    worldToIndex[4] * position[1] +
    worldToIndex[8] * position[2] +
    worldToIndex[12] * 1;

  const y =
    worldToIndex[1] * position[0] +
    worldToIndex[5] * position[1] +
    worldToIndex[9] * position[2] +
    worldToIndex[13] * 1;

  const z =
    worldToIndex[2] * position[0] +
    worldToIndex[6] * position[1] +
    worldToIndex[10] * position[2] +
    worldToIndex[14] * 1;

  return [x * spacing[0], y * spacing[1], z * spacing[2]];
}

function getNearRadius() {
  return Number((window as any).nearValue ?? 0);
}

function getPlaneOriginInIndexSpace(): [number, number, number] {
  return getNewPosition(planeOrigin.value);
}

function isVisibleInCurrentView(
  transformedPoint: [number, number, number],
  transformedPlaneOrigin: [number, number, number],
  nearRadius: number
) {
  if (id.value === 'ObliqueCoronal') {
    return Math.abs(transformedPoint[2] - transformedPlaneOrigin[2]) <= nearRadius;
  }

  if (id.value === 'ObliqueSagittal') {
    return Math.abs(transformedPoint[0] - transformedPlaneOrigin[0]) <= nearRadius;
  }

  if (id.value === 'ObliqueAxial') {
    return Math.abs(transformedPoint[1] - transformedPlaneOrigin[1]) <= nearRadius;
  }

  return true;
}

function buildCachedItemsFromObj(obj: PointsByColor): CachedGlyphItem[] {
  const items: CachedGlyphItem[] = [];

  Object.keys(obj).forEach((key: string) => {
    const color255 = normalizeColor255(key);
    const positionList = obj[key];

    positionList.forEach((item) => {
      const { position, direction } = parsePointItem(item);
      const transformed = getNewPosition(position);

      items.push({
        position: [position[0], position[1], position[2]],
        transformed,
        color255,
        direction: direction ? [direction[0], direction[1], direction[2]] : undefined,
      });
    });
  });

  return items;
}

function buildCachedItemsFromPlainList(positionList: Vector3[]): CachedGlyphItem[] {
  const items: CachedGlyphItem[] = [];

  positionList.forEach((position) => {
    const transformed = getNewPosition(position);
    items.push({
      position: [position[0], position[1], position[2]],
      transformed,
      color255: [255, 0, 0],
    });
  });

  return items;
}

function createColorArray(values: number[]) {
  return vtkDataArray.newInstance({
    name: 'color',
    numberOfComponents: 4,
    values: new Uint8Array(values),
    dataType: 'Uint8Array',
  });
}

function createVectorArray(values: number[]) {
  return vtkDataArray.newInstance({
    name: 'vectors',
    numberOfComponents: 3,
    values: new Float32Array(values),
    dataType: 'Float32Array',
  });
}

function clearPolyData() {
  if (!spherePolyData || !arrowPolyData) return;

  spherePolyData.getPoints().setData(new Float32Array(), 3);
  spherePolyData.getPointData().setScalars(
    createColorArray([])
  );

  arrowPolyData.getPoints().setData(new Float32Array(), 3);
  const arrowPD = arrowPolyData.getPointData();
  arrowPD.setScalars(createColorArray([]));
  arrowPD.setVectors(createVectorArray([]));

  spherePolyData.modified();
  arrowPolyData.modified();
  scheduleRender();
}

function updateGlyphs() {
  if (!isMounted) return;

  if (!cachedItems.length) {
    clearPolyData();
    return;
  }

  const nearRadius = getNearRadius();
  const transformedPlaneOrigin = getPlaneOriginInIndexSpace();

  sphereSource.setRadius(currentRadius);

  const spherePositions: number[] = [];
  const sphereColors: number[] = [];

  const arrowPositions: number[] = [];
  const arrowColors: number[] = [];
  const arrowVectors: number[] = [];

  // 保留你原来的偏移算法，外观不会变
  const offset = (6 * currentRadius * currentRadius) / (6 * currentRadius - 5) + 2.7;

  for (const item of cachedItems) {
    if (!isVisibleInCurrentView(item.transformed, transformedPlaneOrigin, nearRadius)) {
      continue;
    }

    spherePositions.push(item.position[0], item.position[1], item.position[2]);
    pushRGBA(sphereColors, item.color255, 255);

    if (item.direction && item.direction.length) {
      const dx = item.direction[0];
      const dy = item.direction[1];
      const dz = item.direction[2];
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const dir: Vector3 = len > 0 ? [dx / len, dy / len, dz / len] : [1, 0, 0];

      const adjustedPosition: [number, number, number] = [
        item.position[0] + dir[0] * offset,
        item.position[1] + dir[1] * offset,
        item.position[2] + dir[2] * offset,
      ];

      arrowPositions.push(adjustedPosition[0], adjustedPosition[1], adjustedPosition[2]);
      pushRGBA(arrowColors, item.color255, 255);
      arrowVectors.push(dir[0], dir[1], dir[2]);
    }
  }

  spherePolyData.getPoints().setData(Float32Array.from(spherePositions), 3);
  spherePolyData.getPointData().setScalars(createColorArray(sphereColors));

  arrowPolyData.getPoints().setData(Float32Array.from(arrowPositions), 3);
  const arrowPD = arrowPolyData.getPointData();
  arrowPD.setScalars(createColorArray(arrowColors));
  arrowPD.setVectors(createVectorArray(arrowVectors));

  spherePolyData.modified();
  arrowPolyData.modified();
  scheduleRender();
}

function addPoints(positionList: Vector3[], radius: number) {
  currentRadius = radius;

  // 保留你原来的“清空占位点”写法
  if (isClearPlaceholder(positionList)) {
    cachedItems = buildCachedItemsFromPlainList(positionList);
  } else {
    cachedItems = buildCachedItemsFromPlainList(positionList);
  }

  updateGlyphs();
}

function addPointsColorArrow(obj: PointsByColor, radius: number) {
  currentRadius = radius;

  if (!obj) {
    cachedItems = [];
    updateGlyphs();
    return;
  }

  cachedItems = buildCachedItemsFromObj(obj);
  updateGlyphs();
}

function clearPoints() {
  // 保留你原来“清空后放一个远点”的行为
  cachedItems = buildCachedItemsFromPlainList([[1000, 1000, 1000]]);
  currentRadius = 0.1;
  updateGlyphs();
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: number | null = null;

  return function (this: any, ...args: any[]) {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  } as T;
}

const debouncedUpdateGlyphs = debounce(() => {
  updateGlyphs();
}, 80);

onMounted(() => {
  isMounted = true;

  sphereSource = vtkSphereSource.newInstance();
  sphereSource.setThetaResolution(16);
  sphereSource.setPhiResolution(16);

  arrowSource = vtkArrowSource.newInstance();
  arrowSource.setTipResolution(16);
  arrowSource.setShaftResolution(16);
  arrowSource.setTipRadius(0.06);
  arrowSource.setTipLength(0.2);
  arrowSource.setShaftRadius(0.02);

  spherePolyData = vtkPolyData.newInstance();
  spherePolyData.setPoints(vtkPoints.newInstance());
  spherePolyData.getPointData().setScalars(createColorArray([]));

  sphereMapper = vtkGlyph3DMapper.newInstance();
  sphereMapper.setInputData(spherePolyData);
  sphereMapper.setSourceConnection(sphereSource.getOutputPort());
  sphereMapper.setScalarModeToUsePointFieldData();
  sphereMapper.setColorModeToDirectScalars();
  sphereMapper.setColorByArrayName('color');
  sphereMapper.setScaleModeToScaleByConstant();
  sphereMapper.setScaleFactor(1.0);

  sphereActor = vtkActor.newInstance();
  sphereActor.setMapper(sphereMapper);
  sphereActor.getProperty().setOpacity(0.7);
  view.renderer.addActor(sphereActor);

  arrowPolyData = vtkPolyData.newInstance();
  arrowPolyData.setPoints(vtkPoints.newInstance());
  const arrowPD = arrowPolyData.getPointData();
  arrowPD.setScalars(createColorArray([]));
  arrowPD.setVectors(createVectorArray([]));

  arrowMapper = vtkGlyph3DMapper.newInstance();
  arrowMapper.setInputData(arrowPolyData);
  arrowMapper.setSourceConnection(arrowSource.getOutputPort());
  arrowMapper.setScalarModeToUsePointFieldData();
  arrowMapper.setColorModeToDirectScalars();
  arrowMapper.setColorByArrayName('color');
  arrowMapper.setOrientationModeToDirection();
  arrowMapper.setOrientationArray('vectors');
  arrowMapper.setScaleModeToScaleByConstant();
  arrowMapper.setScaleFactor(10);

  arrowActor = vtkActor.newInstance();
  arrowActor.setMapper(arrowMapper);
  view.renderer.addActor(arrowActor);

  scheduleRender();
});

onUnmounted(() => {
  isMounted = false;

  if (renderRaf !== null) {
    cancelAnimationFrame(renderRaf);
    renderRaf = null;
  }

  if (view && sphereActor) view.renderer.removeActor(sphereActor);
  if (view && arrowActor) view.renderer.removeActor(arrowActor);

  spherePolyData?.delete();
  arrowPolyData?.delete();
  sphereActor?.delete();
  arrowActor?.delete();
  sphereSource?.delete();
  arrowSource?.delete();
  sphereMapper?.delete();
  arrowMapper?.delete();
});

watch(
  () => planeOrigin.value,
  () => {
    if (!cachedItems.length) return;
    nextTick(() => {
      debouncedUpdateGlyphs();
    });
  },
  { deep: true }
);

useSetPointsEvents().onClick(([positionList, radius]) => addPoints(positionList, radius));
useSetPointsColorArrowEvents().onClick(([obj, radius]) => addPointsColorArrow(obj, radius));
useClearPointsEvents().onClick(() => clearPoints());
useChangeNearValueEvents().onClick(() => {
  updateGlyphs();
});
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
