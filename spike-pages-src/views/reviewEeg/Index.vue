<template>
  <a-form ref="formRef" :model="form" :rules="rules" :hideRequiredMark="true">
    <div class="eeg-page">
      <div class="page-top-tab">
        <SwitchTab :tab="4" :megId="megId" :subjectId="subjectId" />

        <div class="flex-between">
          <div class="flex-start">
            <SelectPatient :megId="megId" :subjectId="subjectId" @change="changePatientList" />
            <div class="flex-start">
              <UploadData class="mr8" :foldName="foldName" :widthSmall="widthSmall"
                @uploadFileSuccess="uploadFileSuccess" />
            </div>
          </div>
          <a-space class="form-list flex-start">

            <a-form-item :label="widthBig ? t('标记线') : null" name="redLine">
              <div class="flex-start">
                <div class="arrow arrow-left" :class="{ disabled: form.redLine === curData.tmin }" title="-0.1"
                  @click="changeRedLineValue(-0.1)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M13 7L9 12L13 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M19 7L15 12L19 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M7 7L3 12L7 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="arrow arrow-left" :class="{ disabled: form.redLine === curData.tmin }" title="-0.01"
                  @click="changeRedLineValue(-0.01)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M17 7L13 12L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M11 7L7 12L11 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="arrow arrow-left" :class="{ disabled: form.redLine === curData.tmin }" title="-0.001"
                  @click="changeRedLineValue(-0.001)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M14 7L10 12L14 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>

                <a-input-number class="input-110 mr2" v-model:value="form.redLine" placeholder="标记线" :controls="false"
                  :min="0" addon-after="s" v-bind="inputNumberParser" @pressEnter="pressEnterRedLine" />

                <div class="arrow arrow-right" :class="{ disabled: form.redLine === curData.tmax }" title="+0.001"
                  @click="changeRedLineValue(0.001)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M10 7L14 12L10 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="arrow arrow-right" :class="{ disabled: form.redLine === curData.tmax }" title="+0.01"
                  @click="changeRedLineValue(0.01)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M7 7L11 12L7 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13 7L17 12L13 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="arrow arrow-right" :class="{ disabled: form.redLine === curData.tmax }" title="+0.1"
                  @click="changeRedLineValue(0.1)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                    <path d="M11 7L15 12L11 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M5 7L9 12L5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M17 7L21 12L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </div>
              </div>
            </a-form-item>

            <a-form-item :label="widthBig ? t('导联组合') : null" name="leadCombination">
              <a-select class="select-width" v-model:value="form.leadCombination" :options="leadCombinationList"
                allowClear :placeholder="t('导联组合')" @change="changeLeadCombination" />
            </a-form-item>

            <a-form-item :label="widthBig ? '脑电通道' : null">
              <a-popover placement="bottomRight">
                <!-- :open="false" -->
                <a-button size="small">
                  <span> {{ form.chNames[0] }} </span>
                  <span class="inline-block color-t6 ml4" v-if="!form.chNames.length">{{ t('脑电通道') }}</span>
                  <span v-if="form.chNames.length > 1">... ({{ form.chNames.length }})</span>
                  <close-circle-filled class="delete-all-icon ml4" v-if="form.chNames.length"
                    :style="{ fontSize: '12px', transform: 'translateY(-1px)' }" @click="deleteAllChNames" />
                  <IconDown class="ml4" v-if="!form.chNames.length"
                    :style="{ fontSize: '12px', color: 'var(--color-t6)', transform: 'translateY(-1px)' }" />
                </a-button>
                <!-- 这个空标签的存在可以让popover的位置不受按钮宽度变化而改变，不能删 -->
                <div></div>

                <template #content>

                  <div class="search-box">

                    <div class="left">
                      <div class="flex-between mb4">
                        <div class="flex-start mb8">
                          {{ t('已选通道') }}：( {{ form.chNames.length }} )
                          <close-circle-filled class="delete-icon ml8" v-if="form.chNames.length" :title="t('清空')"
                            @click="deleteAllChNames" />
                        </div>

                      </div>
                      <div class="select-list">
                        <div v-for="(item, index) in form.chNames" :key="index" class="item"
                          :class="{ active: !!form.chNames.includes(item) }" @click="clickChName(item)">
                          {{ item }}
                        </div>
                      </div>
                    </div>

                    <div class="right">

                      <div class="pt8 pb8 flex-start">

                        <a-input class="input-search widthP100" v-model:value="searchChannel" allowClear
                          :placeholder="t('搜索')" @pressEnter="onSearchChannel">
                          <template #suffix>
                            <IconSearch style="color: var(--color-t5)" @click="onSearchChannel" />
                          </template>
                        </a-input>
                      </div>


                      <!-- 结果框 -->
                      <div class="result-box">
                        <div class="flex-between mb4">
                          <span class="mr4"> {{ resultTitle }} ： </span>
                          <a-checkbox v-model:checked="selectAllResult" @change="changeSelectAllResult">{{ t('全选') }}</a-checkbox>
                        </div>
                        <div class="result-list">
                          <div v-for="(item, index) in allResultList" :key="index" class="item"
                            :class="{ active: !!form.chNames.includes(item) }" @click="clickChName(item)">
                            {{ item }}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </template>
              </a-popover>
            </a-form-item>


            <a-space>

              <a-form-item :label="widthBig ? t('比例尺') : null">
                <a-input-number class="input-big" v-model:value="ratioScale" :placeholder="t('比例尺')" addon-after="μV"
                  :min="1" :step="ratioStep" v-bind="inputNumberParser" @step="onRatioStep"
                  @change="changeRatioScale()" />
              </a-form-item>

              <!-- <a-button v-if="showLeft" size="small" title="收起" @click="clickShowLeft">
                <template #icon>
                  <MenuUnfoldOutlined />
                </template>
              </a-button>
              <a-button v-if="!showLeft" size="small" title="展开" @click="clickShowLeft">
                <template #icon>
                  <MenuFoldOutlined />
                </template>
              </a-button> -->

            </a-space>

          </a-space>
        </div>

      </div>

      <div class="page-bottom">

        <div class="left" v-show="showLeft">
          <div class="scroll">
            <DataList ref="dataListRef" :foldName="foldName" :subjectId="subjectId" @getCurData="getCurData" />
            <div class="bg-gray-line"></div>
            <SpikeList ref="spikeListRef" @getCurSpike="getCurAlgSpike" @pressEnterThreshold="pressEnterThreshold" />
            <div class="bg-gray-line"></div>
            <ManualList ref="manualListRef" :subjectId="subjectId" @getCurSpike="getCurManualSpike"
              @deleteSpike="deleteSpike" />
            <div class="bg-gray-line"></div>
          </div>
        </div>
        <div class="right"
          :class="!showLeft && !showSide ? 'only-right' : showLeft && !showSide ? 'left-right' : !showLeft && showSide ? 'right-side' : null">

          <Line v-if="themeReady" ref="lineRef" class="widthP100" @successClickType="successClickType"
            @setRedLineValue="setRedLineValue" :filePath="curData.filePath" :leadCombination="form.leadCombination"
            :chNames="form.chNames" :startTime="form.startTime" :subjectId="subjectId" :tmin="curData.tmin"
            :tmax="curData.tmax" :duration="form.duration" @setStartTime="setStartTime" />

        </div>

        <div class="fold-button" :class="{ 'fold-button-right': !showSide }" @click="foldSide">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="80" viewBox="0 0 10 80" fill="none">
            <path
              d="M0 27.082C0 22.4247 1.08435 17.8313 3.16718 13.6656L10 0V80L3.16719 66.3344C1.08436 62.1687 0 57.5753 0 52.918V27.082Z"
              fill="var(--color-gray-icon)" />
            <path
              d="M6.14645 43.1464L3.35355 40.3536C3.15829 40.1583 3.15829 39.8417 3.35355 39.6464L6.14645 36.8536C6.46143 36.5386 7 36.7617 7 37.2071L7 42.7929C7 43.2383 6.46143 43.4614 6.14645 43.1464Z"
              fill="var(--color-white)" />
          </svg>
        </div>

        <div class="side form-list" :class="showSide ? 'show-side' : 'hide-side'">

          <div class="title">{{ t('筛选条件') }}</div>
          <div class="content">


            <a-form-item :label="t('起始时间') + '(s)'" name="startTime">
              <a-input-number v-model:value="form.startTime" placeholder="" :min="curData.tmin"
                :max="curData.tmax - form.duration" v-bind="inputNumberParser" />
            </a-form-item>

            <a-form-item :label="t('显示时长') + '(s)'" name="duration">
              <a-input-number v-model:value="form.duration" placeholder="" :min="1" :max="120"
                v-bind="inputNumberParser" />
            </a-form-item>


            <a-form-item :label="t('步频') + '(s)'" name="frequency">
              <div class="flex-between">

                <a-button class="mr4 tooltip" :data-title="t('后退') + ' ←'" :disabled="form.startTime === curData.tmin"
                  size="small" @click="playBackward">
                  <template #icon>
                    <CaretLeftOutlined />
                  </template>
                </a-button>

                <a-input-number class="input-110 mr4" v-model:value="form.frequency" placeholder="" :min="1"
                  v-bind="inputNumberParser" />

                <a-button class="tooltip-before" :data-title="t('前进') + ' →'"
                  :disabled="form.startTime >= curData.tmax - form.duration" size="small" @click="playForward">
                  <template #icon>
                    <CaretRightOutlined />
                  </template>
                </a-button>

              </div>
            </a-form-item>

            <a-form-item :label="t('自动翻页') + '(s/page)'" name="playSpeed">
              <div class="flex-between">

                <a-input-number class="input-140 mr4" v-model:value="form.playSpeed" placeholder="" :min="1"
                  v-bind="inputNumberParser" />

                <a-button v-if="!isPlaying" class="tooltip-before" :data-title="t('自动翻页')" size="small"
                  @click="startPlay">
                  <template #icon>
                    <CaretRightOutlined />
                  </template>
                </a-button>

                <a-button v-if="isPlaying" class="tooltip-center" :data-title="t('暂停')" danger size="small"
                  @click="stopPlay">
                  <template #icon> <pause-outlined /> </template>
                </a-button>
              </div>

            </a-form-item>


            <a-button v-if="!form.isFilter" class="widthP100 mb16 color-t5 flex-start" type="default" size="small"
              @click="changeFilter">
              <IconCheckbox />
              {{ t('滤波') }}
            </a-button>
            <a-popover placement="left" v-if="form.isFilter">
              <a-button v-if="form.isFilter" class="widthP100 mb16 flex-between" type="default" size="small"
                @click="changeFilter">
                <div>
                  <IconCheckboxActive class="color-blue mr4" />
                  {{ t('滤波') }}
                </div>
                <IconDown class="text-12" />
              </a-button>
              <template #content>
                <a-form-item class="mb8" style="width: 210px;" :label="t('高通滤波频率')" name="lowFreq"
                  :labelCol="{ span: 11 }" :wrapperCol="{ span: 13 }">
                  <a-input-number class="input-unit" v-model:value="form.lowFreq" placeholder="" :min="0"
                    addon-after="Hz" v-bind="inputNumberParser" />
                </a-form-item>
                <a-form-item class="mb8" style="width: 210px;" :label="t('低通滤波频率')" name="highFreq"
                  :labelCol="{ span: 11 }" :wrapperCol="{ span: 13 }">
                  <a-input-number class="input-unit" v-model:value="form.highFreq" placeholder="" :min="0"
                    addon-after="Hz" v-bind="inputNumberParser" />
                </a-form-item>
                <a-form-item class="mb4" style="width: 210px;" :label="t('陷波频率')" name="notchFreq"
                  :labelCol="{ span: 11 }" :wrapperCol="{ span: 13 }">
                  <a-input-number class="input-unit" v-model:value="form.notchFreq" placeholder="" :min="0"
                    addon-after="Hz" v-bind="inputNumberParser" />
                </a-form-item>
              </template>
            </a-popover>

            <a-button v-if="!form.isBaselineCorrect" class="widthP100 mb16 color-t5 flex-start" type="default"
              size="small" @click="changeBaselineCorrect">
              <IconCheckbox />
              {{ t('基线校正') }}
            </a-button>
            <a-button v-if="form.isBaselineCorrect" class="widthP100 mb16 flex-start" type="default" size="small"
              @click="changeBaselineCorrect">
              <IconCheckboxActive class="color-blue" />
              {{ t('基线校正') }}
            </a-button>


            <a-button class="widthP100 mb16" v-if="overlap" size="small" @click="setOverlap(false)">
              <span class="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M14.6667 8.66653L12.9233 7.62051C11.9675 7.04703 10.7559 7.12853 9.88549 7.82484L9.66589 8.00052C8.69198 8.77965 7.3081 8.77965 6.33419 8.00052L6.11459 7.82484C5.2442 7.12853 4.03255 7.04703 3.07675 7.62051L1.33337 8.66653M14.6667 4.66653L12.9233 3.62051C11.9675 3.04703 10.7559 3.12853 9.88549 3.82484L9.66589 4.00052C8.69198 4.77965 7.3081 4.77965 6.33419 4.00052L6.11459 3.82484C5.2442 3.12853 4.03255 3.04703 3.07675 3.62051L1.33337 4.66653"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                  <path
                    d="M14.6666 12.6668L12.9232 11.6208C11.9674 11.0473 10.7558 11.1288 9.88537 11.8251L9.66577 12.0008C8.69186 12.7799 7.30798 12.7799 6.33406 12.0008L6.11447 11.8251C5.24408 11.1288 4.03243 11.0473 3.07663 11.6208L1.33325 12.6668"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </span>
              {{ t('分离通道') }}
            </a-button>
            <a-button class="widthP100 mb16" v-if="!overlap" size="small" @click="setOverlap(true)">
              <span class="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 15.9213C3.68421 15.9213 4.36842 15.9215 5.05263 13.1909C5.8327 10.0778 5.57532 5 7.10526 5C8.47368 5 7.78947 15.0114 9.84211 15.9213C11.8947 16.8312 11.7331 9.55019 13.2632 9.55042C14.6316 9.55063 13.9474 15.9213 16 15.9213"
                    stroke="currentColor" stroke-linecap="round" />
                  <path
                    d="M16.6666 13.6668L14.9232 12.6208C13.9674 12.0473 12.7558 12.1288 11.8854 12.8251L11.6658 13.0008C10.6919 13.7799 9.30798 13.7799 8.33406 13.0008L8.11447 12.8251C7.24408 12.1288 6.03243 12.0473 5.07663 12.6208L3.33325 13.6668"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </span>
              {{ t('重叠通道') }}
            </a-button>

            <a-button class="widthP100 mb16" size="small" @click="resetRedChannel">
              <span class="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M14.6667 8.66629L12.9233 7.62027C11.9675 7.04679 10.7559 7.12828 9.88549 7.8246L9.66589 8.00027C8.69198 8.77941 7.3081 8.77941 6.33419 8.00027L6.11459 7.8246C5.2442 7.12828 4.03255 7.04679 3.07675 7.62027L1.33337 8.66629M14.6667 4.66629L12.9233 3.62027C11.9675 3.04679 10.7559 3.12828 9.88549 3.8246L9.66589 4.00027C8.69198 4.77941 7.3081 4.77941 6.33419 4.00027L6.11459 3.8246C5.2442 3.12828 4.03255 3.04679 3.07675 3.62027L1.33337 4.66629"
                    stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                  <path
                    d="M14.6666 12.6663L12.9232 11.6203C11.9674 11.0468 10.7558 11.1283 9.88537 11.8246L9.66577 12.0003C8.69186 12.7794 7.30798 12.7794 6.33406 12.0003L6.11447 11.8246C5.24408 11.1283 4.03243 11.0468 3.07663 11.6203L1.33325 12.6663"
                    stroke="#FF2C3B" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </span>
              {{ t('清空标记通道') }}
            </a-button>



            <a-space class="search-button">
              <a-button type="primary" size="small" shape="round" :disabled="buttonLoading" @click="onSearch">
                <IconSearch />
                {{ t('查询') }}
              </a-button>
              <a-button type="primary" ghost size="small" shape="round" @click="onReset">
                <IconReset />
                {{ t('重置') }}
              </a-button>
            </a-space>

          </div>

        </div>
      </div>

    </div>
  </a-form>

