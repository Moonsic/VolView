import { get, post, baseUrl } from '@/api/axios/request'

// 文件操作相关接口（5条） - file

// 1. 患者详情页面，获取文件列表
export const getFileListApi = (
  params: {
    foldName  ?: string  // 文件夹名称
    subjectId ?: string  // 患者id
    queryFileName ?: string  // 查询名称
  }
) => get(`${baseUrl}/file/getFileList`, params)

// 2. 下载文件
export const downloadFileApi = (
  params: {
    fileName : string  // 文件名称 【必填】
  }
) => get(`${baseUrl}/file/downloadFile`, params, 'blob') // 所有下载类的接口都要加'blob'，否则下载下来的文件有问题！

// 3. 删除文件或者文件夹
export const deleteFileApi = (
  params: {
    filePath   : string  // 需要删除的文件或文件夹路径 【必填】
    subjectId ?: string  // 患者id
  }
) => get(`${baseUrl}/file/deleteFile`, params)

// 4. 上传文件
export const uploadFilesApi = (
  params: {
    files     : string[]  // 文件 【必填】
    subjectId : string  // 患者id 【必填】
    filePath  : string  // 文件所在路径 【必填】
  }
) => post(`${baseUrl}/file/uploadFiles`, params, 'formData')

// 5. 压缩打包下载文件夹里面的所有文件
export const downloadFilesApi = (
  params: {
    foldName : string  // 文件夹名称 【必填】
  }
) => get(`${baseUrl}/file/downloadFiles`, params, 'blob') // 所有下载类的接口都要加'blob'，否则下载下来的文件有问题！