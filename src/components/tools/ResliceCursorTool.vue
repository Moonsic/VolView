<script setup lang="ts">
import { computed, inject, ref, toRefs } from 'vue';
import {
  vtkResliceCursorViewWidget,
  ResliceCursorWidgetState,
} from '@kitware/vtk.js/Widgets/Widgets3D/ResliceCursorWidget';
import { OBLIQUE_OUTLINE_COLORS } from '@/src/constants';
import { getLPSAxisFromDir, getVTKViewTypeFromLPSAxis } from '@/src/utils/lps';
import { LPSAxisDir } from '@/src/types/lps';
import useResliceCursorStore from '@/src/store/reslice-cursor';
import { VtkViewContext } from '@/src/components/vtk/context';
import { onViewMounted, onViewUnmounted } from '@/src/core/vtk/onViewMounted';
import { InitViewIDs } from '@/src/config';

interface Props {
  viewId: string;
  viewDirection: LPSAxisDir;
}

const props = defineProps<Props>();
const { viewDirection } = toRefs(props);
const viewAxis = computed(() => getLPSAxisFromDir(viewDirection.value));

const view = inject(VtkViewContext);
if (!view) throw new Error('No vtk view');

const resliceCursorStore = useResliceCursorStore();
const { resliceCursor, resliceCursorState } = resliceCursorStore;

const widget = ref<vtkResliceCursorViewWidget>();
const vtkViewType = computed(() => getVTKViewTypeFromLPSAxis(viewAxis.value));

onViewMounted(view.renderWindowView, () => {
  widget.value = view.widgetManager.addWidget(
    resliceCursor,
    vtkViewType.value
  ) as vtkResliceCursorViewWidget;

  widget.value.setKeepOrthogonality(true);
  // reset mouse cursor styles
  widget.value.setCursorStyles({
    translateCenter: 'pointer',
    rotateLine: 'pointer',
    translateAxis: 'pointer',
  });
  // console.log('viewId :>> ', props.viewId);

  // if (props.viewId === 'ObliqueCoronal') {
    // }

    // 这是针对5个圆点
  resliceCursorState.getStatesWithLabel('sphere').forEach((handle, index) => {
    const h = handle as ResliceCursorWidgetState;

    // if (props.viewId === 'ObliqueCoronal') {
    //   console.log('第一 h :>> ', h.getColor3());
    // }

    h.setScale1(12); // 十字线的圆形大小，一共5个圆形，默认是10
    h.setOpacity(100); // 圆形的透明度，默认128

    // 第一个就是中间的白色圆点
    if (index === 0) {
      h.setOpacity(40); // 圆形的透明度，默认128
    }
  });

  // 这是针对线
  resliceCursorState.getStatesWithLabel('line').forEach((handle) => {
    const h = handle as ResliceCursorWidgetState;
    // console.log('line h :>> ', h);
    h.setScale3(1, 1, 1); // 线粗度，默认1
    h.setOpacity(100); // 透明度，默认100
  });

  // 1、3视图的黄色竖线
  const xLines = [
    ...resliceCursorState.getStatesWithLabel('XinZ'),
    ...resliceCursorState.getStatesWithLabel('XinY'),
  ];
  // console.log('xLines :>> ', xLines);
  xLines.forEach((handle) => {
    const h = handle as ResliceCursorWidgetState;
    h.setColor3(OBLIQUE_OUTLINE_COLORS[InitViewIDs.ObliqueSagittal]);
  });

  // 2视图的红色竖线、3视图的红色横线
  const yLines = [
    ...resliceCursorState.getStatesWithLabel('YinZ'),
    ...resliceCursorState.getStatesWithLabel('YinX'),
  ];
  yLines.forEach((handle) => {
    const h = handle as ResliceCursorWidgetState;
    h.setColor3(OBLIQUE_OUTLINE_COLORS[InitViewIDs.ObliqueCoronal]);
  });

  // 1、2 视图的青色横线
  const zLines = [
    ...resliceCursorState.getStatesWithLabel('ZinX'),
    ...resliceCursorState.getStatesWithLabel('ZinY'),
  ];
  zLines.forEach((handle) => {
    const h = handle as ResliceCursorWidgetState;
    h.setColor3(OBLIQUE_OUTLINE_COLORS[InitViewIDs.ObliqueAxial]);
  });

  // update representation to not be as 3D
  widget.value.getRepresentations().forEach((rep) => {
    rep.getActors().forEach((actor) => {
      actor.getProperty().setAmbient(1);
    });
  });

  view.requestRender();
});

onViewUnmounted(view.renderWindowView, () => {
  widget.value = undefined;
  view.widgetManager.removeWidget(resliceCursor);
});
</script>

<template>
  <div></div>
</template>
