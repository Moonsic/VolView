<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
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
} from '@/src/components/App.vue';

type PointWithDirection = Vector3 | [Vector3, Vector3];
type PointsByColor = Record<string, PointWithDirection[]>;

interface CachedGlyphItem {
  position: Vector3;
  color255: [number, number, number];
  direction?: Vector3;
}

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

function buildCachedItemsFromObj(obj: PointsByColor): CachedGlyphItem[] {
  const items: CachedGlyphItem[] = [];

  Object.keys(obj).forEach((key: string) => {
    const color255 = normalizeColor255(key);
    const positionList = obj[key];

    positionList.forEach((item) => {
      const { position, direction } = parsePointItem(item);

      items.push({
        position: [position[0], position[1], position[2]],
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
    items.push({
      position: [position[0], position[1], position[2]],
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
  spherePolyData.getPoints().setData(new Float32Array(), 3);
  spherePolyData.getPointData().setScalars(createColorArray([]));

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

  sphereSource.setRadius(currentRadius);

  const spherePositions: number[] = [];
  const sphereColors: number[] = [];

  const arrowPositions: number[] = [];
  const arrowColors: number[] = [];
  const arrowVectors: number[] = [];

  // 保留你原来的箭头偏移逻辑，外观尽量不变
  const offset = (6 * currentRadius * currentRadius) / (6 * currentRadius - 5) + 2.7;

  for (const item of cachedItems) {
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
  // 保留你原来的“清空后放一个远点”的行为
  cachedItems = buildCachedItemsFromPlainList([[1000, 1000, 1000]]);
  currentRadius = 0.1;
  updateGlyphs();
}

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

useSetPointsEvents().onClick(([positionList, radius]) => addPoints(positionList, radius));
useSetPointsColorArrowEvents().onClick(([obj, radius]) => addPointsColorArrow(obj, radius));
useClearPointsEvents().onClick(() => clearPoints());
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
