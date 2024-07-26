<script setup lang="ts">
// import { toRefs, watchEffect, inject, ref } from 'vue';
import { toRefs, inject } from 'vue';
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
import { useSetPositionListWithColorEvents } from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件

interface Props {
  sphereRadius: number;
}

const props = defineProps<Props>();
const {
  sphereRadius, // 球体半径
} = toRefs(props);

const view = inject(VtkViewContext);
// console.log('36 view :>> ', view); // 就是VtkVolume.vue里的api
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


function addSphereList(positionList: Vector3[], change?: boolean) {
  deleteSphereList() // 先清除旧的球体

  // const [x, y, z] = window.xyzCenter
  const [xD, yD, zD] = window.dimensions  // [256, 256, 256] 或 [192, 512, 512]
  const [xDis, yDis, zDis] = window.distanceList  // [256, 256, 256] 或 [192, 512, 512]
  const [minX, minY, minZ] = window.xyzMinList  // [256, 256, 256] 或 [192, 512, 512]

  positionList.forEach(position => {

    let newPosition: Vector3
    if (change) {

    // 最终版本:第3个切片的左上和右下 的2点会很准确
    newPosition = [
      (position[0] / xD) * xDis + minX,
      (position[1] / yD) * yDis + minY,
      (position[2] / zD) * zDis + minZ,
    ]
    // console.log('newPosition :>> ',position, newPosition);

    } else {
      newPosition = position
    }

    sphere.setCenter(newPosition);
    sphere.setRadius(sphereRadius.value); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
    const sphereMapper = vtkMapper.newInstance();
    sphereMapper.setInputData(sphere.getOutputData());
    const sphereActor = vtkActor.newInstance();
    sphereActor.setMapper(sphereMapper);
    sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // 红色
    view?.renderer.addActor(sphereActor);

    actors.push(sphereActor);
  })
}


function addSphereListWithColor(obj: any, change?: boolean) {
  deleteSphereList() // 先清除旧的球体

  // const [x, y, z] = window.xyzCenter
  const [xD, yD, zD] = window.dimensions  // [256, 256, 256] 或 [192, 512, 512]
  const [xDis, yDis, zDis] = window.distanceList  // [256, 256, 256] 或 [192, 512, 512]
  const [minX, minY, minZ] = window.xyzMinList  // [256, 256, 256] 或 [192, 512, 512]

  Object.keys(obj).forEach((key: string) => {
    const positionList = obj[key]

    const color: number[] = normalizeColor(key)
    positionList.forEach((position: Vector3) => {

      let newPosition: Vector3
      if (change) {

      // 最终版本:第3个切片的左上和右下 的2点会很准确
      newPosition = [
        (position[0] / xD) * xDis + minX,
        (position[1] / yD) * yDis + minY,
        (position[2] / zD) * zDis + minZ,
      ]
      // console.log('newPosition :>> ',position, newPosition);

      } else {
        newPosition = position
      }

      sphere.setCenter(newPosition);
      sphere.setRadius(sphereRadius.value); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
      const sphereMapper = vtkMapper.newInstance();
      sphereMapper.setInputData(sphere.getOutputData());
      const sphereActor = vtkActor.newInstance();
      sphereActor.setMapper(sphereMapper);
      sphereActor.getProperty().setColor(color[0], color[1], color[2]);
      view?.renderer.addActor(sphereActor);

      actors.push(sphereActor);
    })
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
useSetPositionListEvents().onClick(([positionList,change]) => addSphereList(positionList,change));

useSetPositionListWithColorEvents().onClick(([obj,change]) => addSphereListWithColor(obj,change));

//将颜色值，转化成[1,1,1]
function normalizeColor(inputColor: string): number[] {
  const colorMap: any = {
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    // 可在此处添加更多颜色映射
  };

  let hexColor;

  // 尝试从映射中获取颜色对应的十六进制代码
  if (colorMap[inputColor]) {
    hexColor = colorMap[inputColor];
  }
  // 检查输入是否为有效的六位或三位十六进制颜色代码
  else if (/^#[0-9A-Fa-f]{3,6}$/i.test(inputColor)) {
    hexColor = inputColor;
  } else {
    throw new Error('Invalid color format. Please provide a valid color name or hex code.');
  }

  // 确保颜色代码为六位形式，如果是三位则重复字符
  hexColor = /^#[0-9A-Fa-f]{3}$/i.test(hexColor)
    ? hexColor.replace(/[0-9A-Fa-f]/g, (c: any) => c + c)
    : hexColor;

  // 解析十六进制颜色代码为RGB，并归一化到[0, 1]区间
  const rgb = [
    parseInt(hexColor.slice(1, 3), 16) / 255,
    parseInt(hexColor.slice(3, 5), 16) / 255,
    parseInt(hexColor.slice(5), 16) / 255
  ];

  return rgb;
}

// // 示例使用
// try {
//   console.log(normalizeColor('red'));       // 应输出: [1, 0, 0]
//   console.log(normalizeColor('#ffffff'));   // 应输出: [1, 1, 1]
//   console.log(normalizeColor('#ff0000'));   // 应输出: [1, 0, 0]
//   console.log(normalizeColor('#fff'));      // 新增测试: 应输出: [1, 1, 1]
// } catch (error) {
//   console.error(error.message);
// }

</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
