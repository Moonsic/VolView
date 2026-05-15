import { get, post, baseUrl } from '@/api/axios/request'

// 分片上传相关接口（7条） - fileChunk

// 1. 获取文件上传分片Index
export const getFileUploadChunkIndexApi = (
  params: {
    filePath : string  // 文件路径（含文件名）,例如 meg 是 sub01/meg/xx.fif, eeg是 sub-01/eeg/xx.edf
    fileMd5  : string  // 对文件内容进行MD5，与文件名无关
  }
) => get(`${baseUrl}/fileChunk/getFileUploadChunkIndex`, params)

// 2. 第一次上传文件（没用了）
export const firstUploadApi = (
  params: {
    filePath  : string  // 文件路径（含文件名）
    fileName  : string  // 文件名
    fileMd5   : string  // 对文件内容进行MD5，与文件名无关
    chunkNum  : number  // 当前文件总共被分为多少片
    chunk     : File    // 文件
    fileType ?: number  // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
  }
) => post(`${baseUrl}/fileChunk/firstUpload`, params, 'formData')

// 3. 其他上传（没用了）
export const otherUploadApi = (
  params: {
    filePath   : string  // 文件路径（含文件名）
    fileMd5    : string  // 对文件内容进行MD5，与文件名无关
    chunkIndex : number  // 当前上传的是第几个文件分片（从2开始）
    chunk      : File    // 文件
  }
) => post(`${baseUrl}/fileChunk/otherUpload`, params, 'formData')

// 4. 合并文件
export const mergeFileApi = (
  params: {
    filePath : string  // 文件路径（含文件名）
    fileMd5  : string  // 对文件内容进行MD5，与文件名无关
  }
) => post(`${baseUrl}/fileChunk/mergeFile`, params, 'form')

// 5. 获取未上传完成的文件列表
export const getUploadingFileListApi = (
  params: {
  }
) => get(`${baseUrl}/fileChunk/getUploadingFileList`, params)

// 6. 删除未上传完成的文件
export const deleteUploadingFileApi = (
  params: {
    filePath : string  // 文件路径（含文件名）
    fileMd5  : string  // 对文件内容进行MD5，与文件名无关
  }
) => post(`${baseUrl}/fileChunk/deleteUploadingFile`, params, 'formData')

// 7. 上传文件
export const chunkUploadApi = (
  params: {
    filePath   : string   // 文件路径（含文件名）
    fileName   : string   // 文件名
    fileMd5    : string   // 对文件内容进行MD5，与文件名无关
    fileType   : number   // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
    chunkIndex : number   // 当前上传的是第几个文件分片(从1开始)
    chunkNum   : number   // 当前文件总共被分为多少片
    chunk      : File     // 文件
  }
) => post(`${baseUrl}/fileChunk/chunkUpload`, params, 'formData')
