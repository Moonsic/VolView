import { get, post } from './axios/request'

// mock 模块
const baseUrl = '/mock'

// 分页查询
export const pageApi = (params:{}) => get(`${baseUrl}/pageApi`, params)
// 根据ID查询详情
export const detailApi = (params:{}) => get(`${baseUrl}/detailApi`, params)
// 新增
export const addApi = (params:{}) => post(`${baseUrl}/addApi`, params)
// 修改
export const editApi = (params:{}) => post(`${baseUrl}/editApi`, params)
// 删除
export const deleteApi = (params:{}) => post(`${baseUrl}/deleteApi`, params)
// 启动
export const startApi = (params:{}) => post(`${baseUrl}/startApi`, params)
// 停止
export const stopApi = (params:{}) => post(`${baseUrl}/stopApi`, params)
// 重复名称校验
export const checkNameApi = (params:{}) => get(`${baseUrl}/checkNameApi`, params)
// 获取下拉框列表
export const getSelectListApi = (params:{}) => get(`${baseUrl}/getSelectListApi`, params)
// 获取树
export const getTreeApi = (params:{}) => get(`${baseUrl}/getTreeApi`, params)
// 获取可展开树表格
export const getTableTreeApi = (params:{}) => get(`${baseUrl}/getTableTreeApi`, params)
// 获取所有数据
export const listApi = (params:{}) => get(`${baseUrl}/listApi`, params)
// 导入
export const importApi = (params:{}) => post(`${baseUrl}/importApi`, params)
// 发布
export const publishApi = (params:{}) => post(`${baseUrl}/importApi`, params)