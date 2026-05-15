<script setup lang="ts">
import { toRefs, watchEffect, inject, computed } from 'vue';
import { useImage } from '@/src/composables/useCurrentImage';
import { useSliceRepresentation } from '@/src/core/vtk/useSliceRepresentation';
import { useSliceConfig } from '@/src/composables/useSliceConfig';
import { useWindowingConfig } from '@/src/composables/useWindowingConfig';
import { LPSAxis } from '@/src/types/lps';
import { syncRefs } from '@vueuse/core';
import { vtkFieldRef } from '@/src/core/vtk/vtkFieldRef';
import { SlicingMode } from '@kitware/vtk.js/Rendering/Core/ImageMapper/Constants';
import { Maybe } from '@/src/types';
import { VtkViewContext } from '@/src/components/vtk/context';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';
import useVolumeColoringStore from '@/src/store/view-configs/volume-coloring';
import { useVolumeColoringInitializer } from '@/src/composables/useVolumeColoringInitializer';
import { useColoringEffect } from '@/src/composables/useColoringEffect';

interface Props {
  viewId: string;
  imageId: Maybe<string>;
  axis: LPSAxis;
}

const props = defineProps<Props>();
const { viewId: viewID, imageId: imageID, axis } = toRefs(props);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

const { metadata: imageMetadata, imageData } = useImage(imageID);
const coloringConfig = computed(() =>
  useVolumeColoringStore().getConfig(viewID.value, imageID.value)
);

// bind slice and window configs
const sliceConfig = useSliceConfig(viewID, imageID);
const wlConfig = useWindowingConfig(viewID, imageID);

// setup base image
const sliceRep = useSliceRepresentation(view, imageData);
// console.log('base liceRep',sliceRep)

sliceRep.property.setRGBTransferFunction(
  0,
  vtkColorTransferFunction.newInstance()
);
sliceRep.property.setScalarOpacity(0, vtkPiecewiseFunction.newInstance());
sliceRep.property.setUseLookupTableScalarRange(false);

// set slice ordering to be in the back
sliceRep.mapper.setResolveCoincidentTopologyToPolygonOffset();
sliceRep.mapper.setResolveCoincidentTopologyPolygonOffsetParameters(1, 1);

// set slicing mode
watchEffect(() => {
  const { lpsOrientation } = imageMetadata.value;
  const ijkIndex = lpsOrientation[axis.value];
  const mode = [SlicingMode.I, SlicingMode.J, SlicingMode.K][ijkIndex];
  // console.log('mode :>> ', mode);
  sliceRep.mapper.setSlicingMode(mode);
});

// sync slicing
const slice = vtkFieldRef(sliceRep.mapper, 'slice');
syncRefs(sliceConfig.slice, slice, { immediate: true });

// console.log('slice :>> ', slice);
// sync windowing
const colorLevel = vtkFieldRef(sliceRep.property, 'colorLevel');
const colorWindow = vtkFieldRef(sliceRep.property, 'colorWindow');
syncRefs(wlConfig.level, colorLevel, { immediate: true });
syncRefs(wlConfig.width, colorWindow, { immediate: true });

// 主结构像切片也接入颜色映射，这样 iframe 切换色图时 2D/斜切视图会同步变化。
useVolumeColoringInitializer(viewID, imageID);
useColoringEffect(
  coloringConfig,
  computed(() => sliceRep.property.getRGBTransferFunction(0)),
  computed(() => sliceRep.property.getPiecewiseFunction(0))
);

defineExpose(sliceRep);
</script>

<template>
  <slot></slot>
</template>
