<template>
  <div class="main-page">
    <div class="page-top" :class="{ 'page-top-fixed': isScrollTop, ['page-top-' + hospital]: hospital }">
      <div class="flex-start">
        <Back class="page-back" :title="pageTitle" />
      </div>

      <a-space class="flex-start">

        <template v-if="hospital === 'sanbo' && isEdit">

          <div class="flex-center">
            <span>{{ t('选择模板') }}：</span>
            <a-select style="width: 140px;" v-model:value="curTemplateId" :options="templateList"
              :fieldNames="{ label: 'template_name', value: 'id' }" :placeholder="t('请选择')" allowClear
              :dropdownMatchSelectWidth="false" @change="changeTemplate" />
          </div>

          <a-button type="default" :title="t('新增模板')" size="small" class="flex-center" @click="addTemplate">
            <PlusOutlined />
            <!-- 新增 -->
          </a-button>
          <a-button type="default" :title="t('修改模板')" size="small" class="flex-center" :disabled="!curTemplateId"
            @click="editTemplate">
            <EditOutlined />
            <!-- 修改 -->
          </a-button>
          <a-button type="default" :title="t('模板管理')" size="small" class="flex-center" @click="showTemplateModal">
            <SettingOutlined />
            <!-- 管理 -->
          </a-button>
        </template>


        <div class="mr4 ml4">
          <span>{{ t('选择报告') }}：</span>
          <a-select class="select-style" v-model:value="hospital" :options="selectList"
            :dropdownMatchSelectWidth="false" @change="changeSelectList" />
        </div>


        <a-button type="primary" class="flex-center" v-if="!isEdit" @click="onEdit(true)">
          <EditOutlined class="text-16" /> {{ t('编辑') }}
        </a-button>
        <a-button type="default" class="flex-center" v-if="isEdit" @click="onEdit(false)">
          {{ t('取消编辑') }}
        </a-button>

        <a-button type="primary" class="flex-center" :loading="loading" v-if="isEdit" @click="onSave">
          <IconSave class="text-16" /> {{ t('保存') }}
        </a-button>

        <a-button type="primary" class="flex-center" :disabled="isEdit" v-if="!isGetting" @click="getScreenshot()">
          <IconDownload class="text-16" /> {{ t('下载报告') }}
        </a-button>

        <a-button type="primary" class="flex-center" v-if="isGetting" :loading="true">
          {{ t('报告下载中') }}
        </a-button>

      </a-space>
    </div>

    <a-config-provider :locale="zhCN" :theme="{ algorithm: antdvTheme.defaultAlgorithm, token: themeToken }">
      <General ref="generalRef" v-if="hospital === 'general'" @success="successSave" @fail="failSave" />
      <Sanbo ref="sanboRef" v-if="hospital === 'sanbo'" @success="successSave" @fail="failSave" />
      <Huaxi ref="huaxiRef" v-if="hospital === 'huaxi'" @success="successSave" @fail="failSave" />
      <Xuanwu ref="xuanwuRef" v-if="hospital === 'xuanwu'" @success="successSave" @fail="failSave" />
    </a-config-provider>

  </div>

  <a-back-top class="back-top-btn" />

  <!-- 新增、修改弹窗 -->
  <AddEditModal ref="addEditModalRef" @success="successAddTemplate" />
  <TemplateModal ref="templateModalRef" :templateList="templateList" @success="successAddTemplate" />

</template>


<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme as antdvTheme } from 'ant-design-vue';

import General from './General.vue'
import Sanbo from './Sanbo.vue'
import Huaxi from './Huaxi.vue'
import Xuanwu from './Xuanwu.vue'

import AddEditModal from './modal/AddEditModal.vue'
import TemplateModal from './modal/TemplateModal.vue'

import {
  getCurHospitalApi, // 1.  获取当前医院
  getReportTemplatesListApi, // 12. 获取报告模板列表
} from '@/api/report'


