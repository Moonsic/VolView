<script setup lang="ts">
import { useResetViewsEvents } from '@/src/components/tools/ResetViews.vue';
import { VtkViewContext } from '@/src/components/vtk/context';
import { useWindowingConfig } from '@/src/composables/useWindowingConfig';
import { useMouseRangeManipulatorListener } from '@/src/core/vtk/useMouseRangeManipulatorListener';
import { useVtkInteractionManipulator } from '@/src/core/vtk/useVtkInteractionManipulator';
import { useWindowingStore } from '@/src/store/view-configs/windowing';
import { Maybe } from '@/src/types';
import vtkMouseRangeManipulator, {
  IMouseRangeManipulatorInitialValues,
} from '@kitware/vtk.js/Interaction/Manipulators/MouseRangeManipulator';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import type { Vector2 } from '@kitware/vtk.js/types';
import { syncRef } from '@vueuse/core';
import { inject, toRefs, computed } from 'vue';

interface Props {
  viewId: string;
  imageId: Maybe<string>;
  manipulatorConfig?: IMouseRangeManipulatorInitialValues;
}

const props = defineProps<Props>();
const { viewId, imageId, manipulatorConfig } = toRefs(props);

// console.log('manipulatorConfig :>> ', manipulatorConfig);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

const interactorStyle =
  view.interactorStyle as Maybe<vtkInteractorStyleManipulator>;
if (!interactorStyle?.isA('vtkInteractorStyleManipulator')) {
  throw new Error('No vtkInteractorStyleManipulator');
}

const config = computed(() => {
  return {
    button: 1,
    dragEnabled: true, // GGG 这里是控制是否可以按住左键拖拽改变亮度，之前默认是true，我现在改成false，不能拖拽。
    scrollEnabled: false, // GGG 这里不不不是控制是否可以按住右键缩放的，目前不知道是什么意思
    ...manipulatorConfig?.value,
  };
});

const { instance: rangeManipulator } = useVtkInteractionManipulator(
  interactorStyle,
  vtkMouseRangeManipulator,
  config
);

const wlConfig = useWindowingConfig(viewId, imageId);
useResetViewsEvents().onClick(() => {
  useWindowingStore().resetConfig(imageId.value, viewId.value);
});

const computeStep = (range: Vector2) => {
  const diff = range[1] - range[0] || 1;
  return Math.min(diff, 1) / 256;
};
const wlStep = computed(() => computeStep(wlConfig.range.value));

const horiz = useMouseRangeManipulatorListener(
  rangeManipulator,
  'horizontal',
  wlConfig.range,
  wlStep,
  wlConfig.level.value
);

const vert = useMouseRangeManipulatorListener(
  rangeManipulator,
  'vertical',
  computed(() => [1e-12, wlConfig.range.value[1] - wlConfig.range.value[0]]),
  wlStep,
  wlConfig.width.value
);

syncRef(horiz, wlConfig.level, { immediate: true });
syncRef(vert, wlConfig.width, { immediate: true });
</script>

<template><slot></slot></template>