</template>


<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'

import { message, type FormInstance } from 'ant-design-vue'
import useKeyUp from '@/hooks/useKeyUp'
import { debounce, inputNumberParser } from '@u/utils'
import { calcUpEeg, calcDownEeg, setRatioStepEeg } from '@/utils/ratioScale'

import SwitchTab from '@c/SwitchTab.vue'
import SelectPatient from '@c/SelectPatient.vue'

import UploadData from './UploadData.vue'
import DataList from './DataList.vue'
import SpikeList from './SpikeList.vue'
import ManualList from './ManualList.vue'
import Line from './Line.vue'

let allChannelList: string[] = []
import { leadCombinationList } from '@u/data' // 导联组合列表

import {
  eegApi, // 1. 查折线图
  getEegFileChsApi, // 获取脑电图文件的通道列表
  timeIntervalManualSpikeApi, // 获取这段时间内的所有手工标注棘波
} from '@/api/eeg'

import { useThemeStore } from '@/store/theme'
import { storeToRefs } from 'pinia'

// 主题色出现，不为undefined才能使用Line组件，否则Line组件报错，useTheme为undefined，页面就空白了
const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)
const themeReady = computed(() => !!theme.value)

const { t } = useI18n()

const { width: windowWidth } = useWindowSize()
const widthBig = computed(() => windowWidth.value > 2050)
const widthSmall = computed(() => windowWidth.value <= 1840)

