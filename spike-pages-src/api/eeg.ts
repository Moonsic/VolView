import { get, post, deleteItem, baseUrl } from '@/api/axios/request'

// 脑电图相关接口（9条） - eeg

// 1. 查折线图
export const eegApi = (
  params: {
  }
) => post(`${baseUrl}/eeg/getEegDataJson`, params)

// 2. 患者数据列表，不分页。foldName 是 eegId/eeg
export const getEegFileListApi = (
  params: {
    foldName : string
  }
) => get(`${baseUrl}/eeg/getEegFileList`, params)

// 3. 添加或者修改手动标注的棘波，修改的时候，也需要传入所有字段的信息√
export const addOrUpdateManualSpikeApi = (
  params: {
    id       ?: string|null // 用户id
    filePath  : string  // 用户id
    startTime : string //棘波开始时间, 以字符串形式传递
    endTime  ?: string|null //棘波结束时间。当选择一个时间段的时候，才会有endTime。 以字符串形式传递
    brainArea : string //脑区
    channels  : string //当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
    spikeType : number //棘波类型
  }
) => post(`${baseUrl}/eeg/addSpike`, params)

// 4. 获取手动标注棘波的列表
export const getManualSpikeListApi = (
  params: {
    filePath : string
    pageSize : number
    pageNum  : number
  }
) => post(`${baseUrl}/eeg/getManualSpikeList`, params)

// 5. 获取某一段时间范围内的所有手工标注棘波
export const timeIntervalManualSpikeApi = (
  params: {
    filePath  : string
    startTime : string
    endTime   : string
  }
) => post(`${baseUrl}/eeg/timeIntervalManualSpike`, params, 'form')

// 6. 删除手动标记的棘波
export const deleteManualSpikeApi = (
  params: {
    id : string  // id 【必填】
  }
) => deleteItem(`${baseUrl}/eeg/deleteManualSpike/${params.id}`)

// 7. 获取脑电图文件的通道列表
export const getEegFileChsApi = (
  params: {
    filePath : string
  }
) => get(`${baseUrl}/eeg/getEegFileChs`, params)

// 8. 发起EEG棘波检测
export const startEegDetectApi = (
  params: {
    filePath  : string
    subjectId : string
    thr       : string // 阈值
  }
) => get(`${baseUrl}/eeg/startEegDetect`, params)

// 9. 查询eeg算法棘波检列表
export const getSpikeListApi = (
  params: {
    filePath : string
    pageSize : number
    pageNum  : number
    thr      : string // 阈值
  }
) => post(`${baseUrl}/eeg/getSpikeList`, params)