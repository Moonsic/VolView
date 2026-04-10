<template>
  <div class="vtk-container-wrapper" tabindex="0">
    <div class="vtk-gutter"></div>
    <div class="vtk-container">
      <div class="vtk-sub-container">

        <!-- id:{{ id }}- 这个id区分3个视图，第一个是ObliqueCoronal，第二个是ObliqueSagittal，第三个是ObliqueAxial -->
        <!-- {{ currentImageID }}- -->

          <!-- {{ viewDirection }}-
          {{ viewUp }}-
        {{ currentTool }}- -->

      <div class="info-box" v-show="showResliceCursor">
          <!-- id:{{ id }}-
          <div> currentSlice:{{ currentSlice + 1 }}-</div>
          <div> planeOrigin:</div>
          <div> 0:{{ planeOrigin[0] }}-</div>setNewSlice
          <div> 1:{{ planeOrigin[1] }}-</div>
          <div> 2:{{ planeOrigin[2] }}-</div>
          <div> sliceDomain:</div>
          <div> {{ sliceDomain }}</div> -->
        <slice-slider
          v-model="currentSlice"
          class="slice-slider"
          :min="sliceDomain.min"
          :max="sliceDomain.max"
          :step="1"
          :handle-height="20"
          />
          <!-- @setNewSlice="setNewSlice" -->
        </div>

        <vtk-slice-view
          class="vtk-view"
          ref="vtkView"
          data-testid="vtk-view"
          :view-id="viewId"
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

          <!-- VtkSliceViewSlicingManipulator，oblique似乎不需要这个组件 -->
          <!-- <vtk-slice-view-slicing-manipulator
            :view-id="id"
            :image-id="currentImageID"
            :view-direction="viewDirection"
          ></vtk-slice-view-slicing-manipulator> -->

          <!-- 鼠标按住左右滑、上下滑，改变亮度的。不能删，否则已进入页面就是全黑的，只能在内部改 -->
          <vtk-slice-view-window-manipulator
            :view-id="viewId"
            :image-id="currentImageID"
            :manipulator-config="windowingManipulatorProps"
          ></vtk-slice-view-window-manipulator>

          <!--文字信息，比如上下左右的 LR 方向信息，以及左下角的亮度信息。亮度信息现在注释掉，方向要保留。 -->
          <slice-viewer-overlay
            :view-id="viewId"
            :image-id="currentImageID"
          ></slice-viewer-overlay>

          <!-- VtkBaseObliqueSliceRepresentation 1个切片 -->
          <vtk-base-oblique-slice-representation
            :view-id="viewId"
            :image-id="currentImageID"
            :plane-normal="planeNormal"
            :plane-origin="planeOrigin"
          ></vtk-base-oblique-slice-representation>

<!--
          <vtk-segmentation-slice-representation
            v-for="segId in segmentations"
            :key="`seg-${segId}`"
            :view-id="id"
            :segmentation-id="segId"
            :axis="viewAxis"
          ></vtk-segmentation-slice-representation> -->


          <!-- <template v-if="currentImageID">
            <vtk-layer-slice-representation
              v-for="layer in currentLayers"
              :key="`layer-${layer.id}`"
              :view-id="id"
              :layer-id="layer.id"
              :parent-id="currentImageID"
              :axis="viewAxis"
            ></vtk-layer-slice-representation>
          </template> -->

          <!-- VtkImageOutlineRepresentation 线框 thickness：4 就是线宽的意思 -->
           <!-- 添加了透明度为0，意味着边框不显示了 -->
          <vtk-image-outline-representation
            :view-id="viewId"
            :image-id="currentImageID"
            :plane-normal="planeNormal"
            :plane-origin="planeOrigin"
            :thickness="2"
            :color="outlineColor"
            :opacity="0"
          ></vtk-image-outline-representation>

          <!-- 十字指示线 -->
          <reslice-cursor-tool
            v-show="showResliceCursor"
            :view-id="viewId"
            :view-direction="viewDirection"></reslice-cursor-tool>

          <!-- 画球体 -->
          <!-- :sliceDomain="sliceDomain"没用到 -->
          <MySpheresRepresentation :id="viewId" :planeOrigin="planeOrigin"></MySpheresRepresentation>

          <slot></slot>
        </vtk-slice-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ResliceCursorWidgetState,
} from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget';
import { useResetViewsEvents } from '@/src/components/tools/ResetViews.vue';
import { useSetPositionEvents } from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件

import ResliceCursorTool from '@/src/components/tools/ResliceCursorTool.vue';
// import VtkBaseSliceRepresentation from '@/src/components/vtk/VtkBaseSliceRepresentation.vue';
import VtkBaseObliqueSliceRepresentation from '@/src/components/vtk/VtkBaseObliqueSliceRepresentation.vue';
import VtkImageOutlineRepresentation from '@/src/components/vtk/VtkImageOutlineRepresentation.vue';

import MySpheresRepresentation from '@/src/components/vtk/MySpheresRepresentation.vue';

import SliceSlider from '@/src/components/SliceSlider.vue';
import { useSliceConfig } from '@/src/composables/useSliceConfig';


// import VtkBaseSliceRepresentation from '@/src/components/vtk/VtkBaseSliceRepresentation.vue';
// import VtkLayerSliceRepresentation from '@/src/components/vtk/VtkLayerSliceRepresentation.vue';
// import VtkSliceViewSlicingManipulator from '@/src/components/vtk/VtkSliceViewSlicingManipulator.vue';
// import VtkSegmentationSliceRepresentation from '@/src/components/vtk/VtkSegmentationSliceRepresentation.vue';
// import { useSegmentGroupStore } from '@/src/store/segmentGroups';