// 修改患者
function changePatientList(record: any) {
  subjectId.value = record.subjectId
  megId.value = record.megId
  document.title = `${t('脑电图复核')} | ${megId.value}`
  nextTick(() => {
    dataListRef.value.getData(true) // true默认选中第一个
  })
}

let redLineEnter = false // 是否在标记线输入框按下Enter键
let ratioScaleEnter = false // 是否在比例尺输入框按下Enter键
let searchEnter = false // 是否在搜索输入框按下Enter键
let thresholdEnter = false  // 是否在阈值输入框按下Enter键

// 敲击键盘，按Enter键就查询，上下左右是移动
useKeyUp((key: string) => {
  if (ratioScaleEnter || redLineEnter || searchEnter || thresholdEnter) {
    return false
  }
  if (key === 'Enter') {
    onSearch()
  }
  if (key === 'ArrowUp') {
    moveUpDown('up')
  }
  if (key === 'ArrowDown') {
    moveUpDown('down')
  }

  // 上下左右现在没了，左右改成后退和前进
  if (key === 'ArrowLeft') {
    playBackward()
  }
  if (key === 'ArrowRight') {
    playForward()
  }

})

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
const foldName = computed(() => {
  return `${megId.value}/eeg`
})
document.title = `${t('脑电图复核')} | ${megId.value}`

