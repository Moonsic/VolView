<template>
  <div ref="vtkContainer" class="vtk-container"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';

import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';

import vtkPointSource from '@kitware/vtk.js/Filters/Sources/PointSource';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';

const vtkContainer = ref(null);
let context = null;

onMounted(initVTK);

function initVTK() {
  const renderWindowView = vtkOpenGLRenderWindow.newInstance();
  renderWindowView.setContainer(vtkContainer.value);
  renderWindowView.setSize(400, 400);
  // renderWindowView.addViewPort(0, 0, 1, 1);

  const renderer = vtkRenderer.newInstance();
  const renderWindow = vtkRenderWindow.newInstance();
  renderWindow.addRenderer(renderer);
  renderWindow.addView(renderWindowView);

  const interactor = vtkRenderWindowInteractor.newInstance();
  // renderWindow.setInteractor(interactor);


  interactor.setView(renderWindowView);
  interactor.initialize();

  renderer.setBackground(0.2, 0.3, 0.4);
  // renderWindowView.addRenderer(renderer);

  const sphere = vtkSphereSource.newInstance();
  const sphereMapper = vtkMapper.newInstance();
  const pointSource = vtkPointSource.newInstance({ numberOfPoints: 200, radius: 1 });
  const mapper = vtkMapper.newInstance();

  // 渲染器设置
  renderer.addActor(vtkAxesActor.newInstance());
  renderer.resetCamera();
  renderWindowView.render();

  // 点数据设置
  pointSource.setRadius(0.01);
  const points = [
    [0, 0, 0],
    [0.1, 0.1, 0.1],
    [0.1, 0.2, 0.3],
    [0.2, 0.1, 0.5],
    [0.3, 0.2, 0.1],
    [0.4, 0.4, 0.4],
  ];

  points.forEach(item => {
    sphere.setCenter(item);
    sphereMapper.setInputData(sphere.getOutputData());
    const sphereActor = vtkActor.newInstance();
    sphereActor.setMapper(sphereMapper);
    sphereActor.getProperty().setColor(0.0, 1.0, 0.0);
    renderer.addActor(sphereActor);
  });

  // 点数据映射
  mapper.setInputConnection(pointSource.getOutputPort());
  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setColor(1, 0, 0);
  actor.getProperty().setPointSize(5);
  actor.getProperty().setOpacity(0.5);
  renderer.addActor(actor);

  // renderWindowView.addRenderer(renderer);

  context = { renderWindowView, renderer, actor, mapper };
}

onBeforeUnmount(() => {
  if (context) {
    const { renderWindowView, actor, mapper } = context;
    actor.delete();
    mapper.delete();
    renderWindowView.delete();
    context = null;
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
