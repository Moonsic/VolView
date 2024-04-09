<template>
  <div
    class="vtk-container-wrapper-oblique"
    tabindex="0"
    @pointerenter="hover = true"
    @pointerleave="hover = false"
    @focusin="hover = true"
    @focusout="hover = false"
  >

    <div class="vtk-gutter">
      <v-btn dark icon size="medium" variant="text" @click="enableResizeToFit">
        <v-icon size="medium" class="py-1">mdi-camera-flip-outline</v-icon>
        <v-tooltip
          location="right"
          activator="parent"
          transition="slide-x-transition"
        >
          Reset Camera
        </v-tooltip>
      </v-btn>
      <!-- 侧边的滚动条 -->
      <!-- <slice-slider
        v-model="currentSlice"
        class="slice-slider"
        :min="sliceRange[0]"
        :max="sliceRange[1]"
        :step="1"
        :handle-height="20"
      /> -->
    </div>


    <div class="vtk-container" :class="active ? 'active' : ''">
      <div class="vtk-sub-container">
        <div class="vtk-view" ref="vtkContainerRef" />
      </div>
      <div class="overlay-no-events tool-layer" ref="toolContainer">
        <pan-tool :view-id="viewID" />
        <zoom-tool :view-id="viewID" />
        <reslice-cursor-tool
          :view-id="viewID"
          :view-direction="viewDirection"
        />
        <window-level-tool :view-id="viewID" />
      </div>
      <view-overlay-grid class="overlay-no-events view-annotations">
        <template v-slot:bottom-left>
          <div class="annotation-cell">
            <!-- <div>Slice: {{ currentSlice + 1 }}/{{ sliceRange[1] + 1 }}</div> -->
            <div v-if="windowWidth != null && windowLevel != null">
              W/L: {{ windowWidth.toFixed(2) }} / {{ windowLevel.toFixed(2) }}
            </div>
          </div>
        </template>
        <template v-slot:top-right>
          <div class="annotation-cell">
            <dicom-quick-info-button
              :image-id="curImageID"
            ></dicom-quick-info-button>
          </div>
        </template>
      </view-overlay-grid>
      <transition name="loading">
        <div v-if="isImageLoading" class="overlay-no-events loading">
          <div>Loading the image</div>
          <div>
            <v-progress-circular indeterminate color="blue" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  PropType,
  provide,
  ref,
  toRefs,
  watch,
  watchEffect,
} from 'vue';
import { vec3 } from 'gl-matrix';
import { onKeyStroke } from '@vueuse/core';

import type { RGBColor, Vector3 } from '@kitware/vtk.js/types';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import vtkMatrixBuilder from '@kitware/vtk.js/Common/Core/MatrixBuilder';
import vtkResliceRepresentationProxy from '@kitware/vtk.js/Proxy/Representations/ResliceRepresentationProxy';
import { useResizeToFit } from '@/src/composables/useResizeToFit';
import vtkLPSView2DProxy from '@/src/vtk/LPSView2DProxy';
import { SlabTypes } from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper/Constants';
import { ViewTypes } from '@kitware/vtk.js/Widgets/Core/WidgetManager/Constants';
import { ResliceCursorWidgetState } from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget';
import { onVTKEvent } from '@/src/composables/onVTKEvent';
import { manageVTKSubscription } from '@/src/composables/manageVTKSubscription';
// import SliceSlider from '@/src/components/SliceSlider.vue';
import ViewOverlayGrid from '@/src/components/ViewOverlayGrid.vue';
import { useSliceConfig } from '@/src/composables/useSliceConfig';
import { useSliceConfigInitializer } from '@/src/composables/useSliceConfigInitializer';
import { useWindowingConfig } from '@/src/composables/useWindowingConfig';
import { useWindowingConfigInitializer } from '@/src/composables/useWindowingConfigInitializer';
import { useProxyRepresentation } from '@/src/composables/useProxyRepresentations';
import DicomQuickInfoButton from '@/src/components/DicomQuickInfoButton.vue';
import { useResizeObserver } from '../composables/useResizeObserver';
import { getLPSAxisFromDir } from '../utils/lps';
import { useCurrentImage } from '../composables/useCurrentImage';
import { useCameraOrientation } from '../composables/useCameraOrientation';
import WindowLevelTool from './tools/windowing/WindowLevelTool.vue';
import PanTool from './tools/PanTool.vue';
import ZoomTool from './tools/ZoomTool.vue';
import ResliceCursorTool from './tools/ResliceCursorTool.vue';

