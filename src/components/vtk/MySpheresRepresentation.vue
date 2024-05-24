<script setup lang="ts">
// import { toRefs, watchEffect, inject, ref } from 'vue';
import { inject } from 'vue';
// import { useImage } from '@/src/composables/useCurrentImage';
// import { useResliceRepresentation } from '@/src/core/vtk/useResliceRepresentation';
// import { useWindowingConfig } from '@/src/composables/useWindowingConfig';
// import { Maybe } from '@/src/types';
import { VtkViewContext } from '@/src/components/vtk/context';
// import { SlabTypes } from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper/Constants';
import type { Vector3 } from '@kitware/vtk.js/types';
// import { watchImmediate } from '@vueuse/core';
// import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';

// import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
// import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
// import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';

import { useSetPositionListEvents } from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件


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

const view = inject(VtkViewContext);
console.log('36 view :>> ', view); // 就是VtkVolume.vue里的api
// const api = inject(api);
// console.log('36 api :>> ', api);
if (!view) throw new Error('No VtkView');

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



// // // 画一些坐标点
// const sphere = vtkSphereSource.newInstance();
// const points: Vector3[] = [
//   [1,1,1],
//   [10,10,10],
//   [20,20,20],
//   [30,30,30],
//   [-40,-40,-40],
//   [-133,77,57],
//   [132,-132,132],
// ]
// points.forEach(item=>{
//   sphere.setCenter(item);
//   sphere.setRadius(4); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
//   const sphereMapper = vtkMapper.newInstance();
//   sphereMapper.setInputData(sphere.getOutputData());
//   const sphereActor = vtkActor.newInstance();
//   sphereActor.setMapper(sphereMapper);
//   sphereActor.getProperty().setColor(0.0, 1.0, 0.0);
//   view.renderer.addActor(sphereActor);
// })


// const sphere = vtkSphereSource.newInstance();
// function addSphere(position: Vector3) {
//   // sphere.setCenter(position);
//   console.log('setCenter :>> ', [position[0]-128,position[1]-128,position[2]-128]);
//   sphere.setCenter([position[0]-128,position[1]-128,position[2]-128]);
//   sphere.setRadius(4); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
//   const sphereMapper = vtkMapper.newInstance();
//   sphereMapper.setInputData(sphere.getOutputData());
//   const sphereActor = vtkActor.newInstance();
//   sphereActor.setMapper(sphereMapper);
//   sphereActor.getProperty().setColor(1.0, 0.0, 0.0);
//   view?.renderer.addActor(sphereActor);
// }

let actors: any[] = [];
const sphere = vtkSphereSource.newInstance();

// 先清除旧的球体
function deleteSphereList() {
  // 遍历actors数组，并从renderer中移除每一个actor
  if (actors.length) {
    actors.forEach(actor => {
      view?.renderer.removeActor(actor);
    });
  }
  // 清空actors数组
  actors = [];
  // // 更新渲染器
  // view?.renderWindow.render();
}



function addSphereList(positionList: Vector3[]) {
deleteSphereList() // 先清除旧的球体

console.log('148 window.xyzCenter',window.xyzCenter)
const [x, y, z] = window.xyzCenter
  positionList.forEach(position => {
    // sphere.setCenter([
    //   position[0]-128,
    //   position[1]-128,
    //   position[2]-128
    // ]);

    const newPosition:Vector3 = [
      position[0] - 128 + x,
      position[1] - 128 + y,
      position[2] - 128 + z,
    ]
    console.log('newPosition :>> ', newPosition);

    sphere.setCenter(newPosition);
    // sphere.setCenter([0,0,0]);
    // sphere.setCenter(position);
    sphere.setRadius(4); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
    const sphereMapper = vtkMapper.newInstance();
    sphereMapper.setInputData(sphere.getOutputData());
    const sphereActor = vtkActor.newInstance();
    sphereActor.setMapper(sphereMapper);
    sphereActor.getProperty().setColor(1.0, 0.0, 0.0);
    view?.renderer.addActor(sphereActor);

    actors.push(sphereActor);
  })
}

// setTimeout(()=>{
//   addSphereList(
//     [
//       [0,0,0],
//       [-2.081481458619237, 4.4918666201410815, 8.861701400950565]
//     ]
//   )
// },1000)

// 设置点坐标的事件
useSetPositionListEvents().onClick((positionList) => addSphereList(positionList));


</script>

<template>
  <slot></slot>
</template>

<style scoped>

</style>
