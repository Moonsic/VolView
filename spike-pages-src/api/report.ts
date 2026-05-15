import { get, post,deleteItem, baseUrl } from '@/api/axios/request'

// 报告相关接口（6条） - report

// 1. 获取当前医院
export const getCurHospitalApi = (
  params: {}
) => get(`${baseUrl}/report/getCurHospital`, params)

// 2. 获取三博报告数据
export const getSanboReportDataApi = (
  params: {
    subjectId : string  // 患者id
  }
) => get(`${baseUrl}/report/getSanboReportData`, params)

// 3. 保存三博报告数据
export const saveSanboReportDataApi = (
  params: {
    subjectId  : string  // 患者id
    reportInfo : any   // 报告信息
  }
) => post(`${baseUrl}/report/saveSanboReportData`, params)

// 4. 获取华西报告数据
export const getHuaxiReportDataApi = (
  params: {
    subjectId : string  // 患者id
  }
) => get(`${baseUrl}/report/getHuaxiReportData`, params)

// 5. 保存华西博报告数据
export const saveHuaxiReportDataApi = (
  params: {
    subjectId  : string  // 患者id
    reportInfo : any   // 报告信息
  }
) => post(`${baseUrl}/report/saveHuaxiReportData`, params)

// 7. 获取通用模板报告
export const getGeneralReportDataApi = (
  params: {
    subjectId             : string  // 患者id
    isOnlyDipoleOverview ?: boolean // 是否只返回脑部信息
  }
) => get(`${baseUrl}/report/getGeneralReportData`, params)

// 8. 保存通用模板报告
export const saveGeneralReportDataApi = (
  params: {
    subjectId  : string  // 患者id
    reportInfo : any   // 报告信息
  }
) => post(`${baseUrl}/report/saveGeneralReportData`, params)

// 9. 新报告数据接口，这个是新报告数据生成接口，调用会自动生成通用报告数据和个性化报告数据（目前支持三博和华西）
export const generateReportDataApi = (
  params: {
    subjectId           : string  // 患者id
    userId              : string  // 用户id
    mainClassSpikesType : string // both/alg/manual
  }
) => get(`${baseUrl}/report/generateReportData`, params)


// 10. 获取宣武报告数据
export const getXuanwuReportDataApi = (
  params: {
    subjectId : string  // 患者id
  }
) => get(`${baseUrl}/report/getXuanwuReportData`, params)

// 11. 保存宣武博报告数据
export const saveXuanwuReportDataApi = (
  params: {
    subjectId  : string  // 患者id
    reportInfo : any   // 报告信息
  }
) => post(`${baseUrl}/report/saveXuanwuReportData`, params)


// 12. 获取报告模板列表
export const getReportTemplatesListApi = (
  params: {
    userId : string  //
  }
) => get(`${baseUrl}/report/getReportTemplatesList`, params)

// 13. 保存报告模板列表
export const saveReportTemplateApi = (
  params: {
    id          ?: string  // 模板id，用于修改
    userId       : string  // 用户id
    templateName : string   // 报告信息
    isDefault    : boolean   // 报告信息
    templateData : any   // 报告信息
  }
) => post(`${baseUrl}/report/saveReportTemplate`, params)

// 14. 删除报告模板
export const deleteReportTemplateApi = (
  params: {
    id : string  // 报告id
  }
) => deleteItem(`${baseUrl}/report/deleteReportTemplate/${params.id}`)

// 15. 保存新的截图
export const saveDipoleOverviewScreenshotApi = (
  params: {
    subjectId      : string  // id
    screenshotInfo : any  // 截图信息
  }
) => post(`${baseUrl}/report/saveDipoleOverviewScreenshot`, params)