const formRef = ref<FormInstance>()
const dataListRef = ref(null)
const spikeListRef = ref(null)
const manualListRef = ref(null)
const lineRef = ref(null)

const loading = ref<boolean>(false)
const curData = ref<any>({})

const form = reactive<any>({
  startTime: null,   // 起始时间
  duration: 5,       // 显示时长
  frequency: 5,      // 步频
  playSpeed: 5,      // 自动翻页
  leadCombination: null, // 导联组合
  chNames: [],       // 通道 多选
  isFilter: true,    // 滤波
  isBaselineCorrect: true, // 基线校正
  lowFreq: 0.5,        // 高通滤波频率
  highFreq: 75,      // 低通滤波频率
  notchFreq: 50,     // 陷波频率
  redLine: null,     // 红色竖线数值
})

const rules = reactive({
  startTime: [
    { required: true, message: t('请填写起始时间'), trigger: 'change' },
  ],
  duration: [
    { required: true, message: t('请填写显示时长') },
  ],
  frequency: [
    { required: true, message: '请填写步频' },
  ],
  playSpeed: [
    { required: true, message: '请填写自动翻页' },
  ],
})

const overlap = ref<boolean>(false)   // 重叠，默认不重叠
const isPlaying = ref<boolean>(false) // 正在翻页
const ratioScale = ref<number>(180)  // 比例尺
const buttonLoading = ref<boolean>(false) // 点击查询后2秒内不允许再次点击

