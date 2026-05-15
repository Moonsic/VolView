<template>
  <a-button @click="deleteSphereList">删掉球体</a-button>
  <div ref="vtkContainer" class="vtk-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
// import * as vtk from 'vtk.js';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkPointSource from '@kitware/vtk.js/Filters/Sources/PointSource';

import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';

import vtkPointPicker from '@kitware/vtk.js/Rendering/Core/PointPicker';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';

// import vtkScalarMode from '@kitware/vtk.js/Rendering/Core/ScalarMode';

// import vtkAnnotatedCubeActor from '@kitware/vtk.js/Rendering/Core/AnnotatedCubeActor';
// import vtkOrientationMarkerWidget from '@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget';


// import { vtkRenderer, vtkRenderWindow, vtkRenderWindowInteractor } from '@kitware/vtk.js/Rendering/Core';
// import { vtkPoints, vtkPolyData } from '@kitware/vtk.js/Common/Core';
// import { vtkMapper, vtkActor } from '@kitware/vtk.js/Rendering/Core';
// import { vtkUnsignedCharArray } from '@kitware/vtk.js/Common/Core';

// import { vtkUnsignedCharArray, vtkFloatArray } from '@kitware/vtk.js/Common/Core'
// import vtkFloatArray from '@kitware/vtk.js/Common/Core/FloatArray'


// import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
// console.log('vtkDataArray :>> ', vtkDataArray);

// import { vtkFullScreenRenderWindow, vtkActor, vtkMapper, vtkPoints, vtkPolyData, vtkVertexGlyphFilter } from '@kitware/vtk.js';
// import {  vtkVertexGlyphFilter } from '@kitware/vtk.js';
import { VtkDataTypes } from '@kitware/vtk.js/Common/Core/DataArray/Constants';
import vtkTubeFilter from '@kitware/vtk.js/Filters/General/TubeFilter';
import { VaryRadius } from '@kitware/vtk.js/Filters/General/TubeFilter/Constants';


const vtkContainer = ref(null);
const context = ref(null);
let actors = [];

watchEffect(() => {
  // const res = unref(coneResolution);
  // const rep = unref(representation);
  if (context.value) {
    const { actor, renderWindow } = context.value;
    // coneSource.setResolution(res);
    // actor.getProperty().setRepresentation(rep);
    renderWindow.render();
  }
});

onMounted(() => {
  if (!context.value) {
    initVTK();
  }
});


