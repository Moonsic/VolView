<template>
  <div class="vtk-container-wrapper" tabindex="0">
    <div class="vtk-gutter"></div>
    <div class="vtk-container">
      <div class="vtk-sub-container">
        <vtk-slice-view
          class="vtk-view"
          ref="vtkView"
          data-testid="vtk-view"
          :view-id="id"
          :image-id="currentImageID"
          :view-direction="viewDirection"
          :view-up="viewUp"
          :slice-range="sliceDomain"
        >
          <vtk-mouse-interaction-manipulator
            v-if="currentTool === Tools.Pan"
            :manipulator-constructor="vtkMouseCameraTrackballPanManipulator"
            :manipulator-props="{ button: 1 }"
          ></vtk-mouse-interaction-manipulator>
          <vtk-mouse-interaction-manipulator
            :manipulator-constructor="vtkMouseCameraTrackballPanManipulator"
            :manipulator-props="{ button: 1, shift: true }"
          ></vtk-mouse-interaction-manipulator>
          <vtk-mouse-interaction-manipulator
            v-if="currentTool === Tools.Zoom"
            :manipulator-constructor="
              vtkMouseCameraTrackballZoomToMouseManipulator
            "
            :manipulator-props="{ button: 1 }"
          ></vtk-mouse-interaction-manipulator>
          <vtk-mouse-interaction-manipulator
            :manipulator-constructor="
              vtkMouseCameraTrackballZoomToMouseManipulator
            "
            :manipulator-props="{ button: 3 }"
          ></vtk-mouse-interaction-manipulator>
          <vtk-slice-view-window-manipulator
            :view-id="id"
            :image-id="currentImageID"
            :manipulator-config="windowingManipulatorProps"
          ></vtk-slice-view-window-manipulator>
          <slice-viewer-overlay
            :view-id="id"
            :image-id="currentImageID"
          ></slice-viewer-overlay>

          <!-- VtkBaseObliqueSliceRepresentation 1个切片 -->
          <vtk-base-oblique-slice-representation
            :view-id="id"
            :image-id="currentImageID"
            :plane-normal="planeNormal"
            :plane-origin="planeOrigin"
          ></vtk-base-oblique-slice-representation>

          <!-- VtkImageOutlineRepresentation 线框 thickness：4 就是线宽的意思 -->
          <vtk-image-outline-representation
            :view-id="id"
            :image-id="currentImageID"
            :plane-normal="planeNormal"
            :plane-origin="planeOrigin"
            :thickness="2"
            :color="outlineColor"
          ></vtk-image-outline-representation>

          <!-- 十字指示线 -->
          <reslice-cursor-tool
            :view-id="id"
            :view-direction="viewDirection"
          ></reslice-cursor-tool>

          <!-- 画球体 -->
          <MySpheresRepresentation :sphereRadius="3"></MySpheresRepresentation>

          <slot></slot>
        </vtk-slice-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResetViewsEvents } from '@/src/components/tools/ResetViews.vue';
import { useSetPositionEvents } from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件

import ResliceCursorTool from '@/src/components/tools/ResliceCursorTool.vue';
import VtkBaseObliqueSliceRepresentation from '@/src/components/vtk/VtkBaseObliqueSliceRepresentation.vue';
import VtkImageOutlineRepresentation from '@/src/components/vtk/VtkImageOutlineRepresentation.vue';

import MySpheresRepresentation from '@/src/components/vtk/MySpheresRepresentation.vue';


import VtkSliceView from '@/src/components/vtk/VtkSliceView.vue';
import { onVTKEvent } from '@/src/composables/onVTKEvent';
import { useCurrentImage } from '@/src/composables/useCurrentImage';
import { useViewAnimationListener } from '@/src/composables/useViewAnimationListener';
import { useWebGLWatchdog } from '@/src/composables/useWebGLWatchdog';
import { OBLIQUE_OUTLINE_COLORS } from '@/src/constants';
import { vtkFieldRef } from '@/src/core/vtk/vtkFieldRef';
import useResliceCursorStore, {
  mapAxisToViewType,
} from '@/src/store/reslice-cursor';
import { LayoutViewProps } from '@/src/types';
import { LPSAxisDir } from '@/src/types/lps';
import { VtkViewApi } from '@/src/types/vtk-types';
import { batchForNextTask } from '@/src/utils/batchForNextTask';
import { getLPSAxisFromDir } from '@/src/utils/lps';
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import type { RGBColor, Vector3 } from '@kitware/vtk.js/types';
import { watchImmediate } from '@vueuse/core';
import { vec3 } from 'gl-matrix';
import { computed, ref, toRefs, watchEffect } from 'vue';
import SliceViewerOverlay from '@/src/components/SliceViewerOverlay.vue';
import VtkSliceViewWindowManipulator from '@/src/components/vtk/VtkSliceViewWindowManipulator.vue';
import VtkMouseInteractionManipulator from '@/src/components/vtk/VtkMouseInteractionManipulator.vue';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkMouseCameraTrackballZoomToMouseManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomToMouseManipulator';
import { storeToRefs } from 'pinia';
import { useToolStore } from '@/src/store/tools';
import { Tools } from '@/src/store/tools/types';

