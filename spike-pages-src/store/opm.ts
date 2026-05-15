import { defineStore } from 'pinia'

import * as configMegin from './opm/megin'
import * as opmMeg from './opm/opmMeg'
import * as opmHuaxi from './opm/opmHuaxi'
import * as opmSanbo from './opm/opmSanbo'

// 从 localStorage 获取初始配置
// const local_opmConfig = localStorage.getItem('opmConfig') || 'opmMeg'

// 定义 megType 的联合类型
type MegType = 'megin' | 'opm64_meg_prefix' | 'opm64' | 'opm96'

export const useOpmStore = defineStore('opm', {
  state: () => ({
    // opmConfig: local_opmConfig as 'opmMeg' | 'opmHuaxi' | 'opmSanbo' , // 明确类型
    // 当前患者的 megType，可在切换患者时更新
    currentPatientMegType: 'megin' as MegType, // 默认值
  }),
  getters: {
    // 根据当前患者 megType 返回对应的配置对象
    currentOpmConfig(): typeof opmMeg | typeof opmHuaxi | typeof opmSanbo | typeof configMegin {
      switch (this.currentPatientMegType) {
        case 'opm64_meg_prefix':
          return opmMeg
        case 'opm64':
          return opmHuaxi
        case 'opm96':
          return opmSanbo
        case 'megin':
          return configMegin
        default:
          return configMegin
          // throw new Error(`未知的 megType: ${state.currentPatientMegType}`)
      }
    },
    // 后续 getter 改为普通函数，通过 this 访问 currentOpmConfig
    allChannelList(): string[] {
      return this.currentOpmConfig.allChannelList
    },
    allChannelListByName(): Record<string, string[]> {
      return this.currentOpmConfig.allChannelListByName
    },
    allChannelListByName16(): Record<string, string[]> {
      return this.currentOpmConfig.allChannelListByName16
    },
    layoutPositionList(): Array<{ [key: string]: string | number }> {
      return this.currentOpmConfig.layoutPositionList;
    },
  },
  actions: {
    setCurrentPatientMegType(type: MegType) {
      this.currentPatientMegType = type
    },
  },
})