async function initVTK() {
  const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
    rootContainer: vtkContainer.value,
    background: [0.2, 0.3, 0.4], // rgb 蓝色多一点
  });
  const renderer = fullScreenRenderer.getRenderer();
  const renderWindow = fullScreenRenderer.getRenderWindow();
  const mapper = vtkMapper.newInstance();

  //   // 画点
  // const pointSource = vtkPointSource.newInstance({
  //   numberOfPoints: 250,
  //   radius: 22,
  // });
  // mapper.setInputConnection(pointSource.getOutputPort());



  // // 初始化你的点数据
  // const points = vtkPoints.newInstance({
  //   dataType: VtkDataTypes.FLOAT,
  // });
  // // console.log('points :>> ', points);
  // // const points = vtk.Common.DataModel.vtkPoints.newInstance();
  // points.insertNextPoint(0, 0, 0); // 示例点1
  // points.insertNextPoint(10, 10, 0); // 示例点2
  // points.insertNextPoint(10, 10, 10); // 示例点1
  // points.insertNextPoint(20, 20, 20); // 示例点2
  // console.log('points :>> ', points);
  // console.log('points :>> ', points.getData());
  // console.log('points :>> ', points.getPoint());


  // // 创建 PolyData 对象
  // const polyData = vtkPolyData.newInstance();
  // polyData.setPoints(points);

  // console.log('polyData1 :>> ', polyData);
  // console.log('polyData2 :>> ', polyData.getPoints());
  // console.log('polyData3 :>> ', polyData.getNumberOfPoints());


  // // const filter = vtkTubeFilter.newInstance({
  // //   capping: true,
  // //   radius: 1, // scaling factor
  // //   varyRadius: VaryRadius.VARY_RADIUS_BY_ABSOLUTE_SCALAR,
  // //   numberOfSides: 5,
  // // });

  // // filter.setInputArrayToProcess(0, 'Radius', 'PointData', 'Scalars');
  // // filter.setInputData(polyData);

  // // // 创建顶点（Vertex）来连接点
  // // const vertices = vtkCellArray.newInstance();
  // // for (let i = 0; i < points.getNumberOfPoints(); i++) {
  // //   // vertices.insertNextCell(1); // 每个顶点由一个点组成
  // //   // vertices.setValue(i, i); // 设置顶点的点索引
  // // }
  // // polyData.setVerts(vertices);

  // // 使用vtkVertexGlyphFilter将点转换为可渲染的顶点
  // // const glyphFilter = vtkVertexGlyphFilter.newInstance();
  // // glyphFilter.setInputData(polyData);
  // // glyphFilter.update();

  // // 创建 Mapper
  // mapper.setInputData(polyData);
  // // mapper.setInputData(filter.getOutputData());

  //  mapper.setInputData(glyphFilter.getOutputData());


  //   // 创建点数组
  //   const points = new Float32Array([
  //     10, 10, 10, // 第一个点的 x, y, z 坐标
  //     20, 20, 20, // 第二个点的 x, y, z 坐标
  //     // ... 更多点的坐标
  //   ]);

  //   // 创建 vtkPoints 对象并设置点数据
  //   const pointData = vtkPoints.newInstance();
  //   pointData.setData(points, 3); // 3 表示每个点有三个坐标分量（x, y, z）
  //  // 创建 PolyData 对象并设置点
  //  const polydata = vtkPolyData.newInstance();
  //   polydata.setPoints(pointData);

  //   mapper.setInputData(polydata);

  //   mapper.setColorModeToMapScalars(); // 根据点的标量值设置颜色（如果需要的话）
  //   // mapper.setScalarMode(vtkScalarMode.USE_POINT_DATA); // 使用点的数据作为标量值



  // // 创建渲染相关对象
  // const renderer = vtkRenderer.newInstance();
  // const renderWindow = vtkRenderWindow.newInstance();
  // renderWindow.addRenderer(renderer);
  // const interactor = vtkRenderWindowInteractor.newInstance();
  // interactor.setView(renderWindow);
  // interactor.setInteractorStyle(null); // 或者使用其他交互样式
  // // 将渲染窗口与DOM元素绑定
  // const canvas = renderWindow.getCanvas();
  // vtkContainer.value.appendChild(canvas);



  // // 准备点数据
  // const points = [
  //   [0.0, 10.0, 0.0],
  //   [1.0, 0.0, 20.0],
  //   [10.0, 1.0, 0.0], // 示例点坐标，可根据需要添加更多
  // ];
  // const sizes = [5, 10, 15]; // 每个点的大小

  // // 创建点数据
  // const pointData = vtkPoints.newInstance();
  // points.forEach(point => pointData.insertNextPoint(...point));

  // // 创建多边形数据对象并设置点
  // const polyData = vtkPolyData.newInstance();
  // polyData.setPoints(pointData);

  // // // 设置颜色为红色
  // // const colorData = vtkUnsignedCharArray.newInstance({
  // //   numberOfComponents: 3, // RGB
  // //   name: 'Colors',
  // // });
  // // points.forEach(() => colorData.push(255, 0, 0)); // 全部设为红色
  // // polyData.getPointData().setScalars(colorData);

  // // // 设置点大小
  // // const sizeData = new Float32Array(points.length);
  // // // sizes.forEach((size, index) => {
  // // //   // 在这里没有直接设置polyData的Scalars来控制点大小，因为没有使用vtkFloatArray
  // // // });
  // // sizes.forEach((size, index) => sizeData[index] = size);
  // // polyData.getPointData().setScalars(vtkFloatArray.newInstance({ name: 'Scalars', values: sizeData }));


  // // 换成了vtkDataArray
  // // 设置点大小
  // const points2 = new Uint8Array(4 * 4 * 4);
  // const sizeData = vtkDataArray.newInstance({
  //   name: 'Sizes',
  //   numberOfComponents: 1, // 3: 每个颜色有3个分量（R, G, B）
  //   values: [5, 10, 15],
  // });
  // // sizes.forEach(size => sizeData.push(size));
  // polyData.getPointData().setScalars(sizeData);

  // // 映射器和演员
  // mapper.setInputData(polyData);










  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);

  actor.getProperty().setColor(1, 0, 0); // 设置颜色为红色
  actor.getProperty().setPointSize(5); // 默认点大小，实际大小由polyData中的Scalars控制
  actor.getProperty().setOpacity(0.5);

  // // 添加到渲染器并渲染
  // renderer.addActor(actor);
  // renderer.resetCamera();
  // renderWindow.render();

  // interactor.initialize();
  // interactor.bindEvents(vtkContainer.value);








  // const renderer = fullScreenRenderer.getRenderer();
  // const renderWindow = fullScreenRenderer.getRenderWindow();
  // 坐标轴
  const axesActor = vtkAxesActor.newInstance();
  renderer.addActor(axesActor);

  renderer.addActor(actor);
  renderer.resetCamera();
  renderWindow.render();





  // 画一些球体
  const sphere = vtkSphereSource.newInstance();
  const points = [
    [0.1, 0.2, 0.3],
    [0.2, 0.1, 0.5],
    [0.3, 0.2, 0.1],
    [0.4, 0.4, 0.4],
  ]
  points.forEach(item => {
    sphere.setCenter(item);
    sphere.setRadius(0.01); // 这是球体半径，实际开发中，这个太小会看不出来，要写大点
    const sphereMapper = vtkMapper.newInstance();
    sphereMapper.setInputData(sphere.getOutputData());
    const sphereActor = vtkActor.newInstance();
    sphereActor.setMapper(sphereMapper);
    sphereActor.getProperty().setColor(0.0, 1.0, 0.0);
    renderer.addActor(sphereActor);

    actors.push(sphereActor);

  })
  renderWindow.render();


  // ----------------------------------------------------------------------------
  // Setup picking interaction
  // ----------------------------------------------------------------------------
  // Only try to pick cone points
  const picker = vtkPointPicker.newInstance();
  picker.setPickFromList(1);
  picker.initializePickList();
  picker.addPickList(actor);

  // Pick on mouse right click
  renderWindow.getInteractor().onRightButtonPress((callData) => {
    if (renderer !== callData.pokedRenderer) {
      return;
    }

    const pos = callData.position;
    const point = [pos.x, pos.y, 0.0];
    console.log(`Pick at: ${point}`);
    picker.pick(point, renderer);
    console.log(`picker.getActors()`, picker.getActors());

    if (picker.getActors().length === 0) {
      const pickedPoint = picker.getPickPosition();
      console.log(`No point picked, default: ${pickedPoint}`);
      const sphere = vtkSphereSource.newInstance();
      sphere.setCenter(pickedPoint);
      sphere.setRadius(0.01);
      const sphereMapper = vtkMapper.newInstance();
      sphereMapper.setInputData(sphere.getOutputData());
      const sphereActor = vtkActor.newInstance();
      sphereActor.setMapper(sphereMapper);
      sphereActor.getProperty().setColor(1.0, 0.0, 0.0);
      renderer.addActor(sphereActor);
    } else {
      const pickedPointId = picker.getPointId();
      console.log('Picked point: ', pickedPointId);

      const points = picker.getPickedPositions();
      for (let i = 0; i < points.length; i++) {
        const pickedPoint = points[i];
        console.log(`Picked: ${pickedPoint}`);
        const sphere = vtkSphereSource.newInstance();
        sphere.setCenter(pickedPoint);
        sphere.setRadius(0.01);
        const sphereMapper = vtkMapper.newInstance();
        sphereMapper.setInputData(sphere.getOutputData());
        const sphereActor = vtkActor.newInstance();
        sphereActor.setMapper(sphereMapper);
        sphereActor.getProperty().setColor(0.0, 1.0, 0.0);
        renderer.addActor(sphereActor);
      }
    }

    renderWindow.render();
  });





  context.value = {
    fullScreenRenderer,
    renderWindow,
    renderer,
    actor,
    mapper,
  };
}

// 删掉球体
function deleteSphereList() {
  // 遍历actors数组，并从renderer中移除每一个actor
  actors.forEach(actor => {
    context.value.renderer.removeActor(actor);
  });
  // 清空actors数组
  actors = [];
  // 更新渲染器
  context.value.renderWindow.render();
}

onBeforeUnmount(() => {
  if (context.value) {
    const { fullScreenRenderer, actor, mapper } = context.value;
    actor.delete();
    mapper.delete();
    fullScreenRenderer.delete();
    context.value = null;
  }
});
</script>

<style scoped>
.vtk-container {
  width: 400px;
  height: 400px;
  position: relative;
  margin: 0 auto;
}
</style>