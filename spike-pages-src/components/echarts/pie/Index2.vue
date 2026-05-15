<template>
  <div :style="cssStyle">
    <div v-if="isEmpty" class="empty widthP100">暂无数据</div>
    <!-- <div v-if="!isEmpty" ref="echarts" :class="['widthP100', { none: isEmpty }]" /> -->
    <div v-else ref="echartsRef" class="widthP100" />
  </div>
</template>

<script lang="ts" setup name="my-pie-chart">
// echarts 5.0踩坑
// https://github.com/apache/incubator-echarts/issues/13764
// https://github.com/apache/incubator-echarts/issues/13741
// https://echarts.apache.org/next/zh/tutorial.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9E%84%E5%BB%BA%20ECharts
// 这里只写echarts的方法

import _ from 'lodash'
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';

import * as echarts from 'echarts'

// import { useChartOptions } from './useChartOptions'; // 假设这是你的 Hook 文件路径

import defaultOptions from './options'; // 假设这是你的默认选项文件路径

// const props = withDefaults(defineProps<{
//   width: number | string,
//   height: number | string,
//   option: Record<string, any> | null,
//   functionList?: Record<string, Function>
// }>(), {
//   width: '100%',
//   height: '100%',
//   option: null,
//   functionList: () => ({}),
// });


const props = defineProps({
  width: {
    type: [Number,String],
    default: '100%',
  },
  height: {
    type: [Number,String],
    default: '100%',
  },
  option: {
    type: Object,
    default: () => ({}),
  },
  functionList: {
    type: Function,
    default: () => ({}),
  },
})

// const isEmpty = ref(!props.option || !Object.keys(props.option).length);
const isEmpty = ref(true);

const echartsRef = ref<HTMLDivElement>();
const chart = ref<echarts.ECharts>();

let timer: ReturnType<typeof setTimeout> | null = null;
let interval: ReturnType<typeof setInterval> | null = null;

const cssStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}));

// onMounted(() => {
// console.log('22isEmpty :>> ', isEmpty.value);

//   if (!isEmpty.value) {
//     initCharts();
//   }
// });

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



let newOption: any = {} // 配置参数

let chartOption: any = {} // 配置参数
let extraOption: any = {} // 配置参数

let first = true

// 如果改变的是引用类型，比如seriesData是数组，会触发watch监听，但newOption === oldOption，
// 如果改变的是基础类型，比如string/number/boolean，则不会触发watch监听。所以加上if (!_.isEqual(newOption, oldOption))
watch(() => props.option, (newOption, oldOption) => {
  console.log('watch :>> ', props.option);




  const { chartOption: _chartOption, ...extra } = props.option

  chartOption = _chartOption
  extraOption = extra

  if (!chartOption.seriesData.length) {
    console.log('没有数据 :>> ');
    return
  }

  isEmpty.value = !props.option || !Object.keys(props.option).length;

  if (!isEmpty.value) {
    nextTick(() => {
      if (chart.value) {
        chart.value.clear(); // 如果打开，每次都重新生成
        initCharts();
      } else {
        initCharts();
      }
    });
  } else {
    // 当配置为空时，清除
    if (chart.value) {
      chart.value.clear();
    }
  }

}, { deep: true });


const initCharts = () => {


  // 解构 chartOption 中不需要的属性
  let {
    type: _type,
    xAxis: _xAxis,
    yAxis: _yAxis,
    legend: _legend,
    color: _color,
    seriesData: _seriesData,
    backgroundColor: _backgroundColor,
    max: _max,
    showLabel: _showLabel,
    borderRadius: _borderRadius,
    theme: _theme,
    tooltipTheme: _tooltipTheme,
    loop: _loop,
    loopTime: _loopTime,
  } = chartOption;


  // 设置默认值
  _type = _type ? _type.toLowerCase() : '';
  _xAxis = _xAxis || 'name';
  _yAxis = _yAxis || 'value';
  _legend = _legend || 'type';


  if (first) {
    chart.value = echarts.init(echartsRef.value);
  }

  console.log('_seriesData.length :>> ', _seriesData.length);
  let newSeriesData = []
  if (_seriesData.length) {
    newSeriesData = _seriesData.map((item: any, index: number)=>{
      return {
        name: item[_xAxis],
        value: item[_yAxis],
        itemStyle: {
          color: _color[index] || null,
        }
      }
    })
  }

  if (first) {
    const defaultOp = { ...defaultOptions['BASIC_OPTION'] }
    newOption = _.merge({}, defaultOp, extraOption, {
      series: [{
        data: newSeriesData
      }]
    })

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
    first = false

  } else {
    newOption = _.merge({}, newOption, extraOption, {
      series: [{
        data: newSeriesData
      }]
    })
  }



  chart.value.setOption(newOption, true);


  // 如果要循环播放
  if (chartOption.loop) {
    showTooltipLoop()
  }


  // if (!props.option.backgroundColor) {
  //   chart.value = echarts.init(echartsRef.value, 'dark');
  // } else {
  // }

  // if (!chart.value) {
  //   chart.value = echarts.init(echartsRef.value);
  // }

  // const defaultOp = { ...defaultOptions['BASIC_OPTION'] }


  // newOption = _.merge({}, defaultOp, extraOption, {
  //   series: [{
  //     data: chartOption.seriesData
  //   }],
  // })

  // console.log('chartOption :>> ', chartOption);
  // console.log('newOption :>> ', newOption);




};




const showTooltipLoop = () => {
  stopLoop()
  const loopTime = chartOption.loopTime || 2000;
  const length = newOption.series[0]?.data?.length || 0;
  const isPie = chartOption.type === 'pie';
  const seriesLength = isPie ? 1 : newOption.series.length; // 如果是饼状图，则需要在循环同时显示高亮highlight效果，且只有一个环有效果

  let num = 0;
  let seriesNum = 0; // 针对series有多个的情况（双向柱状图）

  // 循环显示tooltip
  const loopCommon = () => {
    chart.value.dispatchAction({
      type: 'showTip',
      seriesIndex: seriesNum,
      dataIndex: num,
    });

    // 如果是饼状图，先取消上一个的高亮效果，再点亮这个的高亮效果
    if (isPie) {
      chart.value.dispatchAction({
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

  let loopFn: any
  if (chartOption.type === 'bartransverse') {
    num = length - 1
    loopFn = loopBarTransverse
  } else {
    loopFn = loopCommon
  }

  timer = setTimeout(loopFn, 200);
  interval = setInterval(loopFn, loopTime);




  // 鼠标移入
  chart.value.on('mouseover', () => {
    stopLoop()
  })
  // 鼠标移出
  chart.value.on('mouseout', () => {
    stopLoop()
    timer = setInterval(loopFn, loopTime)
  })

};

const stopLoop = () => {
  if (timer) {
    clearTimeout(timer);
  }
  if (interval) {
    clearInterval(interval);
  }
};

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