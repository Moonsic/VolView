<template>
  <div class="vtk-container-wrapper" tabindex="0">
    <div class="vtk-gutter"></div>
    <div class="vtk-container">
      <div class="vtk-sub-container">

        <!-- VtkVolumeView -->
        <vtk-volume-view
          class="vtk-view"
          ref="vtkView"
          data-testid="vtk-view"
          :view-id="id"
          :image-id="currentImageID"
          :view-direction="viewDirection"
          :view-up="viewUp"
        >
          <!-- 我的球体参考点，只有一个，不应该放在v-for里 -->
          <MySpheresRepresentation :sphereRadius="4"></MySpheresRepresentation>


          <template v-for="(sliceProps, idx) in obliqueSliceProps" :key="idx">

            <!-- VtkBaseObliqueSliceRepresentation 3个切片 -->
            <vtk-base-oblique-slice-representation
              :view-id="sliceProps.viewId"
              :image-id="currentImageID"
              :plane-normal="sliceProps.planeNormal"
              :plane-origin="sliceProps.planeOrigin"
            ></vtk-base-oblique-slice-representation>


            <!-- VtkImageOutlineRepresentation 线框 thickness：4 就是线宽的意思 -->
            <vtk-image-outline-representation
              :view-id="sliceProps.viewId"
              :image-id="currentImageID"
              :plane-normal="sliceProps.planeNormal"
              :plane-origin="sliceProps.planeOrigin"
              :thickness="2"
              :color="sliceProps.outlineColor"
            ></vtk-image-outline-representation>
          </template>
          <slot></slot>
        </vtk-volume-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from 'vue';
import { useCurrentImage } from '@/src/composables/useCurrentImage';
import { LPSAxis, LPSAxisDir } from '@/src/types/lps';
import VtkVolumeView from '@/src/components/vtk/VtkVolumeView.vue';
import { VtkViewApi } from '@/src/types/vtk-types';
import { LayoutViewProps } from '@/src/types';
import VtkBaseObliqueSliceRepresentation from '@/src/components/vtk/VtkBaseObliqueSliceRepresentation.vue';
import VtkImageOutlineRepresentation from '@/src/components/vtk/VtkImageOutlineRepresentation.vue';
import MySpheresRepresentation from '@/src/components/vtk/MySpheresRepresentation.vue';

import { useViewAnimationListener } from '@/src/composables/useViewAnimationListener';
import useResliceCursorStore, {
  mapAxisToViewType,
} from '@/src/store/reslice-cursor';
import { vtkFieldRef } from '@/src/core/vtk/vtkFieldRef';
import { useResetViewsEvents } from '@/src/components/tools/ResetViews.vue';
import { vec3 } from 'gl-matrix';
import { OBLIQUE_OUTLINE_COLORS } from '@/src/constants';
import type { RGBColor } from '@kitware/vtk.js/types';

interface SliceSpec {
  viewID: string;
  axis: LPSAxis;
}

interface Props extends LayoutViewProps {
  viewDirection: LPSAxisDir;
  viewUp: LPSAxisDir;
  slices: SliceSpec[];
}

const vtkView = ref<VtkViewApi>();

const props = defineProps<Props>();

const {
  id: viewId,
  type: viewType,
  viewDirection,
  viewUp,
  slices,
} = toRefs(props);

useViewAnimationListener(vtkView, viewId, viewType);

// base image
const { currentImageID } = useCurrentImage();
// console.log('98--- :>> ', currentImageID);

// reslice cursor
const resliceStore = useResliceCursorStore();
const { resliceCursor, resliceCursorState } = resliceStore;

// -----

const resliceCenter = vtkFieldRef(resliceCursorState, 'center');
// console.log('106 resliceCenter :>> ', resliceCenter);
const obliqueSliceProps = computed(() => {
  return slices.value.map((sliceSpec) => {
    const planeNormal = resliceCursor.getPlaneNormalFromViewType(
      mapAxisToViewType(sliceSpec.axis)
    );
    const outlineColor = vec3.scale(
      [0, 0, 0],
      OBLIQUE_OUTLINE_COLORS[sliceSpec.viewID],
      1 / 255
    ) as RGBColor;
    return {
      viewId: sliceSpec.viewID,
      planeNormal,
      planeOrigin: resliceCenter.value,
      outlineColor,
    };
  });
});

// console.log('slices :>> ', slices);
// console.log('obliqueSliceProps :>> ', obliqueSliceProps);
// console.log('127 vtkView.value :>> ', vtkView.value);

// reset camera logic
function resetCamera() {
  if (!vtkView.value) return;
  vtkView.value.resetCamera();
  vtkView.value.requestRender();
}

useResetViewsEvents().onClick(resetCamera);



// ObliqueSagittal黄、ObliqueCoronal红、ObliqueAxial蓝
// [
//   {
//     "viewId": "ObliqueSagittal",
//     "planeNormal": [
//       1,
//       3.958120942115784e-9,
//       3.725290298461914e-9
//     ],
//     "planeOrigin": [
//       -2.081481458619237,
//       4.4918666201410815,
//       8.861701400950565
//     ],
//     "outlineColor": [
//       1,
//       1,
//       0
//     ]
//   },
//   {
//     "viewId": "ObliqueCoronal",
//     "planeNormal": [
//       7.450580596923828e-9,
//       -1,
//       -7.450580596923828e-9
//     ],
//     "planeOrigin": [
//       -2.081481458619237,
//       4.4918666201410815,
//       8.861701400950565
//     ],
//     "outlineColor": [
//       1,
//       0.2,
//       0.2
//     ]
//   },
//   {
//     "viewId": "ObliqueAxial",
//     "planeNormal": [
//       -3.725290964595848e-9,
//       -7.450581929191696e-9,
//       -0.9999999999999999
//     ],
//     "planeOrigin": [
//       -2.081481458619237,
//       4.4918666201410815,
//       8.861701400950565
//     ],
//     "outlineColor": [
//       0,
//       0.5019607843137255,
//       1
//     ]
//   }
// ]













</script>

<style scoped src="@/src/components/styles/vtk-view.css"></style>
<style scoped src="@/src/components/styles/utils.css"></style>