// import { useViewStore } from '@/src/store/views';
import useViewSliceStore from '@/src/store/view-configs/slicing';


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
import { LPSAxisDir } from '@/src/types/lps';
import { VtkViewApi } from '@/src/types/vtk-types';
import { batchForNextTask } from '@/src/utils/batchForNextTask';
import { getLPSAxisFromDir } from '@/src/utils/lps';
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import type { RGBColor, Vector3 } from '@kitware/vtk.js/types';
import { watchImmediate } from '@vueuse/core';
import { vec3 } from 'gl-matrix';
import { computed, ref, toRefs, watchEffect,unref,watch } from 'vue';
import SliceViewerOverlay from '@/src/components/SliceViewerOverlay.vue';
import VtkSliceViewWindowManipulator from '@/src/components/vtk/VtkSliceViewWindowManipulator.vue';
import VtkMouseInteractionManipulator from '@/src/components/vtk/VtkMouseInteractionManipulator.vue';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkMouseCameraTrackballZoomToMouseManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomToMouseManipulator';
import { storeToRefs } from 'pinia';
import { useToolStore } from '@/src/store/tools';
import { Tools } from '@/src/store/tools/types';
// import { updatePlaneManipulatorFor2DView } from '@/src/utils/manipulators';
// import vtkPlaneManipulator from '@kitware/vtk.js/Widgets/Manipulators/PlaneManipulator';
// import { nextTick } from 'process';

interface Props {
  viewId: string;
  outlineType: string;
  viewDirection: LPSAxisDir;
  viewUp: LPSAxisDir;
}

const vtkView = ref<VtkViewApi>();

const props = defineProps<Props>();

const { viewId, outlineType, viewDirection, viewUp } = toRefs(props);
const viewAxis = computed(() => getLPSAxisFromDir(viewDirection.value));

useWebGLWatchdog(vtkView);
useViewAnimationListener(vtkView, viewId, 'Oblique');

// active tool
const { currentTool } = storeToRefs(useToolStore());
const windowingManipulatorProps = computed(() =>
  currentTool.value === Tools.WindowLevel ? { button: 1 } : { button: -1 }
);

// base image
const { currentImageID, currentLayers, currentImageData, currentImageMetadata,isImageLoading } =
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
  // console.log('planeOrigin.value :>> ', planeOrigin.value);
  if (!vtkView.value || !resliceCursorState.getImage()) return;

  // GGG 注释，因为报错，官方也报错，等官方解决
  // console.log('object 1:>> ', vtkView.value.renderer);
  // console.log('object 2:>> ',  widgetViewType.value);
  // console.log('object 3:>> ', resetFocalPoint);
  // console.log('resliceCursor:>> ', resliceCursor);
  resliceCursor.updateCameraPoints(
    vtkView.value.renderer,
    widgetViewType.value,
    resetFocalPoint,
    // false, // 我发现把这个false去掉就不会报错，首先updateCameraPoints只有4个参数，所以官方写的5个参数不对，其实false会报错，true不会报错
    true
  );
};



function toSliceScalar(origin: Vector3, normal: Vector3) {
  const n = vec3.normalize(vec3.create(), vec3.fromValues(...normal));
  const p = vec3.fromValues(...origin);
  return vec3.dot(p, n);
}

function fromSliceScalar(slice: number, normal: Vector3): Vector3 {
  const n = vec3.normalize(vec3.create(), vec3.fromValues(...normal));
  const p = vec3.scale(vec3.create(), n, slice);
  return [p[0], p[1], p[2]];
}

const currentSlice = computed<number>({
  get() {
    if (!planeOrigin.value || !planeNormal.value) return 0;
    return toSliceScalar(planeOrigin.value, planeNormal.value);
  },

  set(slice) {
    if (!planeNormal.value || !planeOrigin.value) return;

    // 当前法线方向上的投影
    const currentProjected = fromSliceScalar(
      toSliceScalar(planeOrigin.value, planeNormal.value),
      planeNormal.value
    );

    // 当前平面“偏移”（非常关键！）
    const offset = vec3.subtract(
      vec3.create(),
      vec3.fromValues(...planeOrigin.value),
      vec3.fromValues(...currentProjected)
    );

    // 新位置（沿法线移动 + 保持平移）
    const newProjected = fromSliceScalar(slice, planeNormal.value);

    const final = vec3.add(
      vec3.create(),
      vec3.fromValues(...newProjected),
      offset
    );

    planeOrigin.value = [final[0], final[1], final[2]];
  },
});

// 最新：这个方法没用了。
// 已知又有一个数组boundsArray=[-130.0814828891307, 125.91851997189224, -123.50813484017272, 132.49186808045488, -119.1382771413773, 136.86167994327843 ]，
// 它代表一个3维的坐标，是一个256256256的正方体，
// 其中第1个数表示x轴的最小值，第2个数表示x轴的最大值，
// 第3个数表示y轴的最小值，第4个数表示y轴的最大值，
// 第5个数表示z轴的最小值，第6个数表示z轴的最大值，
// 我现在要写一个函数，输入是一个数组，里面3个数字，数字范围在[0,256]之间，分别表示x/y/z轴 ,
// 这个函数要返回一个数组，里面是3个轴的坐标
// 想通过给定的边界数组以及用户输入的 [x, y, z] 坐标，在这个 256256256 的正方体范围内，获取相应的标准化坐标
// 例：输入：boundsArray：上面的例子 ，inputArray：[80,150,200] 输出：[-50.08148199506104, 26.491866871132515, 80.86168933100998]

