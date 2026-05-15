import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import SparkMD5 from 'spark-md5'

import {
  getFileUploadChunkIndexApi, // 1. 获取文件上传分片Index
  mergeFileApi,   // 4. 合并文件
  chunkUploadApi, // 6. 上传文件
} from '@/api/fileChunk'

import {
  dealSubImageZipApi, // 16. 处理上传患者zip
  startFsprepApi,    // 13. 开始对结构像进行预处理
  dealSubjectFoldApi, // 28. 目录所有文件上传完成后调用这个接口，对目录进行处理
} from '@/api/sl'


import {
  transformDicomToNiiApi    // 24. 将Dicom转化为nii格式
} from '@/api/meg'


// 上传，用于@c/components.vue和各上传按钮
export const useUploadStore = defineStore('upload', {
  state: () => ({
    showUploadPopover: false, // 主动打开上传列表弹窗
    uploadingList: [],    // 正在上传的文件列表
    lastUploadedFile: {}, // 最新上传成功的一个文件，用于被页面监听，上传成功后刷新页面列表。用了5处地方
    curUploadingDirectoryList: [],
    curUploadingDirectoryName: '',
  }),
  actions: {
    async getFileMd5(obj: any): Promise<string> {
      const chunks = obj.chunkList.length  // 计算需要多少个分块
      const spark = new SparkMD5.ArrayBuffer()
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        const loadNext = (index: number) => {

          let target = null
          // 如果切片长度大于4，才显示进度条，小于4，结果出来太快了，根本没必要显示进度条
          if (obj.chunkList.length > 4) {
            target = this.uploadingList.find(item => item.filePath === obj.filePath)
            target.md5Pro = (index / chunks * 100).toFixed(0) + '%'
          }

          if (index === chunks) {
            if (obj.chunkList.length > 4) {
              setTimeout(() => {
                target.md5Pro = null
              }, 500)
            }
            // 所有块处理完成，获取最终MD5
            const md5Result = spark.end()
            resolve(md5Result)
            return
          }
          fileReader.readAsArrayBuffer(obj.chunkList[index])
          fileReader.onload = (event) => {
            spark.append(event.target.result as ArrayBuffer)
            // 递归加载下一块
            loadNext(index + 1)
          }
          fileReader.onerror = reject
        }
        loadNext(0)
      })
    },

    // 获取文件MD5
    async getFileMd5Simple(file: File) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)
        fileReader.onload = (event) => {
          const spark = new SparkMD5.ArrayBuffer()
          spark.append(event.target.result as ArrayBuffer)
          const md5Result = spark.end()
          resolve(md5Result)
        }
        fileReader.onerror = reject
      })
    },

    // 添加一个新的上传文件
    async addUploadingList(obj: IAnyObject) {
      if (obj.file.size === 0) {
        return message.error(`【${obj.fileName}】文件大小为0，不能上传`)
      }

      this.showUploadPopover = true // 有数据了就先打开弹窗，再去做其他判断

      if (obj.fileType === 6) {
        const directoryName = obj.filePath.split('/')[0]
        // 如果还没有文件夹名字，就赋值，就第一个文件会赋值
        if (!this.curUploadingDirectoryName) {
          this.curUploadingDirectoryName = directoryName
        }
        // 之后的文件会匹配是否也是这个文件夹，是的话就是同一个患者的，不是的话，说明同时上传了第二个患者
        if (this.curUploadingDirectoryName === directoryName) {
          this.curUploadingDirectoryList.push({
            fileName: obj.fileName,
            fileType: obj.fileType,
            filePath: obj.filePath,
            status: 'pending', // 'pending' | 'success' | 'failed'
          })
        } else {
          message.info(`请等待当前患者上传完成再上传其他患者`)
          return
        }
      } else {
        const hasSameFile = this.uploadingList.filter(f => f.filePath === obj.filePath)
        if (hasSameFile.length) {
          message.info(`【${obj.fileName}】正在上传中`)
          return
        }
      }

      // 分片的步骤，文件再大也很快。
      let chunkList: File[] = []         // 分片列表
      // 创建切片
      const size = 1024 * 1024 * 50 // 50MB 切片大小
      for (let index = 0; index < obj.file.size; index += size) {
        chunkList.push(obj.file.slice(index, index + size))
      }
      obj.chunkList = chunkList       // 分片列表
      obj.chunkNum = chunkList.length // 分片数量
      obj.progress = 1                // 进度
      obj.md5Pro = null                // md5验证进度
      obj.status = 'md5'               // 状态 'md5','uploading','success'

      this.uploadingList.unshift(obj)

      // console.log('obj :>> ', obj);

      // 这一步大的文件太慢了，需要很久
      // const md5 = await this.getFileMd5(obj)

      // 直接获取文件名称的md5
      // const md5 = await SparkMD5.hash(obj.fileName)

      // 只对分片列表中的第一个分片做md5
      const md5 = await this.getFileMd5Simple(obj.chunkList[0])

      // console.log('md5 :>> ', md5)

      obj.fileMd5 = md5                // 当前文件的Md5
      obj.status = 'uploading'

      this.getFileUploadChunkIndex(obj)
    },

    // 2. 获取文件上传分片Index
    async getFileUploadChunkIndex(obj: IAnyObject) {
      const params = {
        filePath: obj.filePath,  // 文件路径（含文件名）
        fileMd5: obj.fileMd5,    // 对文件内容进行MD5，与文件名无关
      }
      const { code, data } = await getFileUploadChunkIndexApi(params)
      if (code === 200) {
        // uploadStatus： -1 没上传，0 上传一部分 1 上传成功已存在

        // -1: 表示还没有上传, 不存在相同的文件，所以是第一次上传
        if (data.uploadStatus === -1) {
          this.chunkUpload(obj, 1)
        }

        // 1: 存在完全相同的文件，直接返回上传成功（秒传）
        if (data.uploadStatus === 1) {
          this.finishedUpload(obj)
        }

        // 0: 上传一部分，但没有完成上传，服务端返回上传到第几个分片，前端继续上传剩余的分片
        if (data.uploadStatus === 0) {
          // 如果数量相等，也说明上传完成了，但还没合并，所以现在合并
          if (data.chunkIndex === obj.chunkNum) {
            this.mergeFile(obj)
          } else {
            this.chunkUpload(obj, data.chunkIndex + 1)
          }
        }

      }
    },

    // 1. 上传文件, index从1开始
    async chunkUpload(obj: IAnyObject, index: number) {
      if (index > 1) {
        const target = this.uploadingList.find(item => item.filePath === obj.filePath)
        target.progress = parseFloat(((index - 1) / obj.chunkNum * 100).toFixed(0))
      }

      const params: any = new FormData()
      params.append('filePath', obj.filePath)    // 文件路径（含文件名）
      params.append('fileName', obj.fileName)    // 文件名
      params.append('fileMd5', obj.fileMd5)      // 对文件内容进行MD5，与文件名无关
      params.append('fileType', obj.fileType)    //  1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件

      params.append('chunkNum', obj.chunkNum)    // 当前文件总共被分为多少片
      params.append('chunkIndex', index)         // 当前分片文件index
      params.append('chunk', obj.chunkList[index - 1])  // 当前分片文件

      const { code } = await chunkUploadApi(params)
      if (code === 200) {
        // 如果到最后一个了，就合并文件，否则上传下一个
        if (index < obj.chunkNum) {
          this.chunkUpload(obj, index + 1)
        } else {
          this.mergeFile(obj)
        }
      } else {
        console.log('上传文件失败 :>> ', obj);
        // 会出现400001报错："文件已经上传"，此时要清空当前上传
        // 会出现400002报错："用户没有上传过该文件，请重新上传"，此时要清空当前上传
        this.clearFile(obj)
      }
    },

    // 合并切片
    async mergeFile(obj: IAnyObject) {
      // console.log('mergeFile :>> ', obj);
      const target = this.uploadingList.find(item => item.filePath === obj.filePath)
      target.progress = 99

      const params = {
        filePath: obj.filePath,  // 文件路径（含文件名）
        fileMd5: obj.fileMd5,      // 对文件内容进行MD5，与文件名无关
      }
      const { code } = await mergeFileApi(params)
      if (code === 200) {
        this.finishedUpload(obj)
      } else {
        console.log('合并切片失败 :>> ', obj);

        if (obj.fileType === 6) {
          // 为了避免名称重复，所以用filePath
          const target = this.curUploadingDirectoryList.find(item => item.filePath === obj.filePath)
          if (target) {
            target.finished = true
            target.status = 'failed'
          }
        }
        this.clearFile(obj)
      }
    },

    // 完成上传
    async finishedUpload(obj: IAnyObject) {
      // console.log('完成上传 :>> ',obj);

      // 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
      if (obj.fileType === 1) {
        // message.success(`【${obj.fileName}】上传成功，正在对脑磁图进行滤波处理`)
        const code = await this.dealSubImageZip(obj)
        // 如果失败，则清空当前上传
        if (code !== 200) {
          this.clearFile(obj)
          return
        }
      }
      if (obj.fileType === 2) {
        this.transformDicomToNii(obj)
      }
      // NIFTI文件上传后并且不是共注册页面的3个上传，才需要马上预处理
      if (obj.fileType === 3 && !obj.isFromCoreg) {
        this.startFsprep(obj)
      }


      obj.status = 'success'
      message.success(`【${obj.fileName}】上传成功`)
      const target = this.uploadingList.find(item => item.filePath === obj.filePath)
      target.progress = 100

      // 赋值后，页面会监听到lastUploadedFile，然后刷新页面列表
      this.lastUploadedFile = {
        fileMd5: obj.fileMd5,
        fileName: obj.fileName,
        filePath: obj.filePath,
        fileType: obj.fileType, // 目前只用到fileType，1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
      }

      if (obj.fileType === 6) {
        // 为了避免名称重复，所以用filePath
        const target = this.curUploadingDirectoryList.find(item => item.filePath === obj.filePath)
        if (target) {
          target.finished = true
          target.status = 'success'
        }
        if (this.curUploadingDirectoryList.every(item => item.status === 'success' || item.status === 'failed')) {
          message.success('文件夹上传完成')
          console.log('文件夹上传完成')
          // 不管是否全部完成，都要处理文件夹
          this.lastUploadedFile.allFinished = true
          this.dealSubjectFold(obj)
        } else {
          // console.log('this.curUploadingDirectoryList2 :>> ', this.curUploadingDirectoryList);
          // console.log('文件夹未完全上传成功2')
        }
      }

      this.clearFile(obj)
    },

    // 清空文件
    clearFile(obj: IAnyObject) {
      setTimeout(() => {
        this.uploadingList = this.uploadingList.filter((item: any) => item.filePath !== obj.filePath)

        // 没有数据了就关闭弹窗
        if (this.uploadingList.length === 0) {
          setTimeout(() => {
            this.showUploadPopover = false
          }, 800)
        }
      }, 2000)
    },

    // 处理上传患者zip
    async dealSubImageZip(obj: IAnyObject): Promise<any> {
      return new Promise<number>(async (resolve, reject) => {
        const params = {
          zipName: obj.fileName,  // 文件路径
        }
        const { code } = await dealSubImageZipApi(params)
        resolve(code)
      })
    },

    // 将Dicom转化为NIFTI格式
    async transformDicomToNii(obj: IAnyObject) {
      const params = {
        dicomFilePath: obj.filePath,  // 文件路径
      }
      const { code } = await transformDicomToNiiApi(params)
      if (code === 200) {
        message.success('转化为Nifti格式成功')
      }
    },

    // NIFTI文件上传后需要马上预处理，这个会成功提示：成功发起预处理任务
    async startFsprep(obj: IAnyObject) {
      const params = {
        filePath: obj.filePath,  // 文件路径
        subjectId: obj.subjectId,
      }
      const { code, msg } = await startFsprepApi(params)
      if (code === 200) {
        message.success(msg)
      }
    },

    async dealSubjectFold(obj: IAnyObject) {
      const params = {
        foldName: obj.filePath.split('/')[0],  // 文件路径
      }
      const { code, msg } = await dealSubjectFoldApi(params)
      this.curUploadingDirectoryList = []
      this.curUploadingDirectoryName = ''
      if (code === 200) {
        message.success(msg)
      }
    },

  },
})

