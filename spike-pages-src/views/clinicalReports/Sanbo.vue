<template>

  <a-card class="report-card-page">

    <div class="page-content" ref="pageRef" id="report-page-sanbo">

      <div class="top-title">首都医科大学三博脑科医院</div>
      <div class="main-title">脑磁图报告单</div>

      <div class="flex-between mb8 pl8 pr8">
        <div class="item">
          <div class="label">门 诊 号：</div>
          <div v-if="!isEdit">{{ allData.outpatient_num }}</div>
          <div v-else>
            <a-input v-model:value="allData.outpatient_num" allowClear placeholder="请输入" />
          </div>
        </div>
        <div class="item">
          <div class="label">检 查 号：</div>
          <div v-if="!isEdit" style="min-width: 100px;">{{ allData.check_num }}</div>
          <div v-else>
            <a-input v-model:value="allData.check_num" allowClear placeholder="请输入" />
          </div>
        </div>
      </div>

      <table class="base-table" border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td>
              <div class="flex mb8">
                <div class="flex-1 item">
                  <div class="label">姓名：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.name }}</div>
                  <div v-else>
                    <a-input v-model:value="allData.base_info.name" allowClear placeholder="请输入" />
                  </div>
                </div>
                <div class="flex-1 item">
                  <div class="label">性别：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.gender }}</div>
                  <div v-else>
                    <a-select v-model:value="allData.base_info.gender" :options="genderList" allowClear
                      placeholder="请选择" />
                  </div>
                </div>
                <div class="flex-1 item">
                  <div class="label">年龄：</div>
                  <div>{{ allData.base_info?.age }}</div>
                </div>
                <div class="flex-1 item">
                  <div class="label">出生日期：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.birth_date }}</div>
                  <div v-else>
                    <a-date-picker v-model:value="allData.base_info.birth_date" placeholder="请选择日期" allowClear
                      format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" @change="changeBirthDate" />
                    <!-- <a-month-picker v-model:value="allData.base_info.birth_date" placeholder="请选择年月" allowClear format="YYYY-MM" valueFormat="YYYY-MM" /> -->
                  </div>
                </div>
              </div>
              <div class="flex mb8">
                <div class="flex-1 item">
                  <div class="label">申请科室：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.order_dept }}</div>
                  <div v-else>
                    <a-input v-model:value="allData.base_info.order_dept" allowClear placeholder="请输入" />
                  </div>
                </div>
                <div class="flex-1 item">
                  <div class="label">申请人：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.order_provider }}</div>
                  <div v-else>
                    <a-input v-model:value="allData.base_info.order_provider" allowClear placeholder="请输入" />
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="flex-1 item">
                  <div class="label">临床诊断：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.diagnosis }}</div>
                  <div v-else>
                    <a-input v-model:value="allData.base_info.diagnosis" allowClear placeholder="请输入" />
                  </div>
                </div>
                <div class="flex-1 item">
                  <div class="label">检查时间：</div>
                  <div v-if="!isEdit">{{ allData.base_info?.check_time }}</div>
                  <div v-else>
                    <a-date-picker v-model:value="allData.base_info.check_time" placeholder="请选择日期" allowClear
                      format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
                  </div>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">主 诉：</div>
                <div v-if="!isEdit">{{ allData.complaint }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.complaint" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">服药情况：</div>
                <div v-if="!isEdit">{{ allData.medication }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.medication" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">检查状态：</div>
                <div v-if="!isEdit">{{ allData.check_state }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.check_state" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">检查方式：</div>
                <div v-if="!isEdit">{{ allData.check_method }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.check_method" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">脑磁图所见：</div>
                <div v-if="!isEdit">{{ allData.meg_findings }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.meg_findings" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">印象：</div>
                <div v-if="!isEdit">{{ allData.conclusion }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.conclusion" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">备注：</div>
                <div v-if="!isEdit">{{ allData.notes }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.notes" allowClear placeholder="请输入" :auto-size="{ minRows: 2 }" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>


      <div class="flex-between mt8 mb8 pl8 pr8">
        <div class="item">
          <div class="label">分析者：</div>
          <div v-if="!isEdit">{{ allData.analyst }}</div>
          <div v-else>
            <a-input v-model:value="allData.analyst" allowClear placeholder="请输入" />
          </div>
        </div>
        <div class="item">
          <div class="label">报告医生：</div>
          <div v-if="!isEdit">{{ allData.report_doctor }}</div>
          <div v-else>
            <a-input v-model:value="allData.report_doctor" allowClear placeholder="请输入" />
          </div>
        </div>
        <div class="item"></div>
        <div class="item">
          <div class="label">报告时间：</div>
          <div v-if="!isEdit">{{ allData.report_time }}</div>
          <div v-else>
            <a-date-picker v-model:value="allData.report_time" placeholder="请选择日期" allowClear format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD" />
          </div>
        </div>

      </div>

    </div>

  </a-card>


</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import html2pdf from 'html2pdf.js'
import { calculateAge } from '@u/utils'

import {
  getSanboReportDataApi, // 2. 获取三博报告数据
  saveSanboReportDataApi, // 3. 保存三博报告数据
} from '@/api/report'

const { t } = useI18n()

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
document.title = `${t('临床报告')} | ${megId.value}`

const pageRef = ref(null)

const allData = ref<any>({}) // 这里必须是null，不能是{}，配合html里的allData?.
const loading = ref<boolean>(false)


const genderList = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
]

// 获取报告数据
async function getSanboReportData() {
  if (!subjectId.value) return message.error('请先选择患者')
  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getSanboReportDataApi(params)
  loading.value = false
  if (code === 200) {
    allData.value = data || {}
    if (allData.value.base_info.birth_date?.length === 7) {
      allData.value.base_info.birth_date = allData.value.base_info.birth_date + '-01'
    }
  }
}


const isEdit = ref<boolean>(false)
function onEdit(bool: boolean) {
  isEdit.value = bool
  if (!bool) {
    getSanboReportData()
  }
}

// 修改出生日期自动计算年龄
function changeBirthDate(date: string) {
  allData.value.base_info.age = calculateAge(date)
}

async function onSave() {
  const params = {
    subjectId: subjectId.value,
    reportInfo: convertObject(allData.value)
  }
  loading.value = true
  const { code, msg } = await saveSanboReportDataApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    onEdit(false)
    emit('success')
  } else {
    emit('fail')
  }
}

function getTemplateData() {
  const data = convertObject(allData.value)
  const templateData = {
    complaint: data.complaint,
    medication: data.medication,
    checkState: data.checkState,
    megFindings: data.megFindings,
    conclusion: data.conclusion,
    notes: data.notes,
    analyst: data.analyst,
    reportDoctor: data.reportDoctor,
  }
  return templateData
}

function setTemplateData(data: any) {
  allData.value = {
    ...allData.value,
    complaint: data.complaint,
    medication: data.medication,
    check_state: data.checkState,
    meg_findings: data.megFindings,
    conclusion: data.conclusion,
    notes: data.notes,
    analyst: data.analyst,
    report_doctor: data.reportDoctor,
  }
}


function getScreenshot() {
  onDownload()
}



// 下载
function onDownload() {
  const element = document.getElementById('report-page-sanbo')
  const opt = {
    margin: 16, // 没有页边距
    filename: `${megId.value}_临床报告.pdf`,
    pagebreak: {
      before: '.page-break', // 根据 .page-break这个class类分页
    },
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      // imageTimeout: 5000, // 设置图像加载的超时时间为30秒
    },
    jsPDF: {
      // unit: 'in', // in英寸
      // format: 'A4',

      unit: 'px',
      // format: [800,1131],
      format: [900, 1272],
      // format: [1000,1414],

      orientation: 'portrait',
    }
  }

  html2pdf().from(element).set(opt).save()
}

const emit = defineEmits(['success', 'fail'])


// 暴露方法
defineExpose({
  onEdit,
  onSave,
  getScreenshot,
  getTemplateData,
  setTemplateData,
  getSanboReportData,
})


function convertObject(obj: any) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item: any) => convertObject(item))
  }

  const newObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    const newKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
    newObj[newKey] = convertObject(value)
  }

  return newObj
}