// function getNormalizedCoordinates(boundsArray: [number, number, number, number, number, number], inputArray: [number, number, number]): Vector3 {
//     const [minX, maxX, minY, maxY, minZ, maxZ] = boundsArray;
//     const [x, y, z] = inputArray;
//     // 确保输入的坐标在[0, 256]范围内
//     if (x < 0 || x > 256 || y < 0 || y > 256 || z < 0 || z > 256) {
//         throw new Error('Input coordinates should be in the range of [0, 256]');
//     }
//     // 标准化坐标到[-130.081, 136.862]等对应区间
//     const normalizedX = (x / 256) * (maxX - minX) + minX;
//     const normalizedY = (y / 256) * (maxY - minY) + minY;
//     const normalizedZ = (z / 256) * (maxZ - minZ) + minZ;
//     return [normalizedX, normalizedY, normalizedZ];
// }

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
// change默认不传是false，直接赋值。之前做的功能是给我位置信息，我自己再转化的，现在给我的位置信息我不需要再转化了，所以是false。
function resetCamera(position?: Vector3) {
  // console.log('288 vtkView.value :>> ', vtkView.value);

  if (!vtkView.value) return;

  const metadata = currentImageMetadata.value;
  resliceStore.resetReslicePlanes(metadata);

  const { worldBounds } = metadata;

  // console.log('metadata 295 :>> ', metadata);

  // planeOrigin.value = vtkBoundingBox.getCenter(worldBounds); // 原来的planeOrigin.value直接用的中心点的值
  // resliceCursorState.placeWidget(worldBounds);



  // 如果传来位置，就定位新的位置，并设置成默认位置，再点击reset Views时回到新的位置
  // 如果没有传来位置，但有默认位置，再定位到新的位置
  // 如果没有传来位置，也没有默认位置，就定位到中心位置
  const center = vtkBoundingBox.getCenter(worldBounds);
  let newCenter: Vector3
  if (position) {
    // console.log('309 worldBounds',worldBounds)
    // console.log('309 position',position)
    // newCenter = getNormalizedCoordinates(worldBounds, position)

    // 现在change都是false,，直接看这里
    newCenter = position

    // if (change) {
    //   const [xD, yD, zD] = window.dimensions  // [256, 256, 256] 或 [192, 512, 512]
    //   const [xDis, yDis, zDis] = window.distanceList  // [256, 256, 256] 或 [192, 512, 512]
    //   const [minX, minY, minZ] = window.xyzMinList  // [256, 256, 256] 或 [192, 512, 512]
    //   newCenter = [
    //     (position[0]/xD) * xDis + minX ,
    //     (position[1]/yD) * yDis + minY ,
    //     (position[2]/zD) * zDis + minZ ,
    //   ]
    // }


    defaultPosition = newCenter
  } else if (defaultPosition) {
    newCenter = defaultPosition
  } else {
    newCenter = center
  }
  // console.log('322 newCenter',newCenter)

  planeOrigin.value = newCenter // GGG 我发现只要改变planeOrigin.value，就能马上改变位置
  resliceCursorState.placeWidget(worldBounds);


  vtkView.value.resetCamera();
  updateResliceCamera(false);

  vtkView.value.requestRender();
}

useResetViewsEvents().onClick(resetCamera);

// 设置点坐标的事件
useSetPositionEvents().onClick(([position]) => resetCamera(position));


// 防抖，防抖是指在一系列连续的操作中，只在最后一次操作后的一段时间内执行一次操作
function debounce<T extends Function>(fn: T, delay: number): T {
  let timer: number = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  } as unknown as T;
}


let firstAngles: any = null // 一开始的数据

let oldData: any = null

// function setNewSlice(newSlice: number) {
//   // currentSlice.value = newSlice
//   // console.log('!!! :>> ',props.id, newSlice, planeOrigin.value );
// }

// const { slice: currentSlice, range: sliceRange } = useSliceConfig(
//   viewId,
//   currentImageID
// )

// let newSliceValue: number

// // const currentViewIDs = ['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']
// function setSlice(viewID:string,slice: any) {
//   const viewSliceStore = useViewSliceStore();
//   const imageID = unref(currentImageID) as string
//   viewSliceStore.updateConfig(viewID, imageID, { slice });
// }


// let dragging = false
// function setNewSlice(newSlice: number) {
//   currentSlice.value = newSlice
//   console.log('!!! :>> ',props.id, newSlice, planeOrigin.value );

//   const dimensions = window.dimensions
//   const {min,max} = sliceDomain.value

//   const oldList = [...planeOrigin.value]

//   const slice = newSlice + 1

//   if (props.id === 'ObliqueCoronal') {
//     const newValue = min + (slice / dimensions[1]) * (max - min)
//     console.log('ObliqueCoronal :>> ', newValue);

//     // const newValue2 = min + (slice / dimensions[1]) * (max - min)
//     // console.log('ObliqueCoronal2 :>> ', newValue2);
//       // const out = vec3.create();
//       // vec3.transformMat4(out, planeOrigin.value, currentImageMetadata.value.worldToIndex)
//       // const imagePosition = out
//       // console.log('imagePosition :>> ', imagePosition);



//     planeOrigin.value = [oldList[0],newValue,oldList[2]]
//   }
//    if (props.id === 'ObliqueSagittal') {
//     const newValue = min + (slice / dimensions[0]) * (max - min)
//     console.log('ObliqueSagittal :>> ', newValue);
//     planeOrigin.value = [newValue,oldList[1], oldList[2]]
//   }
//   if (props.id === 'ObliqueAxial') {
//     const newValue = min + (slice / dimensions[2]) * (max - min)
//     console.log('ObliqueAxial :>> ', newValue);
//     planeOrigin.value = [oldList[0], oldList[1],newValue]
//   }


