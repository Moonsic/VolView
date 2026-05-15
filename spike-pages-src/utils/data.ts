// 性别
export const genderList = [
  { label: t('男'), value: 1 },
  { label: t('女'), value: 2 },
]

// 是否
export const yesNoList = [
  { label: t('是'), value: 1 },
  { label: t('否'), value: 0 },
]

// true/false
export const trueFalseList = [
  { label: 'true', value: 1 },
  { label: 'false', value: 0 },
]

// 脑区列表
// ['lt', 'rt', 'lp', 'rp', 'lf', 'rf', 'lo', 'ro']
export const brainRegionList = [
  { label: 'LT', value: 'LT' },
  { label: 'RT', value: 'RT' },
  { label: 'LP', value: 'LP' },
  { label: 'RP', value: 'RP' },
  { label: 'LF', value: 'LF' },
  { label: 'RF', value: 'RF' },
  { label: 'LO', value: 'LO' },
  { label: 'RO', value: 'RO' },
]

// 脑区列表16个
export const brainRegion16List = [
  { label: 'LT_all', value: 'LT_all' },
  { label: 'LT_grad', value: 'LT_grad' },
  { label: 'RT_all', value: 'RT_all' },
  { label: 'RT_grad', value: 'RT_grad' },
  { label: 'LP_all', value: 'LP_all' },
  { label: 'LP_grad', value: 'LP_grad' },
  { label: 'RP_all', value: 'RP_all' },
  { label: 'RP_grad', value: 'RP_grad' },
  { label: 'LO_all', value: 'LO_all' },
  { label: 'LO_grad', value: 'LO_grad' },
  { label: 'RO_all', value: 'RO_all' },
  { label: 'RO_grad', value: 'RO_grad' },
  { label: 'LF_all', value: 'LF_all' },
  { label: 'LF_grad', value: 'LF_grad' },
  { label: 'RF_all', value: 'RF_all' },
  { label: 'RF_grad', value: 'RF_grad' },
]

// 导联组合列表
export const leadCombinationList = [
  { label: 'Longitudinal 1', value: 'Longitudinal 1' },
  { label: 'Longitudinal 2', value: 'Longitudinal 2' },
  { label: 'Longitudinal 3', value: 'Longitudinal 3' },
  { label: 'Transversal 1', value: 'Transversal 1' },
  { label: 'Transversal 2', value: 'Transversal 2' },
  { label: 'Temporal ring 1', value: 'Temporal ring 1' },
  { label: 'Temporal ring 3', value: 'Temporal ring 3' },
  { label: 'Referential 3', value: 'Referential 3' },
]


// 算法列表
export const locMethodList = [
  { label: 'Dipole fitting', value: 'dip' },
  { label: 'dSPM', value: 'dSPM' },
  { label: 'sLORETA', value: 'sLORETA' },
  { label: 'beamformer', value: 'beamformer' },
  { label: 'wMNE', value: 'wMNE' },
]

// 所有颜色，每组10个颜色[0,9]，gray13个颜色[0,12]  https://ant.design/docs/spec/colors-cn
export const allColorList = {
  red: ['#fff1f0', '#ffccc7', '#ffa39e', '#ff7875', '#ff4d4f', '#f5222d', '#cf1322', '#a8071a', '#820014', '#5c0011'],
  volcano: ['#fff2e8', '#ffd8bf', '#ffbb96', '#ff9c6e', '#ff7a45', '#fa541c', '#d4380d', '#ad2102', '#871400', '#610b00'],
  orange: ['#fff7e6', '#ffe7ba', '#ffd591', '#ffc069', '#ffa940', '#fa8c16', '#d46b08', '#ad4e00', '#873800', '#612500'],
  gold: ['#fffbe6', '#fff1b8', '#ffe58f', '#ffd666', '#ffc53d', '#faad14', '#d48806', '#ad6800', '#874d00', '#613400'],
  yellow: ['#feffe6', '#ffffb8', '#fffb8f', '#fff566', '#ffec3d', '#fadb14', '#d4b106', '#ad8b00', '#876800', '#614700'],
  lime: ['#fcffe6', '#f4ffb8', '#eaff8f', '#d3f261', '#bae637', '#a0d911', '#7cb305', '#5b8c00', '#3f6600', '#254000'],
  green: ['#f6ffed', '#d9f7be', '#b7eb8f', '#95de64', '#73d13d', '#52c41a', '#389e0d', '#237804', '#135200', '#092b00'],
  cyan: ['#e6fffb', '#b5f5ec', '#87e8de', '#5cdbd3', '#36cfc9', '#13c2c2', '#08979c', '#006d75', '#00474f', '#002329'],
  blue: ['#e6f4ff', '#baeBff', '#91caff', '#69b1ff', '#4096ff', '#1677ff', '#0958d9', '#003eb3', '#002c8c', '#001d66'],
  geekblue: ['#f0f5ff', '#d6e4ff', '#adc6ff', '#85a5ff', '#597ef7', '#2f54eb', '#1d39c4', '#10239e', '#061178', '#030852'],
  purple: ['#f9f0ff', '#efdbff', '#d3adf7', '#b37feb', '#9254de', '#722ed1', '#531dab', '#391085', '#22075e', '#120338'],
  magenta: ['#fff0f6', '#ffd6e7', '#ffadd2', '#ff85c0', '#f759ab', '#eb2f96', '#c41d7f', '#9e1068', '#780650', '#520339'],
  gray: ['#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9', '#bfbfbf', '#8c8c8c', '#595959', '#434343', '#262626', '#1f1f1f', '#141414', '#000000'],
}

// const { red, volcano, orange, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta, gray } = allColorList
const { red, orange, yellow, green, blue, purple } = allColorList

const bgColor = 5
const borderColor = 7
// 棘波类型列表
export const spikeTypeList = [
  { label: t('棘波'), value: 1, color: [red[bgColor], red[borderColor]] }, // 红
  { label: t('尖波'), value: 2, color: [orange[bgColor], orange[borderColor]] }, // 橙
  { label: t('棘慢波'), value: 3, color: [yellow[bgColor], yellow[borderColor]] }, // 黄
  { label: t('尖慢波'), value: 4, color: [green[bgColor], green[borderColor]] }, // 绿
  { label: t('多棘慢波'), value: 5, color: [blue[bgColor], blue[borderColor]] }, // 蓝
  { label: t('其他'), value: 6, color: [purple[bgColor], purple[borderColor]] }, // 紫
]


// 下面这些颜色值会用到 js代码里的lineStyle.color上，识别不了var(--color...)写法，只能用上面的写法
// const bgColor = 6
// const borderColor = 8

// // 棘波类型列表
// export const spikeTypeList = [
//   { label: '棘波', value: 1, color: [`var(--color-red-${bgColor})`, `var(--color-red-${borderColor})`] },         // 红
//   { label: '尖波', value: 2, color: [`var(--color-orange-${bgColor})`, `var(--color-orange-${borderColor})`] },   // 橙
//   { label: '棘慢波', value: 3, color: [`var(--color-yellow-${bgColor})`, `var(--color-yellow-${borderColor})`] }, // 黄
//   { label: '尖慢波', value: 4, color: [`var(--color-green-${bgColor})`, `var(--color-green-${borderColor})`] },   // 绿
//   { label: '多棘慢波', value: 5, color: [`var(--color-blue-${bgColor})`, `var(--color-blue-${borderColor})`] },   // 蓝
//   { label: '其他', value: 6, color: [`var(--color-gray-${bgColor})`, `var(--color-gray-${borderColor})`] },       // 灰
// ]


