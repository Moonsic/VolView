<template>

  <a-card class="report-card-page">

    <div class="page-content" ref="pageRef" id="report-page-xuanwu" :class="[isEdit ? 'is-edit' : 'no-edit']">

      <!-- <div class="top-title">首都医科大学宣武医院</div> -->
      <div class="main-title">脑磁图中心磁源成像报告</div>


      <table class="base-table top-table mb8" border="1" cellspacing="0" cellpadding="0">
        <colgroup>
          <col style="width: 25%">
          <col style="width: 23%">
          <col style="width: 23%">
          <col style="width: 29%">
        </colgroup>
        <tbody>
          <tr>
            <td>
              <div class="item">
                <div class="label">姓名：</div>
                <div v-if="!isEdit">{{ allData.base_info?.name }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.name" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">性别：</div>
                <div v-if="!isEdit">{{ allData.base_info?.gender }}</div>
                <div v-else>
                  <a-select v-model:value="allData.base_info.gender" :options="genderList" allowClear
                    placeholder="请选择" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">年龄：</div>
                <div v-if="!isEdit">{{ allData.base_info?.age }}</div>
                <div v-else>
                  <a-input-number v-model:value="allData.base_info.age" :min="0" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">MEG号：</div>
                <div v-if="!isEdit">{{ allData.base_info?.meg_id }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.meg_id" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="3">
              <div class="item">
                <div class="label">科别：</div>
                <div v-if="!isEdit">{{ allData.base_info?.order_dept }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.order_dept" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">住院号：</div>
                <div v-if="!isEdit">{{ allData.base_info?.hospital_num }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.hospital_num" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="item">
                <div class="label">检查项目：</div>
                <div v-if="!isEdit">{{ allData.base_info?.check_item }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.check_item" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="1">
              <div class="item">
                <div class="label">检查部位：</div>
                <div v-if="!isEdit">{{ allData.base_info?.check_area }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.check_area" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="item">
                <div class="label">临床诊断：</div>
                <div v-if="!isEdit">{{ allData.base_info?.diagnosis }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.diagnosis" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">检查时间：</div>
                <div v-if="!isEdit">{{ allData.base_info?.check_time }}</div>
                <div v-else>
                  <a-date-picker v-model:value="allData.base_info.check_time" placeholder="请选择日期" allowClear
                    format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
                </div>
              </div>
            </td>
          </tr>



          <tr class="desc-box">
            <td colspan="4">
              <div class="mb8">描述：</div>
              <div class="item">
                <div class="ml32"></div>
                <div v-if="!isEdit">{{ allData.analysis_info?.description }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.description" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
              <div class="mb8">脑磁图结果：</div>

              <div class="item ml32">
                <div class="label">背景：</div>
                <div v-if="!isEdit">{{ allData.analysis_info?.meg_result?.background }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.meg_result.background" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
              <div class="item ml32">
                <div class="label">慢波：</div>
                <div v-if="!isEdit">{{ allData.analysis_info?.meg_result?.slow_wave }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.meg_result.slow_wave" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>
              <div class="item ml32 mb32">
                <div class="label">棘波源定位：</div>
                <div v-if="!isEdit">{{ allData.analysis_info?.meg_result?.spike_sl }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.meg_result.spike_sl" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>

              <div class="item ml32 mb32">
                <div class="label">印象：</div>
                <div v-if="!isEdit">{{ allData.analysis_info?.conclusion }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.conclusion" allowClear placeholder="请输入"
                    :auto-size="{ minRows: 2 }" />
                </div>
              </div>

              <div class="flex-between pl8 pr8">
                <div class="item">
                  <div class="label">报告医生：</div>
                  <div v-if="!isEdit">{{ allData.report_doctor }}</div>
                  <div v-else>
                    <a-input v-model:value="allData.report_doctor" allowClear placeholder="请输入" />
                  </div>
                </div>
                <div class="item">
                  <div class="label">报告日期：</div>
                  <div v-if="!isEdit">{{ allData.report_time }}</div>
                  <div v-else>
                    <a-date-picker v-model:value="allData.report_time" placeholder="请选择日期" allowClear
                      format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>



      <table class="base-table top-table mt16 page-break" border="1" cellspacing="0" cellpadding="0">
        <tbody>

          <tr :class="{ 'page-break': index > 0 }" v-for="(item, index) in allData.typical_spikes"
            :key="item.spike_time">
            <td>
              <div class="item mb8" v-if="index === 0">
                <div class="label">典型棘波信号：</div>
              </div>
              <div class="item mb8">
                <div class="label">典型棘波时刻点 {{ allData.typical_spikes?.spike_time }}，所在脑磁图文件： {{
                  item?.file_path }}</div>
              </div>
              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="item?.waves_fig" v-if="item?.waves_fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="item?.waves_fig">
                    <a-button class="delete-box" @click="deleteImg('waves_fig', index)">删除图片</a-button>
                    <img class="copy-image" :src="item.waves_fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('waves_fig', index)">点击粘贴图片</div>
                </div>
              </div>


              <div class="item">
                <div class="label">拓扑图和通道布局图：</div>
              </div>

              <div class="img-box">
                <template v-if="!isEdit">
                  <div>
                    <div class="left">
                      <div class="img-wrap top">
                        <img :src="item?.topo_fig" v-if="item?.topo_fig" alt="">
                      </div>
                    </div>
                    <div class="img-wrap right">
                      <img :src="item?.layout_fig" v-if="item?.layout_fig" alt="">
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <div class="left">
                      <div class="img-wrap top">
                        <template v-if="item?.topo_fig">
                          <a-button class="delete-box" @click="deleteImg('topo_fig', index)">删除图片</a-button>
                          <img class="copy-image" :src="item.topo_fig" alt="" />
                        </template>
                        <div v-else class="paste-box" @click="pasteImg('topo_fig', index)">点击粘贴图片</div>
                      </div>
                    </div>

                    <div class="img-wrap right">
                      <template v-if="item?.layout_fig">
                        <a-button class="delete-box" @click="deleteImg('layout_fig', index)">删除图片</a-button>
                        <img class="copy-image" :src="item.layout_fig" alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteImg('layout_fig', index)">点击粘贴图片</div>
                    </div>
                  </div>
                </template>
              </div>


              <!-- <div class="img-box">

              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="allData.typical_spikes?.topo_fig" v-if="allData.typical_spikes?.topo_fig"
                    alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="allData.typical_spikes?.topo_fig">
                    <a-button class="delete-box" @click="deleteImg('topo_fig')">删除图片</a-button>
                    <img class="copy-image" :src="allData.typical_spikes.topo_fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('topo_fig')">点击粘贴图片</div>
                </div>
              </div>
              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="allData.typical_spikes?.layout_fig"
                    v-if="allData.typical_spikes?.layout_fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="allData.typical_spikes?.layout_fig">
                    <a-button class="delete-box" @click="deleteImg('layout_fig')">删除图片</a-button>
                    <img class="copy-image" :src="allData.typical_spikes.layout_fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('layout_fig')">点击粘贴图片</div>
                </div>
              </div>
            </div> -->

            </td>
          </tr>



          <!-- <tr class="page-break">
          <td>
            <div class="item">
              <div class="label">通道布局图：</div>
            </div>
            <div class="item">
              <div class="img-wrap" v-if="!isEdit">
                <img :src="allData.typical_spikes?.layout_fig"
                  v-if="allData.typical_spikes?.layout_fig" alt="">
              </div>
              <div class="img-wrap" v-else>
                <template v-if="allData.typical_spikes?.layout_fig">
                  <a-button class="delete-box" @click="deleteImg('layout_fig')">删除图片</a-button>
                  <img class="copy-image" :src="allData.typical_spikes.layout_fig" alt="" />
                </template>
                <div v-else class="paste-box" @click="pasteImg('layout_fig')">点击粘贴图片</div>
              </div>
            </div>
          </td>
        </tr> -->



          <tr class="page-break">
            <td>
              <div class="item">
                <div class="label">发作间期偶极子总览：</div>
              </div>
              <div class="img-box-overview">
                <template v-if="!isEdit">
                  <div class="row">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index"
                      :class="{ 'no-margin': !allData.inter_dipole_overview?.axial_plane[index]?.fig }">
                      <img :src="allData.inter_dipole_overview?.axial_plane[index]?.fig"
                        v-if="allData.inter_dipole_overview?.axial_plane[index]?.fig" alt="">
                    </div>
                  </div>
                  <div class="row"
                    :class="{ 'page-break': allData.inter_dipole_overview?.axial_plane.length + allData.inter_dipole_overview?.coronal_plane.length > 24 }">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index"
                      :class="{ 'no-margin': !allData.inter_dipole_overview?.coronal_plane[index]?.fig }">
                      <img :src="allData.inter_dipole_overview?.coronal_plane[index]?.fig"
                        v-if="allData.inter_dipole_overview?.coronal_plane[index]?.fig" alt="">
                    </div>
                  </div>
                  <div class="row"
                    :class="{ 'page-break': allData.inter_dipole_overview?.axial_plane.length + allData.inter_dipole_overview?.coronal_plane.length + allData.inter_dipole_overview?.sagittal_plane.length > 24 }">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index"
                      :class="{ 'no-margin': !allData.inter_dipole_overview?.sagittal_plane[index]?.fig }">
                      <img :src="allData.inter_dipole_overview?.sagittal_plane[index]?.fig"
                        v-if="allData.inter_dipole_overview?.sagittal_plane[index]?.fig" alt="">
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="row">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index">
                      <template v-if="allData.inter_dipole_overview.axial_plane[index]?.fig">
                        <a-button class="delete-box" @click="deleteOverviewImg('axial_plane', index)">删除</a-button>
                        <img class="copy-image" :src="allData.inter_dipole_overview.axial_plane[index]?.fig" alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteOverviewImg('axial_plane', index)">点击粘贴图片</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index">
                      <template v-if="allData.inter_dipole_overview.coronal_plane[index]?.fig">
                        <a-button class="delete-box" @click="deleteOverviewImg('coronal_plane', index)">删除</a-button>
                        <img class="copy-image" :src="allData.inter_dipole_overview.coronal_plane[index]?.fig" alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteOverviewImg('coronal_plane', index)">点击粘贴图片</div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index">
                      <template v-if="allData.inter_dipole_overview.sagittal_plane[index]?.fig">
                        <a-button class="delete-box" @click="deleteOverviewImg('sagittal_plane', index)">删除</a-button>
                        <img class="copy-image" :src="allData.inter_dipole_overview.sagittal_plane[index]?.fig"
                          alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteOverviewImg('sagittal_plane', index)">点击粘贴图片</div>
                    </div>
                  </div>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>




  </a-card>

  <a-card class="report-card-page mt8">


  </a-card>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import testimg from './testimg.png' // 测试用的
import html2pdf from 'html2pdf.js'
// import { calculateAge } from '@u/utils'
import { calculateAge, convertAllUrlsToBase64, convertToBase64 } from '@u/utils'

import { previewImg } from '@u/preview'

import {
  getXuanwuReportDataApi, // 2. 获取宣武报告数据
  saveXuanwuReportDataApi, // 3. 保存宣武报告数据
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

const nowTime = ref<number>()

// 获取报告数据
async function getXuanwuReportData() {
  if (!subjectId.value) return message.error('请先选择患者')
  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getXuanwuReportDataApi(params)
  loading.value = false
  if (code === 200) {
    nowTime.value = new Date().getTime()

    // 给所有图片加上时间戳，防止缓存，3处
    if (data.typical_spikes && data.typical_spikes.length) {
      const figKeys = ['waves_fig', 'topo_fig', 'layout_fig']
      data.typical_spikes.forEach((item: any) => {
        figKeys.forEach(key => {
          if (item[key]) {
            item[key] = item[key] + '?t=' + nowTime.value
          }
        })
      })
    }

    if (data.inter_dipole_overview) {
      Object.entries(data.inter_dipole_overview).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          data.inter_dipole_overview[key] = values.map((item: any) => {
            return {
              fig: item?.fig ? item.fig + '?t=' + nowTime.value : null,
              slice_num: item?.slice_num,
            }
          })
        }
      })
    }

    // console.log('data :>> ', data);
    allData.value = data || {}

    if (allData.value.base_info.birth_date?.length === 7) {
      allData.value.base_info.birth_date = allData.value.base_info.birth_date + '-01'
    }


    // 先把图片转化成base64
    await convertAllUrlsToBase64(allData.value);
  }
}


const isEdit = ref<boolean>(false)
function onEdit(bool: boolean) {
  isEdit.value = bool
  if (!bool) {
    getXuanwuReportData()
  }
}

// 修改出生日期自动计算年龄
function changeBirthDate(date: string) {
  allData.value.base_info.age = calculateAge(date)
}

async function onSave() {

  const reportInfo = convertObject(allData.value)

  // 修复1: 使用Promise.all处理typicalSpikes
  const typicalPromises = reportInfo.typicalSpikes.map(async (item: any) => {
    const keys = Object.keys(item)
    const promises = keys.map(async key => {
      if (typeof item[key] === 'string' && item[key].startsWith('http://')) {
        item[key] = await convertToBase64(item[key])
      }
    })
    await Promise.all(promises)
  })
  await Promise.all(typicalPromises)

  // 修复2: 正确修改interDipoleOverview数组
  const arrayPromises = Object.values(reportInfo.interDipoleOverview)
    .filter(value => Array.isArray(value))
    .map(async (array: any[]) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] && typeof array[i].fig === 'string' && array[i].fig.startsWith('http://')) {
          array[i].fig = await convertToBase64(array[i].fig)
        }
        // 把是null的元素改成{fig: null, slice_num: 0}
        if (!array[i]) {
          array[i] = {
            fig: null,
            slice_num: 0,
          }
        }
      }
    })

  await Promise.all(arrayPromises)

  delete reportInfo.iedOverview

  const params = {
    subjectId: subjectId.value,
    reportInfo: reportInfo
  }

  loading.value = true
  const { code, msg } = await saveXuanwuReportDataApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    onEdit(false)
    emit('success')
  } else {
    emit('fail')
  }
}

const emit = defineEmits(['success', 'fail'])


// 暴露方法
defineExpose({
  onEdit,
  onSave,
  getScreenshot,
})


async function pasteImg(type: string, index: number) {
  const img = await getClipboard()
  allData.value.typical_spikes[index][type] = img
}

function deleteImg(type: string, index: number) {
  allData.value.typical_spikes[index][type] = null
}

async function pasteOverviewImg(type: string, index: number) {
  const img = await getClipboard()
  allData.value.inter_dipole_overview[type][index] = {
    fig: img,
    slice_num: 0,
  }
}

function deleteOverviewImg(type: string, index: number) {
  allData.value.inter_dipole_overview[type][index] = {
    fig: null,
    slice_num: 0,
  }
}



const getClipboard = async () => {
  try {
    // 检查浏览器是否支持 Clipboard API
    if (!navigator.clipboard || !navigator.clipboard.read) {
      throw new Error('您的浏览器不支持剪贴板读取API')
    }

    // 读取剪贴板内容
    const clipboardItems = await navigator.clipboard.read()

    for (const clipboardItem of clipboardItems) {
      // 查找图片类型
      for (const type of clipboardItem.types) {
        if (type.startsWith('image/')) {
          const blob = await clipboardItem.getType(type)
          return await convertBlobToBase64(blob) // 找到第一个图片后返回
        }
      }
    }

    message.info('暂无可粘贴的图片')
    throw new Error('剪贴板中没有找到图片')
  } catch (error) {
    console.error('粘贴图片失败:', error)
    // 降级方案：使用 document.execCommand('paste')
    // fallbackPaste()
  }
};

// 将Blob转换为Base64
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.readAsDataURL(blob)
  })
};


// 把对象里所有的_改成驼峰 a_b => aB
function convertObject(obj: any) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item: any) => convertObject(item));
  }

  const newObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    // 优化：处理连续下划线，并确保首字母不大写
    const newKey = key
      .replace(/^_+/, '') // 移除开头的下划线
      .replace(/_+/g, (match) => match.length > 1 ? '' : '_') // 合并连续下划线为单个
      .replace(/_(.)/g, (_, char) => char.toUpperCase()); // 将下划线后的字符大写，不止a-z 数字也是
    newObj[newKey] = convertObject(value)
  }

  return newObj
}