//   newSliceValue = newSlice
//   setSlice(props.id,newSlice)
//   console.log('newSliceValue,新planeOrigin :>> ',newSliceValue, planeOrigin.value);


//   // 不行啊，滑动结构像是新的slice 和当前的就差得很远了。
//   // 所以说，滑动滚动条，根本就没有设置对正确的planeOrigin.value !!!!!!!!
//   // 先放弃了。
//   dragging = true
//   setTimeout(()=>{
//     dragging = false
//   },1000)
// }


// // 不行啊，获取slice，不能用dimensions，还是需要vec3.transformMat4
// watch(
//   planeOrigin,
//   (newValue, oldValue) => {
//     if (dragging) return

//     const newVal = newValue.map(item => parseFloat(item.toFixed(2)));
//     const oldVal = oldValue.map(item => parseFloat(item.toFixed(2)));
//     if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
//       console.log('watch planeOrigin newVal 一样 :>> ', props.id,newVal,oldVal);
//       return
//     }
//     console.log('watch planeOrigin newVal 不一样 :>> ', props.id,newVal,oldVal);

//     // planeOrigin01相反
//     // const dimensions = window.dimensions
//     const [min,max] = sliceRange.value

//     let slice:number
//     let changeId = ''
//     if (newVal[0] !== oldVal[0]) {
//       changeId = 'ObliqueSagittal'
//       // slice = dimensions[1] * (planeOrigin.value[0] - min) / (max - min)
//     } else if (newVal[1] !== oldVal[1]) {
//       changeId = 'ObliqueCoronal'
//       // slice = dimensions[0] * (planeOrigin.value[1] - min) / (max - min)
//     } else if (newVal[2] !== oldVal[2]) {
//       changeId = 'ObliqueAxial'
//       // slice = dimensions[2] * (planeOrigin.value[2] - min) / (max - min)
//     }

//     if (props.id === changeId) {
//       console.log('changeId11 :>> ', changeId);

//       const out = vec3.create();
//       vec3.transformMat4(out, planeOrigin.value, currentImageMetadata.value.worldToIndex)
//       const imagePosition = out
//       console.log('imagePosition :>> ', imagePosition);

//       if(changeId === 'ObliqueCoronal') {
//         slice = imagePosition[2]
//         // slice = max+1 - imagePosition[2]
//         console.log('max :>> ', max);
//       } else if(changeId === 'ObliqueSagittal') {
//         slice = imagePosition[0]
//       } else if(changeId === 'ObliqueAxial') {
//         slice = imagePosition[1]
//         // slice = max+1 - imagePosition[1]
//       }
//       slice = Math.round(slice)
//       console.log('changeId22 :>> ', changeId,slice);
//       setSlice(changeId,slice)
//       currentSlice.value = slice



//       // const currentViewIDs = ['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']
//       // const { lpsOrientation } = unref(currentImageMetadata);
//       // const viewSliceStore = useViewSliceStore()
//       // const imageID = unref(currentImageID) as string
//       // const list: any = {}

//       // currentViewIDs.forEach((viewID) => {
//       //   const sliceConfig = viewSliceStore.getConfig(viewID, imageID);
//       //   const axis = getLPSAxisFromDir(sliceConfig!.axisDirection);
//       //   const index = lpsOrientation[axis];
//       //   let slice = Math.round(imagePosition[index]);
//       //   console.log('object :>> ', viewID,axis,index,sliceConfig, slice);
//       //   viewSliceStore.updateConfig(viewID, imageID, { slice });
//       //   if (slice < 0) {
//       //     slice = 0
//       //   }
//       //   list[viewID] = slice + 1
//       // });
//     }
//   })



// watch(
//   [currentSlice],
//   ([sliceNew]) => {
//     console.log('################################## :>> ', sliceNew);
//     // planeOrigin.value = randomPosition()
//   })


