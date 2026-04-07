<script setup lang="ts">
import { inject, toRefs } from 'vue';
import ViewOverlayGrid from '@/src/components/ViewOverlayGrid.vue';
import { useSliceConfig } from '@/src/composables/useSliceConfig';
import { Maybe } from '@/src/types';
import { VtkViewContext } from '@/src/components/vtk/context';
import { useWindowingConfig } from '@/src/composables/useWindowingConfig';
import { useOrientationLabels } from '@/src/composables/useOrientationLabels';
import DicomQuickInfoButton from '@/src/components/DicomQuickInfoButton.vue';
import { storeToRefs } from 'pinia';
import { useToolStore } from '@/src/store/tools';
import { Tools } from '@/src/store/tools/types';

interface Props {
  viewId: string;
  imageId: Maybe<string>;
}

const props = defineProps<Props>();
const { viewId, imageId } = toRefs(props);

const view = inject(VtkViewContext);
if (!view) throw new Error('No VtkView');

// console.log('22 view :>> ', view);

const {
  top: topLabel,
  left: leftLabel,
  bottom: bottomLabel,
  right: rightLabel
 } = useOrientationLabels(view);

const {
  config: sliceConfig,
  slice,
  range: sliceRange,
} = useSliceConfig(viewId, imageId);

// 注释了亮度的信息
const {
  config: wlConfig,
  width: windowWidth,
  level: windowLevel,
  range: windowRange
} = useWindowingConfig(viewId, imageId);


// GGG，但处于调整明暗时，才出现
const { currentTool } = storeToRefs(useToolStore());




// B项目接收
window.addEventListener('message', (event: any) => {
  if (event.data.type === 'changeWindow') {
    const value: number = JSON.parse(event.data.value)
    windowWidth.value = value;
  }
  if (event.data.type === 'changeLevel') {
    const value: number = JSON.parse(event.data.value)
    windowLevel.value = value;
  }
})


</script>

<template>
  <view-overlay-grid class="overlay-no-events view-annotations">
    <template v-slot:top-center>
      <div class="annotation-cell">
        <span>{{ topLabel }}</span>
      </div>
    </template>
    <template v-slot:middle-left>
      <!-- HHH 因为左边有滑动条，所以要25px的margin-left -->
      <div class="annotation-cell annotation-cell-left">
        <span>{{ leftLabel }}</span>
      </div>
    </template>
    <template v-slot:middle-right>
      <div class="annotation-cell annotation-cell-right">
        <span>{{ rightLabel }}</span>
      </div>
    </template>
    <template v-slot:bottom-center>
      <div class="annotation-cell">
        <span>{{ bottomLabel }}</span>
      </div>
    </template>
    <template v-slot:bottom-left>
      <div class="annotation-cell">
        <!-- GGG 这里是新版本加的吧，以前没有，但滚动slice也没改变，官网上也是，估计有bug -->
        <div v-if="sliceConfig">
          <!-- Slice:  -->
          {{ slice + 1 }}/{{ sliceRange[1] + 1 }}
        </div>
        <!-- <div>{{ viewId.replace('Oblique','') }}：{{ slice + 1 }}/{{ sliceRange[1] + 1 }}</div> -->
        <!-- 把左下角的亮度信息注释了 -->
        <div v-if="wlConfig && currentTool === Tools.WindowLevel">
          W/L: {{ windowWidth.toFixed(2) }} / {{ windowLevel.toFixed(2) }}
        </div>
        <!-- <div>range:{{ windowRange }}</div> -->
      </div>
    </template>
    <template v-slot:top-right>
      <div class="annotation-cell">
        <dicom-quick-info-button :image-id="imageId"></dicom-quick-info-button>
      </div>
    </template>
  </view-overlay-grid>
</template>

<style scoped src="@/src/components/styles/vtk-view.css"></style>

<style scoped>

.annotation-cell-left {
  margin-left: 25px;
}

.annotation-cell-right {
  margin-right: 15px;
}
</style>
