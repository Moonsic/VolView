<template>

  <a-card class="report-card-page">

    <div class="page-content" ref="pageRef" id="report-page-huaxi" :class="[isEdit ? 'is-edit' : 'no-edit']">

      <div class="top-title">四川大学华西医院脑磁图室</div>
      <div class="main-title">脑磁图监测报告</div>


      <table class="base-table top-table mb8" border="1" cellspacing="0" cellpadding="0">

        <colgroup>
          <col style="width: 26%">
          <col style="width: 17%">
          <col style="width: 17%">
          <col style="width: 20%">
          <col style="width: 20%">
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
                <div>{{ allData.base_info?.age }}</div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">出生日期：</div>
                <div v-if="!isEdit">{{ allData.base_info?.birth_date }}</div>
                <div v-else>
                  <a-date-picker v-model:value="allData.base_info.birth_date" placeholder="请选择日期" allowClear
                    format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" @change="changeBirthDate" />
                  <!-- <a-month-picker v-model:value="allData.base_info.birth_date" placeholder="请选择年月" allowClear format="YYYY-MM" valueFormat="YYYY-MM" /> -->
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">利手：</div>
                <div v-if="!isEdit">{{ allData.base_info?.handness }}</div>
                <div v-else>
                  <a-select v-model:value="allData.base_info.handness" :options="handnessList" allowClear
                    placeholder="请选择" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">脑磁图号：</div>
                <div v-if="!isEdit">{{ allData.base_info?.meg_id }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.meg_id" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">住院号：</div>
                <div v-if="!isEdit">{{ allData.base_info?.hospital_num }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.hospital_num" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">脑电图床号：</div>
                <div v-if="!isEdit">{{ allData.base_info?.eeg_bed_num }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.eeg_bed_num" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td>
              <div class="item">
                <div class="label">申请科室：</div>
                <div v-if="!isEdit">{{ allData.base_info?.order_dept }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.order_dept" allowClear placeholder="请输入" />
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
            <td colspan="2">
              <div class="item">
                <div class="label">临床用药其他治疗：</div>
                <div v-if="!isEdit">{{ allData.base_info?.medic_other_treat }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.medic_other_treat" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">记录电极：</div>
                <div v-if="!isEdit">{{ allData.base_info?.rec_electrode }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.rec_electrode" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">附加电极：</div>
                <div v-if="!isEdit">{{ allData.base_info?.add_electrode }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.add_electrode" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">多导生理记录：</div>
                <div v-if="!isEdit">{{ allData.base_info?.multich_phy_recording }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.multich_phy_recording" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">患者状态：</div>
                <div v-if="!isEdit">{{ allData.base_info?.patient_status }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.patient_status" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">申请医生：</div>
                <div v-if="!isEdit">{{ allData.base_info?.order_provider }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.order_provider" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">检查类型：</div>
                <div v-if="!isEdit">{{ allData.base_info?.check_type }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.check_type" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="item">
                <div class="label">记录开始日期：</div>
                <div v-if="!isEdit">{{ allData.base_info?.record_st_time }}</div>
                <div v-else>
                  <a-date-picker v-model:value="allData.base_info.record_st_time" placeholder="请选择日期" allowClear
                    format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">总记录时间：</div>
                <div v-if="!isEdit">{{ allData.base_info?.total_record_time }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.total_record_time" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
            <td colspan="2">
              <div class="item">
                <div class="label">仪器：</div>
                <div v-if="!isEdit">{{ allData.base_info?.device }}</div>
                <div v-else>
                  <a-input v-model:value="allData.base_info.device" allowClear placeholder="请输入" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>


      <table class="base-table bottom-table" border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td>
              背景活动
            </td>
            <td>
              <div v-if="!isEdit">{{ allData.analysis_info?.bg_activity?.brief }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.analysis_info.bg_activity.brief" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
            <td colspan="4">
              <div v-if="!isEdit">{{ allData.analysis_info?.bg_activity?.detail }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.analysis_info.bg_activity.detail" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>
          <tr>
            <td>睡眠周期</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.analysis_info?.sleep_cycle }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.analysis_info.sleep_cycle" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>
          <tr>
            <td>诱发实验</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.analysis_info?.evoke_experiment }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.analysis_info.evoke_experiment" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>
          <tr>
            <td>背景非特异性异常</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.analysis_info?.nonspec_bg_abnorm }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.analysis_info.nonspec_bg_abnorm" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>
          <tr>
            <td>发作间期放电</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.analysis_info?.inter_discharge }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.analysis_info.inter_discharge" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>




          <tr>
            <td rowspan="3">EEG/MEG诊断</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.eegmeg_diagnosis_info?.base_diag }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.eegmeg_diagnosis_info.base_diag" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>
          <tr>
            <td>间期dipole：</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.eegmeg_diagnosis_info?.inter_dipole }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.eegmeg_diagnosis_info.inter_dipole" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 1 }" />
              </div>
            </td>
          </tr>
          <tr>
            <td>备注：</td>
            <td colspan="5">
              <div v-if="!isEdit">{{ allData.eegmeg_diagnosis_info?.notes }}</div>
              <div v-else>
                <a-textarea v-model:value="allData.eegmeg_diagnosis_info.notes" allowClear placeholder="请输入"
                  :auto-size="{ minRows: 3 }" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>



      <div class="flex-between mt8 mb8 pl8 pr8">
        <div class="item"></div>
        <div class="item">
          <div class="label">脑电图/脑磁图医师：</div>
          <div v-if="!isEdit">{{ allData.eegmeg_physician }}</div>
          <div v-else>
            <a-input v-model:value="allData.eegmeg_physician" allowClear placeholder="请输入" />
          </div>
        </div>
        <div class="item">
          <div class="label">住院医师：</div>
          <div v-if="!isEdit">{{ allData.resident }}</div>
          <div v-else>
            <a-input v-model:value="allData.resident" allowClear placeholder="请输入" />
          </div>
        </div>
        <div class="item">
          <div class="label">脑电图/脑磁图技师：</div>
          <div v-if="!isEdit">{{ allData.eegmeg_technician }}</div>
          <div v-else>
            <a-input v-model:value="allData.eegmeg_technician" allowClear placeholder="请输入" />
          </div>
        </div>
      </div>

      <div class="flex-between mt8 mb8 pl8 pr8">
        <div class="item"></div>
        <div class="item">
          <div class="label">报告日期：</div>
          <div v-if="!isEdit">{{ allData.report_time }}</div>
          <div v-else>
            <a-date-picker v-model:value="allData.report_time" placeholder="请选择日期" allowClear format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD" />
          </div>
        </div>
      </div>


      <table class="base-table top-table mt16 page-break" border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr class="page-break22" :class="{ 'page-break': index > 0 }" v-for="(item, index) in allData.typical_spikes"
            :key="item.spike_time">
            <td>
              <div class="item mb8">
                <div class="label">MEG：</div>
                <div v-if="!isEdit">{{ item?.meg_spike.loc }}</div>
                <div v-else>
                  <a-input v-model:value="item.meg_spike.loc" allowClear placeholder="请输入" />
                </div>
              </div>
              <div class="item">
                <div class="label" v-if="item?.meg_spike.meg_notes || isEdit">备注：</div>
                <div v-if="!isEdit">{{ item?.meg_spike.meg_notes }}</div>
                <div v-else>
                  <a-input v-model:value="item.meg_spike.meg_notes" allowClear placeholder="请输入备注" />
                </div>
              </div>
              <div class="item">
                <div class="img-wrap" v-if="!isEdit">
                  <img :src="item?.meg_spike.fig" v-if="item?.meg_spike.fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="item?.meg_spike.fig">
                    <a-button class="delete-box" @click="deleteImg('meg_spike', index)">删除图片</a-button>
                    <img class="copy-image" :src="item.meg_spike.fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('meg_spike', index)">点击粘贴图片</div>
                </div>
              </div>
              <!-- </td>
        </tr>

        <tr>
          <td> -->
              <div class="item mb8 page-break">
                <div class="label">EEG：</div>
                <div v-if="!isEdit">{{ item?.eeg_spike.loc }}</div>
                <div v-else>
                  <a-input v-model:value="item.eeg_spike.loc" allowClear placeholder="请输入" />
                </div>
              </div>
              <div class="item">
                <div class="label" v-if="item?.eeg_spike.eeg_notes || isEdit">备注：</div>
                <div v-if="!isEdit">{{ item?.eeg_spike.eeg_notes }}</div>
                <div v-else>
                  <a-input v-model:value="item.eeg_spike.eeg_notes" allowClear placeholder="请输入备注" />
                </div>
              </div>
              <div class="item">
                <div class="img-wrap eeg-img-wrap" v-if="!isEdit">
                  <img :src="item?.eeg_spike.fig" v-if="item?.eeg_spike.fig" alt="">
                </div>
                <div class="img-wrap" v-else>
                  <template v-if="item?.eeg_spike.fig">
                    <a-button class="delete-box" @click="deleteImg('eeg_spike', index)">删除图片</a-button>
                    <img class="copy-image" :src="item.eeg_spike.fig" alt="" />
                  </template>
                  <div v-else class="paste-box" @click="pasteImg('eeg_spike', index)">点击粘贴图片</div>
                </div>
              </div>
              <!-- </td>
        </tr>


        <tr>
          <td> -->
              <div class="item mb8">
                <div class="label">Dipole：</div>
                <div v-if="!isEdit">{{ item?.dipole.loc }}</div>
                <div v-else>
                  <a-input v-model:value="item.dipole.loc" allowClear placeholder="请输入" />
                </div>
              </div>
              <div class="item">
                <div class="label" v-if="item?.dipole.dipole_notes || isEdit">备注：</div>
                <div v-if="!isEdit">{{ item?.dipole.dipole_notes }}</div>
                <div v-else>
                  <a-input v-model:value="item.dipole.dipole_notes" allowClear placeholder="请输入备注" />
                </div>
              </div>
              <div class="img-box dipole-img-box">
                <template v-if="!isEdit">
                  <div>
                    <div class="left">
                      <div class="img-wrap top">
                        <img :src="item?.dipole.figs.wave_detail" v-if="item?.dipole.figs.wave_detail" alt="">
                      </div>
                      <div class="img-wrap bottom">
                        <img :src="item?.dipole.figs.topo_map" v-if="item?.dipole.figs.topo_map" alt="">
                      </div>
                    </div>
                    <div class="img-wrap right">
                      <img :src="item?.dipole.figs.layout" v-if="item?.dipole.figs.layout" alt="">
                    </div>
                  </div>

                  <div class="img-wrap loc-result-img-wrap">
                    <img :src="item?.dipole.figs.loc_result" v-if="item?.dipole.figs.loc_result" alt="">
                  </div>
                </template>
                <template v-else>
                  <div>
                    <div class="left">
                      <div class="img-wrap top">
                        <template v-if="item?.dipole.figs.wave_detail">
                          <a-button class="delete-box" @click="deleteImg('wave_detail', index)">删除图片</a-button>
                          <img class="copy-image" :src="item.dipole.figs.wave_detail" alt="" />
                        </template>
                        <div v-else class="paste-box" @click="pasteImg('wave_detail', index)">点击粘贴图片</div>
                      </div>
                      <div class="img-wrap bottom">
                        <template v-if="item?.dipole.figs.topo_map">
                          <a-button class="delete-box" @click="deleteImg('topo_map', index)">删除图片</a-button>
                          <img class="copy-image" :src="item.dipole.figs.topo_map" alt="" />
                        </template>
                        <div v-else class="paste-box" @click="pasteImg('topo_map', index)">点击粘贴图片</div>
                      </div>
                    </div>

                    <div class="img-wrap right">
                      <template v-if="item?.dipole.figs.layout">
                        <a-button class="delete-box" @click="deleteImg('layout', index)">删除图片</a-button>
                        <img class="copy-image" :src="item.dipole.figs.layout" alt="" />
                      </template>
                      <div v-else class="paste-box" @click="pasteImg('layout', index)">点击粘贴图片</div>
                    </div>
                  </div>
                  <div class="img-wrap">
                    <template v-if="item?.dipole.figs.loc_result">
                      <a-button class="delete-box" @click="deleteImg('loc_result', index)">删除图片</a-button>
                      <img class="copy-image" :src="item.dipole.figs.loc_result" alt="" />
                    </template>
                    <div v-else class="paste-box" @click="pasteImg('loc_result', index)">点击粘贴图片</div>
                  </div>
                </template>
              </div>
            </td>
          </tr>


          <tr class="page-break">
            <td>
              <div class="item mb8">
                <div class="label">发作间期偶极子总览</div>
              </div>
              <div class="item">
                <div class="label" v-if="allData?.inter_dipole_overview?.overview_notes || isEdit">备注：</div>
                <div v-if="!isEdit">{{ allData?.inter_dipole_overview?.overview_notes }}</div>
                <div v-else>
                  <a-input v-model:value="allData.inter_dipole_overview.overview_notes" allowClear
                    placeholder="请输入备注" />
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

import {
  getHuaxiReportDataApi, // 2. 获取华西报告数据
  saveHuaxiReportDataApi, // 3. 保存华西报告数据
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
const handnessList = [
  { label: '右利手', value: '右利手' },
  { label: '左利手', value: '左利手' },
]

const nowTime = ref<number>()

// 获取报告数据
async function getHuaxiReportData() {
  if (!subjectId.value) return message.error('请先选择患者')
  const params = {
    subjectId: subjectId.value,
  }
  loading.value = true
  const { code, data } = await getHuaxiReportDataApi(params)
  loading.value = false
  if (code === 200) {

    nowTime.value = new Date().getTime()


    // 给所有图片加上时间戳，防止缓存，3处
    if (data.typical_spikes && data.typical_spikes.length) {
      const figKeys = ['layout', 'loc_result', 'topo_map', 'wave_detail']
      data.typical_spikes.forEach((item: any) => {
        if (item.dipole) {
          figKeys.forEach(key => {
            if (item.dipole.figs[key]) {
              item.dipole.figs[key] = item.dipole.figs[key] + '?t=' + nowTime.value
            }
          })
        }
        if (item.meg_spike) {
          item.meg_spike.fig = item.meg_spike.fig + '?t=' + nowTime.value
        }
        if (item.eeg_spike) {
          item.eeg_spike.fig = item.eeg_spike.fig + '?t=' + nowTime.value
        }
      })
    }


    if (data.inter_dipole_overview) {
      Object.entries(data.inter_dipole_overview).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          // data.inter_dipole_overview[key] = values.map((item: any) => item ? item + '?t=' + nowTime.value : null)
          data.inter_dipole_overview[key] = values.map((item: any) => {
            return {
              fig: item?.fig ? item.fig + '?t=' + nowTime.value : null,
              slice_num: item?.slice_num,
            }
          })
        }
      })
    }


    allData.value = data || {}
    // console.log(' allData.value :>> ', allData.value)
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
    getHuaxiReportData()
  }
}

// 修改出生日期自动计算年龄
function changeBirthDate(date: string) {
  allData.value.base_info.age = calculateAge(date)
}

async function onSave() {

  const reportInfo = convertObject(allData.value)

  // 在顶层定义通用转换函数（只创建一次）
  const convertUrl = async (url: string) => {
    if (typeof url === 'string' && url.startsWith('http://')) {
      return await convertToBase64(url);
    }
    return url;
  };

  // 处理typicalSpikes
  await Promise.all(reportInfo.typicalSpikes.map(async (item) => {
    await Promise.all([
      item.megSpike?.fig && (item.megSpike.fig = await convertUrl(item.megSpike.fig)),
      item.eegSpike?.fig && (item.eegSpike.fig = await convertUrl(item.eegSpike.fig)),
      ...['waveDetail', 'topoMap', 'layout', 'locResult'].map(async key =>
        item.dipole?.figs?.[key] &&
        (item.dipole.figs[key] = await convertUrl(item.dipole.figs[key]))
      )
    ]);
  }));


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

  // console.log('reportInfo :>> ', reportInfo);

  const params = {
    subjectId: subjectId.value,
    reportInfo: reportInfo
  }

  loading.value = true
  const { code, msg } = await saveHuaxiReportDataApi(params)
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

  if (type === 'meg_spike') {
    allData.value.typical_spikes[index].meg_spike.fig = img
  } else if (type === 'eeg_spike') {
    allData.value.typical_spikes[index].eeg_spike.fig = img
  } else if (type === 'wave_detail') {
    allData.value.typical_spikes[index].dipole.figs.wave_detail = img
  } else if (type === 'topo_map') {
    allData.value.typical_spikes[index].dipole.figs.topo_map = img
  } else if (type === 'layout') {
    allData.value.typical_spikes[index].dipole.figs.layout = img
  } else if (type === 'loc_result') {
    allData.value.typical_spikes[index].dipole.figs.loc_result = img
  }
}

function deleteImg(type: string, index: number) {
  if (type === 'meg_spike') {
    allData.value.typical_spikes[index].meg_spike.fig = null
  } else if (type === 'eeg_spike') {
    allData.value.typical_spikes[index].eeg_spike.fig = null
  } else if (type === 'wave_detail') {
    allData.value.typical_spikes[index].dipole.figs.wave_detail = null
  } else if (type === 'topo_map') {
    allData.value.typical_spikes[index].dipole.figs.topo_map = null
  } else if (type === 'layout') {
    allData.value.typical_spikes[index].dipole.figs.layout = null
  } else if (type === 'loc_result') {
    allData.value.typical_spikes[index].dipole.figs.loc_result = null
  }
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
    const newKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase())
    newObj[newKey] = convertObject(value)
  }

  return newObj
}



function getScreenshot() {
  // const a = new Date().getTime()
  // console.log('a', a)
  onDownload()
  // const b = new Date().getTime()
  // console.log('b', b)
  // console.log('b-a', b - a)
}



// 下载
function onDownload() {
  const element = document.getElementById('report-page-huaxi')
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
      // padding: 10px 10px 10px 10px;
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


  // tr {
  //   td {
  //     // width: 150px;
  //   }
  // }
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
  // border: 1px dashed var(--color-primary);
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

  .eeg-img-wrap {
    margin: 0 16px;
  }

  .dipole-img-box {
    .img-wrap {
      margin: 0 4px;
    }

    .loc-result-img-wrap {
      margin: 0 16px;
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
</style>
