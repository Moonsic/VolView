<template>
  1111
  <div ref="vtkContainer" class="vtk-container"></div>
</template>

<!-- <script setup>
import { onMounted, onBeforeUnmount, ref, watchEffect } from 'vue';

import vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';
import vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import vtkCamera from '@kitware/vtk.js/Rendering/Core/Camera';
// import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Rendering/Core/InteractorStyleTrackballCamera';

import vtkOpenGLRenderWindow from '@kitware/vtk.js/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPointSource from '@kitware/vtk.js/Filters/Sources/PointSource';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';



const vtkContainer = ref(null);
const context = ref(null);

watchEffect(() => {
  if (context.value?.renderWindow) {
    context.value.renderWindow.render();
  }
});

onMounted(() => {
  if (!context.value) {
    initVTK();
  }
});


function initVTK() {
  // const openglRenderWindow = new vtkOpenGLRenderWindow();
  const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
  openglRenderWindow.setContainer(vtkContainer.value);

  // const renderer = new vtkRenderer();
  const renderer = vtkRenderer.newInstance({ background: [0.1, 0.1, 0.1] });
  openglRenderWindow.getRenderer().add(renderer);
  // openglRenderWindow.addRenderer(renderer);

  const renderWindow = openglRenderWindow;
  const interactor = new vtkRenderWindowInteractor();
  interactor.setView(openglRenderWindow);
  interactor.initialize();

  const camera = renderer.getActiveCamera();
  camera.setParallelProjection(false);
  renderer.resetCamera();

  const mapper = new vtkMapper();
  const pointSource = vtkPointSource.newInstance({numberOfPoints: 200, radius: 1});
  mapper.setInputConnection(pointSource.getOutputPort());

  const actor = new vtkActor();
  actor.setMapper(mapper);
  actor.getProperty().setColor(1, 0, 0);
  actor.getProperty().setPointSize(5);
  actor.getProperty().setOpacity(0.5);

  const axesActor = new vtkAxesActor();
  renderer.addActor(axesActor);
  renderer.addActor(actor);

  // const style = new vtkInteractorStyleTrackballCamera();
  // interactor.setInteractorStyle(style);

  // 小球绘制部分可以根据需要调整并加入

  context.value = {
    renderWindow,
    renderer,
    interactor,
    actor,
    mapper,
  };
}

onBeforeUnmount(() => {
  if (context.value) {
    context.value.interactor.delete();
    context.value.renderWindow.delete();
    context.value.renderer.delete();
    context.value.actor.delete();
    context.value.mapper.delete();
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
</style> -->