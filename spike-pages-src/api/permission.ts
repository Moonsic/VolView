import { get, post, baseUrl } from '@/api/axios/request'

// 权限操作相关接口（1条） - permission

// 1. 获取权限树
export const getTreeApi = (
  params: {}
) => get(`${baseUrl}/permission/getTree`, params)