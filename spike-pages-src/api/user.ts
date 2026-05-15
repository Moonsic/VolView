import { get, post, baseUrl } from '@/api/axios/request'

// 用户管理相关接口（8条） - user

// 1. 查询用户列表
export const listApi = (
  params: {
    pageNum    ?: number  // -
    pageSize   ?: number  // -
    orderField ?: number  // -
    sortType   ?: number  // -
  }
) => post(`${baseUrl}/user/list`, params)

// 2. 登录
export const loginApi = (
  params: {
    account  : string  // 用户登录账号 【必填】
    password : string  // 用户登录密码 【必填】
  }
) => post(`${baseUrl}/user/login`, params, 'form')

// 3. 编辑用户
export const editApi = (
  params: {
    id          ?: string  // 用户id
    account     ?: string  // 用户登录账号
    passwordMD5 ?: string  // 用户登录密码，经过MD5处理
    name        ?: string  // 用户姓名
    gender      ?: string  // 用户性别
    roleId      ?: string  // 角色id
  }
) => post(`${baseUrl}/user/edit`, params)

// 4. 添加用户
export const addApi = (
  params: {
    id          ?: string  // 用户id
    account     ?: string  // 用户登录账号
    passwordMD5 ?: string  // 用户登录密码，经过MD5处理
    name        ?: string  // 用户姓名
    gender      ?: string  // 用户性别
    roleId      ?: string  // 角色id
  }
) => post(`${baseUrl}/user/add`, params)

// 5. 根据用户id查询用户信息
export const getUserInfoApi = (
  params: {
    userId : string  // 用户id 【必填】
  }
) => get(`${baseUrl}/user/getUserInfo`, params)

// 6. 根据用户id删除用户
export const deleteApi = (
  params: {
    userId : string  // 用户id 【必填】
  }
) => get(`${baseUrl}/user/delete`, params)

// 7. 获取设置，返回用户页面设置，直接将保存的JSON串返回了
export const getWebPageSetApi = (
  params: {
    userId : string  // 用户id 【必填】
  }
) => get(`${baseUrl}/user/getWebPageSet`, params)

// 8. 修改设置，保存或者更新页面设置，将所有设置打包成JSON串
export const updateWebPageSetApi = (
  params: {
    userId : string  // 用户id 【必填】
  }
) => post(`${baseUrl}/user/updateWebPageSet`, params)