onMounted(() => {
  // 存在就赋值
  const local_form = JSON.parse(localStorage.getItem('eegForm')) || {}
  form.lowFreq = local_form.lowFreq ?? 0.5
  form.highFreq = local_form.highFreq ?? 75
  form.notchFreq = local_form.notchFreq ?? 50
  form.duration = local_form.duration ?? 5 // 显示时长
  form.frequency = local_form.frequency ?? 5 // 步频
  form.playSpeed = local_form.playSpeed ?? 5 // 自动翻页
  form.isFilter = local_form.isFilter ?? true // 滤波
  form.isBaselineCorrect = local_form.isBaselineCorrect ?? true // 基线校正
  // ratioScale.value = local_form.ratioScale ?? 180 // 比例尺
})

// 查询
function onSearch() {
  if (!buttonLoading.value) {
    // 当滤波存在有值时，缓存当前值，滤波不存在时使用缓存值
    const local_form = JSON.parse(localStorage.getItem('eegForm')) || {}
    localStorage.setItem('eegForm', JSON.stringify({
      lowFreq: form.isFilter ? form.lowFreq : local_form.lowFreq,
      highFreq: form.isFilter ? form.highFreq : local_form.highFreq,
      notchFreq: form.isFilter ? form.notchFreq : local_form.notchFreq,
      duration: form.duration,
      frequency: form.frequency,
      playSpeed: form.playSpeed,
      isFilter: form.isFilter,
      isBaselineCorrect: form.isBaselineCorrect,
      ratioScale: ratioScale.value, // 比例尺
    }))

    getMegData()
    buttonLoading.value = true
    setTimeout(() => {
      buttonLoading.value = false
    }, 2000)
  }
}

// 重置
function onReset() {
  form.startTime = curData.value.tmin
  form.leadCombination = null
  form.chNames = []
  form.isFilter = true
  form.isBaselineCorrect = true
  isPlaying.value = false
  selectAllResult.value = false
  lineRef.value.resetChart() // 重置移动

  // 存在就赋值
  const local_form = JSON.parse(localStorage.getItem('eegForm')) || {}
  form.lowFreq = local_form.lowFreq ?? 0.5
  form.highFreq = local_form.highFreq ?? 75
  form.notchFreq = local_form.notchFreq ?? 50
  form.duration = local_form.duration ?? 5 // 显示时长
  form.frequency = local_form.frequency ?? 5 // 步频
  form.playSpeed = local_form.playSpeed ?? 5 // 自动翻页
  form.isFilter = local_form.isFilter ?? true // 滤波
  form.isBaselineCorrect = local_form.isBaselineCorrect ?? true // 基线校正
  // ratioScale.value = local_form.ratioScale ?? 180 // 比例尺
}

// 重置红通道
function resetRedChannel() {
  lineRef.value.resetRedChannel() // 重置红通道
}

// 修改导联组合，如果有值就查询
function changeLeadCombination() {
  if (form.leadCombination) {
    onSearch()
  }
}


const searchChannel = ref<string>('')       // 搜索内容
const resultTitle = ref<string>(t('全部通道'))
const allResultList = ref([])  // 搜索结果
const selectAllResult = ref<boolean>(false)     // 全选