interface Props extends LayoutViewProps {
  viewDirection: LPSAxisDir;
  viewUp: LPSAxisDir;
}

const vtkView = ref<VtkViewApi>();

const props = defineProps<Props>();

const { id: viewId, type: viewType, viewDirection, viewUp } = toRefs(props);
const viewAxis = computed(() => getLPSAxisFromDir(viewDirection.value));

useWebGLWatchdog(vtkView);
useViewAnimationListener(vtkView, viewId, viewType);

// active tool
const { currentTool } = storeToRefs(useToolStore());
const windowingManipulatorProps = computed(() =>
  currentTool.value === Tools.WindowLevel ? { button: 1 } : { button: -1 }
);

// base image
const { currentImageID, currentImageData, currentImageMetadata } =
  useCurrentImage();

// reslice cursor
const resliceStore = useResliceCursorStore();
const { resliceCursor, resliceCursorState } = resliceStore;

const widgetViewType = computed(() => mapAxisToViewType(viewAxis.value));

watchEffect(() => {
  if (currentImageData.value) {
    resliceCursor.setImage(currentImageData.value);
  }
});

// setup plane origin/normal
const planeOrigin = vtkFieldRef(resliceCursorState, {
  get: () => resliceCursorState.getCenter(),
  set: (v) => resliceCursor.setCenter(v),
});
const planes = vtkFieldRef(resliceCursorState, 'planes');
const planeNormal = computed(() => planes.value[widgetViewType.value].normal);

// slicing domain/range

// Function to compute float range of slicing for oblique slicing.
// Range is calculated as distance along the plane normal (as originating from {0,0,0} ).
function slicePlaneRange(
  cornerPoints: number[][],
  sliceNormal: number[]
): [number, number] {
  if (!cornerPoints || !sliceNormal) return [0, 1];

  // Get rotation matrix from normal to +X (since bounds is aligned to XYZ)
  const transform = vtkMatrixBuilder
    .buildFromDegree()
    .identity()
    .rotateFromDirections(sliceNormal, [1, 0, 0]);

  const corners = cornerPoints.map((x) => x.slice());
  corners.forEach((pt) => transform.apply(pt));

  // range is now maximum X distance
  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < 8; i++) {
    const x = corners[i][0];
    if (x > maxX) {
      maxX = x;
    }
    if (x < minX) {
      minX = x;
    }
  }

  return [minX, maxX];
}

const imageCorners = computed(() => {
  const image = currentImageData.value;
  const [xmin, xmax, ymin, ymax, zmin, zmax] = image?.getExtent() ?? [
    0, 1, 0, 1, 0, 1,
  ];
  const corners = [
    [xmin, ymin, zmin],
    [xmax, ymin, zmin],
    [xmin, ymax, zmin],
    [xmax, ymax, zmin],
    [xmin, ymin, zmax],
    [xmax, ymin, zmax],
    [xmin, ymax, zmax],
    [xmax, ymax, zmax],
  ];
  corners.forEach((p) => image?.indexToWorld(p as vec3, p as vec3));
  return corners;
});

const sliceDomain = computed(() => {
  const [...sliceNormal] = planeNormal.value;
  const range = slicePlaneRange(imageCorners?.value, sliceNormal);
  return {
    min: range[0],
    max: range[1],
  };
});

// the core update camera function
const updateResliceCamera = (resetFocalPoint: boolean) => {
  if (!vtkView.value || !resliceCursorState.getImage()) return;
  resliceCursor.updateCameraPoints(
    vtkView.value.renderer,
    widgetViewType.value,
    resetFocalPoint,
    false,
    true
  );
};


// 已知又有一个数组boundsArray=[-130.0814828891307, 125.91851997189224, -123.50813484017272, 132.49186808045488, -119.1382771413773, 136.86167994327843 ]，
// 它代表一个3维的坐标，是一个256256256的正方体，
// 其中第1个数表示x轴的最小值，第2个数表示x轴的最大值，
// 第3个数表示y轴的最小值，第4个数表示y轴的最大值，
// 第5个数表示z轴的最小值，第6个数表示z轴的最大值，
// 我现在要写一个函数，输入是一个数组，里面3个数字，数字范围在[0,256]之间，分别表示x/y/z轴 ,
// 这个函数要返回一个数组，里面是3个轴的坐标
// 想通过给定的边界数组以及用户输入的 [x, y, z] 坐标，在这个 256256256 的正方体范围内，获取相应的标准化坐标
// 例：输入：boundsArray：上面的例子 ，inputArray：[80,150,200] 输出：[-50.08148199506104, 26.491866871132515, 80.86168933100998]

