import { defineStore } from 'pinia'

// 布局弹窗，reviewMeg 页面用到，用于收集各种弹窗的布局数据
export const useCardStore = defineStore('card', {
  state: () => ({
    // 正在收集数据中
    isCollecting: false,
    // 当前选中的布局
    curLayoutData: {
      layoutInfo: null,
    },
    // 收集道到的布局信息
    layoutData: {
      butterfly: null,
      layoutModal: null,
      viewModal: null,
      allTimeModal: null,
      lineList: []
    },
  }),
  actions: {
    // 设置正在收集，会被页面监听，就会开始收集数据
    setIsCollecting(bool: boolean) {
      this.isCollecting = bool
    },
    setCurLayoutData(obj: any) {
      this.curLayoutData = obj
    },
    setButterflyData(cardRect: any) {
      this.layoutData.butterfly = cardRect
      // console.log('1 :>> ');
    },
    setLayoutModalData(cardRect: any) {
      this.layoutData.layoutModal = cardRect
      // console.log('2 :>> ');
    },
    setViewModalData(cardRect: any) {
      this.layoutData.viewModal = cardRect
      // console.log('3 :>> ');
    },
    setAllTimeModalData(cardRect: any) {
      this.layoutData.allTimeModal = cardRect
      // console.log('3 :>> ');
    },

    setLineData(lineList: any) {
      this.layoutData.lineList = lineList
      // console.log('4 :>> ');
      // console.log('2 :>> ', new Date().getTime());
    },

  },
})
