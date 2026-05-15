import { get, post, deleteItem, baseUrl } from '@/api/axios/request'

// 脑磁图相关接口（35条） - meg

// // 1. 查折线图
// export const megProtobufApi = (
//   params: {
//   }
// ) => post(`${baseUrl}/meg`, params)

// 0. 查折线图
export const megApi = (
  params: {
  }
) => post(`${baseUrl}/megjson`, params)

// 1. 点击数据列表或上传完成之后
export const analysisApi = (
  params: {
    filePath  : string
    thr       : string // 阈值
    subjectId : string
  }
) => post(`${baseUrl}/meg/analysis`, params, 'form')

// 2. 患者数据列表，不分页。foldName 是 megId/meg
export const getFifFileListApi = (
  params: {
    foldName : string
  }
) => get(`${baseUrl}/meg/getFifFileList`, params)

// 3. 悬浮显示更多，但现在不需要了，都在getFifFileListApi里
export const infoApi = (
  params: {
    id          ?: string  // 用户id
    account     ?: string  // 用户登录账号
    passwordMD5 ?: string  // 用户登录密码，经过MD5处理
    name        ?: string  // 用户姓名
    gender      ?: string  // 用户性别
    roleId      ?: string  // 角色id
  }
) => get(`${baseUrl}/meg/info`, params)

// 4. 在analysisApi之前，先调这个，判断有没有进行过，是的话 跳出小框告知已经进行过，是否要再进行一次。
export const judgeIfDetectApi = (
  params: {
    filePath : string
  }
) => get(`${baseUrl}/meg/judgeIfDetect`, params)

// 5. 棘波检测列表，分页。脑区和tag是固定的
export const spikeListApi = (
  params: {
    subjectId   : string
    filePath    : string
    pageSize    : number
    pageNum     : number
    brainRegion : string // 脑区
    thr         : string // 阈值
  }
) => post(`${baseUrl}/meg/spikeList`, params)

// 6. 转换
export const turnNegativeApi = (
  params: {
    id : string
  }
) => get(`${baseUrl}/meg/turnNegative`, params)

// V1.1新加接口
// 7. 添加或者修改手动标注的棘波，修改的时候，也需要传入所有字段的信息√
export const addOrUpdateManualSpikeApi = (
  params: {
    id       ?: string|null // 用户id
    filePath  : string  // 用户id
    startTime : string //棘波开始时间, 以字符串形式传递
    endTime  ?: string|null //棘波结束时间。当选择一个时间段的时候，才会有endTime。 以字符串形式传递
    brainArea : string //脑区
    channels  : string //当前展示的是哪些通道的脑磁图，以逗号隔开。如果同时存在脑区和通道的话，以通道为准
    spikeType : number //棘波类型
    subjectId : string
  }
) => post(`${baseUrl}/meg/addOrUpdateManualSpike`, params)

// 8.  获取手动标注棘波的列表 √
export const getManualSpikeListApi = (
  params: {
    subjectId : string
    filePath  : string
    pageSize  : number
    pageNum   : number
  }
) => post(`${baseUrl}/meg/getManualSpikeList`, params)

// 9.  获取某一段时间范围内的所有手工标注棘波 √
export const timeIntervalManualSpikeApi = (
  params: {
    filePath  : string
    startTime : string
    endTime   : string
  }
) => post(`${baseUrl}/meg/timeIntervalManualSpike`, params, 'form')

// 9.5  获取某一段时间范围内的所有算法手工标注棘波 √
export const timeIntervalSpikeApi = (
  params: {
    filePath  : string
    startTime : string
    endTime   : string
  }
) => post(`${baseUrl}/meg/timeIntervalSpike`, params, 'form')

// 10.  删除手动标记的棘波 √
export const deleteManualSpikeApi = (
  params: {
    id : string  // id 【必填】
  }
) => deleteItem(`${baseUrl}/meg/deleteManualSpike/${params.id}`)


// 10.5.  批量删除手动标记的棘波 √
export const deleteManualSpikeBatchApi = (
  params: {
    ids : string[]  // id[] 【必填】
  }
) => post(`${baseUrl}/meg/deleteManualSpikeBatch`, params)



// 11.  获取拓扑图的接口 √
export const getTopoGraphApi = (
  params: {
    filePath  : string
    timeSec   : string
    subjectId : string
  }
) => post(`${baseUrl}/meg/getTopoGraph`, params, 'form')

// 12.  当ctrl+鼠标单击一个点时，自动跳转到附近的波峰/波谷点 √
export const getGfpPointApi = (
  params: {
    filePath  : string
    brainArea : string
    channels  : string
    timeSec   : string
    lowFreq   : string
    highFreq  : string
  }
) => post(`${baseUrl}/meg/getGfpPoint`, params)

