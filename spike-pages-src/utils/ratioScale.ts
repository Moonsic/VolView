// 封装 calcUp / calcDown，供多页面复用

// utils/ratioStep.ts
export type Direction = 'up' | 'down'

export function setRatioStep(value: number, direction: Direction): number {
  if (direction === 'up') {
    if (value < 50) return 10
    if (value < 500) return 50
    if (value < 1000) return 100
    if (value < 2000) return 200
    if (value < 4000) return 500
    if (value < 6000) return 1000
    return 2000
  } else {
    // down
    if (value <= 50) return 10
    if (value <= 500) return 50
    if (value <= 1000) return 100
    if (value <= 2000) return 200
    if (value <= 4000) return 500
    if (value <= 6000) return 1000
    return 2000
  }
}

// 计算比例尺数值变大
export function calcUp(value: number) {
  if (value === 1) return 10
  if (value < 50) return value + 10
  if (value < 500) return value + 50
  if (value < 1000) return value + 100
  if (value < 2000) return value + 200
  if (value < 4000) return value + 500
  if (value < 6000) return value + 1000
  return value + 2000
}

// 计算比例尺数值变小
export function calcDown(value: number) {
  if (value <= 50) return Math.max(1, value - 10)
  if (value < 500) return value - 50
  if (value <= 1000) return value - 100
  if (value <= 2000) return value - 200
  if (value <= 4000) return value - 500
  if (value <= 6000) return value - 1000
  return value - 2000
}


// EEG 有一点不一样
export function setRatioStepEeg(value: number, direction: Direction): number {
  if (direction === 'up') {
    if (value < 200) return 20
    if (value < 500) return 50
    if (value < 1000) return 100
    if (value < 2000) return 200
    if (value < 4000) return 500
    if (value < 6000) return 1000
    return 2000
  } else {
    // down
    if (value <= 200) return 20
    if (value <= 500) return 50
    if (value <= 1000) return 100
    if (value <= 2000) return 200
    if (value <= 4000) return 500
    if (value <= 6000) return 1000
    return 2000
  }
}

// 计算比例尺数值变大
export function calcUpEeg(value: number) {
  if (value === 1) return 20
  if (value < 200) return value + 20
  if (value < 500) return value + 50
  if (value < 1000) return value + 100
  if (value < 2000) return value + 200
  if (value < 4000) return value + 500
  if (value < 6000) return value + 1000
  return value + 2000
}

// 计算比例尺数值变小
export function calcDownEeg(value: number) {
  if (value <= 200) return Math.max(1, value - 20)
  if (value < 500) return value - 50
  if (value <= 1000) return value - 100
  if (value <= 2000) return value - 200
  if (value <= 4000) return value - 500
  if (value <= 6000) return value - 1000
  return value - 2000
}