// update the camera
onVTKEvent(
  resliceCursorState,
  'onModified',
  batchForNextTask(() => {

    // return
    // console.log('onModified :>> ', props.id, planeOrigin.value)


    // if (props.id === 'ObliqueCoronal') {
    // console.log('onModified :>> ', props.id);

    // //   debouncedGetData()
    // }
// return





    // TODO
    if (props.id === 'ObliqueCoronal') {
    // if (props.id !== '888') {
      // sliceRange.value: [0,255]

      // console.log('------ :>> ', planeOrigin.value);

// const slice0 = currentImageMetadata.value.dimensions[2] * (planeOrigin.value[1] - sliceDomain.value.min) / (sliceDomain.value.max - sliceDomain.value.min)
// console.log('slice0 :>> ', slice0);

      // setSlice(slice0)

        // viewSliceStore.updateConfig(viewID, imageID, { slice: slice0 });



      const out = vec3.create();
      vec3.transformMat4(
        out,
        planeOrigin.value,
        currentImageMetadata.value.worldToIndex
      );
      const imagePosition = out
      // console.log('imagePosition :>> ', imagePosition);


      // const max = sliceRange.value[1];
      const viewSliceStore = useViewSliceStore();
      // const list: any = {}
      // const currentViewIDs = ['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']
      // const imageID = unref(currentImageID) as string
      // currentViewIDs.forEach((viewID) => {

      //   let slice: number;
      //   if (viewID === 'ObliqueCoronal') {
      //     slice = max+1 - Math.round(imagePosition[2])
      //   } else if (viewID === 'ObliqueSagittal') {
      //     slice = Math.round(imagePosition[0])
      //   } else if (viewID === 'ObliqueAxial') {
      //     slice = max+1 - Math.round(imagePosition[1])
      //   }
      //   // currentSlice.value = slice
      //   // console.log('currentSlice.value :>> ', currentSlice.value);
      //   console.log('slice :>> ', slice);
      //   viewSliceStore.updateConfig(viewID, imageID, { slice: slice });

      //   // if (slice < 0) {
      //   //   slice = 0
      //   // }
      //   // list[viewID] = slice + 1
      //   // list.push({ viewID, imageID, slice })
      // });




      // const viewSliceStore = useViewSliceStore();
      // // const viewStore = useViewStore();

      const imageID = unref(currentImageID) as string;
      // // const currentViewIDs = viewStore.viewIDs.filter(
      // //   (viewID) => !!viewSliceStore.getConfig(viewID, imageID)
      // // );
      // // const currentViewIDs = viewStore.viewIDs.filter(
      // //   (viewID) => viewID.includes('Oblique')
      // // );

      const currentViewIDs = ['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']

      const { lpsOrientation } = unref(currentImageMetadata);

      // // console.log('currentViewIDs :>> ', currentViewIDs);


      const list: any = {}

      currentViewIDs.forEach((viewID) => {
        const sliceConfig = viewSliceStore.getConfig(viewID, imageID);
        const axis = getLPSAxisFromDir(sliceConfig!.axisDirection);
        const index = lpsOrientation[axis];
        let slice = Math.round(imagePosition[index]);
        // console.log('object :>> ', viewID,axis,index,sliceConfig, slice);
        viewSliceStore.updateConfig(viewID, imageID, { slice });

        if (slice < 0) {
          slice = 0
        }
        list[viewID] = slice + 1
        // list.push({ viewID, imageID, slice })
      });

      // console.log('list :>> ', list);

      // 发送给A项目
      // window.parent.postMessage({ type: 'getCenter', value: planeOrigin.value }, '*');
      window.parent.postMessage({
        type: 'getSliceCenter',
        value: JSON.stringify({
        planeOrigin: planeOrigin.value,
        sliceDomain: sliceDomain.value,
        sliceList: list,
      })}, '*');
    // console.log('viewDirection.value :>> ', viewDirection.value);
      // console.log('---2 :>> ', resliceCursorState.invokeBoundsChange());
      // console.log('1 :>> ', resliceCursorState, resliceCursor);
      // console.log('2 :>> ', resliceCursorState.invokeBoundsChange())



      // console.log('planeOrigin.value :>> ', planeOrigin.value);
      // planeOrigin.value = randomPosition()
    }





    updateResliceCamera(false);
  })
);

watchImmediate(currentImageID, () => {
  updateResliceCamera(true);
});


// 使用防抖包装，500毫秒内连续触发只执行最后一次
const debouncedGetData = debounce(() => {
  getData()
}, 500)

function getData() {
  // console.log('resliceCursorState :>> ', resliceCursorState);
  // console.log('getAxisXinY() :>> ', resliceCursorState.getAxisXinY());
  // console.log('getAxisXinY() 1:>> ', resliceCursorState.getAxisXinY().getState());
  // console.log('getAxisXinY() :>> ', resliceCursorState.getAxisXinY().getState().direction);
  // console.log('getAxisXinZ() :>> ', resliceCursorState.getAxisXinZ().getState().direction);
  // console.log('getAxisYinX() :>> ', resliceCursorState.getAxisYinX().getState().direction);
  // console.log('getAxisYinZ() :>> ', resliceCursorState.getAxisYinZ().getState().direction);
  // console.log('getAxisZinX() :>> ', resliceCursorState.getAxisZinX().getState().direction);
  // console.log('getAxisZinY() :>> ', resliceCursorState.getAxisZinY().getState().direction);

  const newData: any = {
    getAxisXinY: resliceCursorState.getAxisXinY().getState().direction,
    getAxisXinZ: resliceCursorState.getAxisXinZ().getState().direction,
    getAxisYinX: resliceCursorState.getAxisYinX().getState().direction,
    getAxisYinZ: resliceCursorState.getAxisYinZ().getState().direction,
    getAxisZinX: resliceCursorState.getAxisZinX().getState().direction,
    getAxisZinY: resliceCursorState.getAxisZinY().getState().direction,
  }

  // 是否相等，如果相等，说明没有旋转，只是误触或者平移。
  const isEqual = twoObjEqual(newData, oldData)

  // 如果是false，说明变换角度了
  if (!isEqual) {
    const xyzAngles = calculateEulerAngles(oldData, newData)
    console.log('xyzAngles :>> ', xyzAngles);

    // 没有老数据，说明就是第一次进来的数据
    if (!oldData) {
      firstAngles = JSON.parse(JSON.stringify(xyzAngles))
    }
    if (firstAngles) {
      returnData(xyzAngles)
    }

  }

  oldData = JSON.parse(JSON.stringify(newData))
}

function returnData(xyzAngles: any) {
  const obj = {
    x: parseFloat((xyzAngles.thetaX - firstAngles.thetaX).toFixed(2)),
    y: parseFloat((xyzAngles.thetaY - firstAngles.thetaY).toFixed(2)),
    z: parseFloat(-(xyzAngles.thetaZ - firstAngles.thetaZ).toFixed(2)),
  }

  if (obj.z < -180) {
    obj.z = 360 + obj.z
  }
  console.log('returnData :>> ', obj);

  window.parent.postMessage({ type: 'rotateAngles', value: obj }, '*');

}