import { useResetViewsEvents } from './tools/ResetViews.vue';
import { useResetViewsEvents2 } from './App.vue';

import { LPSAxisDir } from '../types/lps';
import { ViewProxyType } from '../core/proxies';
import { useViewProxy } from '../composables/useViewProxy';
import useViewSliceStore from '../store/view-configs/slicing';
import {
  OBLIQUE_OUTLINE_COLORS,
  ToolContainer,
  VTKResliceCursor,
} from '../constants';

const SLICE_OFFSET_KEYS: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
  ArrowDown: 1,
} as const;

export default defineComponent({
  name: 'VtkObliqueView',
  props: {
    id: {
      type: String,
      required: true,
    },
    viewDirection: {
      type: String as PropType<LPSAxisDir>,
      required: true,
    },
    viewUp: {
      type: String as PropType<LPSAxisDir>,
      required: true,
    },
  },
  components: {
    // SliceSlider,
    ViewOverlayGrid,
    WindowLevelTool,
    PanTool,
    ZoomTool,
    ResliceCursorTool,
    DicomQuickInfoButton,
  },
  setup(props) {
    const viewSliceStore = useViewSliceStore();

    const { id: viewID, viewDirection, viewUp } = toRefs(props);

    const vtkContainerRef = ref<HTMLElement>();

    const viewAxis = computed(() => getLPSAxisFromDir(viewDirection.value));

    // --- computed vars --- //

    const {
      currentImageData: curImageData,
      currentImageID: curImageID,
      currentImageMetadata: curImageMetadata,
      isImageLoading,
    } = useCurrentImage();

    // console.log('oblique',viewID, curImageID)

    const {
      config: sliceConfig,
      slice: currentSlice,
      range: sliceRange
    } = useSliceConfig(viewID, curImageID);

    // currentSlice.value = 100

    // watch(
    //   currentSlice,
    //   (value) => {
    //     console.log('currentSlice :>> ', value);
    //   },
    //   { immediate: true }
    // )


    const {
      width: windowWidth,
      level: windowLevel,
      config: wlConfig,
    } = useWindowingConfig(viewID, curImageID);

    // --- view proxy setup --- //

    const { viewProxy } = useViewProxy<vtkLPSView2DProxy>(
      viewID,
      ViewProxyType.Oblique
    );

    const resliceCursor = inject(VTKResliceCursor);
    if (!resliceCursor) {
      throw Error('Cannot access global ResliceCursor instance.');
    }

    const VTKViewType = computed(() => {
      const viewAxisValue = viewAxis?.value;
      switch (viewAxisValue) {
        case 'Coronal':
          return ViewTypes.XZ_PLANE;
        case 'Sagittal':
          return ViewTypes.YZ_PLANE;
        default:
          return ViewTypes.XY_PLANE;
      }
    });

    const { representation: baseImageRep } =
      useProxyRepresentation<vtkResliceRepresentationProxy>(curImageID, viewID);

    onBeforeMount(() => {
      // do this before mount, as the ManipulatorTools run onMounted
      // before this component does.
      viewProxy.value.getInteractorStyle2D().removeAllManipulators();
    });

    const updateViewFromResliceCursor = () => {
      const rep = baseImageRep?.value;
      const state = resliceCursor?.getWidgetState() as ResliceCursorWidgetState;
      if (resliceCursor && rep) {
        const planeOrigin = state.getCenter();
        const planeNormal = resliceCursor.getPlaneNormalFromViewType(
          VTKViewType.value
        );
        rep.getSlicePlane().setNormal(planeNormal);
        rep.getSlicePlane().setOrigin(planeOrigin);
        if (curImageData.value) {
          resliceCursor.updateCameraPoints(
            viewProxy.value.getRenderer(),
            VTKViewType.value,
            false,
            false,
            true
          );
        }
      }
    };

    onVTKEvent(
      resliceCursor.getWidgetState(),
      'onModified',
      updateViewFromResliceCursor
    );

    onMounted(() => {
      viewProxy.value.setContainer(vtkContainerRef.value ?? null);
      viewProxy.value.setOrientationAxesVisibility(false); // 方向，在左下角，没用

      // Initialize camera points during construction
      if (curImageData.value) {
        resliceCursor.updateCameraPoints(
          viewProxy.value.getRenderer(),
          VTKViewType.value,
          true,
          false,
          true
        );
      }
    });

    onBeforeUnmount(() => {
      viewProxy.value.setContainer(null);
    });

    // Function to compute float range of slicing for oblique slicing.
    // Range is calculated as distance along the plane normal (as originating from {0,0,0} ).
    function slicePlaneRange(
      cornerPoints: number[][],
      sliceNormal: number[]
    ): [number, number] {
      // console.log('cornerPoints :>> ', cornerPoints, sliceNormal);
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

    // --- arrows change slice --- //

    const hover = ref(false);
    const onKeyDown = (event: KeyboardEvent) => {
      console.log("onKeyDown; ",event);
      if (!curImageID.value || !hover.value) return;

      const sliceOffset = SLICE_OFFSET_KEYS[event.key] ?? 0;
      if (sliceOffset) {
        viewSliceStore.updateConfig(viewID.value, curImageID.value, {
          slice: currentSlice.value + sliceOffset,
        });

        event.stopPropagation();
      }
    };
    onKeyStroke(Object.keys(SLICE_OFFSET_KEYS), onKeyDown);

    // --- resizing --- //

    useResizeObserver(vtkContainerRef, () => viewProxy.value.resize());

    // Used by SVG tool widgets for resizeCallback
    const toolContainer = ref<HTMLElement>();
    provide(ToolContainer, toolContainer);

    // --- window/level setup --- //

    watch(
      curImageData,
      (imageData) => {
        if (curImageID.value == null || wlConfig.value != null || !imageData) {
          return;
        }

        updateViewFromResliceCursor();
      },
      {
        immediate: true,
      }
    );

    // --- scene setup --- //

    const { cameraDirVec, cameraUpVec } = useCameraOrientation(
      viewDirection,
      viewUp,
      curImageMetadata
    );

    const imageCorners = computed(() => {
      const image = curImageData.value;
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
      const [...sliceNormal] = cameraDirVec?.value ?? [0, 0, 1];
      const range = slicePlaneRange(imageCorners?.value, sliceNormal);
      return {
        min: range[0],
        max: range[1],
      };
    });

    // --- apply windowing and slice configs --- //

    useSliceConfigInitializer(viewID, curImageID, viewDirection, sliceDomain);
    useWindowingConfigInitializer(viewID, curImageID);

    watch(
      baseImageRep,
      (obliqueRep) => {
        console.log('obliqueRep',obliqueRep)
        if (obliqueRep) {
          obliqueRep.setOutlineVisibility(true); // 是否显示外围的线
          obliqueRep.setOutlineLineWidth(1.0); // 线宽，原来为4

          if (viewID.value) {
            const outlineColor = vec3.scale(
              [0, 0, 0],
              OBLIQUE_OUTLINE_COLORS[viewID.value],
              1 / 255
            ) as RGBColor;
            obliqueRep.setOutlineColor(outlineColor);

          }
        }
      },
      { immediate: true }
    );

    // Set default cutting plane parameters.

    watch([baseImageRep, cameraDirVec], () => {
      const rep = baseImageRep?.value;
      if (rep) {
        if (cameraDirVec) {
          const planeNormal: Vector3 = [
            cameraDirVec.value[0],
            cameraDirVec.value[1],
            cameraDirVec.value[2],
          ];
          rep.getSlicePlane().setNormal(planeNormal);
        }
        rep.setSlabType(SlabTypes.MAX);
        rep.setSlabThickness(1);
      }
    });

    // --- camera setup --- //

    const { resizeToFit, ignoreResizeToFitTracking, resetResizeToFitTracking } =
      useResizeToFit(viewProxy.value.getCamera(), false);

    const resizeToFitScene = () =>
      ignoreResizeToFitTracking(() => {
        // resize to fit
        const lookAxis =
          curImageMetadata.value.lpsOrientation[
            getLPSAxisFromDir(viewDirection.value)
          ];
        const upAxis =
          curImageMetadata.value.lpsOrientation[
            getLPSAxisFromDir(viewUp.value)
          ];
        const dimsWithSpacing = curImageMetadata.value.dimensions.map(
          (d, i) => d * curImageMetadata.value.spacing[i]
        );
        viewProxy.value.resizeToFit(lookAxis, upAxis, dimsWithSpacing);
        resetResizeToFitTracking();
      });

    // 已知又有一个数组boundsArray=[-130.0814828891307, 125.91851997189224, -123.50813484017272, 132.49186808045488, -119.1382771413773, 136.86167994327843 ]，
    // 它代表一个3维的坐标，是一个256256256的正方体，
    // 其中第1个数表示x轴的最小值，第2个数表示x轴的最大值，
    // 第3个数表示y轴的最小值，第4个数表示y轴的最大值，
    // 第5个数表示z轴的最小值，第6个数表示z轴的最大值，
    // 我现在要写一个函数，输入是一个数组，里面3个数字，数字范围在[0,256]之间，分别表示x/y/z轴 ,
    // 这个函数要返回一个数组，里面是3个轴的坐标
    // 想通过给定的边界数组以及用户输入的 [x, y, z] 坐标，在这个 256256256 的正方体范围内，获取相应的标准化坐标
    function getNormalizedCoordinates(boundsArray: [number, number, number, number, number, number], inputArray: [number, number, number]): vec3 {
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

    let defaultPosition: Vector3|Float32Array|null = null

    const resetCamera = (position?: [number, number, number]) => {
      const bounds = curImageMetadata.value.worldBounds;
      const center = vtkBoundingBox.getCenter(bounds);

      // console.log('bounds',bounds)
      // console.log('center',center)

      // GGG 就是这个resliceCursor.setCenter(center);方法，设置定位的，
      // TODO：bounds一个6个元素的数组，以0为中心的，有正有负，所以要换算，
      // 都是256
      // console.log('x',bounds[1]-bounds[0])
      // console.log('y',bounds[3]-bounds[2])
      // console.log('z',bounds[5]-bounds[4])


      // const target = [10,10,10]
      // const target = [250,250,250]
      // const target = [120,120,120]
      // const target = [120,10,10] // 第3个，黄线，正面
      // const target = [10,120,10] // 第2个，红线，顶面
      // const target:[number, number, number] = [80,140,180] // 第1个，绿线，侧面

      // 如果传来位置，就定位新的位置，并设置成默认位置，再点击reset Views时回到新的位置
      // 如果没有传来位置，但有默认位置，再定位到新的位置
      // 如果没有传来位置，也没有默认位置，就定位到中心位置
      let newCenter: vec3
      if (position) {
        newCenter = getNormalizedCoordinates(bounds, position)
        defaultPosition = newCenter
      } else if (defaultPosition) {
        newCenter = defaultPosition
      } else {
        newCenter = center
      }

      // const newCenter = position ? getNormalizedCoordinates(bounds, position) : center
      console.log('newCenter',newCenter)


      // do not track resizeToFit state
      ignoreResizeToFitTracking(() => {
        viewProxy.value.updateCamera(
          cameraDirVec.value,
          cameraUpVec.value,
          newCenter // 之前是center
        );
        viewProxy.value.resetCamera(bounds);
        // reset cursor widget
        const state =
          resliceCursor?.getWidgetState() as ResliceCursorWidgetState;
        // Reset to default plane values before transforming based on current image-data.
        state.setPlanes({
          [ViewTypes.YZ_PLANE]: {
            normal: [1, 0, 0],
            viewUp: [0, 0, 1],
          },
          [ViewTypes.XZ_PLANE]: {
            normal: [0, -1, 0],
            viewUp: [0, 0, 1],
          },
          [ViewTypes.XY_PLANE]: {
            normal: [0, 0, -1],
            viewUp: [0, -1, 0],
          },
        });
        const planes = state.getPlanes();

        if (curImageMetadata.value) {
          planes[ViewTypes.XY_PLANE].normal = curImageMetadata.value
            .lpsOrientation.Inferior as Vector3;
          planes[ViewTypes.XY_PLANE].viewUp = curImageMetadata.value
            .lpsOrientation.Anterior as Vector3;

          planes[ViewTypes.XZ_PLANE].normal = curImageMetadata.value
            .lpsOrientation.Anterior as Vector3;
          planes[ViewTypes.XZ_PLANE].viewUp = curImageMetadata.value
            .lpsOrientation.Superior as Vector3;

          planes[ViewTypes.YZ_PLANE].normal = curImageMetadata.value
            .lpsOrientation.Left as Vector3;
          planes[ViewTypes.YZ_PLANE].viewUp = curImageMetadata.value
            .lpsOrientation.Superior as Vector3;

          resliceCursor.setCenter(newCenter); // 之前是center
        }
        if (curImageMetadata) {
          state.placeWidget(bounds);
        }
        viewProxy.value.renderLater();
      });

      resizeToFitScene();

      updateViewFromResliceCursor();

      viewProxy.value.renderLater();
    };

    manageVTKSubscription(
      viewProxy.value.onResize(() => {
        if (resizeToFit.value) {
          resizeToFitScene();
        }
      })
    );

    // if we re-enable resizeToFit, reset the camera
    watch(resizeToFit, () => {
      if (resizeToFit.value) {
        resetCamera();
      }
    });

    watch(
      [curImageID, cameraDirVec, cameraUpVec],
      () => {
        // If we have a saved camera configuration restore it
        if (resizeToFit.value) {
          resetCamera();
        } else {
          // this will trigger a resetCamera() call
          resizeToFit.value = true;
        }
      },
      { immediate: true, deep: true }
    );

    // --- viewport orientation/camera labels --- //

    watchEffect(() => {
      if (sliceConfig.value == null || wlConfig.value == null) {
        return;
      }

      const { width, level } = wlConfig.value;

      if (baseImageRep.value) {
        baseImageRep.value.setWindowWidth(width);
        baseImageRep.value.setWindowLevel(level);
      }

      viewProxy.value.renderLater();
    });

    // Listen to ResetViews event.
    const events = useResetViewsEvents();
    events.onClick(() => resetCamera());

    const events2 = useResetViewsEvents2();
    events2.onClick((position) => resetCamera(position));

    const enableResizeToFit = () => {
      resizeToFit.value = true;
      resetCamera();
    };

    return {
      vtkContainerRef,
      toolContainer,
      viewID,
      viewProxy,
      viewAxis,
      active: true,
      curImageID,
      currentSlice,
      sliceRange,
      windowWidth,
      windowLevel,
      isImageLoading,
      enableResizeToFit,
      hover,
    };
  },
  mounted() {
    this.enableResizeToFit();
  },
});
</script>

<style scoped src="@/src/components/styles/vtk-view.css"></style>
<style scoped src="@/src/components/styles/utils.css"></style>
<style scoped>
.hover-info {
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.vtk-container-wrapper-oblique {
  flex: 1;
  display: grid;
  /* grid-template-columns: auto; */
  grid-template-columns: 20px auto;
  grid-template-rows: auto;
  z-index: 0; /* avoids partial obscuring of focus outline */
}
</style>
