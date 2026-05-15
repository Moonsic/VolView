<script setup lang="ts">
import { toRefs, watchEffect, inject, computed } from 'vue';
import { useResliceRepresentation } from '@/src/core/vtk/useResliceRepresentation';
import { VtkViewContext } from '@/src/components/vtk/context';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
import { SlabTypes } from '@kitware/vtk.js/Rendering/Core/ImageResliceMapper/Constants';
import type { Vector3 } from '@kitware/vtk.js/types';
import { watchImmediate } from '@vueuse/core';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import { useLayersStore } from '@/src/store/datasets-layers';
import useLayerColoringStore from '@/src/store/view-configs/layers';
import { useLayerConfigInitializer } from '@/src/composables/useLayerConfigInitializer';
import { applyColoring } from '@/src/composables/useColoringEffect';

interface Props {
  viewId: string;
  layerId: string;
  planeNormal: Vector3;
  planeOrigin: Vector3;
}

const props = defineProps<Props>();
const { viewId, layerId, planeNormal, planeOrigin } = toRefs(props);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

const layersStore = useLayersStore();
const coloringStore = useLayerColoringStore();
const imageData = computed(() => layersStore.layerImages[layerId.value]);
const coloringConfig = computed(() =>
  coloringStore.getConfig(viewId.value, layerId.value)
);

const sliceRep = useResliceRepresentation(view, imageData);

sliceRep.property.setRGBTransferFunction(
  0,
  vtkColorTransferFunction.newInstance()
);
sliceRep.property.setScalarOpacity(0, vtkPiecewiseFunction.newInstance());
sliceRep.property.setUseLookupTableScalarRange(false);

// 共注册层要盖在底图上面，否则颜色层会看不出来。
sliceRep.mapper.setResolveCoincidentTopologyToPolygonOffset();
sliceRep.mapper.setResolveCoincidentTopologyPolygonOffsetParameters(-4, -4);

const slicePlane = vtkPlane.newInstance();
sliceRep.mapper.setSlicePlane(slicePlane);
sliceRep.mapper.setSlabType(SlabTypes.MAX);
sliceRep.mapper.setSlabThickness(1);

watchImmediate([planeNormal, planeOrigin], ([normal, origin]) => {
  const plane = sliceRep.mapper.getSlicePlane();
  if (!plane) return;
  plane.setNormal(normal);
  plane.setOrigin(origin);
});

useLayerConfigInitializer(viewId, layerId);

watchEffect(() => {
  const config = coloringConfig.value;
  if (!config) return;

  const cfun = sliceRep.property.getRGBTransferFunction(0);
  const ofun = sliceRep.property.getPiecewiseFunction(0);
  if (!cfun || !ofun) throw new Error('Missing layer transfer functions');

  applyColoring({
    props: {
      colorFunction: config.transferFunction,
      opacityFunction: config.opacityFunction,
    },
    cfun,
    ofun,
  });

  const { mappingRange } = config.transferFunction;
  const width = mappingRange[1] - mappingRange[0];
  const center = (mappingRange[1] + mappingRange[0]) / 2;

  sliceRep.property.setColorWindow(width);
  sliceRep.property.setColorLevel(center);
  sliceRep.property.setOpacity(config.blendConfig.opacity);
  sliceRep.actor.setVisibility(config.blendConfig.visibility);
});

defineExpose(sliceRep);
</script>

<template>
  <slot></slot>
</template>
