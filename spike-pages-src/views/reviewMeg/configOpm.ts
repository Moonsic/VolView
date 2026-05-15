import * as huaxi from '@/store/opm/opmHuaxi.js'
import * as meg from '@/store/opm/opmMeg.js'

// 从 localStorage 获取当前配置，默认为 'opmMeg'
const opmConfig = localStorage.getItem('opmConfig') || 'opmMeg'

// 根据配置选择对应的模块
const currentConfig = opmConfig === 'opmHuaxi' ? huaxi : meg

// 导出所有变量（与两个原文件中的导出变量名一致）
export const allChannelListByName16 = currentConfig.allChannelListByName16
export const allChannelListByName = currentConfig.allChannelListByName
export const allChannelList = currentConfig.allChannelList
export const layoutPositionList = currentConfig.layoutPositionList

// 可选：导出整个配置对象
export const getConfig = () => currentConfig

export function getOpmConfig(megType: string) {
  switch (megType) {
    case 'opm64Meg':
      return meg
    case 'opm64Huaxi':
      return huaxi
    default:
      throw new Error(`未知的 opm 配置类型: ${megType}`)
  }
}