// 13.  检测是否调用过聚类算法
export const judgeIfClusterApi = (
  params: {
    subjectId  : string
  }
) => get(`${baseUrl}/meg/judgeIfCluster`, params)

// 14.  调用聚类算法
export const clusterAnalysisApi = (
  params: {
    megId      : string
    subjectId  : string
    foldName   : string
    checkList  : any[]
    hyperParas : Object
  }
) => post(`${baseUrl}/meg/clusterAnalysis`, params)

// 15.  获取聚类列表
export const getClusterListApi = (
  params: {
    subjectId : string
    pageSize ?: number
    pageNum  ?: number
  }
) => post(`${baseUrl}/meg/getClusterList`, params)

// 16.  点击每一个类，请求获取该类的棘波时刻点的所有时刻点还有图
export const getClusterSpikesApi = (
  params: {
    subjectId : string
    taskId    : string
    className : string
    pageSize ?: number
    pageNum  ?: number
  }
) => post(`${baseUrl}/meg/getClusterSpikes`, params)

// 17. 获取每类平均图的原图
export const getOrgAvgMapApi = (
  params: {
    subjectId : string
    taskId    : string
    className : string
  }
) => post(`${baseUrl}/meg/getOrgAvgMap`, params)

// 18. 获取单个棘波时刻点的原图
export const getOrgSpikeMapApi = (
  params: {
    subjectId : string
    taskId    : string
    spikeTime : string
  }
) => post(`${baseUrl}/meg/getOrgSpikeMap`, params)

// 19.  移动的接口和示例
export const updateSpikeClassApi = (
  params: {
    subjectId    : string
    taskId       : string
    spikeTime    : string
    subjectName  : string
    oldClassName : string
    newClassName : string
  }
) => post(`${baseUrl}/meg/updateSpikeClass`, params)

// 20.  获取完整的蝴蝶图
export const getEntireButterflyApi = (
  params: {
    filePath  : string
    subjectId : string
    startTime : string
    duration  : number
    isFilter  : boolean
    filterFreqs : {}
    resolution : {}
    isColorFlip ?: boolean // 默认false黑底白线，传true就变成了白底黑线
  }
) => post(`${baseUrl}/meg/getEntireButterfly`, params)

// 20.5  获取完整的蝴蝶图（图表数据）
export const getButterflyDataApi = (
  params: {
    filePath  : string
    subjectId : string
    startTime : string
    duration  : number
    isFilter  : boolean
    filterFreqs : {}
  }
) => post(`${baseUrl}/meg/getButterflyData`, params)

// 21.  获取自定义通道集合列表
export const getCustomChannelListApi = (
  params: {
    userId : string // 用户id
    type   : number // 0表示fif通道集合，1表示fif_eeg通道集合，2表示eeg通道集合
  }
) => get(`${baseUrl}/meg/getSdChannelList`, params)

// 22.  添加、编辑自定义通道集合列表
export const addCustomChannelApi = (
  params: {
    id         ?: string   // 通道集合户id (有它就是编辑，没有就是新增)
    userId      : string   // 用户id
    listName    : string   // 集合名称
    brainArea  ?: string   // 脑区(非必传)
    channelList : string[] // 通道集合
  }
) => post(`${baseUrl}/meg/addSdChannelList`, params)

// 23.  删除自定义通道集合列表
export const deleteCustomChannelApi = (
  params: {
    id  : string // 通道集合户id
  }
) => deleteItem(`${baseUrl}/meg/deleteSdChannelList/${params.id}`)

// 24.  生成报告
export const generateReportApi = (
  params: {
    subjectId  : string //
  }
) => get(`${baseUrl}/report/generateReport`, params)

// 25. 批量新增手动标注的棘波时刻点
export const addManualSpikeBatchApi = (
  params: {
    fifFilePath   : string
    niiFilePath   : string
    brainArea     : string
    channels      : string
    spikeTimeList : any[]
    subjectId     : string
  }
) => post(`${baseUrl}/meg/addManualSpikeBatch`, params)

// 27. 获取头盔图
export const getTopomap3dApi = (
  params: {
  }
) => post(`${baseUrl}/meg/getTopomap3d`, params)

// 28. 将Dicom转化为nii格式
export const transformDicomToNiiApi = (
  params: {
    dicomFilePath: string
  }
) => get(`${baseUrl}/anat/transformDicomToNii`, params)

// 29.  获取报告数据
export const getReportDataApi = (
  params: {
    subjectId: string
  }
) => get(`${baseUrl}/report/getReportData`, params)

// 30.  导出数据
export const exportEventApi = (
  params: {
    megId  : string //
    type   : string // 导出文件类型fif，txt，csv'
    fifFileInfoList  : any[] // 文件列表
  }
) => post(`${baseUrl}/meg/exportEvent`, params, 'blob')