// 点击搜索或按下回车键时的回调，会触发方法，并会阻止useKeyUp()事件
function onSearchChannel() {
  searchEnter = true
  setTimeout(() => {
    searchEnter = false
  }, 1000)

  allResultList.value = []
  selectAllResult.value = false
  // 如果有搜索内容
  if (searchChannel.value) {
    resultTitle.value = t('搜索结果')
    // 把搜索内容根据分号分割成数组，复杂的情况：*1*3;1*0*;Meg1；222
    const searchList = searchChannel.value.split(/[;；]/g).filter(m => m)
    searchList.forEach((m, i) => {
      searchList[i] = m.toUpperCase() // 转大写
    })
    allChannelList.map((item: string) => {
      searchList.forEach((f: string) => {
        // 如果有*号，Cp*
        if (f.includes('*')) {
          let flag = true
          f.split('').forEach((m: string, index: number) => {
            if (m !== '*') {
              if (item[index].toUpperCase() !== m) { // EEg的通道没有MEG，所以去掉index+3
                flag = false
              }
            }
          })
          if (flag) {
            allResultList.value.push(item)
          }
        } else {
          // 如果没有*号
          if (item.toUpperCase().includes(f)) {
            allResultList.value.push(item)
          }
        }
      })
    })
  } else {
    // 点击清空
    resultTitle.value = t('全部通道')
    selectAllResult.value = false
    allResultList.value = allChannelList
  }
}

// 选择某个通道
function clickChName(item: string) {
  if (form.chNames.includes(item)) {
    form.chNames = form.chNames.filter((f: string) => f !== item)
  } else {
    form.chNames.push(item)
    changeSort()
  }
  selectAllResult.value = false
}

// 点击全选
function changeSelectAllResult() {
  if (selectAllResult.value) {
    form.chNames = [...new Set([...form.chNames, ...allResultList.value])]
    changeSort()
  } else {
    const list: string[] = []
    form.chNames.forEach((item: string) => {
      if (!allResultList.value.includes(item)) {
        list.push(item)
      }
    })
    form.chNames = list
  }
}

// 让顺序符合allChannelList的顺序
function changeSort() {
  const list: string[] = []
  allChannelList.forEach(f => {
    if (form.chNames.includes(f)) {
      list.push(f)
    }
  })
  form.chNames = list
}

// 删除所有通道
function deleteAllChNames() {
  form.chNames = []
  selectAllResult.value = false
}

// 修改滤波
function changeFilter() {
  form.isFilter = !form.isFilter

  if (!form.isFilter) {
    form.lowFreq = 0
    form.highFreq = 0
    form.notchFreq = 0
  } else {
    // 存在就赋值
    const local_form = JSON.parse(localStorage.getItem('eegForm')) || {}
    form.lowFreq = local_form.lowFreq ?? 0.5
    form.highFreq = local_form.highFreq ?? 75
    form.notchFreq = local_form.notchFreq ?? 50
  }
}

// 修改基线校正
function changeBaselineCorrect() {
  form.isBaselineCorrect = !form.isBaselineCorrect
}

// 计时器
let timer: string | number | NodeJS.Timeout = null
// 开始翻页(就是前进)
function startPlay() {
  if (!form.playSpeed) {
    message.info(t('请填写自动翻页'))
    return
  }
  isPlaying.value = true
  if (timer) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    form.startTime = form.startTime + form.frequency
    // 这里有些问题
    if (form.startTime >= curData.value.tmax - form.duration) {
      form.startTime = curData.value.tmax - form.duration
      stopPlay()
    }
    getMegData()
  }, form.playSpeed * 1000)
}
// 停止翻页
function stopPlay() {
  isPlaying.value = false
  clearInterval(timer)
  timer = null
}

// 后退（使用防抖）
function playBackward() {
  if (!form.frequency) {
    message.info(t('请填写步频'))
    return
  }
  form.startTime = form.startTime - form.frequency
  if (form.startTime < curData.value.tmin) {
    form.startTime = curData.value.tmin
  }
  debouncedGetMegData()
}
// 前进（使用防抖）
function playForward() {
  if (!form.frequency) {
    message.info(t('请填写步频'))
    return
  }
  // 这里可能有些问题
  form.startTime = form.startTime + form.frequency
  if (form.startTime >= curData.value.tmax - form.duration) {
    form.startTime = curData.value.tmax - form.duration
  }
  debouncedGetMegData()
}

// 使用防抖包装，500毫秒内连续触发只执行最后一次
const debouncedGetMegData = debounce(() => {
  getMegData()
}, 500)

//  设置重叠
function setOverlap(value: boolean) {
  overlap.value = value
  lineRef.value.setOverlap(overlap.value, ratioScale.value)
}

