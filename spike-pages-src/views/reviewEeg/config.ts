// 浅色主题
export const lightTheme: { [key: string]: string } = {
  'backgroundColor': '#fff', // 背景色
  'xAxis.axisLabel.color': '#222', // x轴刻度标签
  'yAxis.axisLabel.color': '#222', // y轴刻度标签
  'xAxis.splitLine.lineStyle.color': '#eef', // x轴分隔线
  'yAxis.splitLine.lineStyle.color': '#eef', // y轴分隔线
  'yAxis.axisLine.lineStyle.color': '#eef', // y轴坐标轴轴线
  'series.itemStyle.color': '#000', // 折线
  'red-mark-line': 'rgba(255,0,0,.4)', // 红色竖线，带透明度，不遮挡折线
  'red-mark-line-text': '#a00', // 红色竖线上的文字颜色
  'badColor': '#ccc', // 坏道颜色
  'sliderBorderColor': 'rgba(210, 219, 238, 0.8)', // 滑块边框颜色
}

// 护眼主题
export const eyecareTheme: { [key: string]: string } = {
  'backgroundColor': '#f8f6ef', // 背景色
  'xAxis.axisLabel.color': '#222', // x轴刻度标签
  'yAxis.axisLabel.color': '#222', // y轴刻度标签
  'xAxis.splitLine.lineStyle.color': '#eef', // x轴分隔线
  'yAxis.splitLine.lineStyle.color': '#eef', // y轴分隔线
  'yAxis.axisLine.lineStyle.color': '#eef', // y轴坐标轴轴线
  'series.itemStyle.color': '#000', // 折线
  'red-mark-line': 'rgba(255,0,0,.4)', // 红色竖线，带透明度，不遮挡折线
  'red-mark-line-text': '#a00', // 红色竖线上的文字颜色
  'badColor': '#ccc', // 坏道颜色
  'sliderBorderColor': 'rgba(210, 219, 238, 0.8)', // 滑块边框颜色
}

// 深色主题
export const darkTheme: { [key: string]: string } = {
  'backgroundColor': '#17181B', // 背景色
  'xAxis.axisLabel.color': '#aaa',// x轴刻度标签
  'yAxis.axisLabel.color': '#aaa', // y轴刻度标签
  'xAxis.splitLine.lineStyle.color': '#221', // x轴分隔线
  'yAxis.splitLine.lineStyle.color': '#221', // y轴分隔线
  'yAxis.axisLine.lineStyle.color': '#221',// y轴坐标轴轴线
  'series.itemStyle.color': '#d7d8db', // 折线
  'red-mark-line': 'rgba(255,0,0,.4)', // 红色竖线，带透明度，不遮挡折线
  'red-mark-line-text': '#f00', // 红色竖线上的文字颜色
  'badColor': '#333', // 坏道颜色
  'sliderBorderColor': 'rgba(210, 219, 238, 0.2)', // 滑块边框颜色
}

export const allThemeList: { [key: string]: any } = {
  'light': lightTheme,
  'dark': darkTheme,
  'eyecare': eyecareTheme,
}