// 31.  窗口布局列表
export const getWinsLayoutApi = (
  params: {
    userId : string // 用户id
  }
) => get(`${baseUrl}/meg/getWinsLayout`, params)

// 32.  添加或者更新窗口布局信息
export const addOrUpdateWinsLayoutApi = (
  params: {
    id         ?: string // 窗口布局id，编辑时用id
    userId      : string // 用户id
    layoutName  : string //布局名称
    layoutInfo  : any // 布局信息
  }
) => post(`${baseUrl}/meg/addOrUpdateWinsLayout`, params)

// 33.  删除窗口布局
export const deleteWinsLayoutApi = (
  params: {
    id          : string // 窗口布局id
  }
) => deleteItem(`${baseUrl}/meg/deleteWinsLayout/${params.id}`)

// 34.  导入手动标注点文件
export const importEventApi = (
  params: {
    fifFilePath : string //
    files        : File // 文件
  }
) => post(`${baseUrl}/meg/importEvent`, params, 'formData')

// 35.  获取坏通道
export const getBadChannelApi = (
  params: {
    subjectId    : string //
    fifFilePath  : string //
  }
) => get(`${baseUrl}/meg/getBadChannel`, params)

// 36.  添加坏通道
export const addBadChannelApi = (
  params: {
    subjectId    : string //
    fifFilePath  : string //
    channelNames : any[]
  }
) => post(`${baseUrl}/meg/addBadChannel`, params)

// 37.  删除坏通道
export const deleteBadChannelApi = (
  params: {
    subjectId    : string //
    fifFilePath  : string //
    channelNames : any[]
  }
) => post(`${baseUrl}/meg/deleteBadChannel`, params)


// 38.  获取脑磁中的脑电通道集合
export const getEegChannelNamesApi = (
  params: {
    subjectId    : string //
    fifFilePath  : string //
  }
) => get(`${baseUrl}/meg/getEegChannelNames`, params)

// 39.  保存导联组合
export const saveLeadCombinationApi = (
  params: {
    id           ?: string // 添加不传id，修改时才传id
    combinationName : string // 导联组合名称
    combination  : string[] // 改成数组，对象key会覆盖
  }
) => post(`${baseUrl}/meg/saveLeadCombination`, params)

// 40.  查询导联组合
export const getEEgLeadCombinationApi = (
  params: {
  }
) => get(`${baseUrl}/meg/getEEgLeadCombination`, params)

// 41.  获取脑电数据
export const eegjsonApi = (
  params: {
    // leadCombination : string[] // 改成数组，对象key会覆盖
  }
) => post(`${baseUrl}/meg/eegjson`, params)


// 42.  删除导联组合
export const deleteLeadCombinationApi = (
  params: {
    id: string // 导联组合id
  }
) => get(`${baseUrl}/meg/deleteLeadCombination`, params)


// 43.  获取某个fif文件的所有时刻点
export const getFifFileAllSpikeApi = (
  params: {
    subjectId: string
    filePath: string
  }
) => get(`${baseUrl}/meg/getFifFileAllSpike`, params)


// 44.  获取聚类类别列表
export const getClusterTypeListApi = (
  params: {
    subjectId: string
  }
) => get(`${baseUrl}/meg/getClusterTypeList`, params)

// 45.  分页查询算法结果列表
export const getAlgClusterSpikeTimeListApi = (
  params: {
    subjectId : string
    className : string
    pageSize  : number
    pageNum   : number
  }
) => post(`${baseUrl}/meg/getAlgClusterSpikeTimeList`, params)

// 46.  分页查询手动标注列表
export const getManualClusterSpikeTimeListApi = (
  params: {
    subjectId : string
    className : string
    pageSize  : number
    pageNum   : number
  }
) => post(`${baseUrl}/meg/getManualClusterSpikeTimeList`, params)


// 47.  将时刻点添加到报告中
export const addSpikeToReportApi = (
  params: {
    spikeId : string
    isAlg   : boolean
  }
) => get(`${baseUrl}/meg/addSpikeToReport`, params)

// 48.  将时刻点从报告中取消
export const cancelSpikeInReportApi = (
  params: {
    spikeId : string
    isAlg   : boolean
  }
) => get(`${baseUrl}/meg/cancelSpikeInReport`, params)


// 49.  获取时刻点备注
export const getSpikeNoteApi = (
  params: {
    fifFilePath : string
    subjectId   : string
    isManual    : boolean
  }
) => get(`${baseUrl}/meg/getSpikeNote`, params)

// 50.  设置时刻点备注
export const updateSpikeNoteApi = (
  params: {
    isManual      : boolean
    spikeTimeList : any[]
  }
) => post(`${baseUrl}/meg/updateSpikeNote`, params)