import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'
import { PlusOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()

const themeStore = useThemeStore()
const { isScrollTop } = storeToRefs(themeStore)

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
const colorBg = getComputedStyle(document.documentElement).getPropertyValue('--white-bg')
const colorBorderCard = getComputedStyle(document.documentElement).getPropertyValue('--black-border')
const colorT2 = getComputedStyle(document.documentElement).getPropertyValue('--black-t2')

const themeToken: any = reactive({
  colorPrimary: primaryColor,
  colorLink: primaryColor,
  colorBgContainer: colorBg,
  colorBorder: colorBorderCard,
  colorText: colorT2,
  wireframe: true,
});

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
const type = ref<string>(String(route.query.type || 'general'))

const pageTitle = ref<string[]>([t('临床报告'), megId.value || t('请先选择患者')])
document.title = `${t('临床报告')} | ${megId.value}`

const loading = ref<boolean>(false)
const hospital = ref<string>(null) // sanbo/huaxi/general/xuanwu

const allSelectList = [
  { label: t('通用报告'), value: 'general' },
  { label: t('三博报告'), value: 'sanbo' },
  { label: t('华西报告'), value: 'huaxi' },
  { label: t('宣武报告'), value: 'xuanwu' },
]

const selectList = ref<any[]>([
  { label: t('通用报告'), value: 'general' },
])

const router = useRouter()

function changeSelectList(value: string) {
  // 这里用replace方法，而不是push方法，这样点击返回键就不会返回到切换type前的当前页面了
  router.replace({
    path: 'clinicalReports',
    query: {
      subjectId: subjectId.value,
      megId: megId.value,
      type: value,
    }
  })
  nextTick(() => {
    onEdit(false)
  })
  if (value === 'sanbo') {
    getReportTemplatesList()
  }
}

onMounted(() => {
  getCurHospital()
})

// 获取报告数据
async function getCurHospital() {

  // selectList.value = allSelectList
  // return

  // http://localhost:3031/clinicalReports?subjectId=64295cd3-d48c-11ef-8f31-6dd1187feb3c&megId=case_0023

  // hospital.value = type.value
  // changeSelectList(hospital.value)
  // return

  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getCurHospitalApi(params)
  loading.value = false
  if (code === 200) {
    selectList.value = allSelectList.filter((item) => item.value === 'general' || item.value === data.hospital)
    if (data.hospital === type.value) {
      hospital.value = type.value
    } else {
      hospital.value = 'general'
    }
    changeSelectList(hospital.value)
  }
}

const generalRef = ref(null)
const sanboRef = ref(null)
const huaxiRef = ref(null)
const xuanwuRef = ref(null)

const isEdit = ref<boolean>(false)
function onEdit(bool: boolean) {
  isEdit.value = bool
  loading.value = false

  if (hospital.value === 'general') {
    generalRef.value.onEdit(bool)
  }
  if (hospital.value === 'sanbo') {
    sanboRef.value.onEdit(bool)
    curTemplateId.value = null
    curTemplateObj.value = null
  }
  if (hospital.value === 'huaxi') {
    huaxiRef.value.onEdit(bool)
  }
  if (hospital.value === 'xuanwu') {
    xuanwuRef.value.onEdit(bool)
  }

}

function onSave() {
  loading.value = true

  if (hospital.value === 'general') {
    generalRef.value.onSave()
  }
  if (hospital.value === 'sanbo') {
    sanboRef.value.onSave()
  }
  if (hospital.value === 'huaxi') {
    huaxiRef.value.onSave()
  }
  if (hospital.value === 'xuanwu') {
    xuanwuRef.value.onSave()
  }
}

function successSave() {
  isEdit.value = false
  loading.value = false
  if (hospital.value === 'sanbo') {
    curTemplateId.value = null
    curTemplateObj.value = null
  }
}

// 失败就还是留在编辑状态
function failSave() {
  loading.value = false
}


const isGetting = ref(false) // 正在下载报告中

function getScreenshot() {

  isGetting.value = true

  setTimeout(() => {
    isGetting.value = false
  }, 1000)


  if (hospital.value === 'general') {
    generalRef.value.getScreenshot()
  }
  if (hospital.value === 'sanbo') {
    sanboRef.value.getScreenshot()
  }
  if (hospital.value === 'huaxi') {
    huaxiRef.value.getScreenshot()
  }
  if (hospital.value === 'xuanwu') {
    xuanwuRef.value.getScreenshot()
  }
}




// 获取报告数据
async function getReportTemplatesList() {
  const params = {
    // subjectId: subjectId.value,
    userId: JSON.parse(localStorage.getItem('userInfo') || '{}')?.id, // 用户id
  }
  const { code, data } = await getReportTemplatesListApi(params)
  if (code === 200) {
    templateList.value = data.template_list || []
  }
}

const addEditModalRef = ref(null)
const templateModalRef = ref(null)

async function addTemplate() {
  const templateData = await sanboRef.value.getTemplateData()
  addEditModalRef.value.showModal('add', {
    id: null,
    templateName: null,
    templateData
  })
}

// 编辑
async function editTemplate() {
  const templateData = await sanboRef.value.getTemplateData()
  addEditModalRef.value.showModal('edit', {
    id: curTemplateObj.value.id,
    templateName: curTemplateObj.value.template_name,
    templateData
  })
}

function showTemplateModal() {
  templateModalRef.value.showModal()
}

const templateList = ref<any[]>([])
const curTemplateId = ref<string>(null)
const curTemplateObj = ref<any>({})

// 修改布局
function changeTemplate() {
  if (curTemplateId.value) {
    curTemplateObj.value = templateList.value.find((item: any) => item.id === curTemplateId.value)
    sanboRef.value.setTemplateData(curTemplateObj.value.template_data)
  } else {
    sanboRef.value.getSanboReportData()
  }
}

function successAddTemplate() {
  getReportTemplatesList()
}

</script>

<style lang="less" scoped>
@--color-primary: #235cac;


.bg-gray-line {
  background: #fff;
  // background: red;
  width: 100%;
  height: 1px;
}

// .page-break {
//   border-top: 1px solid blue;
// }

// 页面根class
.main-page {
  position: relative;

  .page-top {
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 12px;
    box-shadow: var(--box-shadow);
    width: 1200px;
  }

  .page-top-fixed {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    z-index: 999;
  }
}

.select-style {
  width: 132px; //132为了适配英文宽度
}
</style>