</script>

<style lang="less" scoped>
@--color-primary: #235cac;

@width: 1200px;

.report-card-page {
  transform-origin: top;
  width: @width;
  margin: 0 auto;
  padding: 0 100px;
  margin-bottom: 30px;
  color: var(--black-t2);
  background-color: var(--white-bg);
  font-size: 16px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  :deep(.ant-select) {
    .ant-select-selector {
      background-color: var(--white-bg) !important;
    }
  }

  :deep(.ant-picker) {
    background-color: var(--white-bg) !important;
  }
}

.top-title {
  width: calc(100% - 70px);
  margin: 0 auto;
  word-break: break-all;
  font-size: 20px;
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  letter-spacing: 1px;
  border-bottom: 1px solid var(--black-t6);
}

.main-title {
  margin-bottom: 16px;
  word-break: break-all;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
}


.base-table {
  width: 100%;
  border: 1px solid var(--black-t6);
  border-collapse: collapse;
  font-size: 16px;

  // .ant-form-item {
  //   margin-bottom: 0px;
  // }
  // .ant-input, .ant-select {
  //   width: 100%;
  //   min-width: 100px;
  // }
  tr {
    height: 40px;

    td {
      min-height: 40px;
      padding: 10px;
      // padding: 10px 0 10px 10px;
    }
  }

}

.item {
  display: flex;
  align-items: center;
  margin-right: 8px;

  .label {
    width: 100px;
    text-align: right;
  }

  >div:not(:first-child) {
    flex: 1;
  }

  .ant-picker,
  .ant-select,
  .ant-input-number {
    width: 100%;
  }
}
</style>
