import { get, post, baseUrl } from '@/api/axios/request'

// 溯源定位相关接口（17条） - sl

// 1. 获取配准结果列表
export const getCoregResultListApi = (
  params: {
    megId       ?: string
    fifFilePath ?: string // 脑磁图文件路径，形如 sub-01/meg/xxx.fif
    niiFilePath ?: string // fif文件路径，形如 sub-01/anat/xxx.nii
  }
) => get(`${baseUrl}/sl/getCoregResultList`, params)

// 2. 获取结构像文件列表
export const getNiiFileListApi = (
  params: {
    foldName : string // 要查询的目录名称，形如 sub-01/anat
  }
) => get(`${baseUrl}/sl/getNiiFileList`, params)

// 3. 获取结构像的2D图像
export const getNiiFileStreamApi = (
  params: {
    filePath  : string  // nifti文件路径，形如 sub-01/anat/xxx.nii
    mgz       : number  // 0:nii, 1:mgz
  }
) => get(`${baseUrl}/sl/getNiiFileStream`, params)  // 新的写法
// ) => get(`${baseUrl}/sl/getNiiFileStream`, params,  'blob') // 旧的写法： 所有下载类的接口都要加'blob'，否则下载下来的文件有问题！


// 4. 获取定位结果列表
export const getSourceLocationResultListApi = (
  params: {
    coregId   : string // 选择的配准结果的id
    subjectId : string //
  }
) => get(`${baseUrl}/sl/getSourceLocationResultList`, params)

// 5. 点击配准按钮
export const startCoregApi = (
  params: {
    niiFilePath : string // 结构像文件路径，形如 sub-01/anat/xx.nii
    fifFilePath : string // 脑磁图文件路径，形如 sub-01/meg/xxx.fif
  }
) => post(`${baseUrl}/sl/startCoreg`, params)

// 6. 开始进行溯源定位
export const startSourceLocationApi = (
  params: {
    coregId        : string   // 选择的配准结果的id
    clusterTaskId  : string   // 聚类任务id
    classList      : string[] // 涉及的分类列表
    timePointList? : string   // 棘波时刻点，当在脑磁图界面进行溯源定位的时候使用
  }
) => post(`${baseUrl}/sl/startSourceLocation`, params)

// 7. 开始前向任务
export const startFwdApi = (
  params: {
    coregId : string // 选择的配准结果的id
  }
) => get(`${baseUrl}/sl/startFwd`, params)

// 8. 快捷溯源定位
export const quickSlApi = (
  params: {
    fifFilePath    : string
    coregId        : string   // 选择的配准结果的id
    timePointList  : string[] // 棘波时刻点，当在脑磁图界面进行溯源定位的时候使用
    returnCoord    : number   // 1 返回坐标（不需要返回图片）， 2 返回溯源定位图片
  }
) => post(`${baseUrl}/sl/quickSl`, params)

// 9. 获取配准结果图片html，现在没用了
export const getCoregPicApi = (
  params: {
    coregId        : string   // 选择的配准结果的id
  }
) => get(`${baseUrl}/sl/getCoregPic`, params)

// 10. 获取配准结果3d展示数据
export const getCoreg3DDataApi = (
  params: {
    coregId       : string  // 选择的配准结果的id
    headType     ?: string  // 传'volume'或者'surface'（默认值），分别可以获取到：头模型是mri volume数据，点是voxel坐标系下的坐标值；头模型是surface 网格数据，点是mri坐标系下的坐标值。
    simplifyPerc ?: number  // 表示对三角形网格数量的压缩百分比，值越大，压缩越多。默认值0.99，此时数量级是几千。值为0时表示不压缩。
  }
) => get(`${baseUrl}/sl/getCoreg3DData`, params)

// 11. 提交偏移量
export const saveManualCoregResultApi = (
  params: {
    coregId : string  // 选择的配准结果的id
    offsetX : number
    offsetY : number
    offsetZ : number
  }
) => post(`${baseUrl}/sl/saveManualCoregResult`, params)

