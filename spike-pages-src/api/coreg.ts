import { get, post, baseUrl } from '@/api/axios/request'

// 共注册相关接口（7条） - coreg

// 1. 获取文件上传分片Index
export const getCoregResultApi = (
  params: {
    megId    : string  // megId
  }
) => get(`${baseUrl}/coreg/getCoregResult`, params)

// 2. 发起共注册
export const startCoregApi = (
  params: {
    megId        : string  // megId
    t1FilePath   : string  // t1文件路径
    t2FilePath  ?: string  // t2文件路径
    petFilePath ?: string  // pet文件路径
    ctFilePath  ?: string  // ct文件路径
  }
) => post(`${baseUrl}/coreg/startCoreg`, params)