function twoObjEqual(newObj: any, oldObj: any) {
  // console.log('newObj,oldObj :>> ', newObj, oldObj);
  if (!oldObj) {
    return false
  }
  let flag = true;
  Object.keys(newObj).forEach((key) => {
    // if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj[key])) {
    //   console.log(`属性 ${key} 的值不同`);
    //   flag = false;
    // }

    let flag2 = true;
    newObj[key].forEach((item, index) => {
      if (item.toFixed(2) !== oldObj[key][index].toFixed(2)) {
        flag2 = false;
      }
    })
    if (!flag2) {
      // console.log(`属性 ${key} 的值不同`);
      flag = false;
    }
  });
  return flag;
}

// function dengyu2(newObj: any, oldObj: any) {
//   let flag = true;
//   const keys = Object.keys(newObj);
//   for (const key of keys) {
//     if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj[key])) {
//       console.log(`属性 ${key} 的值不同`);
//       flag = false;
//       break;
//     }
//   }
//   return flag;
// }


function calculateEulerAngles(initialData, finalData) {
  // 步骤1：从finalData中提取全局坐标系下的轴方向
  // 假设：
  // - Y视图的X轴对应全局Z方向
  // - X视图的Z轴对应全局Y方向
  // - Z视图的Y轴对应全局X方向
  const globalX = finalData.getAxisZinY.map(v => -v); // 根据数据方向调整符号
  const globalY = finalData.getAxisXinZ;
  const globalZ = finalData.getAxisXinY;

  // 构造旋转矩阵（列优先）
  const R = [
    [globalX[0], globalY[0], globalZ[0]],
    [globalX[1], globalY[1], globalZ[1]],
    [globalX[2], globalY[2], globalZ[2]]
  ];

  // 步骤2：按Y→X→Z顺序分解欧拉角
  let thetaY, thetaX, thetaZ;

  // 计算绕X轴的旋转角度（thetaX）
  thetaX = Math.asin(-R[1][2]) * (180 / Math.PI);
  const cosThetaX = Math.cos(thetaX * Math.PI / 180);

  // 避免万向节锁（cosThetaX接近0时）
  if (Math.abs(cosThetaX) > 1e-6) {
    thetaY = Math.atan2(R[0][2] / cosThetaX, R[2][2] / cosThetaX) * (180 / Math.PI);
    thetaZ = Math.atan2(R[1][0] / cosThetaX, R[1][1] / cosThetaX) * (180 / Math.PI);
  } else {
    // 万向节锁处理
    thetaY = Math.atan2(-R[2][0], R[0][0]) * (180 / Math.PI);
    thetaZ = 0;
  }

  // 步骤3：校正角度符号（根据右手定则）
  thetaY = parseFloat(thetaY.toFixed(2));
  thetaX = -parseFloat(thetaX.toFixed(2)); // 这里加上负号，就把负的转成正的了
  thetaZ = parseFloat(thetaZ.toFixed(2));

  return { thetaY, thetaX, thetaZ };
}



// 计算距离是要获取点和切片新的坐标，再计算距离，一个4维矩阵计算公式，万里教我的
function getNewPosition(position: number[]) {

  const worldToIndex = window.worldToIndex

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

  return [x, y, z]
}


// function calculateRotationAngles(initial, afterFirst, afterSecond, afterThird) {
//   // 第一次旋转：绕Y轴θ₁
//   const getAxisXInYInitial = initial.getAxisXinY;
//   const getAxisXInYFirst = afterFirst.getAxisXinY;
//   const theta1 = Math.atan2(getAxisXInYFirst[0], getAxisXInYFirst[2]) * (180 / Math.PI);

//   // 第二次旋转：绕X轴θ₂
//   const getAxisXInZFirst = afterFirst.getAxisXinZ;
//   const getAxisXInZSecond = afterSecond.getAxisXinZ;
//   const dotXZ = getAxisXInZFirst[0] * getAxisXInZSecond[0] +
//     getAxisXInZFirst[1] * getAxisXInZSecond[1] +
//     getAxisXInZFirst[2] * getAxisXInZSecond[2];
//   const theta2 = Math.acos(dotXZ) * (180 / Math.PI);

//   // 第三次旋转：绕Z轴θ₃
//   const getAxisZInYSecond = afterSecond.getAxisZinY;
//   const getAxisZInYThird = afterThird.getAxisZinY;
//   const dotZY = getAxisZInYSecond[0] * getAxisZInYThird[0] +
//     getAxisZInYSecond[1] * getAxisZInYThird[1] +
//     getAxisZInYSecond[2] * getAxisZInYThird[2];
//   const theta3 = Math.acos(dotZY) * (180 / Math.PI);

//   return {
//     thetaY: theta1.toFixed(1),
//     thetaX: theta2.toFixed(1),
//     thetaZ: theta3.toFixed(1)
//   };
// }

// // 输入数据（示例结构）
// const initialData = {
//     getAxisXinY: [-3.47e-18, -7.45e-9, 1],
//     // 其他轴数据...
// };
// const afterFirstRot = {
//     getAxisXinY: [0.7623, -5.18e-9, 0.6472],
//     // 其他轴数据...
// };
// const afterSecondRot = {
//     getAxisXinZ: [-0.1857, -0.9698, -0.1577],
//     // 其他轴数据...
// };
// const afterThirdRot = {
//     getAxisZinY: [-0.6732, -0.2504, 0.6957],
//     // 其他轴数据...
// };

// const angles = calculateRotationAngles(initialData, afterFirstRot, afterSecondRot, afterThirdRot);
// console.log(`Y轴旋转角度：${angles.thetaY}°, X轴旋转角度：${angles.thetaX}°, Z轴旋转角度：${angles.thetaZ}°`);










