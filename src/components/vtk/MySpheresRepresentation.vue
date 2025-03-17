<script setup lang="ts">
import { toRefs, inject, watch, nextTick } from 'vue';
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

interface Props {
  id: string; // 这个id区分3个视图，第一个是ObliqueCoronal，第二个是ObliqueSagittal，第三个是ObliqueAxial
  // sliceDomain: any; // 这是最大和最小{min:-105.334,max:149.664} {-126.169,max:128.831} {min:-116.103,max:138.896}
  planeOrigin: number[]; // 十字线的中心点
}

const props = defineProps<Props>();
const {
  id,
  // sliceDomain,
  planeOrigin, // 十字线的中心点
} = toRefs(props);

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

// 所有数据，包括颜色和箭头，用于滑动时。只展示附近的点，所以要把所有的点先保存下来
let objAll: any = null
let sphereRadius: number // 球体半径


// 清空是传[[1000, 1000, 1000]]二维数组过来，而不是[]空数组
function addPoints(positionList: Vector3[], radius: number) {
  deleteSphereList() // 先清除旧的球体
  // console.log('positionList  addPoints:>> ', positionList);

  // 如果是清空的，就把objAll = null，目前就在结构像弹窗，点击保存按钮后，选中同事清空时间点，的时候，才会调addPoints这个方法
  if (JSON.stringify(positionList) === JSON.stringify([[1000, 1000, 1000]])) {
    objAll = null
  }

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
//   objAll = JSON.parse(JSON.stringify(obj))
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

// 清空所有点位，但要设置一个远一点的店
function clearPoints() {
  // if (id.value === 'ObliqueCoronal') {
  //   console.log('第一 clearPoints :>> ', new Date().getTime());
  // }
  objAll = null // 要清空所有的数据
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

// worldToIndex:
// {
//     "0": -1,
//     "1": 1.862645371275562e-9,
//     "2": -3.503329101063416e-18,
//     "3": 0,
//     "4": -1.862645371275562e-9,
//     "5": -1,
//     "6": 1.8808352653110205e-9,
//     "7": 0,
//     "8": 2.6901773166029227e-18,
//     "9": 1.8808352653110205e-9,
//     "10": 1,
//     "11": 0,
//     "12": 128.83084102223668,
//     "13": 105.33522798525541,
//     "14": 138.89642338247245,
//     "15": 1
// }

// planeOrigin.value

// [
//     1.3308410635218024,
//     -22.1647720337005,
//     -11.396423340784168
// ]

// new x:

// -1*1.3308410635218024 +
// -1.862645371275562e-9 * -22.1647720337005 +
// 2.6901773166029227e-18 * -11.396423340784168 +
// 128.83084102223668 * 1



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


// 添加球体，带颜色，带箭头
function addPointsColorArrow(obj: any, radius: number) {
  // if (id.value === 'ObliqueCoronal') {
  //   console.log('第一 points :>> ', new Date().getTime(), obj);
  // }
  // if (id.value === 'ObliqueCoronal') {
  //   console.log('addPointsColorArrow :>> ', obj);
  // }
  // 先把所有的点保存下来
  objAll = JSON.parse(JSON.stringify(obj))
  sphereRadius = radius

  deleteSphereList() // 先清除旧的球体

  const nearRadius = sphereRadius // 距离和球体半径一样，即正好碰到切片的就是附近的。

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

      // 在计算距离前，要获取到另一个坐标系的位置，再计算距离，一个4维矩阵计算公式
      const newPointPosition: number[] = getNewPosition(position)
      const newplaneOrigin: number[] = getNewPosition(planeOrigin.value)

      // 在这里拦截一下，与当前十字线的距离的绝对值，大于nearValue的点就算远的点，远的点不显示。能显示的都是近的点
      // 第一个视图 Y轴
      if (id.value === 'ObliqueCoronal') {
        const distance = Math.abs(newPointPosition[1] - newplaneOrigin[1])
        if (distance > nearRadius) {
          return
        }
      }
      // 第2个视图 X轴
      if (id.value === 'ObliqueSagittal') {
        const distance = Math.abs(newPointPosition[0] - newplaneOrigin[0])
        if (distance > nearRadius) {
          return
        }
      }
      // 第3个视图 Z轴
      if (id.value === 'ObliqueAxial') {
        const distance = Math.abs(newPointPosition[2] - newplaneOrigin[2])
        if (distance > nearRadius) {
          return
        }
      }

      const newPosition: Vector3 = position

      sphere.setCenter(newPosition);
      sphere.setRadius(sphereRadius); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
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
        // arrowActor.getProperty().setOpacity(0.7); // 箭头不加透明度比较好，所以注释了这行

        // 设置箭头长度
        const arrowLength = 4;
        // 将箭头设置为正确的长度
        arrowActor.setScale(arrowLength, arrowLength, arrowLength);

        // 设置箭头的起点为球体的中心
        arrowActor.setPosition(newPosition[0], newPosition[1], newPosition[2]);

        // 将箭头向反方向偏移，使基点在球表面上；
        // 半径是2.8的情况下才是/1，箭头起点正好在球表面上；
        // 半径是2.6的情况下才是/1.05，箭头起点正好在球表面上；
        // const offset = arrowLength / 1.05;
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

}


// 防抖，防抖是指在一系列连续的操作中，只在最后一次操作后的一段时间内执行一次操作
function debounce<T extends Function>(fn: T, delay: number): T {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  } as unknown as T;
}

// 使用防抖包装，500毫秒内连续触发只执行最后一次
const debouncedGetMegData = debounce(() => {
  addPointsColorArrow(objAll, sphereRadius)
}, 200)


// 这里做一下防抖
watch(() => planeOrigin.value, () => {
  // if (id.value === 'ObliqueCoronal') {
  //   console.log('planeOrigin.value222 :>> ', planeOrigin.value);
  // }
  if (!objAll) {
    return
  }

  nextTick(() => {
    debouncedGetMegData()
  })
})

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
