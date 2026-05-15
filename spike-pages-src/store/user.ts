import { defineStore } from 'pinia'

import {
  getWebPageSetApi, // 7. 获取设置
  updateWebPageSetApi,   // 8. 修改设置
} from '@/api/user'

// 先从localstorage里取语言，没有就用默认的中文
const local_language = localStorage.getItem('language') || 'zh-CN'

// 暂时没用到，用户信息都存在localstorage里了
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: '',
      userName: '',
    },
    versionType: 'doctor', // 'doctor': 医生版 'engineer': 工程师版
    flowchartLayout: 'horizontal', // 'horizontal': 水平布局, 'vertical': 垂直布局
    language: local_language, // 'zh-CN': 中文, 'en-US': 英文
  }),
  getters: {
    userName(state) {
      return state.userInfo.userName
    },
  },
  actions: {
    setUserName(text: string) {
      this.userInfo.userName = text
    },
    setLanguage(text: string) {
      this.language = text
    },
    async getWebPageSet() {
      const params = {
        userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id  // 用户id 【必填】
      }
      const { code, data } = await getWebPageSetApi(params)
      if (code === 200) {
        this.versionType = data?.versionType || 'doctor'
        this.flowchartLayout = data?.flowchartLayout || 'horizontal'

        // this.language = data?.language || 'zh-CN'
        // localStorage.setItem('language', this.language)
        // window.location.reload()
      }
    },

    async updateWebPageSet(obj: IAnyObject) {
      const params = {
        userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id  // 用户id 【必填】
        ...obj,
      }
      const { code } = await updateWebPageSetApi(params)
      // if (code === 200) {
      //   // console.log('state :>> ', this.versionType);
      // }
    },
  },
})