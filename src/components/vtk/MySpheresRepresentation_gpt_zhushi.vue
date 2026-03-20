<script setup lang="ts">
import { toRefs, inject, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { VtkViewContext } from '@/src/components/vtk/context';
import type { Vector3 } from '@kitware/vtk.js/types';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkGlyph3DMapper from '@kitware/vtk.js/Rendering/Core/Glyph3DMapper';
import '@kitware/vtk.js/Rendering/Profiles/Glyph';
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
} from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件

interface Props {
  id: string; // 这个id区分3个视图，第一个是ObliqueCoronal，第二个是ObliqueSagittal，第三个是ObliqueAxial
  planeOrigin: number[]; // 十字线的中心点
}

const props = defineProps<Props>();
const {
  id,
  planeOrigin, // 十字线的中心点
} = toRefs(props);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

// --- 全局状态 ---
let pointsData: any = null;
let currentRadius = 2.8;
let needDistanceCheck = true; // 区分是否需要进行切片距离计算
const arrowLength = 10;

// --- VTK 实例 ---
let spherePolyData: vtkPolyData;
let arrowPolyData: vtkPolyData;
let sphereActor: vtkActor;
let arrowActor: vtkActor;
let sphereSource: vtkSphereSource;
let arrowSource: vtkArrowSource;
let sphereMapper: vtkGlyph3DMapper;
let arrowMapper: vtkGlyph3DMapper;
let isMounted = false;

// 将颜色值，转化成[0,255]
function normalizeColor(inputColor: string): number[] {
  const colorMap: any = {
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
  };

  let hexColor = colorMap[inputColor] || inputColor;
  if (!/^#[0-9A-Fa-f]{3,6}$/i.test(hexColor)) {
    hexColor = '#ff0000';
  }

  hexColor = /^#[0-9A-Fa-f]{3}$/i.test(hexColor)
    ? hexColor.replace(/[0-9A-Fa-f]/g, (c: any) => c + c)
    : hexColor;

  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5), 16)
  ];
}

// 计算距离是要获取点和切片新的坐标，再计算距离，一个4维矩阵计算公式，万里教我的
function getNewPosition(position: number[]) {
  const worldToIndex = (window as any).worldToIndex;
  const spacing = (window as any).spacing;

  if (!worldToIndex || !spacing) return [position[0], position[1], position[2]];

  const x = worldToIndex[0] * position[0] +
    worldToIndex[4] * position[1] +
    worldToIndex[8] * position[2] +
    worldToIndex[12] * 1

  const y = worldToIndex[1] * position[0] +
    worldToIndex[5] * position[1] +
    worldToIndex[9] * position[2] +
    worldToIndex[13] * 1

  const z = worldToIndex[2] * position[0] +
    worldToIndex[6] * position[1] +
    worldToIndex[10] * position[2] +
    worldToIndex[14] * 1

  return [
    x * spacing[0],
    y * spacing[1],
    z * spacing[2],
  ] // 万里说的新的写法，算距离的时候y和z对调，并乘上步长
}

onMounted(() => {
  isMounted = true;
  sphereSource = vtkSphereSource.newInstance();
  sphereSource.setThetaResolution(20);
  sphereSource.setPhiResolution(20);

  spherePolyData = vtkPolyData.newInstance();

  sphereMapper = vtkGlyph3DMapper.newInstance();
  sphereMapper.setInputData(spherePolyData);
  sphereMapper.setSourceConnection(sphereSource.getOutputPort());
  sphereMapper.setScaleModeToScaleByConstant();
  sphereMapper.setScaleFactor(1.0);
  sphereMapper.setColorModeToDirectScalars();
  sphereMapper.setColorByArrayName('colors');

  sphereActor = vtkActor.newInstance();
  sphereActor.setMapper(sphereMapper);
  sphereActor.getProperty().setOpacity(0.7);
  view?.renderer.addActor(sphereActor);

  arrowSource = vtkArrowSource.newInstance();
  arrowSource.setTipResolution(20);
  arrowSource.setShaftResolution(20);
  arrowSource.setTipRadius(0.06);
  arrowSource.setTipLength(0.2);
  arrowSource.setShaftRadius(0.02);

  arrowPolyData = vtkPolyData.newInstance();

  arrowMapper = vtkGlyph3DMapper.newInstance();
  arrowMapper.setInputData(arrowPolyData);
  arrowMapper.setSourceConnection(arrowSource.getOutputPort());
  arrowMapper.setScaleModeToScaleByConstant();
  arrowMapper.setScaleFactor(arrowLength);
  arrowMapper.setOrientationModeToDirection();
  arrowMapper.setOrientationArray('vectors');
  arrowMapper.setColorModeToDirectScalars();
  arrowMapper.setColorByArrayName('colors');

  arrowActor = vtkActor.newInstance();
  arrowActor.setMapper(arrowMapper);
  view?.renderer.addActor(arrowActor);
});

onUnmounted(() => {
  if (view) {
    view.renderer.removeActor(sphereActor);
    view.renderer.removeActor(arrowActor);
    view.renderWindow.render();
  }
  spherePolyData?.delete();
  arrowPolyData?.delete();
  sphereActor?.delete();
  arrowActor?.delete();
  sphereSource?.delete();
  arrowSource?.delete();
  sphereMapper?.delete();
  arrowMapper?.delete();
});

