<script setup lang="ts">
import { inject } from 'vue';
// import { toRefs, inject } from 'vue';
import { VtkViewContext } from '@/src/components/vtk/context';
import type { Vector3 } from '@kitware/vtk.js/types';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkArrowSource from '@kitware/vtk.js/Filters/Sources/ArrowSource';

import {
  useSetPointsEvents,
  // useSetPointsColorEvents,
  useSetPointsColorArrowEvents,
  useClearPointsEvents,
} from '@/src/components/App.vue'; // 从App.vue过来的设置点坐标的事件

// interface Props {
//   sphereRadius: number;
// }

// const props = defineProps<Props>();
// const {
//   sphereRadius, // 球体半径
// } = toRefs(props);

const view = inject(VtkViewContext);
// console.log('36 view :>> ', view); // 就是VtkVolume.vue里的api
// const api = inject(api);
// console.log('36 api :>> ', api);
if (!view) throw new Error('No VtkView');

// 将颜色值，转化成[1,1,1]
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

let actors: any[] = [];
const sphere = vtkSphereSource.newInstance();
sphere.setThetaResolution(50) // 球体横向分割数，数值越大球越圆
sphere.setPhiResolution(50) // 球体纵向分割数

const arrowSource = vtkArrowSource.newInstance();
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


function addPoints(positionList: Vector3[], radius: number) {
  deleteSphereList() // 先清除旧的球体

  positionList.forEach(position => {

    const newPosition: Vector3 = position

    sphere.setCenter(newPosition);
    sphere.setRadius(radius); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
    const sphereMapper = vtkMapper.newInstance();
    sphereMapper.setInputData(sphere.getOutputData());
    const sphereActor = vtkActor.newInstance();
    sphereActor.setMapper(sphereMapper);
    sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // 红色
    sphereActor.getProperty().setOpacity(0.7);
    view?.renderer.addActor(sphereActor);

    actors.push(sphereActor);
  })
}

// // 添加球体，带颜色
// function addPointsColor(obj: any, radius: number) {
//   deleteSphereList() // 先清除旧的球体
//   Object.keys(obj).forEach((key: string) => {
//     const positionList = obj[key]
//     const color: number[] = normalizeColor(key) // 0-1之间的数 [1,0,0]
//     positionList.forEach((position: Vector3) => {
//       const newPosition: Vector3 = position
//       sphere.setCenter(newPosition);
//       sphere.setRadius(radius); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
//       const sphereMapper = vtkMapper.newInstance();
//       sphereMapper.setInputData(sphere.getOutputData());
//       const sphereActor = vtkActor.newInstance();
//       sphereActor.setMapper(sphereMapper);
//       sphereActor.getProperty().setColor(color[0], color[1], color[2]);
//       sphereActor.getProperty().setOpacity(0.7);
//       view?.renderer.addActor(sphereActor);
//       actors.push(sphereActor);
//     })
//   })
// }

// 清空所有点位，但要设置一个远一f点的店
function clearPoints() {
  console.log('clear points');

  deleteSphereList() // 先清除旧的球体
  sphere.setCenter([1000, 1000, 1000]);
  sphere.setRadius(0.1); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
  const sphereMapper = vtkMapper.newInstance();
  sphereMapper.setInputData(sphere.getOutputData());
  const sphereActor = vtkActor.newInstance();
  sphereActor.setMapper(sphereMapper);
  sphereActor.getProperty().setColor(1.0, 0.0, 0.0); // 红色
  sphereActor.getProperty().setOpacity(0.1); // 0是不透明
  view?.renderer.addActor(sphereActor);
  actors.push(sphereActor);
}