// 比例尺的step
const ratioStep = ref<number>(0)
// 比例尺input-number点击上下箭头的回调
function onRatioStep(value: number, info: { offset: number, type: 'up' | 'down' }) {
  ratioStep.value = setRatioStepEeg(ratioScale.value, info.type)
  // 第一次点击没反应，自己操作，但如果先点击了缩放，再点这个就有问题了
  if (info.offset === 0) {
    ratioScale.value = info.type === 'up' ? calcUpEeg(ratioScale.value) : calcDownEeg(ratioScale.value)
    changeRatioScale()
  }
  if (info.type === 'up' && ratioScale.value === 21) {
    ratioScale.value = 20
  }
}

// 展开收起左边的列表和side
const showLeft = ref<boolean>(true)
const showSide = ref(true)

function clickShowLeft() {
  showLeft.value = !showLeft.value
  if (showLeft.value) {
    showSide.value = true
  } else {
    showSide.value = false
  }
  resizeChart()
}

function foldSide() {
  showSide.value = !showSide.value
  resizeChart()
}

// 点击2个展开收起，改变图表的大小
function resizeChart() {
  // 如果是单模式
  // 12+240+8+16+200+12 = 480 默认的，左和side都展示
  // 12+240+8+8+12 = 280 展示左，不展示side
  // 12+16+200+12 = 240 不展示左，展示side
  // 12+8+12 =32  不展示左，不展示side
  lineRef.value.resize(94, showLeft.value && showSide.value ? 480 : showLeft.value && !showSide.value ? 280 : !showLeft.value && showSide.value ? 240 : 32) // 12+4+40+12=68
}

// 上下左右移动
function moveUpDown(type: 'up' | 'down' | 'left' | 'right') {
  lineRef.value.setMove(type)
}

// 修改比例尺
function changeRatioScale() {
  lineRef.value.setRatioScale(overlap.value, ratioScale.value)
}

// 在算法检测棘波列表的阈值输入框按下Enter键，会触发它的getData()方法，并会阻止useKeyUp()事件
function pressEnterThreshold() {
  thresholdEnter = true
  setTimeout(() => {
    thresholdEnter = false
  }, 1000)
}

// 上传数据成功，刷选患者数据列表
function uploadFileSuccess() {
  dataListRef.value.getData()
}

const isFirst = ref<boolean>(true) // 如果是第一次进入

// 点击了某数据，去获取棘波列表，去获取折线图数据
function getCurData(item: any) {
  spikeListRef.value.setData(item)
  manualListRef.value.setData(item)
  curData.value = item // 设置当前数据
  form.startTime = item.tmin
  getMegData()
  getEegFileChs()
  // 如果是第一次进入，默认了第一条数据，就不做“把竖线去掉”的操作
  if (isFirst.value) {
    isFirst.value = false
  } else {
    // 切换患者数据列表时，要把竖线去掉
    setTimeout(() => {
      lineRef.value.setRedMarkLine(null)
    }, 500)
  }
}


// 点击了算法检测棘波列表某点，去获取折线图数据
function getCurAlgSpike(item: { spikeTime: number }) {
  // 如果点就在当前图中，就直接画线，否则要改动form.startTime，getMegData()，再画线
  if (item.spikeTime >= form.startTime && item.spikeTime <= form.startTime + form.duration) {
    lineRef.value.setRedMarkLine(item.spikeTime)
  } else {
    // 把要画的线放在正中间，去找form.startTime
    form.startTime = parseFloat((item.spikeTime - form.duration / 2).toFixed(1))
    if (form.startTime < curData.value.tmin) {
      form.startTime = curData.value.tmin
    }
    if (form.startTime >= curData.value.tmax - form.duration) {
      form.startTime = curData.value.tmax - form.duration
    }
    getMegData()
    lineRef.value.setRedMarkLine(item.spikeTime)
  }
}


// 点击了手动标注列表某点，去画线
function getCurManualSpike(item: { startTime: number }) {
  // 如果点就在当前图中，就直接画线，否则要改动form.startTime，getMegData()，再画线
  if (item.startTime >= form.startTime && item.startTime <= form.startTime + form.duration) {
    lineRef.value.setRedMarkLine(item.startTime)
  } else {
    // 把要画的线放在正中间，去找form.startTime
    form.startTime = parseFloat((item.startTime - form.duration / 2).toFixed(1))
    if (form.startTime < curData.value.tmin) {
      form.startTime = curData.value.tmin
    }
    if (form.startTime >= curData.value.tmax - form.duration) {
      form.startTime = curData.value.tmax - form.duration
    }
    getMegData()
    lineRef.value.setRedMarkLine(item.startTime)
  }
}

// 如果点就在当前图中，就获取新的棘波点
function deleteSpike(item: any) {
  if (item.startTime >= form.startTime && item.startTime <= form.startTime + form.duration) {
    getTimeIntervalManualSpikeList()
  }
}


