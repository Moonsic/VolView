import { get, post, baseUrl } from '@/api/axios/request'

// 角色管理相关接口（6条） - role

// 1. 添加角色
export const addApi = (
  params: {
    id              ?: string  // 角色id
    roleName        ?: string  // 角色名称
    createTime      ?: string  // 角色创建时间
    permissionCodes ?: string  // 角色权限码
    createTimeStr   ?: string  // role创建时间
  }
) => post(`${baseUrl}/role/add`, params)

// 2. 设置角色的权限
export const rolePermissionSetApi = (
  params: {
    roleId             ?: string  // 角色id
    checkedPermissions ?: string  // 权限码集合，用逗号隔开
  }
) => post(`${baseUrl}/role/rolePermissionSet`, params)

// 3. 根据角色id查询角色相关信息
export const getRoleInfoByIdApi = (
  params: {
    roleId : string  // 角色id 【必填】
  }
) => get(`${baseUrl}/role/getRoleInfoById`, params)

// 4. 编辑角色
export const editApi = (
  params: {
    id              ?: string  // 角色id
    roleName        ?: string  // 角色名称
    createTime      ?: string  // 角色创建时间
    permissionCodes ?: string  // 角色权限码
    createTimeStr   ?: string  // role创建时间
  }
) => post(`${baseUrl}/role/edit`, params)

// 5. 删除角色
export const deleteApi = (
  params: {
    roleId : string  // 角色id 【必填】
  }
) => get(`${baseUrl}/role/delete`, params)

// 6. 查询角色列表
export const listApi = (
  params: {
    pageNum    ?: number  // -
    pageSize   ?: number  // -
    orderField ?: number  // -
    sortType   ?: number  // -
  }
) => post(`${baseUrl}/role/list`, params)