import { defineStore } from 'pinia'

// clusterList 页面用到，因为有文件夹和移动弹窗，复用数据
export const useClusterStore = defineStore('cluster', {
  state: () => ({
    folderList: []
  }),
  actions: {
    setFolderList(list: any[]) {
      this.folderList = list
    },
  },
})