// 在标记线输入框按下Enter键，会触发changeRatioScale()方法，并会阻止useKeyUp()事件
function pressEnterRedLine() {
  redLineEnter = true
  setTimeout(() => {
    redLineEnter = false
  }, 1000)

  // 如果这个时间小于tmin或者大于tmax，其实也没必要跳转了
  if (form.redLine < curData.value.tmin || form.redLine > curData.value.tmax) {
    return message.info(`文件时间范围在[${curData.value.tmin}s, ${curData.value.tmax}s]，请重新填写时间`)
  }

  // 如果在最左边，小于tmin+0.5的范围，直接画线
  // 如果在最右边，大于tmax-0.5的范围，直接画线
  // 如果不在最左和最右边，[form.startTime+0.5,form.startTime+form.duration-0.5]的范围，直接画线
  // 其他情况，把要画的线放在正中间，修改form.startTime后getMegData()，再画线
  if (form.startTime === curData.value.tmin && form.redLine <= form.startTime + 0.5) {
    lineRef.value.setRedMarkLine(form.redLine)
  } else
    if (form.startTime === curData.value.tmax - form.duration && form.redLine >= curData.value.tmax - 0.5) {
      lineRef.value.setRedMarkLine(form.redLine)
    } else
      if (form.redLine >= form.startTime + 0.5 && form.redLine <= form.startTime + form.duration - 0.5) {
        lineRef.value.setRedMarkLine(form.redLine)
      } else {
        form.startTime = parseFloat((form.redLine - form.duration / 2).toFixed(1))
        if (form.startTime < curData.value.tmin) {
          form.startTime = curData.value.tmin
        }
        if (form.startTime >= curData.value.tmax - form.duration) {
          form.startTime = curData.value.tmax - form.duration
        }
        getMegData()
        lineRef.value.setRedMarkLine(form.redLine)
      }
}

// 左右改变标记线值的大小
function changeRedLineValue(num: number) {
  // 禁用的效果
  if (num < 0 && form.redLine === curData.value.tmin) {
    return
  }
  if (num > 0 && form.redLine === curData.value.tmax) {
    return
  }

  form.redLine = parseFloat((form.redLine + num).toFixed(4)) // 脑电图是4位小数

  if (form.redLine < curData.value.tmin) {
    form.redLine = curData.value.tmin
  }
  if (form.redLine > curData.value.tmax) {
    form.redLine = curData.value.tmax
  }

  pressEnterRedLine()
}

// 设置标记线的值
function setRedLineValue(value: number) {
  form.redLine = value
}

// 获取折线图Meg数据
async function getMegData() {
  if (!curData.value.filePath) {
    message.info(t('请先选择患者edf文件'))
    return
  }
  if (typeof form.startTime !== 'number') {
    message.info(t('请填写起始时间'))
    return
  }
  if (!form.duration) {
    message.info(t('请填写显示时长'))
    return
  }
  const params = {
    subjectId: subjectId.value,
    filePath: curData.value.filePath,
    startTime: form.startTime,
    duration: form.duration,
    leadCombination: form.leadCombination,
    chNames: form.chNames,
    isFilter: form.isFilter,
    isBaselineCorrect: form.isBaselineCorrect,
    filterFreqs: {
      lowFreq: form.lowFreq,
      highFreq: form.highFreq,
      notchFreq: form.notchFreq,
    },
  }
  if (!isPlaying.value) {
    loading.value = true
  }
  const { code, data } = await eegApi(params)
  loading.value = false
  if (code === 200) {
    lineRef.value.setChartData(data)
    getTimeIntervalManualSpikeList()
  }
}

// 获取这段时间内的所有手工标注棘波
async function getTimeIntervalManualSpikeList() {
  const params = {
    filePath: curData.value.filePath,
    startTime: form.startTime,
    endTime: form.startTime + form.duration
  }
  const { code, data } = await timeIntervalManualSpikeApi(params)
  if (code === 200) {
    lineRef.value.drawSpikePointList(data?.records || [])
  }
}

// 手动标注一个后
function successClickType() {
  getTimeIntervalManualSpikeList()
  manualListRef.value.getData()
}

// 获取脑电图文件的通道列表，展示在通道名称弹窗的全部通道里
async function getEegFileChs() {
  searchChannel.value = '' // 搜索内容
  resultTitle.value = t('全部通道')
  selectAllResult.value = false // 全选
  form.chNames = []        // 因为通道不一样
  allChannelList = []
  allResultList.value = []
  const params = {
    filePath: curData.value.filePath,
  }
  const { code, data } = await getEegFileChsApi(params)
  if (code === 200) {
    allChannelList = data || []
    allResultList.value = [...allChannelList]
  }
}

// 针对数字框，最多输入4位小数
function parser(value: string) {
  if (value === '') {
    return '';
  }
  return parseFloat(Number(value).toFixed(4))
}


// 从时间拉条设置起始时间
function setStartTime(start: number) {
  form.startTime = start
  getMegData()
}

</script>

<style lang="less" scoped>
@import './style/index.less';
</style>
