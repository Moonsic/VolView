<template>

  <a-card class="report-card-page">

    <div class="page-content" ref="pageRef" id="report-page-general" :class="[isEdit ? 'is-edit' : 'no-edit']">

      <div class="main-title">{{ t('通用脑磁图报告') }}</div>

      <table class="base-table top-table mb8" border="1" cellspacing="0" cellpadding="0">

        <colgroup>
          <col style="width: 24%">
          <col style="width: 18%">
          <col style="width: 18%">
          <col style="width: 20%">
          <col style="width: 20%">
        </colgroup>
        <tbody>
          <tr>
            <td>
              <div class="item">
                <div class="label">{{ t('姓名') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.name }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.name" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">{{ t('性别') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.gender }}</div>
                <div v-else>
                  <a-select v-model:value="allData.base_info.gender" :options="genderList" allowClear
                    :placeholder="t('请选择')" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">{{ t('年龄') }}：</div>
                <div>{{ allData.base_info?.age }}</div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">{{ t('出生日期') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.birth_date }}</div>
                <div v-else>
                  <a-date-picker v-model:value="allData.base_info.birth_date" :placeholder="t('请选择日期')" allowClear
                    format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" @change="changeBirthDate" />
                  <!-- <a-month-picker v-model:value="allData.base_info.birth_date" placeholder="请选择年月" allowClear format="YYYY-MM" valueFormat="YYYY-MM" /> -->
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">{{ t('利手') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.handness }}</div>
                <div v-else>
                  <a-select v-model:value="allData.base_info.handness" :options="handnessList" allowClear
                    :dropdownMatchSelectWidth="false" :placeholder="t('请选择')" />
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="item">
                <div class="label">{{ t('脑磁图号') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.meg_id }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.meg_id" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td colspan="1">
              <div class="item">
                <div class="label max-width-102">{{ t('住院号') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.hospital_num }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.hospital_num" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label max-width-90">{{ t('申请科室') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.order_dept }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.order_dept" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label max-width-90">{{ t('申请医生') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.order_provider }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.order_provider" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label max-width-90">{{ t('检查时间') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.check_time }}</div>
                <div v-else>
                  <a-date-picker v-model:value="allData.base_info.check_time" :placeholder="t('请选择日期')" allowClear
                    format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="3">
              <div class="item">
                <div class="label">{{ t('临床诊断') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.diagnosis }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.diagnosis" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">{{ t('临床用药其他治疗') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.medic_other_treat }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.medic_other_treat" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="5">
              <div class="item">
                <div class="label">{{ t('患者主诉') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.complaint }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.complaint" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
          </tr>


          <tr>
            <td colspan="3">
              <div class="item">
                <div class="label">{{ t('检查状态') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.patient_status }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.patient_status" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">{{ t('检查方式') }}：</div>
                <div v-if="!isEdit">{{ allData.base_info?.check_type }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.check_type" allowClear :placeholder="t('请输入')" />
                </div>
              </div>
            </td>
          </tr>


          <tr>
            <td colspan="5">
              <div class="item">
                <div class="label">{{ t('脑磁图结果') }}：</div>
                <div v-if="!isEdit">{{ allData.analysis_info?.conclusion }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.conclusion" allowClear :placeholder="t('请输入')"
                    :auto-size="{ minRows: 1 }" />
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td colspan="5">
              <div class="item">
                <div class="label">{{ t('备注') }}：</div>
                <div v-if="!isEdit">{{ allData.analysis_info?.notes }}</div>
                <div v-else>
                  <a-textarea v-model:value="allData.analysis_info.notes" allowClear :placeholder="t('请输入')"
                    :auto-size="{ minRows: 1 }" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>


      <div class="flex-between mt8 mb32 pl8 pr8">
        <div class="item">
          <div class="label">{{ t('报告医生') }}：</div>
          <div v-if="!isEdit">{{ allData.report_doctor }}</div>
          <div v-else>
            <a-input v-model:value="allData.report_doctor" allowClear :placeholder="t('请输入')" />
          </div>
        </div>
        <div class="item">
          <div class="label">{{ t('脑磁图技师') }}：</div>
          <div v-if="!isEdit">{{ allData.meg_technician }}</div>
          <div v-else>
            <a-input v-model:value="allData.meg_technician" allowClear :placeholder="t('请输入')" />
          </div>
        </div>
        <div class="item">
          <div class="label">{{ t('报告日期') }}：</div>
          <div v-if="!isEdit">{{ allData.report_time }}</div>
          <div v-else>
            <a-date-picker v-model:value="allData.report_time" :placeholder="t('请选择日期')" allowClear format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD" />
          </div>
        </div>
      </div>



      <table class="base-table top-table mt16" border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td>
              <div class="item mb16">
                <div class="label">{{ t('棘波数量分布（脑区按溯源定位结果确定）') }}：</div>
              </div>

              <div class="ied-list">
                <div class="header">
                  <div>{{ t('脑区') }}</div>
                  <div v-for="(item, index) in brainRegionList" :key="index">{{ item }}</div>
                </div>
                <div class="item item-bg-white">
                  <div>{{ t('IED阳性数量') }}</div>
                  <div v-for="(item, index) in brainRegionList" :key="index">
                    {{ allData.ied_overview?.br_distribute?.[item].spikes_num }}
                  </div>
                </div>
                <div class="item">
                  <div>{{ t('占比') }}</div>
                  <div v-for="(item, index) in brainRegionList" :key="index">
                    {{ allData.ied_overview?.br_distribute?.[item].percent }}
                  </div>
                </div>
              </div>

              <div class="flex-center flex-wrap ied-img-list" v-if="allData?.ied_overview">
                <div
                  :class="{ 'page-break': index === 5 || index === 15 || index === 25, 'widthP100': allData?.ied_overview.ied_file_overview.length === 1 }"
                  v-for="(item, index) in allData?.ied_overview.ied_file_overview" :key="index">
                  <img class="zoom-in" :src="`${item.fig_url}`" @click="previewImg(item.fig_url)" />
                  <div class="img-title">{{ t('图') }}{{ index + 1 }}. {{ item.fif_fname }} {{ t('文件的MEG数据IED分布') }}
                  </div>
                </div>
              </div>

            </td>
          </tr>

          <tr :class="{ 'page-break': index % 2 === 0 }" v-for="(item, index) in allData.typical_spikes"
            :key="item.spike_time">
            <td>
              <div class="item mb8" v-if="index === 0">
                <div class="label">{{ t('典型棘波信号') }}：</div>
              </div>
              <div class="item mb8">
                <div class="label">{{ t('典型棘波时刻点') }} {{ item?.spike_time }}，{{ t('所在脑磁图文件') }}： {{
                  item?.file_path }}</div>
              </div>
              <div class="item">
                <div class="label" v-if="item?.waves_notes || isEdit">{{ t('备注') }}：</div>
                <div v-if="!isEdit">{{ item?.waves_notes }}</div>
                <div v-else>
                  <a-input v-model:value="item.waves_notes" allowClear :placeholder="t('请输入备注')" />
                </div>
              </div>
              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="item?.waves_fig" v-if="item?.waves_fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="item?.waves_fig">
                    <a-button class="delete-box" @click="deleteImg('waves_fig', index)">{{ t('删除图片') }}</a-button>
                    <img class="copy-image" :src="item.waves_fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('waves_fig', index)">{{ t('点击粘贴图片') }}</div>
                </div>
              </div>

              <div class="item mb8" :class="{ 'page-break': index % 2 === 1 }">
                <div class="label">{{ t('拓扑图和通道布局图') }}：</div>
              </div>
              <div class="item">
                <div class="label" v-if="item?.layout_3dtopo_notes || isEdit">{{ t('备注') }}：</div>
                <div v-if="!isEdit">{{ item?.layout_3dtopo_notes }}</div>
                <div v-else>
                  <a-input v-model:value="item.layout_3dtopo_notes" allowClear :placeholder="t('请输入备注')" />
                </div>
              </div>
              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="item?.layout_3dtopo_fig" v-if="item?.layout_3dtopo_fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="item?.layout_3dtopo_fig">
                    <a-button class="delete-box" @click="deleteImg('layout_3dtopo_fig', index)">{{ t('删除图片')
                    }}</a-button>
                    <img class="copy-image" :src="item.layout_3dtopo_fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('layout_3dtopo_fig', index)">{{ t('点击粘贴图片') }}</div>
                </div>
              </div>

              <div class="item mb8" :class="{ 'page-break': index % 2 === 0 }">
                <div class="label">{{ t('溯源结果') }}：</div>
              </div>
              <div class="item">
                <div class="label" v-if="item?.sl_notes || isEdit">{{ t('备注') }}：</div>
                <div v-if="!isEdit">{{ item?.sl_notes }}</div>
                <div v-else>
                  <a-input v-model:value="item.sl_notes" allowClear :placeholder="t('请输入备注')" />
                </div>
              </div>
              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="item?.typical_spike_sl_fig" v-if="item?.typical_spike_sl_fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="item?.typical_spike_sl_fig">
                    <a-button class="delete-box" @click="deleteImg('typical_spike_sl_fig', index)">{{ t('删除图片')
                    }}</a-button>
                    <img class="copy-image" :src="item.typical_spike_sl_fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('typical_spike_sl_fig', index)">{{ t('点击粘贴图片') }}</div>
                </div>
              </div>

            </td>
          </tr>


          <tr class="page-break">
            <td>
              <div class="item mb8">
                <div class="label">{{ t('发作间期偶极子总览') }}：</div>
              </div>
              <div class="item">
                <div class="label" v-if="allData?.inter_dipole_overview?.overview_notes || isEdit">{{ t('备注') }}：</div>
                <div v-if="!isEdit">{{ allData?.inter_dipole_overview?.overview_notes }}</div>
                <div v-else>
                  <a-input v-model:value="allData.inter_dipole_overview.overview_notes" allowClear
                    :placeholder="t('请输入备注')" />
                </div>
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
                        <a-button class="delete-box" @click="deleteOverviewImg('axial_plane', index)">{{ t('删除')
                        }}</a-button>
                        <img class="copy-image" :src="allData.inter_dipole_overview.axial_plane[index]?.fig" alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteOverviewImg('axial_plane', index)">{{ t('点击粘贴图片') }}
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index">
                      <template v-if="allData.inter_dipole_overview.coronal_plane[index]?.fig">
                        <a-button class="delete-box" @click="deleteOverviewImg('coronal_plane', index)">{{ t('删除')
                        }}</a-button>
                        <img class="copy-image" :src="allData.inter_dipole_overview.coronal_plane[index]?.fig" alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteOverviewImg('coronal_plane', index)">{{ t('点击粘贴图片') }}
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="img-wrap" v-for="(item, index) in 16" :key="index">
                      <template v-if="allData.inter_dipole_overview.sagittal_plane[index]?.fig">
                        <a-button class="delete-box" @click="deleteOverviewImg('sagittal_plane', index)">
                          {{ t('删除') }}
                        </a-button>
                        <img class="copy-image" :src="allData.inter_dipole_overview.sagittal_plane[index]?.fig"
                          alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteOverviewImg('sagittal_plane', index)">{{ t('点击粘贴图片') }}
                      </div>
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



</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import testimg from './testimg.png' // 测试用的
import html2pdf from 'html2pdf.js'
// import { calculateAge } from '@u/utils'
import { calculateAge, convertAllUrlsToBase64, convertToBase64 } from '@u/utils'

import { previewImg } from '@u/preview'

import {
  getGeneralReportDataApi, // 2. 获取通用报告数据
  saveGeneralReportDataApi, // 3. 保存通用报告数据
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
  { label: t('男'), value: t('男') },
  { label: t('女'), value: t('女') },
]
const handnessList = [
  { label: t('右利手'), value: t('右利手') },
  { label: t('左利手'), value: t('左利手') },
]

const brainRegionList = ['LT', 'RT', 'LP', 'RP', 'LO', 'RO', 'LF', 'RF', 'Manual'] // 表头，也是脑区列表


const nowTime = ref<number>()

// 获取报告数据
async function getGeneralReportData() {
  if (!subjectId.value) return message.error(t('请先选择患者'))
  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getGeneralReportDataApi(params)
  loading.value = false
  if (code === 200) {
    nowTime.value = new Date().getTime()

    // 给所有图片加上时间戳，防止缓存，3处
    if (data.typical_spikes && data.typical_spikes.length) {
      const figKeys = ['waves_fig', 'layout_3dtopo_fig', 'typical_spike_sl_fig']
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
          data.inter_dipole_overview[key] = values.map((item: any) => item?.fig ? item.fig + '?t=' + nowTime.value : null)
          data.inter_dipole_overview[key] = values.map((item: any) => {
            return {
              fig: item?.fig ? item.fig + '?t=' + nowTime.value : null,
              slice_num: item?.slice_num,
            }
          })
        }
      })
    }

    if (data.ied_overview) {
      if (data.ied_overview.br_distribute) {
        // 添加一个手动标注的数据
        data.ied_overview.br_distribute['Manual'] = { spikes_num: data.ied_overview?.manual_spikes_num || 0, percent: '-' }
      }

      if (data.ied_overview.ied_file_overview) {
        data.ied_overview.ied_file_overview.forEach((item: any) => {
          if (item.fig_url) {
            item.fig_url = item.fig_url + '?t=' + nowTime.value
          }
        })

        // // 测试多个分布图
        // const baseFig = data.ied_overview.ied_file_overview[0]?.fig_url;
        // for (let i = 3; i <= 17; i++) {
        //   data.ied_overview.ied_file_overview[i] = { fig_url: baseFig };
        // }

      }
    }

    // console.log('data :>> ', data);
    allData.value = data || {}

    if (allData.value.base_info.birth_date?.length === 7) {
      allData.value.base_info.birth_date = allData.value.base_info.birth_date + '-01'
    }


    // 先把图片转化成base64
    // await convertAllUrlsToBase64(allData.value)
  }
}


const isEdit = ref<boolean>(false)
function onEdit(bool: boolean) {
  isEdit.value = bool
  if (!bool) {
    getGeneralReportData()
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

  // // 把是null的元素改成{fig: null, slice_num: 0}
  // Object.values(reportInfo.interDipoleOverview).forEach((value: any) => {
  //   if (Array.isArray(value)) {
  //     // 遍历数组索引，直接修改原数组
  //     for (let i = 0; i < value.length; i++) {
  //       console.log('value[i] :>> ', value[i]);
  //       // 空值的话要改成这个
  //       if (!value[i]) {
  //         value[i] = {  // 直接通过索引修改原数组
  //           fig: null,
  //           sliceNum: 0,
  //         };
  //       }
  //     }
  //   }
  // })

  delete reportInfo.iedOverview

  // console.log('reportInfo :>> ', reportInfo);

  const params = {
    subjectId: subjectId.value,
    reportInfo: reportInfo
  }

  loading.value = true
  const { code, msg } = await saveGeneralReportDataApi(params)
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
      throw new Error(t('您的浏览器不支持剪贴板读取API'))
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

    message.info(t('暂无可粘贴的图片'))
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
    return obj.map((item: any) => convertObject(item))
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
  const element = document.getElementById('report-page-general')
  const opt = {
    margin: 16, // 没有页边距
    filename: `${megId.value}_${t('临床报告.pdf')}`,
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
      // format: [1000, 1414],/
      format: [1150, 1626],
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

// .ant-select-dropdown {
//   background-color: var(--white-bg) !important;
// }


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
    // width: 100px;
    // text-align: right;
    margin-right: 4px;
    min-width: 50px;
  }

  // 这2个max-width是为了适配英文标题。
  .max-width-102 {
    max-width: 102px;
  }

  .max-width-90 {
    max-width: 90px;
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
  // border: 1px solid red;
  min-height: 0;

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
  }

  >div {
    display: flex;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;

      >div {
        flex: 1;
      }
    }

    .right {
      flex: 2;
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


.is-edit {
  .img-wrap {
    min-height: 100px;
    border: 1px dashed var(--color-primary);
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




.img-title {
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--black-t2);
  word-break: break-all;
  line-height: 1.3;
}



.ied-list {
  font-size: 15px;
  border-radius: 8px;
  margin: 0 16px;
  overflow: hidden;

  .header,
  .item {
    height: 46px;
    display: flex;
    align-items: stretch;
    justify-content: center;

    >div {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;

      &:not(:last-child) {
        margin-right: 1px;
      }
    }
  }

  .header {
    >div {
      color: #fff;
      background: @--color-primary;
    }
  }

  .item {
    border-top: 1px solid #fff;
    // border-top: 1px solid var(--color-bg);

    >div {
      color: var(--black-t2);
      background: rgba(35, 92, 172, 0.05);
    }

    &.item-bg-white {
      >div {
        background: rgba(35, 92, 172, 0.01);
      }
    }
  }

  // IED数量分布的第一列，字太长，稍微宽一点

  .header,
  .item {
    >div:first-child {
      flex: 1.5;
    }
  }
}


.zoom-in {
  cursor: zoom-in;
}


.ied-img-list {
  margin-top: 30px;

  >div {
    width: calc(50% - 8px); // 配合ml4 mr4来的
    height: 300px; //A4纸的高度约是 1131.43px。 1131.43px/4=228.85px, 调试后发现280px适合，但每页最后2个高度的282px;
    // border: 1px solid red;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;


    &:nth-child(2n+1) {
      margin-right: 8px;
    }

    &:nth-child(2n) {
      margin-left: 8px;
    }


    // // 前4个高度固定住，不要受其他的影响
    // &:nth-child(1),
    // &:nth-child(2),
    // &:nth-child(3),
    // &:nth-child(4) {
    //   height: 300px;

    //   img {
    //     margin-top: -22px;
    //   }
    // }

    // :class="{ 'mt16': index === 4 || index === 5 || index === 12 || index === 13 || index === 20 || index === 21  }"


    // 这都是每页的最后2个，高度额外高一点，整好8个撑满1页。
    // &:nth-child(11),
    // &:nth-child(12),
    // &:nth-child(19),
    // &:nth-child(20),
    // &:nth-child(27),
    // &:nth-child(28) {
    //   height: 282px;
    // }

    // 只有一个时，这一个会撑满宽度。
    &.widthP100 {
      width: 100%;
      height: 505px;
      margin: 0;

      img {
        width: 662px;
        height: 444px;
      }
    }

  }

  img {
    width: 331px;
    height: 222px;
  }

}

.avoid-break {
  page-break-inside: avoid;
  /* 避免元素内部被分页分割 */
  break-inside: avoid;
}

.avoid-break-inside {
  page-break-inside: avoid;
  break-inside: avoid;
}

.page-break-before {
  page-break-before: always;
}
</style>
