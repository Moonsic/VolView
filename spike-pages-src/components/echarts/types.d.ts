// types.d.ts
export interface ChartOption {
  type?: string;
  xAxis?: string;
  yAxis?: string;
  legend?: string;
  color?: string[];
  seriesData?: any[];
  backgroundColor?: string;
  max?: number;
  showLabel?: boolean;
  borderRadius?: number | number[];
  theme?: 'light' | 'dark';
  tooltipTheme?: 'light' | 'dark';
  loop?: boolean;
  loopTime?: number;
  // 可以根据实际情况添加更多的属性
}

export interface ExtraOption {
  // 定义额外的图表选项
  // ...
}

export interface Props {
  chartOption: ChartOption;
  extraOption?: ExtraOption;
  width?: number | string;
  height?: number | string;
  functionList?: Record<string, any>;
}