// 添加球体，带颜色，带箭头
function addPointsColorArrow(obj: any, radius: number) {
  console.log('add points');

  deleteSphereList() // 先清除旧的球体

  if (!obj) {
    console.log('points data = null');
    return
  }

  Object.keys(obj).forEach((key: string) => {
    const positionList = obj[key]
    const color: number[] = normalizeColor(key) // 0-1之间的数 [1,0,0]
    positionList.forEach((item: Vector3 | [Vector3, Vector3]) => {
      // console.log('item :>> ', item);
      let position: Vector3
      let direction: Vector3 | undefined

      // item下是2维数组，说明是带了箭头的，item是一个一维数组，说明只有位置，没有箭头
      if (Array.isArray(item[0]) && Array.isArray(item[1])) {
        position = item[0] as Vector3
        direction = item[1] as Vector3
      } else {
        position = item as Vector3
      }

      const newPosition: Vector3 = position

      sphere.setCenter(newPosition);
      sphere.setRadius(radius); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
      const sphereMapper = vtkMapper.newInstance();
      sphereMapper.setInputData(sphere.getOutputData());
      const sphereActor = vtkActor.newInstance();
      sphereActor.setMapper(sphereMapper);
      sphereActor.getProperty().setColor(color[0], color[1], color[2]);
      sphereActor.getProperty().setOpacity(0.7);


      if (direction && direction.length) {

        // 画一个箭头
        arrowSource.setTipResolution(50);// 箭头部精细粗糙程度，10不变 6
        arrowSource.setShaftResolution(50);// 柱状体精细粗糙程度，10不变 6
        arrowSource.setTipRadius(0.2); // 箭头部大小 0.1
        arrowSource.setTipLength(0.4); // 箭头部长度 0.35
        arrowSource.setShaftRadius(0.05); // 柱状体粗度 0.03
        arrowSource.set({ direction })

        const arrowMapper = vtkMapper.newInstance();
        arrowMapper.setInputData(arrowSource.getOutputData());
        const arrowActor = vtkActor.newInstance();
        arrowActor.setMapper(arrowMapper);
        arrowActor.getProperty().setColor(color[0], color[1], color[2]);
        // arrowActor.getProperty().setOpacity(0.7); // 箭头不加透明度比较好

        // 设置箭头长度
        const arrowLength = 4;
        // 将箭头设置为正确的长度
        arrowActor.setScale(arrowLength, arrowLength, arrowLength);

        // 设置箭头的起点为球体的中心
        arrowActor.setPosition(newPosition[0], newPosition[1], newPosition[2]);

        // 将箭头向反方向偏移，使基点在球表面上；
        // 半径是2.8的情况下才是/1，箭头起点正好在球表面上；
        // 半径是2.6的情况下才是/1.05，箭头起点正好在球表面上；
        // const offset = arrowLength / 1.05; // 2.6 = 3.81
        // const offset = arrowLength / 1; // 2.8 = 4
        // const offset = arrowLength / 0.98; // 3 = 4.082
        // const offset = arrowLength / 0.78; // 4 = 5.13
        // const offset = arrowLength / 0.64; // 5 = 6.25
        // const offset = getOffset(radius)
        const offset = (6 * radius * radius) / (6 * radius - 5) // 让deepseek推理出来的算法

        const adjustedPosition: [number, number, number] = [
          newPosition[0] + direction[0] * offset,
          newPosition[1] + direction[1] * offset,
          newPosition[2] + direction[2] * offset,
        ];
        arrowActor.setPosition(adjustedPosition[0], adjustedPosition[1], adjustedPosition[2]);

        view?.renderer.addActor(arrowActor);
        actors.push(arrowActor);

      }

      view?.renderer.addActor(sphereActor);
      actors.push(sphereActor);
    })
  })
  // console.log('3d points end :>> ', new Date().getTime());

}


// 尝试推理规律，数字都不是很准确，都是我粗估来的，不要很准确。也许和3维、球体相关，也许不相关。箭头长度=4，球体半径是2.8的情况下，箭头起点正好在球表面上；
// x=2.6 -> y=3.81
// x=2.8 -> y=4
// x=3 -> y=4.082
// x=4 -> y=5.13
// x=5 -> y=6.25


// 设置点坐标的事件
useSetPointsEvents().onClick(([positionList, radius]) => addPoints(positionList, radius));
// useSetPointsColorEvents().onClick(([obj, radius]) => addPointsColor(obj, radius));
useSetPointsColorArrowEvents().onClick(([obj, radius]) => addPointsColorArrow(obj, radius));
useClearPointsEvents().onClick(() => clearPoints());

</script>

<template>
  <slot></slot>
</template>

<style scoped></style>
