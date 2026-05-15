import { get, baseUrl } from '@/api/axios/request'

// 数据总览相关接口（1条） - statistics

// 1. 查询数据总览列表
export const indexPageApi = (
  params: {}
) => get(`${baseUrl}/data/indexPage`, params)


// 1. 查询数据总览列表
export const pipelineStatApi = (
  params: {}
) => get(`${baseUrl}/data/pipelineStat`, params)
