import { get, post, baseUrl } from '@/api/axios/request'

// 患者管理相关接口（3条） - subject

// 1. 根据患者id查询患者详情
export const getSubjectByIdApi = (
  params: {
    subjectId : string  // 患者id 【必填】
  }
) => get(`${baseUrl}/subject/getSubjectById`, params)

// 2. 添加或者更新患者
export const addSubjectApi = (
  params: {
    subjectId ?: string  // 患者id
    megId     ?: string  // 患者编号
    gender    ?: number  // 性别
    birthDate ?: string  // 出生日期
    scanDate  ?: string  // 扫描日期
  }
) => post(`${baseUrl}/subject/addSubject`, params)

// 3. 按条件分页查询患者列表
export const listApi = (
  params: {
    pageNum    ?: number  // -
    pageSize   ?: number  // -
    orderField ?: number  // -
    sortType   ?: number  // -
    id         ?: number  // 患者id
    megId      ?: string  // 患者megId
    startAge   ?: number  // 查询年龄范围下限
    endAge     ?: number  // 查询年龄范围上限
    gender     ?: number  // 性别
  }
) => post(`${baseUrl}/subject/list`, params)

// 4. 删除患者
export const deleteSubjectByIdApi = (
  params: {
    subjectId ?: string  // 患者id
  }
) => get(`${baseUrl}/subject/deleteSubjectById`, params)

// 5. 获取患者任务状态
export const getTaskStatusApi = (
  params: {
    subjectId : string  // 患者id
    megId     : string  // megId
  }
) => get(`${baseUrl}/subject/getTaskStatus`, params)

// 6. 获取执行中的任务（不用了，并在getTaskStatus里）
// export const getRunningTaskApi = (
//   params: {
//     megId     : string  // megId
//   }
// ) => get(`${baseUrl}/subject/getRunningTask`, params)

// 7. 获取所有患者列表
export const getAllSubjectBaseInfoApi = (
  params: {}
) => get(`${baseUrl}/subject/getAllSubjectBaseInfo`, params)

// 8. 获取一键溯源进行中或者失败的某个患者
export const getRunningOrFailedPipeListApi = (
  params: {}
) => get(`${baseUrl}/subject/getRunningOrFailedPipeList`, params)

// 9. 获取每个pipeline的执行时间
export const getEveryAlgStepUseTimeApi = (
  params: {
    pipelineAnalysisId : string
    subjectId: string
    task_status: any
  }
) => post(`${baseUrl}/subject/getEveryAlgStepUseTime`, params)

// 10. 选择结构像的层级到报告中
export const addMriSliceInReporteApi = (
  params: {
    subjectId        : string
    mriSliceInReport : any
  }
) => post(`${baseUrl}/subject/addMriSliceInReport`, params)

// 11. 传要上传文件夹的目录， 用来判断是否存在同名的患者目录
export const isMegIdExsitApi = (
  params: {
    megId: string
  }
) => get(`${baseUrl}/subject/isMegIdExsit`, params)

// 12. 获取选择结构像的层数据
export const getMriSliceInReportApi = (
  params: {
    subjectId: string
  }
) => get(`${baseUrl}/subject/getMriSliceInReport`, params)

// 13. 选择结构像的层添加到报告中
export const addMriSliceInReportApi = (
  params: {
    subjectId        : string
    mriSliceInReport : any
  }
) => post(`${baseUrl}/subject/addMriSliceInReport`, params)

// 14. 获取患者megType，megin还是opm64
export const getMegTypeApi = (
  params: {
    megId: string
  }
) => get(`${baseUrl}/subject/getMegType`, params)

