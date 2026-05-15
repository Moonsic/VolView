<template>
  <div>
    <div ref="vtkContainer" />
    <table class="controls">
      <tbody>
        <tr>
          <td>
            <select style="width: 100%" :value="representation" @change="setRepresentation($event.target.value)">
              <option value="0">Points</option>
              <option value="1">Wireframe</option>
              <option value="2">Surface</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <input type="range" min="4" max="80" :value="coneResolution"
              @input="setConeResolution($event.target.value)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>

import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';

import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource';

import vtkPointSource from '@kitware/vtk.js/Filters/Sources/PointSource';
import vtkSphereSource from '@kitware/vtk.js/Filters/Sources/SphereSource';

// import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
// import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
// import vtkVertexGlyphFilter from '@kitware/vtk.js/Filters/Core/vtkVertexGlyphFilter';
// import { vtkUnsignedCharArray, vtkFloatArray } from '@kitware/vtk.js/Common/Core';




const vtkContainer = ref(null);
const context = ref(null);
const coneResolution = ref(6);
const representation = ref(2);

function setConeResolution(res) {
  coneResolution.value = Number(res);
}

function setRepresentation(rep) {
  representation.value = Number(rep);
}

watchEffect(() => {
  const res = unref(coneResolution);
  const rep = unref(representation);
  if (context.value) {
    const { actor, coneSource, renderWindow } = context.value;
    coneSource.setResolution(res);
    actor.getProperty().setRepresentation(rep);
    renderWindow.render();
  }
});

onMounted(() => {
  if (!context.value) {
    const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: vtkContainer.value,
    });
    const coneSource = vtkConeSource.newInstance({ height: 1.0 });

    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    // 设置颜色
    actor.getProperty().setColor(...[34, 139, 34].map((i) => i / 255));
    // 设置透明度
    actor.getProperty().setOpacity(0.8);


    // // 画点
    // const pointSource = vtkPointSource.newInstance({
    //   numberOfPoints: 250,
    //   // radius: 1,
    // });
    // mapper.setInputConnection(pointSource.getOutputPort());


    // // 画球体
    // const sphereSource = vtkSphereSource.newInstance({
    //   height: 0.5,
    //   phiResolution: 20,
    //   thetaResolution: 20,
    // });
    // // const sphereDataset = addBeachBallColor(sphereSource.getOutputData());
    // mapper.setInputData(sphereSource.getOutputData()); // Glyph




    // // 假设你有一些点的坐标数据，颜色和大小
    // const points = [[10,20,30]]; // 点的坐标数组，如 [[x1, y1, z1], [x2, y2, z2], ...]
    // const colors = [[1,0.5,1]]; // 点的颜色数组，如 [[r1, g1, b1], [r2, g2, b2], ...]，值域通常是0到1
    // const sizes = [100]; // 点的大小数组，如 [s1, s2, ...]

    // const pointsData = vtkPoints.newInstance();
    // points.forEach(point => pointsData.insertNextPoint(...point));
    // const polyData = vtkPolyData.newInstance();
    // polyData.setPoints(pointsData);

    // // 创建顶点（vertices）
    // const vertexFilter = vtkVertexGlyphFilter.newInstance();
    // vertexFilter.setInputData(polyData);
    // vertexFilter.update();
    // polyData.shallowCopy(vertexFilter.getOutputData());

    // // 设置颜色
    // const colorData = vtkUnsignedCharArray.newInstance({
    //   numberOfComponents: 3,
    //   name: 'Colors',
    // });
    // colors.forEach(color => colorData.push(...color.map(c => Math.floor(c * 255))));
    // polyData.getPointData().setScalars(colorData);

    // // 设置大小
    // const sizeData = vtkFloatArray.newInstance({
    //   numberOfComponents: 1,
    //   name: 'Sizes',
    // });
    // sizes.forEach(size => sizeData.push(size));
    // polyData.getPointData().setScalars(sizeData); // 注意，这可能需要更专门的方法来设置点大小

    // mapper.setInputData(polyData);







    const renderer = fullScreenRenderer.getRenderer();
    const renderWindow = fullScreenRenderer.getRenderWindow();

    renderer.addActor(actor);
    renderer.resetCamera();
    renderWindow.render();

    context.value = {
      fullScreenRenderer,
      renderWindow,
      renderer,
      coneSource,
      actor,
      mapper,
    };
  }
});

onBeforeUnmount(() => {
  if (context.value) {
    const { fullScreenRenderer, coneSource, actor, mapper } = context.value;
    actor.delete();
    mapper.delete();
    coneSource.delete();
    fullScreenRenderer.delete();
    context.value = null;
  }
});


</script>

<style lang="less" scoped>
.nii {
  width: 800px;
  height: 800px;
  background: rgba(240, 240, 240, 0.2);
  border: 1px solid #333;
}

#myCanvas {
  width: 600px;
  height: 600px;
}

.controls {
  position: absolute;
  top: 100px;
  left: 25px;
  background: white;
  padding: 12px;
}
</style>