// slicing plane colors
const outlineColor = computed(
  () =>
    vec3.scale(
      [0, 0, 0],
      OBLIQUE_OUTLINE_COLORS[outlineType.value],
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
// setTimeout(()=>{
// console.log('390 view', vtkView.value)
// },22000)

// GGG 展示十字线
const showResliceCursor = ref(true)

// B项目接收
window.addEventListener('message', (event: any) => {
  // console.log('2 ObliqueSliceViewer message :>> ', event)

  // 截图
  if (event.data.type === 'screenshot') {
    // console.log('2 vtkView.value:>> ', vtkView.value)
    const getViewsList = vtkView.value?.renderWindow.getViews()
    // console.log('2 164 getViewsList :>> ', getViewsList);

    if (getViewsList && getViewsList.length) {
      // console.log('2 165t :>> ');
      getViewsList[0]?.captureNextImage().then((imageData: string) => {
        // 将截图发送回 A 项目
        window.parent.postMessage({ type: 'screenshotList', screenshot: imageData }, '*');
      })
      vtkView.value?.renderWindow.render()
    }
  }

    // 单个截图，传来的view是coronal  sagittal axial，index是下标。匹配上['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']的视图，返回一个base64图片
  if (event.data.type === 'screenshotSingle') {
    const view = event.data.view
    const index = event.data.index
    // 匹配上['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']的视图
    if (props.id.toLowerCase().includes(view)) {
      const getViewsList = vtkView.value?.renderWindow.getViews()
      if (getViewsList && getViewsList.length) {
        getViewsList[0]?.captureNextImage().then((imageData: string) => {
        // 将截图发送回 A 项目
        window.parent.postMessage({ type: 'screenshotSingle', view, index, screenshot: imageData }, '*');
      })
      vtkView.value?.renderWindow.render()
      }
    }
  }

  // 回到中心位置
  if (event.data.type === 'resetView') {
    resetCamera(window.xyzCenter)
  }

  // 展示十字线，value是true或者false
  if (event.data.type === 'setShowResliceCursor') {
    showResliceCursor.value = event.data.value
    resliceCursor.setHandleVisibility(event.data.value)
    resetCamera(planeOrigin.value)
  }

  // 获得中心位置
  if (event.data.type === 'getCenter' && props.id === 'ObliqueCoronal') {
    // 发送给A项目
    window.parent.postMessage({ type: 'getCenter', value: planeOrigin.value }, '*');
  }

  if (event.data.type === 'setShowResliceCursorLine') {
    // 展示十字线的线和点
    if (event.data.value) {
      // 这是针对5个圆点
      resliceCursorState.getStatesWithLabel('sphere').forEach((handle, index) => {
        const h = handle as ResliceCursorWidgetState;
        h.setScale1(12); // 十字线的圆形大小，一共5个圆形，默认是10
        h.setOpacity(100); // 圆形的透明度，默认128
        // 第一个就是中间的白色圆点
        if (index === 0) {
          h.setOpacity(40); // 圆形的透明度，默认128
          h.setColor3([255, 255, 255]);
        }
      });
      // 这是针对线
      resliceCursorState.getStatesWithLabel('line').forEach((handle) => {
        const h = handle as ResliceCursorWidgetState;
        h.setScale3(1, 1, 1); // 线粗度，默认1
        h.setOpacity(100); // 透明度，默认100
      });
    } else {
      // 不展示十字线的线和点
      // 这是针对5个圆点
      resliceCursorState.getStatesWithLabel('sphere').forEach((handle, index) => {
        const h = handle as ResliceCursorWidgetState;
        h.setScale1(0); // 十字线的圆形大小，一共5个圆形，默认是10
        h.setOpacity(100); // 圆形的透明度，默认128

        // 第一个就是中间的白色圆点
        if (index === 0) {
          h.setScale1(12); // 十字线的圆形大小，一共5个圆形，默认是10
          h.setOpacity(100); // 圆形的透明度，默认128
          h.setColor3([255, 10, 10]);
        }
      });
      // 这是针对线
      resliceCursorState.getStatesWithLabel('line').forEach((handle) => {
        const h = handle as ResliceCursorWidgetState;
        h.setScale3(0, 0, 0); // 线粗度，默认1
        h.setOpacity(100); // 透明度，默认100
      });
    }
    resetCamera(planeOrigin.value)

  }
})


// // 生成一个随机数
// function randomNum(min: number, max: number)  {
//   return Math.floor(Math.random() * (max - min) + min)
// }
// const randomPosition = () => {
//   const position: Vector3 = [
//     randomNum(50,200),
//     randomNum(50,200),
//     randomNum(50,200)
//   ]
//   return position
// }

// watch(
//   [currentSlice],
//   ([sliceNew]) => {
//     console.log('################################## :>> ', sliceNew);

//     planeOrigin.value = randomPosition()


//     // currentSlice.value  = sliceNew;
//     // console.log('changeSlice927', currentSlice.value);

//     // console.log('938',resliceCursor, resliceCursorState)
//     // console.log('9381',resliceCursor.getPlaneExtremities('ObliqueSagittal'))
//     // console.log('9382',resliceCursor.getPlaneNormalFromViewType('ObliqueSagittal'))
//     // console.log('9383',resliceCursor.getPlaneSource('ObliqueSagittal'))
//     // console.log('9384',resliceCursor.getPlaneSourceFromViewType('ObliqueSagittal'))
//     // console.log('9385',resliceCursor.getResliceAxes('ObliqueSagittal'))
//     // console.log('9386',resliceCursor.getResliceMatrix())


//     // console.log('9381',resliceCursor.getPlaneExtremities(4))
//     // console.log('9382',resliceCursor.getPlaneNormalFromViewType(4))
//     // console.log('9383',resliceCursor.getPlaneSource(4))
//     // console.log('9384',resliceCursor.getPlaneSourceFromViewType(4))
//     // console.log('9385',resliceCursor.getResliceAxes(4))
//     // console.log('9386',resliceCursor.getResliceMatrix())

//     // console.log('0000',resliceCursorState.getCenter())
//     // console.log('0000',resliceCursorState.getImage())
//     // console.log('0000',resliceCursorState.getPlanes())
//     // console.log('0000',resliceCursorState.setPlanes())


//     // console.log('0000 planes',planes)
//     // console.log('0000 planeNormal',planeNormal)


// //      console.log('planeOrigin.value :>> ', planeOrigin.value);
// // if (props.id === 'ObliqueCoronal') {
// //   planeOrigin.value = randomPosition()
// // }


// // const planes = vtkFieldRef(resliceCursorState, 'planes');
// // const planeNormal = computed(() => planes.value[widgetViewType.value].normal);


//     // return

//     // const { metadata: imageMetadata } = useImage(imageId);


//     // const manipulator = vtkPlaneManipulator.newInstance();


//     //   updatePlaneManipulatorFor2DView(
//     //     manipulator,
//     //     viewDirection.value,
//     //     sliceNew,
//     //    currentImageMetadata.value
//     //   );

//     // const viewSliceStore = useViewSliceStore();

//     // const imageID = unref(currentImageID) as string;

//     // const currentViewIDs = ['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']

//     // currentViewIDs.forEach((viewID) => {
//     //   const sliceConfig: any = viewSliceStore.getConfig(viewID, imageID);
//     //   console.log('sliceConfig :>> ', sliceConfig);
//     //   viewSliceStore.updateConfig(viewID, imageID, { slice: sliceConfig.slice });

//     //   // const axis = getLPSAxisFromDir(sliceConfig!.axisDirection);
//     //   // const index = lpsOrientation[axis];
//     //   // let slice = Math.round(imagePosition[index]);
//     //   // // console.log('object :>> ', viewID,sliceConfig,axis,index,slice);
//     //   // viewSliceStore.updateConfig(viewID, imageID, { slice });

//     //   // if (slice < 0) {
//     //   //   slice = 0
//     //   // }
//     //   // list[viewID] = slice + 1
//     //   // list.push({ viewID, imageID, slice })
//     // });


//     //  const viewSliceStore = useViewSliceStore();
//     // const a = viewSliceStore.getConfig(viewID, imageID)
//     // console.log('a :>> ', a);

//     // syncRef(sliceNew, slice, { immediate: true });

//     // if (slice && range) {
//     //   resliceCursorWidget.setSlice(slice);
//     //   resliceCursorWidget.setRange(range);
//     // }



//     // const out = vec3.create();
//     //   vec3.transformMat4(
//     //     out,
//     //     planeOrigin.value,
//     //     currentImageMetadata.value.worldToIndex
//     //   );
//     //   const imagePosition = out
//     //   // console.log('imagePosition :>> ', imagePosition);


//     //   const viewSliceStore = useViewSliceStore();
//     //   // const viewStore = useViewStore();

//     //   const imageID = unref(currentImageID) as string;

//     //   // const currentViewIDs = viewStore.viewIDs.filter(
//     //   //   (viewID) => !!viewSliceStore.getConfig(viewID, imageID)
//     //   // );
//     //   // const currentViewIDs = viewStore.viewIDs.filter(
//     //   //   (viewID) => viewID.includes('Oblique')
//     //   // );

//     //   const currentViewIDs = ['ObliqueCoronal', 'ObliqueSagittal', 'ObliqueAxial']

//     //   const { lpsOrientation } = unref(currentImageMetadata);

//     //   // console.log('currentViewIDs :>> ', currentViewIDs);


//     //   const list: any = {}

//     //   currentViewIDs.forEach((viewID) => {
//     //     const sliceConfig = viewSliceStore.getConfig(viewID, imageID);
//     //     const axis = getLPSAxisFromDir(sliceConfig!.axisDirection);
//     //     const index = lpsOrientation[axis];
//     //     let slice = Math.round(imagePosition[index]);
//     //     // console.log('object :>> ', viewID,sliceConfig,axis,index,slice);
//     //     viewSliceStore.updateConfig(viewID, imageID, { slice });

//     //     if (slice < 0) {
//     //       slice = 0
//     //     }
//     //     list[viewID] = slice + 1
//     //     // list.push({ viewID, imageID, slice })
//     //   });

//     //   console.log('list :>> ', list);

//     //   // 发送给A项目
//     //   // window.parent.postMessage({ type: 'getCenter', value: planeOrigin.value }, '*');
//     //   window.parent.postMessage({
//     //     type: 'getSliceCenter',
//     //     value: JSON.stringify({
//     //     planeOrigin: planeOrigin.value,
//     //     sliceDomain: sliceDomain.value,
//     //     sliceList: list,
//     //   })}, '*');
//   },
//   {
//     immediate: true,
//   }
// );

</script>

<style scoped src="@/src/components/styles/vtk-view.css"></style>
<style scoped src="@/src/components/styles/utils.css"></style>

<style scoped>
.info-box {
  /* width: 300px; */
  max-width: 12px;
  width: 3%;
  height: calc(100% - 50px);
  position: absolute;
  top: 24px;
  left: 5px;
  z-index: 1;
}


.info-box .slice-slider {
  height: 100%;
  position: relative;
  flex: 1 1;
  width: 100%;
  padding: 0;
}
</style>