// 12. 删除定位结果
export const deleteSrLocationApi = (
  params: {
    srLocationId : string  // 选择的id
  }
) => get(`${baseUrl}/sl/deleteSrLocation`, params)

// 13. 开始对结构像进行预处理
export const startFsprepApi = (
  params: {
    filePath : string
  }
) => get(`${baseUrl}/sl/startFsprep`, params)

// 14. 获取一键溯源进度
export const getPipelineStatusApi = (
  params: {
    pipelineAnalysisId : string
  }
) => get(`${baseUrl}/sl/getPipelineStatus`, params)

// 15. 一键溯源
export const startPipelineAnalysisApi = (
  params: {
    subjectId : string // 患者id
  }
) => post(`${baseUrl}/sl/startPipelineAnalysis`, params)

// 16. 处理上传患者zip
export const dealSubImageZipApi = (
  params: {
    zipName : string // 压缩包名称
  }
) => get(`${baseUrl}/sl/dealSubImageZip`, params)

// 17. 终止一键溯源
export const stopPipelineAnalysisApi = (
  params: {
    subjectId : string // 患者id
  }
) => post(`${baseUrl}/sl/stopPipelineAnalysis`, params)

// 18. 获取聚类聚类结果
export const getClusterSourceLocationResultListApi = (
  params: {
    coregId   : string // 选择的配准结果的id
    subjectId : string //
  }
) => get(`${baseUrl}/sl/getClusterSourceLocationResultList`, params)

// 19. 获取预处理后的结构像文件列表
export const getFsprepNiiFileListApi = (
  params: {
    megId     : string // 患者id
    subjectId : string // 患者id
    niiType  ?: number
  }
) => get(`${baseUrl}/sl/getFsprepNiiFileList`, params)

// 20. 保存角度
export const rotateNiiMgzApi = (
  params: {
    x : number
    y : number
    z : number
    fsprepNiiFilePath : string
  }
) => post(`${baseUrl}/sl/rotateNiiMgz`, params)

// 21. 导出溯源定位结果
export const exportNiiWithSlCoordApi = (
  params: {
    megId       : string // 患者id
    subjectId   : string // 患者id
    niiFilePath : string
    exportAlg   : boolean
    exportManual: boolean
    algType     : string
    coregId     : string
    radius      : number
  }
) => post(`${baseUrl}/sl/exportNiiWithSlCoord`, params)

// 22. 获取发起棘波时刻点溯源定位弹窗内的表格列表
export const getFifFileListWithIsSlApi = (
  params: {
    megId : string // 患者id
  }
) => get(`${baseUrl}/sl/getFifFileListWithIsSl`, params)

// 23. 棘波时刻点溯源定位弹窗，确定按钮
export const startFifSourceLocationApi = (
  params: {
    megId          : string
    subjectId      : string
    checkList      : any[]
    spikeLocMethod : string
  }
) => post(`${baseUrl}/sl/startFifSourceLocation`, params)

// 24. 批量一键溯源
export const startBatchPipelineAnalysisApi = (
  params: {
    targetTime : string
  }
) => post(`${baseUrl}/sl/startBatchPipelineAnalysis`, params)

// 25. 撤销批量一键溯源
export const stopBatchPipelineAnalysisApi = (
  params: {
    batchPipelineAnalysisId : string
    celeryTaskId            : string
  }
) => post(`${baseUrl}/sl/stopBatchPipelineAnalysis`, params)


// 26. 获取批量一键溯源状态列表
export const getBatchPipelineStatusApi = (
  params: {
    batchPipelineAnalysisId : string
  }
) => get(`${baseUrl}/sl/getBatchPipelineStatus`, params)

// 27 获取显示在结构像3d图上的头皮点
export const getCoregHeadShapePointsApi = (
  params: {
    coregId : string
  }
) => get(`${baseUrl}/sl/getCoregHeadShapePoints`, params)


// 28. 目录所有文件上传完成后调用这个接口，对目录进行处理
export const dealSubjectFoldApi = (
  params: {
    foldName: string
  }
) => get(`${baseUrl}/sl/dealSubjectFold`, params)

