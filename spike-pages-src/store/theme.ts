import { defineStore } from 'pinia'

// 提取出来的独立DOM操作函数
const updateDOMThemeClass = (mode: string) => {
  const htmlElement = document.documentElement
  if (mode === 'dark') {
    htmlElement.classList.add('dark')
    htmlElement.classList.remove('eyecare')
  } else if (mode === 'eyecare') {
    htmlElement.classList.add('eyecare')
    htmlElement.classList.remove('dark')
  } else {
    htmlElement.classList.remove('dark')
    htmlElement.classList.remove('eyecare')
  }
}

// 提取出来的独立DOM操作函数
const updateDOMChartThemeClass = (mode: string) => {
  const htmlElement = document.body
  if (mode === 'dark') {
    htmlElement.classList.add('chart-dark')
    htmlElement.classList.remove('chart-eyecare')
  } else if (mode === 'eyecare') {
    htmlElement.classList.add('chart-eyecare')
    htmlElement.classList.remove('chart-dark')
  } else {
    htmlElement.classList.remove('chart-dark')
    htmlElement.classList.remove('chart-eyecare')
  }
}


export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: '', // 主题 light/dark/eyecare
    chartTheme: '', // 图表主题 light/dark/eyecare
    isScrollTop: false, // 是否导航栏滚上去了
  }),
  getters: {
    isDarkMode: (state) => state.theme === 'dark',// 是否为暗黑模式，true/false
  },
  actions: {
    initTheme() {
      const theme = localStorage.getItem('theme')
      this.theme = theme || 'light'
      this.updateDOMTheme(theme)
    },
    initChartTheme() {
      const chartTheme = localStorage.getItem('chartTheme')
      this.chartTheme = chartTheme || 'light'
      this.updateDOMChartTheme(chartTheme)
    },
    switchTheme(value: string) {
      this.theme = value
      localStorage.setItem('theme', value)
      this.updateDOMTheme(value)
    },
    switchChartTheme(value: string) {
      this.chartTheme = value
      localStorage.setItem('chartTheme', value)
      this.updateDOMChartTheme(value)
    },
    updateDOMTheme(mode: string) {
      updateDOMThemeClass(mode)
    },
    updateDOMChartTheme(mode: string) {
      updateDOMChartThemeClass(mode)
    },
    setIsScrollTop(value: boolean) {
      this.isScrollTop = value
    },


  },
})