function updateGlyphs() {
  if (!isMounted) return;

  if (!pointsData) {
    spherePolyData.setPoints(vtkPoints.newInstance());
    arrowPolyData.setPoints(vtkPoints.newInstance());
    view?.renderWindow.render();
    return;
  }

  sphereSource.setRadius(currentRadius);
  sphereSource.modified();

  const spherePositions: number[] = [];
  const sphereColors: number[] = [];

  const arrowPositions: number[] = [];
  const arrowColors: number[] = [];
  const arrowVectors: number[] = [];

  const nearRadius = (window as any).nearValue || 1.0;
  const newplaneOrigin: number[] = needDistanceCheck ? getNewPosition(planeOrigin.value) : [];
  const offset = (6 * currentRadius * currentRadius) / (6 * currentRadius - 5) + 2.7;

  Object.keys(pointsData).forEach((key: string) => {
    const color = normalizeColor(key);
    const positionList = pointsData[key];

    positionList.forEach((item: Vector3 | [Vector3, Vector3]) => {
      let pos: Vector3;
      let dir: Vector3 | undefined;

      if (Array.isArray(item[0]) && Array.isArray(item[1])) {
        pos = item[0] as Vector3;
        dir = item[1] as Vector3;
      } else {
        pos = item as Vector3;
      }

      // 距离计算
      if (needDistanceCheck) {
        const newPointPosition: number[] = getNewPosition(pos);
        if (id.value === 'ObliqueCoronal') {
          if (Math.abs(newPointPosition[2] - newplaneOrigin[2]) > nearRadius) return;
        } else if (id.value === 'ObliqueSagittal') {
          if (Math.abs(newPointPosition[0] - newplaneOrigin[0]) > nearRadius) return;
        } else if (id.value === 'ObliqueAxial') {
          if (Math.abs(newPointPosition[1] - newplaneOrigin[1]) > nearRadius) return;
        }
      }

      spherePositions.push(...pos);
      sphereColors.push(...color);

      if (dir && dir.length) {
        const adjustedPosition: [number, number, number] = [
          pos[0] + dir[0] * offset,
          pos[1] + dir[1] * offset,
          pos[2] + dir[2] * offset,
        ];
        arrowPositions.push(...adjustedPosition);
        arrowColors.push(...color);

        const len = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1] + dir[2]*dir[2]);
        if (len > 0) {
          arrowVectors.push(dir[0]/len, dir[1]/len, dir[2]/len);
        } else {
          arrowVectors.push(1, 0, 0);
        }
      }
    });
  });

  const spherePointsObj = vtkPoints.newInstance();
  spherePointsObj.setData(Float32Array.from(spherePositions), 3);
  spherePolyData.setPoints(spherePointsObj);

  const sphereColorArray = vtkDataArray.newInstance({
    name: 'colors',
    numberOfComponents: 3,
    values: Uint8Array.from(sphereColors),
  });
  spherePolyData.getPointData().setScalars(sphereColorArray);

  const arrowPointsObj = vtkPoints.newInstance();
  arrowPointsObj.setData(Float32Array.from(arrowPositions), 3);
  arrowPolyData.setPoints(arrowPointsObj);

  console.log('arrowColors :>> ', arrowColors);
  if (arrowColors.length) {
    const arrowColorArray = vtkDataArray.newInstance({
      name: 'colors',
      numberOfComponents: 3,
      values: Uint8Array.from(arrowColors),
    });
    arrowPolyData.getPointData().setScalars(arrowColorArray);
  } else {
    arrowPolyData.getPointData().removeAllArrays();
  }

  if (arrowVectors.length) {
    const vectorArray = vtkDataArray.newInstance({
      name: 'vectors',
      numberOfComponents: 3,
      values: Float32Array.from(arrowVectors),
    });
    arrowPolyData.getPointData().addArray(vectorArray);
  }

  spherePolyData.modified();
  arrowPolyData.modified();
  view?.renderWindow.render();
}

function addPoints(positionList: Vector3[], radius: number) {
  needDistanceCheck = false;
  if (JSON.stringify(positionList) === JSON.stringify([[1000, 1000, 1000]])) {
    pointsData = null; // 原代码这里是清空滚动展示的objAll
  } else {
    pointsData = { red: positionList };
    currentRadius = radius;
  }
  updateGlyphs();
}

function addPointsColorArrow(obj: any, radius: number) {
  needDistanceCheck = true;
  if (!obj) {
    pointsData = null;
  } else {
    pointsData = JSON.parse(JSON.stringify(obj));
    currentRadius = radius;
  }
  updateGlyphs();
}

function clearPoints() {
  needDistanceCheck = false;
  pointsData = { red: [[1000, 1000, 1000]] };
  currentRadius = 0.1;
  updateGlyphs();
}

function debounce<T extends Function>(fn: T, delay: number): T {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  } as unknown as T;
}

const debouncedGetMegData = debounce(() => {
  if (needDistanceCheck) updateGlyphs();
}, 200);

function changeNearValue() {
  if (!pointsData) return;
  updateGlyphs();
}

watch(() => planeOrigin.value, () => {
  if (!pointsData || !needDistanceCheck) return;
  nextTick(() => {
    debouncedGetMegData();
  });
});

useSetPointsEvents().onClick(([positionList, radius]) => addPoints(positionList, radius));
useSetPointsColorArrowEvents().onClick(([obj, radius]) => addPointsColorArrow(obj, radius));
useClearPointsEvents().onClick(() => clearPoints());
useChangeNearValueEvents().onClick(() => changeNearValue());
</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
