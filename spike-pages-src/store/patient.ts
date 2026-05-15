import { defineStore } from 'pinia'
import { getAllSubjectBaseInfoApi } from '@/api/subject'

interface PatientState {
  patientList: PatientItem[];
  lastFetched: number | null;
  cacheExpiryMs: number;
  defaultPatient: PatientItem | null; // 默认患者
}

export interface PatientItem {
  megId: string;
  subjectId: string;
  pipelineStatus: number | null;
  coregId: string;
  searchLabel: string;
}

export const usePatientStore = defineStore('patient', {
  state: (): PatientState => ({
    patientList: [],
    lastFetched: null,
    cacheExpiryMs: 5 * 60 * 1000, // 5分钟后，当需要患者列表数据时（调用 fetchPatientList），才会请求新数据
    defaultPatient: null, // 初始无默认患者
  }),

  getters: {
    isCacheValid: (state) => {
      if (!state.lastFetched) return false
      return (Date.now() - state.lastFetched) < state.cacheExpiryMs
    },
    getPatientList: (state) => state.patientList,
  },

  actions: {

    // 设置默认患者（只在需要时调用一次）
    setDefaultPatient(patient: PatientItem) {
      // 只有当没有默认患者时才设置
      if (!this.defaultPatient) {
        this.defaultPatient = patient
      }
    },

    async fetchPatientList(forceRefresh: boolean = false) {

      // 如果没有患者列表且有默认患者，直接返回默认患者列表，防止一开始闪烁
      if (!this.patientList.length && this.defaultPatient) {
        this.patientList = [this.defaultPatient]
      }
      // 缓存有效且不需要强制刷新时直接返回
      if (this.isCacheValid && !forceRefresh) {
        // console.log('从缓存加载患者列表')
        return this.patientList
      }

      try {
        // console.log('正在请求新的患者列表...')
        const { code, data } = await getAllSubjectBaseInfoApi({})

        if (code === 200 && Array.isArray(data)) {
          // 转换数据结构并更新缓存
          this.patientList = data.map(item => ({
            megId: item.megId,
            subjectId: item.subjectId,
            pipelineStatus: item.pipelineStatus,
            coregId: item.coregId,
            searchLabel: item.subjectName
              ? `${item.megId} ( ${item.subjectName} )`
              : item.megId,
          }))

          this.lastFetched = Date.now()
          return this.patientList
        } else {
          // console.error('API 返回无效数据:', data)
          throw new Error('Invalid API response')
        }
      } catch (error) {
        // console.error('获取患者列表失败:', error)
        throw error
      }
    },

    // 完全重置选择患者列表
    clearPatientList() {
      this.patientList = []
      this.lastFetched = null
      this.defaultPatient = null
    },
  },
})