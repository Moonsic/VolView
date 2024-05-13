<script setup lang="ts">
import {
  ref,
  toRefs,
  provide,
  watchEffect,
  markRaw,
  effectScope,
  onUnmounted,
} from 'vue';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator';
import { useVtkView } from '@/src/core/vtk/useVtkView';
import { useImage } from '@/src/composables/useCurrentImage';
import { useVtkInteractorStyle } from '@/src/core/vtk/useVtkInteractorStyle';
import { useVtkInteractionManipulator } from '@/src/core/vtk/useVtkInteractionManipulator';
import { LPSAxisDir } from '@/src/types/lps';
import { watchImmediate } from '@vueuse/core';
import { resetCameraToImage } from '@/src/utils/camera';
import { usePersistCameraConfig } from '@/src/composables/usePersistCameraConfig';
import { Maybe } from '@/src/types';
import { VtkViewApi } from '@/src/types/vtk-types';
import { VtkViewContext } from '@/src/components/vtk/context';
import vtkMouseCameraTrackballRotateManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballRotateManipulator';
import vtkBoundingBox from '@kitware/vtk.js/Common/DataModel/BoundingBox';
import type { Vector3 } from '@kitware/vtk.js/types';

// import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
// import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
// import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';


interface Props {
  viewId: string;
  imageId: Maybe<string>;
  viewDirection: LPSAxisDir;
  viewUp: LPSAxisDir;
  disableAutoResetCamera?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disableAutoResetCamera: false,
});
const {
  viewId: viewID,
  imageId: imageID,
  viewDirection,
  viewUp,
  disableAutoResetCamera,
} = toRefs(props);

const vtkContainerRef = ref<HTMLElement>();

const { metadata: imageMetadata } = useImage(imageID);

// use a detached scope so that actors can be removed from
// the renderer before the renderer is deleted.
const scope = effectScope(true);
const view = scope.run(() => useVtkView(vtkContainerRef))!;
console.log('55 view :>> ', view);
onUnmounted(() => {
  scope.stop();
});

view.renderer.setBackground(0, 0, 0);

// setup interactor style
const { interactorStyle } = useVtkInteractorStyle(
  vtkInteractorStyleManipulator,
  view
);

useVtkInteractionManipulator(
  interactorStyle,
  vtkMouseCameraTrackballPanManipulator,
  { button: 1, shift: true }
);
useVtkInteractionManipulator(
  interactorStyle,
  vtkMouseCameraTrackballZoomManipulator,
  { button: 3, scrollEnabled: true }
);
useVtkInteractionManipulator(
  interactorStyle,
  vtkMouseCameraTrackballRotateManipulator,
  { button: 1 }
);

// set center of rotation
watchEffect(() => {
  const center = vtkBoundingBox.getCenter(imageMetadata.value.worldBounds);
  interactorStyle.setCenterOfRotation(...center);
});

function resetCamera() {
  resetCameraToImage(
    view,
    imageMetadata.value,
    viewDirection.value,
    viewUp.value
  );
}

watchImmediate([disableAutoResetCamera, viewID, imageID], ([noAutoReset]) => {
  if (noAutoReset) return;
  resetCamera();
});

// persistent camera config
usePersistCameraConfig(viewID, imageID, view.renderer.getActiveCamera());

// exposed API
const api: VtkViewApi = markRaw({
  ...view,
  interactorStyle,
  resetCamera,
});
console.log('api2 :>> ', api);

defineExpose(api);
provide(VtkViewContext, api);


// 画一些坐标点
const sphere = vtkSphereSource.newInstance();
const points: Vector3[] = [
  [0,0,0],
  [40,40,40],
  [133,77,57],
  [132,132,132],
]
points.forEach(item=>{
  sphere.setCenter(item);
  sphere.setRadius(3); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
  const sphereMapper = vtkMapper.newInstance();
  sphereMapper.setInputData(sphere.getOutputData());
  const sphereActor = vtkActor.newInstance();
  sphereActor.setMapper(sphereMapper);
  sphereActor.getProperty().setColor(1.0, 0.0, 0.0);
  view.renderer.addActor(sphereActor);
})
// 下面3个不需要也能展示
// view.renderWindow.render();
// view.requestRender();
// resetCamera();



</script>

<template>
  <div ref="vtkContainerRef"><slot></slot></div>
</template>