function getScreenshot() {
  onDownload()
}



// 下载
function onDownload() {
  const element = document.getElementById('report-page-xuanwu')
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
      format: [1000, 1414],
      // format: [1200,1697],

      orientation: 'portrait',
    }
  }

  html2pdf().from(element).set(opt).save()
}

</script>

<style lang="less" scoped>
@--color-primary: #235cac;

@width: 1200px;

.report-card-page {
  transform-origin: top;
  width: @width;
  margin: 0 auto;
  color: var(--color-t2);
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

  tr {
    height: 40px;

    td {
      min-height: 40px;
      padding: 10px;
    }
  }

}

.item {
  display: flex;
  align-items: center;

  .label {
    margin-right: 4px;
    min-width: 50px;
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

.desc-box {
  .item {
    align-items: flex-start;
    margin-bottom: 8px;

    &.mb32 {
      margin-bottom: 32px;
    }
  }
}

.top-table {
  table-layout: fixed;
  width: 100%;
}

.bottom-table {
  tr {
    td:first-child {
      width: 150px;
    }
  }
}


.img-wrap {
  position: relative;
  width: 100%;
  min-height: 200px;
  border-radius: 10px;
  overflow: hidden;
  margin: 8px;

  &.no-margin {
    margin: 0 8px;
  }
}



img {
  width: 100%;
  height: 100%;

  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;

  display: block;
}

.copy-image {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.img-box {

  .img-wrap {
    width: auto;
    height: 100%;
  }

  >div {
    display: flex;

    .left {
      flex: 2;
      display: flex;
      flex-direction: column;

      >div {
        // flex: 1;
      }
    }

    .right {
      flex: 3;
    }
  }
}

.img-box-overview {

  >.row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;


    >div {
      width: calc((100% - 8px * 8) / 4);
    }
  }
}



.paste-box {
  width: 100%;
  height: 100%;
  min-height: 198px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--black-t4);
  cursor: pointer;
}

.delete-box {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 99;
  color: var(--black-t2);
  background: var(--white-t2); // 始终是白底黑色好看
  height: 32px;
}


.is-edit {
  .img-wrap {
    border: 1px dashed var(--color-primary);
    min-height: 100px;
  }
}

.no-edit {
  .img-wrap {
    min-height: 0px;
  }

  .img-box-overview {
    .img-wrap {
      border-radius: 0;
    }
  }
}


.img-title {
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(1, 4, 9, 0.89);
  word-break: break-all;
  line-height: 1.3;
}

.zoom-in {
  cursor: zoom-in;
}
</style>
