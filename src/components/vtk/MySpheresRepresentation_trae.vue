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
} from '@/src/components/App.vue';

interface Props {
  id: string;
  planeOrigin: number[];
}

const props = defineProps<Props>();
const { id, planeOrigin } = toRefs(props);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

let pointsData: any = null;
let currentRadius = 2.8;
let needDistanceCheck = true;
const arrowLength = 10;
let isMounted = false;

let spherePolyData: vtkPolyData;
let arrowPolyData: vtkPolyData;
let sphereActor: vtkActor;
let arrowActor: vtkActor;
let sphereSource: vtkSphereSource;
let arrowSource: vtkArrowSource;
let sphereMapper: vtkGlyph3DMapper;
let arrowMapper: vtkGlyph3DMapper;

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
    parseInt(hexColor.slice(1, 3), 16) / 255,
    parseInt(hexColor.slice(3, 5), 16) / 255,
    parseInt(hexColor.slice(5), 16) / 255,
  ];
}

function getNewPosition(position: number[]) {
  const worldToIndex = (window as any).worldToIndex;
  const spacing = (window as any).spacing;

  if (!worldToIndex || !spacing) return [position[0], position[1], position[2]];

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

onMounted(() => {
  isMounted = true;

  sphereSource = vtkSphereSource.newInstance();
  sphereSource.setThetaResolution(20);
  sphereSource.setPhiResolution(20);

  spherePolyData = vtkPolyData.newInstance();
  spherePolyData.setPoints(vtkPoints.newInstance());
  spherePolyData.getPointData().addArray(
    vtkDataArray.newInstance({ name: 'colors', numberOfComponents: 3, values: [], dataType: 'Float32Array' })
  );

  sphereMapper = vtkGlyph3DMapper.newInstance();
  sphereMapper.setInputData(spherePolyData);
  sphereMapper.setSourceConnection(sphereSource.getOutputPort());
  sphereMapper.setScaleModeToScaleByConstant();
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
  arrowPolyData.setPoints(vtkPoints.newInstance());
  const arrowPD = arrowPolyData.getPointData();
  arrowPD.addArray(
    vtkDataArray.newInstance({ name: 'colors', numberOfComponents: 3, values: [], dataType: 'Float32Array' })
  );
  arrowPD.addArray(
    vtkDataArray.newInstance({ name: 'vectors', numberOfComponents: 3, values: [], dataType: 'Float32Array' })
  );

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
    spherePolyData.getPoints().setData(new Float32Array());
    spherePolyData.getPointData().setScalars(vtkDataArray.newInstance({ name: 'colors', values: new Float32Array(), numberOfComponents: 3, dataType: 'Float32Array' }));

    arrowPolyData.getPoints().setData(new Float32Array());
    const arrowPD = arrowPolyData.getPointData();
    arrowPD.setScalars(vtkDataArray.newInstance({ name: 'colors', values: new Float32Array(), numberOfComponents: 3, dataType: 'Float32Array' }));
    arrowPD.setVectors(vtkDataArray.newInstance({ name: 'vectors', values: new Float32Array(), numberOfComponents: 3, dataType: 'Float32Array' }));
  } else {
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

          const len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2]);
          if (len > 0) {
            arrowVectors.push(dir[0] / len, dir[1] / len, dir[2] / len);
          } else {
            arrowVectors.push(1, 0, 0);
          }
        }
      });
    });

    spherePolyData.getPoints().setData(Float32Array.from(spherePositions), 3);
    spherePolyData.getPointData().setScalars(vtkDataArray.newInstance({
      name: 'colors',
      numberOfComponents: 3,
      values: Float32Array.from(sphereColors),
      dataType: 'Float32Array'
    }));

    const arrowPD = arrowPolyData.getPointData();
    arrowPolyData.getPoints().setData(Float32Array.from(arrowPositions), 3);
    arrowPD.setScalars(vtkDataArray.newInstance({
      name: 'colors',
      numberOfComponents: 3,
      values: Float32Array.from(arrowColors),
      dataType: 'Float32Array'
    }));
    arrowPD.setVectors(vtkDataArray.newInstance({
      name: 'vectors',
      numberOfComponents: 3,
      values: Float32Array.from(arrowVectors),
      dataType: 'Float32Array'
    }));
  }

  spherePolyData.modified();
  arrowPolyData.modified();

  nextTick(() => {
    view?.renderWindow.render();
  });
}

function addPoints(positionList: Vector3[], radius: number) {
  needDistanceCheck = false;
  if (JSON.stringify(positionList) === JSON.stringify([[1000, 1000, 1000]])) {
    pointsData = null;
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
