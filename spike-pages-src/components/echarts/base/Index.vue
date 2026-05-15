<template>
  <div :style="cssStyle">
    <div v-if="isEmpty" class="empty widthP100">暂无数据</div>
    <!-- <div v-if="!isEmpty" ref="echarts" :class="['widthP100', { none: isEmpty }]" /> -->
    <div v-else ref="echarts" class="widthP100" />
  </div>
</template>

<script lang="ts" setup name="my-base-chart">
// echarts 5.0踩坑
// https://github.com/apache/incubator-echarts/issues/13764
// https://github.com/apache/incubator-echarts/issues/13741
// https://echarts.apache.org/next/zh/tutorial.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9E%84%E5%BB%BA%20ECharts
// 这里只写echarts的方法

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

import * as echarts from 'echarts'

// import { toRaw } from 'vue'


const props = withDefaults(defineProps<{
  width: number | string,
  height: number | string,
  options: Record<string, any>,
  functionList?: Record<string, Function>
}>(), {
  width: '100%',
  height: '100%',
  functionList: () => ({}),
});

const echartsRef = ref<HTMLDivElement>();
const chart = ref<echarts.ECharts>();
const isEmpty = ref(!props.options || !Object.keys(props.options).length);
let timer: ReturnType<typeof setTimeout> | null = null;
let interval: ReturnType<typeof setInterval> | null = null;

const cssStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));


const initCharts = () => {
  if (!props.options.backgroundColor) {
    chart.value = echarts.init(echartsRef.value!, 'dark');
  } else {
    chart.value = echarts.init(echartsRef.value!);
  }
  chart.value.setOption(props.options, true);

  if (props.functionList && Object.keys(props.functionList).length > 0) {
    Object.entries(props.functionList).forEach(([key, value]) => {
      if (typeof value === 'function') {
        // chart.value!.on(key, value);

        // 假设 value 已经是正确的函数类型，这里进行类型断言
        const typedValue = value as (this: echarts.EChartsType, ...args: unknown[]) => boolean | void;
        chart.value!.on(key, typedValue)
      }
    });
  }
  // 如果要循环播放
  if (props.options.loop) {
    showTooltipLoop();
  }
};


const showTooltipLoop = () => {
  const loopTime = props.options.loopTime || 2000;
  const length = props.options.series[0]?.data?.length || 0;
  const isPie = props.options.series[0]?.type === 'pie';
  const seriesLength = isPie ? 1 : props.options.series.length; // 如果是饼状图，则需要在循环同时显示高亮highlight效果，且只有一个环有效果

  let num = 0;
  let seriesNum = 0; // 针对series有多个的情况（双向柱状图）

  // 循环显示tooltip
  const loopCommon = () => {
    chart.value!.dispatchAction({
      type: 'showTip',
      seriesIndex: seriesNum,
      dataIndex: num,
    });

    // 如果是饼状图，先取消上一个的高亮效果，再点亮这个的高亮效果
    if (isPie) {
      chart.value!.dispatchAction({
        type: 'downplay',
        seriesIndex: seriesNum,
        dataIndex: num === 0 ? length - 1 : num - 1,
      });
      chart.value!.dispatchAction({
        type: 'highlight',
        seriesIndex: seriesNum,
        dataIndex: num,
      });
    }

    num++;
    if (num === length) {
      num = 0;
      seriesNum++;
      if (seriesNum === seriesLength) {
        seriesNum = 0;
      }
    }
  };

  // 循环显示tooltip（横向柱状图）
  const loopBarTransverse = () => {
    chart.value!.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: num,
    });

    num--;
    if (num < 0) {
      num = length - 1;
    }
  };

  const loopFn = props.options.type === 'bartransverse' ? loopBarTransverse : loopCommon;

  timer = setTimeout(loopFn, 200);
  interval = setInterval(loopFn, loopTime);

  const stopLoop = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (interval) {
      clearInterval(interval);
    }
  };

  echartsRef.value!.addEventListener('mouseover', stopLoop);
  echartsRef.value!.addEventListener('mouseout', () => {
    stopLoop();
    setInterval(loopFn, loopTime);
  });

};

onMounted(() => {
  if (!isEmpty.value) {
    initCharts();
  }
});

onBeforeUnmount(() => {
  if (chart.value) {
    chart.value.dispose();
  }
  if (timer) {
    clearTimeout(timer);
  }
  if (interval) {
    clearInterval(interval);
  }

});

watch(() => props.options, (newOptions) => {
  if (isEmpty.value) {
    isEmpty.value = !newOptions || !Object.keys(newOptions).length;
  }

  if (!isEmpty.value) {
    nextTick(() => {
      if (chart.value) {
        chart.value.clear();
        initCharts();
      } else {
        initCharts();
      }
    });
  } else {
    setTimeout(() => {
      isEmpty.value = true;
    }, 1000);
  }
}, { deep: true });

</script>

<style lang="less" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
}

.none {
  display: none;
}

.widthP100 {
  width: 100%;
  height: 100%;
}
</style>