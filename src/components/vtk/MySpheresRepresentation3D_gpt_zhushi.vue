<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue';
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
} from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

// --- 全局状态 ---
let pointsData: any = null;
let currentRadius = 2.8;
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

// 将颜色值，转化成[0,255]用于直接标量着色
function normalizeColor(inputColor: string): number[] {
  const colorMap: any = {
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
  };

  let hexColor = colorMap[inputColor] || inputColor;
  if (!/^#[0-9A-Fa-f]{3,6}$/i.test(hexColor)) {
    hexColor = '#ff0000'; // fallback
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

onMounted(() => {
  isMounted = true;
  // --- 球体初始化 ---
  sphereSource = vtkSphereSource.newInstance();
  sphereSource.setThetaResolution(20); // 降低细分度，性能更好，视觉影响不大
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

  // --- 箭头初始化 ---
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
  // arrowActor.getProperty().setOpacity(0.7); // 箭头保持不透明
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

  // 更新球体半径
  sphereSource.setRadius(currentRadius);
  sphereSource.modified();

  const spherePositions: number[] = [];
  const sphereColors: number[] = [];

  const arrowPositions: number[] = [];
  const arrowColors: number[] = [];
  const arrowVectors: number[] = [];

  // 计算偏移量
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

  // 更新球体数据
  const spherePointsObj = vtkPoints.newInstance();
  spherePointsObj.setData(Float32Array.from(spherePositions), 3);
  spherePolyData.setPoints(spherePointsObj);

  const sphereColorArray = vtkDataArray.newInstance({
    name: 'colors',
    numberOfComponents: 3,
    values: Uint8Array.from(sphereColors),
  });
  spherePolyData.getPointData().setScalars(sphereColorArray);

  // 更新箭头数据
  const arrowPointsObj = vtkPoints.newInstance();
  arrowPointsObj.setData(Float32Array.from(arrowPositions), 3);
  arrowPolyData.setPoints(arrowPointsObj);

  const pointData = arrowPolyData.getPointData();

  if (arrowColors.length) {
    const arrowColorArray = vtkDataArray.newInstance({
      name: 'colors',
      numberOfComponents: 3,
      values: Uint8Array.from(arrowColors),
    });
    pointData.setScalars(arrowColorArray);
  } else {
    pointData.setScalars(null);
  }

  if (arrowVectors.length) {
    const vectorArray = vtkDataArray.newInstance({
      name: 'vectors',
      numberOfComponents: 3,
      values: Float32Array.from(arrowVectors),
    });
    pointData.setVectors(vectorArray);
  } else {
    pointData.setVectors(null);
  }

  spherePolyData.modified();
  arrowPolyData.modified();
  view?.renderWindow.render();
}

function addPoints(positionList: Vector3[], radius: number) {
  pointsData = { red: positionList };
  currentRadius = radius;
  updateGlyphs();
}

function addPointsColorArrow(obj: any, radius: number) {
  if (!obj) {
    pointsData = null;
    updateGlyphs();
    return;
  }
  pointsData = JSON.parse(JSON.stringify(obj));
  currentRadius = radius;
  updateGlyphs();
}

function clearPoints() {
  pointsData = null;
  updateGlyphs();
}

// 设置点坐标的事件
useSetPointsEvents().onClick(([positionList, radius]) => addPoints(positionList, radius));
useSetPointsColorArrowEvents().onClick(([obj, radius]) => addPointsColorArrow(obj, radius));
useClearPointsEvents().onClick(() => clearPoints());

</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
