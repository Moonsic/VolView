<template>
  <div ref="vtkContainer" class="vtk-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPointSource from '@kitware/vtk.js/Filters/Sources/PointSource';


import vtkPointPicker from '@kitware/vtk.js/Rendering/Core/PointPicker';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';


const vtkContainer = ref(null);
const context = ref(null);

watchEffect(() => {
  if (context.value) {
    const { actor, renderWindow } = context.value;
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

  // 画点
  const pointSource = vtkPointSource.newInstance({
    numberOfPoints: 200,
    radius: 1,
  });
  mapper.setInputConnection(pointSource.getOutputPort());

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);

  actor.getProperty().setColor(1, 0, 0); // 设置颜色为红色
  actor.getProperty().setPointSize(5); // 默认点大小，实际大小由polyData中的Scalars控制
  actor.getProperty().setOpacity(0.5);

  // 坐标轴
  const axesActor = vtkAxesActor.newInstance();
  renderer.addActor(axesActor);

  renderer.addActor(actor);
  renderer.resetCamera();
  renderWindow.render();



  const sphere = vtkSphereSource.newInstance();
  const points = [
    [0,0,0],
    [0.1,0.1,0.1],
    [0.1,0.2,0.3],
    [0.2,0.1,0.5],
    [0.3,0.2,0.1],
    [0.4,0.4,0.4],
  ]
  points.forEach(item=>{
    sphere.setCenter(item);
    sphere.setRadius(0.01);
    const sphereMapper = vtkMapper.newInstance();
    sphereMapper.setInputData(sphere.getOutputData());
    const sphereActor = vtkActor.newInstance();
    sphereActor.setMapper(sphereMapper);
    sphereActor.getProperty().setColor(0.0, 1.0, 0.0);
    renderer.addActor(sphereActor);
  })
  renderWindow.render();



  context.value = {
    fullScreenRenderer,
    renderWindow,
    renderer,
    actor,
    mapper,
  };
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