function getNormalizedCoordinates(boundsArray: [number, number, number, number, number, number], inputArray: [number, number, number]): Vector3 {
    const [minX, maxX, minY, maxY, minZ, maxZ] = boundsArray;
    const [x, y, z] = inputArray;
    // 确保输入的坐标在[0, 256]范围内
    if (x < 0 || x > 256 || y < 0 || y > 256 || z < 0 || z > 256) {
        throw new Error('Input coordinates should be in the range of [0, 256]');
    }
    // 标准化坐标到[-130.081, 136.862]等对应区间
    const normalizedX = (x / 256) * (maxX - minX) + minX;
    const normalizedY = (y / 256) * (maxY - minY) + minY;
    const normalizedZ = (z / 256) * (maxZ - minZ) + minZ;
    return [normalizedX, normalizedY, normalizedZ];
}

// 这个代码用到项目里，是错误的，点击时刻点列表时，切片都不见了，不要用了
// function getNormalizedCoordinates(boundsArray: [number, number, number, number, number, number], inputArray: [number, number, number]): Vector3 {
//     // const [minX, maxX, minY, maxY, minZ, maxZ] = boundsArray;
//     return [
//       // inputArray[0] + minX,
//       // inputArray[1] + minY,
//       // inputArray[2] + minZ,

//       inputArray[0] + boundsArray[0],
//       inputArray[1] + boundsArray[2],
//       inputArray[2] + boundsArray[4],
//     ]
// }


let defaultPosition: Vector3

// reset camera logic
function resetCamera(position?: Vector3) {
  if (!vtkView.value) return;

  const metadata = currentImageMetadata.value;
  resliceStore.resetReslicePlanes(metadata);

  const { worldBounds } = metadata;
  // planeOrigin.value = vtkBoundingBox.getCenter(worldBounds); // 原来的planeOrigin.value直接用的中心点的值
  // resliceCursorState.placeWidget(worldBounds);



  // 如果传来位置，就定位新的位置，并设置成默认位置，再点击reset Views时回到新的位置
  // 如果没有传来位置，但有默认位置，再定位到新的位置
  // 如果没有传来位置，也没有默认位置，就定位到中心位置
  const center = vtkBoundingBox.getCenter(worldBounds);
  let newCenter: Vector3
  if (position) {
    newCenter = getNormalizedCoordinates(worldBounds, position)
    defaultPosition = newCenter
  } else if (defaultPosition) {
    newCenter = defaultPosition
  } else {
    newCenter = center
  }
  // console.log('position',position)
  // console.log('290 metadata & center', metadata,center)
  // console.log('planeOrigin.value',planeOrigin.value)
  // console.log('newCenter',newCenter)

  planeOrigin.value = newCenter // 我发现只要改变planeOrigin.value，就能马上改变位置
  resliceCursorState.placeWidget(worldBounds);


  vtkView.value.resetCamera();
  updateResliceCamera(false);

  vtkView.value.requestRender();
}

useResetViewsEvents().onClick(resetCamera);

// 设置点坐标的事件
useSetPositionEvents().onClick((position) => resetCamera(position));

// update the camera
onVTKEvent(
  resliceCursorState,
  'onModified',
  batchForNextTask(() => {
    updateResliceCamera(false);
  })
);

watchImmediate(currentImageID, () => {
  updateResliceCamera(true);
});

// slicing plane colors
const outlineColor = computed(
  () =>
    vec3.scale(
      [0, 0, 0],
      OBLIQUE_OUTLINE_COLORS[viewId.value],
      1 / 255
    ) as RGBColor
);

// console.log('viewId.value',viewId.value) // ObliqueCoronal
// console.log('OBLIQUE_OUTLINE_COLORS', OBLIQUE_OUTLINE_COLORS)
// {
//     "ObliqueAxial": [ 0, 128, 255 ],
//     "ObliqueSagittal": [ 255, 255, 0 ],
//     "ObliqueCoronal": [ 255, 51, 51 ]
// }
// console.log('outlineColor',outlineColor.value) // [1, 0.2, 0.2]

</script>

<style scoped src="@/src/components/styles/vtk-view.css"></style>
<style scoped src="@/src/components/styles/utils.css"></style>
