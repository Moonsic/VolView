import _ from 'lodash'
import { onMounted, reactive, watch } from 'vue';

import { ChartOption, ExtraOption, Props } from './types'; // 引入类型定义

// interface ChartOption {
//   type?: string;
//   xAxis?: string;
//   yAxis?: string;
//   legend?: string;
//   color?: string[];
//   seriesData?: any[];
//   backgroundColor?: string;
//   max?: number;
//   showLabel?: boolean;
//   borderRadius?: number | number[];
//   theme?: 'light' | 'dark';
//   tooltipTheme?: 'light' | 'dark';
//   loop?: boolean;
//   loopTime?: number;
//   // 可以根据实际情况添加更多的属性
// }

// interface ExtraOption {
//   // 定义额外的图表选项
//   // ...
// }

// interface Props {
//   chartOption: ChartOption;
//   extraOption?: ExtraOption;
//   width?: number | string;
//   height?: number | string;
//   functionList?: Record<string, any>;
// }

// 定义一个用于处理图表选项的 Hook
export function useChartOptions(props: Props) {

  const {chartOption, ...extra } = props.options

console.log('_chartOption :>> ', extra);

  // 使用 reactive 创建响应式对象
  const state = reactive({
    options: {},
    chartOption: chartOption || {},
    extraOption: extra || {},
    width: props.width || '100%',
    height: props.height || '100%',
    functionList: props.functionList || {},
  });


  // const newOptions =

  onMounted(() => {
    initOptions()
  })

  // // 初始化选项的方法
  const initOptions = () => {
    console.log('props222 :>> ', props);

    // state.options = props.options || {}
    // state.chartOption = props.options?.chartOption || {}
    // state.extraOption = props.extraOption || {}
    // state.width = props.width || '100%'
    // state.height = props.height || '100%'
    // state.functionList = props.functionList || {}

    console.log('state :>> ', state);

    // 检查配置属性是否为空
    if (_.isEmpty(state.chartOption) && _.isEmpty(state.extraOption)) {
      console.log('空 :>> ');
      state.options = {};
      return;
    }


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
    } = state.chartOption;

    if (!_seriesData || !_seriesData.length) {
      state.options = {};
      return;
    }

    // 设置默认值
    _type = _type ? _type.toLowerCase() : '';
    _xAxis = _xAxis || 'name';
    _yAxis = _yAxis || 'value';
    _legend = _legend || 'type';

    let newSeriesData = [];
    if (_type === 'bartransverse') {
      _seriesData.forEach((item: any) => {
        newSeriesData.unshift(item);
      });
    } else {
      newSeriesData = _seriesData;
    }





    // 数据格式转换
    const temp: { name: any; data: any[]; }[] = [];
    newSeriesData.forEach((item: { [x: string]: any; }) => {
      if (!item[_legend]) {
        item[_legend] = '';
      }
      const data = temp.find(f => f.name === item[_legend]);
      if (data) {
        data.data.push(item);
      } else {
        temp.push({
          name: item[_legend],
          data: [item]
        });
      }
    });


    // 数据解析
    let yAxisData: string | any[] = [], xAxisData: Iterable<any> = [], legend: Iterable<any> = [];
    temp.forEach((item, index) => {
      legend.push(item.name);
      xAxisData = [...xAxisData, ...item.data.map(m => m[_xAxis])];
      if (_type === 'scatter') {
        yAxisData[index] = item.data.map(m => [m[_xAxis], m[_yAxis]]);
      }
    });

    legend = Array.from(new Set(legend));
    xAxisData = Array.from(new Set(xAxisData));

    if (_type !== 'scatter') {
      legend.forEach((legends, j) => {
        const sourceData = temp.find(f => f.name === legends);
        if (!yAxisData[j]) {
          yAxisData[j] = [];
        }
        xAxisData.forEach(item => {
          const yData = sourceData.data.find(f => f[_xAxis] === item);
          yAxisData[j].push(yData && yData[_yAxis] || 0);
        });
      });
    }

    if (!xAxisData.length && !yAxisData.length) {
      state.options = {};
      return;
    }

    // return state.options




    let option = assembleDataToOption(xAxisData, yAxisData, legend, _max) || {};

    // 如果需要循环播放图表
    if (_loop) {
      option = _.merge({}, option, { loop: _loop, loopTime: _loopTime, type: _type });
    }

    option.series.forEach((item: { label: { position: any; show?: any; color?: any; }; itemStyle: { borderRadius: any; }; }, index: number) => {
      // 如果显示图上的具体数字
      if (_showLabel) {
        item.label = {
          show: _showLabel || false,
          position: 'top',
          color: typeof _color[0] === 'string' ? _color[index] : _color[index][0]
        };
        if (_type === 'bartransverse') {
          item.label.position = 'right';
        }
        if (_type === 'barlevels') {
          if (index === 0) {
            item.label.position = 'left';
          }
          if (index === option.series.length - 1) {
            item.label.position = 'right';
          }
        }
        if (_type.includes('pie')) {
          item.label.position = 'outside';
        }
      }

      // 如果图表显示圆角
      if (_borderRadius) {
        item.itemStyle.borderRadius = _borderRadius;

        if (_type === 'barlevels') {
          if (index === 0) {
            item.itemStyle.borderRadius = _borderRadius[0];
          }
          if (index === option.series.length - 1) {
            item.itemStyle.borderRadius = _borderRadius[1];
          }
        }
      }
    });

    // 设置背景色
    option = _.merge({}, option, {
      backgroundColor: _backgroundColor || (_theme === 'light' ? '#fff' : 'transparent')
    });

    // 如果主题色是亮色，就递归 option 设置黑色
    if (_theme === 'light') {
      const setColor = (obj: { [x: string]: any; color: string; }) => {
        for (const key in obj) {
          const value = obj[key];

          if (key !== 'series' && value) {
            if (value instanceof Array) {
              value.forEach(f => {
                if (f && f instanceof Object) {
                  setColor(f);
                }
              });
            } else if (value instanceof Object) {
              setColor(value);
            } else {
              if (key === 'color') {
                obj.color = '#334';
              }
            }
          }
        }
      };
      setColor(option);
      _.merge(option, {
        legend: {
          textStyle: {
            color: '#889', // 图例颜色
          },
        },
        yAxis: [
          {
            splitLine: {
              lineStyle: {
                color: '#dde', // 分隔线颜色
              }
            }
          }
        ]
      });
    }

    // 如果 tooltip 主题色为亮色
    if (_theme === 'light' || _tooltipTheme === 'light') {
      const lightTheme = {
        backgroundColor: 'rgba(255,255,255,1)',
        borderWidth: 0,
        textStyle: {
          color: '#666',
        }
      };
      _.merge(option.tooltip, lightTheme);
    } else {
      const darkTheme = {
        backgroundColor: 'rgba(18,68,181,1)',
        borderWidth: 0,
        textStyle: {
          color: '#c5e3ff',
        }
      };
      _.merge(option.tooltip, darkTheme);
    }

    // 最后再合并 this.extraOption，这样 this.extraOption 的配置项优先级更大
    let options = _.merge({}, option, state.extraOption);

    state.options = options.series ? options : {};
    // 返回 options 属性
    return {
      options: state.options,
    };
  };


  return {
    initOptions
  }

}
