<script setup lang="ts">
// import { toRefs, watchEffect, inject, ref } from 'vue';
// import { useImage } from '@/src/composables/useCurrentImage';
// import { useResliceRepresentation } from '@/src/core/vtk/useResliceRepresentation';
// import { useWindowingConfig } from '@/src/composables/useWindowingConfig';
// import { Maybe } from '@/src/types';
// import { VtkViewContext } from '@/src/components/vtk/context';
// import { SlabTypes } from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper/Constants';
// import type { Vector3 } from '@kitware/vtk.js/types';
// import { watchImmediate } from '@vueuse/core';
// import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';

// import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
// import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
// import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
// import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
// import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
// import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';


// interface Props {
//   viewId: string;
//   imageId: Maybe<string>;
//   planeNormal: Vector3;
//   planeOrigin: Vector3;
// }

// const props = defineProps<Props>();
// const {
//   viewId: viewID,
//   imageId: imageID,
//   planeNormal,
//   planeOrigin,
// } = toRefs(props);

// const view = inject(VtkViewContext);
// console.log('36 view :>> ', view); // 就是VtkVolume.vue里的api
// // const api = inject(api);
// // console.log('36 api :>> ', api);
// if (!view) throw new Error('No VtkView');

// const { imageData } = useImage(imageID);

// // bind window configs
// const wlConfig = useWindowingConfig(viewID, imageID);

// // setup base image
// const sliceRep = useResliceRepresentation(view, imageData);

// console.log('39999 view',view)
// console.log('39999 wlConfig',wlConfig)
// console.log('40000 liceRep',sliceRep)
// console.log('planeNormal',planeNormal)
// console.log('planeOrigin',planeOrigin)

// // set slice ordering to be in the back
// sliceRep.mapper.setResolveCoincidentTopologyToPolygonOffset();
// sliceRep.mapper.setResolveCoincidentTopologyPolygonOffsetParameters(1, 1);

// // create slicing plane
// const slicePlane = vtkPlane.newInstance();
// sliceRep.mapper.setSlicePlane(slicePlane);

// // initialize visual properties
// sliceRep.mapper.setSlabType(SlabTypes.MAX);
// sliceRep.mapper.setSlabThickness(1);

// // set plane normal
// watchImmediate([planeNormal, planeOrigin], ([normal, origin]) => {
//   const plane = sliceRep.mapper.getSlicePlane();
//   if (!plane) return;
//   plane.setNormal(normal);
//   plane.setOrigin(origin);
// });

// // sync windowing
// watchEffect(() => {
//   sliceRep.property.setColorLevel(wlConfig.level.value);
//   sliceRep.property.setColorWindow(wlConfig.width.value);
// });

// defineExpose(sliceRep);






// 2---------
// const myVtkContainer = ref(null);
// const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
//   rootContainer: myVtkContainer.value,
//   background: [0.2, 0.3, 0.4], // rgb 蓝色多一点
// });
// const renderer = fullScreenRenderer.getRenderer();
// const renderWindow = fullScreenRenderer.getRenderWindow();
// const mapper = vtkMapper.newInstance();

// const actor = vtkActor.newInstance();
// actor.setMapper(mapper);

// actor.getProperty().setColor(1, 0, 0); // 设置颜色为红色
// actor.getProperty().setPointSize(5); // 默认点大小，实际大小由polyData中的Scalars控制
// actor.getProperty().setOpacity(0.5);


// const sphere = vtkSphereSource.newInstance();
// const points: Vector3[] = [
//   [0,0,0],
//   [0.1,0.1,0.1],
//   [0.1,0.2,0.3],
//   [0.2,0.1,0.5],
//   [0.3,0.2,0.1],
//   // [0.4,0.4,0.4],
//   // [4,4,4],
//   // [40,40,40],
//   // [100,100,100],
// ]
// points.forEach(item=>{
//   sphere.setCenter(item);
//   sphere.setRadius(0.01);
//   const sphereMapper = vtkMapper.newInstance();
//   sphereMapper.setInputData(sphere.getOutputData());
//   const sphereActor = vtkActor.newInstance();
//   sphereActor.setMapper(sphereMapper);
//   sphereActor.getProperty().setColor(1.0, 0.0, 0.0);
//   renderer.addActor(sphereActor);
//   view.renderer.addActor(sphereActor);
// })
// renderWindow.render();
// view.renderWindow.render();
// view.requestRender();
// view.resetCamera();


/// 1----------------
// const renderer = vtkRenderer.newInstance();
// const renderWindow = vtkRenderWindow.newInstance();
// renderWindow.addRenderer(renderer);

// const sphere = vtkSphereSource.newInstance();
// sliceRep.mapper.setSlicePlane(slicePlane);
// const points: Vector3[] = [
//   [0.1,0.2,0.3],
//   [0.2,0.1,0.5],
//   [0.3,0.2,0.1],
//   [0.4,0.4,0.4],
//   [4,4,4],
//   [40,40,40],
//   [100,100,100],
// ]
// points.forEach(item=>{
//   sphere.setCenter(item);
//   sphere.setRadius(0.01);
//   const sphereMapper = vtkMapper.newInstance();
//   sliceRep.mapper.setInputData(sphere.getOutputData());
//   // const sphereActor = vtkActor.newInstance();
//   // sphereActor.setMapper(sphereMapper);
//   // sliceRep.actor.getProperty().setColor(0.0, 1.0, 0.0);
//   // renderer.addActor(sphereActor);
//   // view.renderer.addActor(sphereActor);
// })
// renderWindow.render();
// view.renderWindow.render();
// view.requestRender();
// view.resetCamera();

</script>

<template>
  <!-- 2222222224
  <div ref="myVtkContainer" class="my-vtk-container"></div> -->
  <slot></slot>
</template>

<style scoped>
.my-vtk-container {
  /* width: 100%; */
  width: 300px;
  height: 300px;
  /* position: relative;
  margin: 0 auto; */
}
</style>
