<template>
  <a-form ref="formRef" :model="form" :rules="rules" :hideRequiredMark="true">
    <div class="meg-page">
      <div class="page-top-tab">
        <SwitchTab :tab="2" :megId="megId" :subjectId="subjectId" />

        <div class="flex-between">
          <div class="flex-start">
            <SelectPatient :megId="megId" :subjectId="subjectId" @change="changePatientList" />
            <div class="flex-start">

              <!-- <a-button v-show="!isAllMode" type="primary" class="light-primary-btn mr8" size="small" shape="round"
                title="切换到多窗口模式" @click="clickTurnToAllMode">
                <IconWindows />
                <span>多窗口模式</span>
              </a-button>
              <a-button v-show="isAllMode" type="primary" class="light-primary-btn mr8" size="small" shape="round"
                title="切换到单窗口模式" @click="clickTurnToSingle">
                <IconOneWindow />
                <span>单窗口模式</span>
              </a-button> -->

              <a-segmented class="segmented" v-model:value="curMode" :options="modeList" @change="changeMode" />

              <UploadData class="mr8" :foldName="foldName" :widthSmall="widthSmall"
                @uploadFileSuccess="uploadFileSuccess" />
              <ExportData :megId="megId" :subjectId="subjectId" :widthSmall="widthSmall" />


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

                <a-input-number class="input-110 mr2" v-model:value="form.redLine" :placeholder="t('标记线')"
                  :controls="false" :min="0" addon-after="s" v-bind="inputNumberParser"
                  @pressEnter="pressEnterRedLine" />

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

            <a-form-item :label="widthBig ? t('脑区') : null" name="brainRegion">
              <a-select class="select-width" v-model:value="form.brainRegion" :options="newBrainRegionList" allowClear
                :placeholder="t('脑区')" @change="changeBrainRegion" />
            </a-form-item>

            <a-form-item :label="widthBig ? t('脑磁通道') : null">
              <MegChannelModal ref="megChannelModalRef" v-model:chNames="form.chNames" :isAllMode="isAllMode"
                :megType="megType" @addNewCard="addNewCard" @stopEnter="stopEnter"
                @setCustomChannelList="setCustomChannelList" />
            </a-form-item>

            <!-- v-if="!isAllMode"  -->
            <a-form-item :label="widthBig ? t('脑电通道') : null" v-if="isAllMode">
              <EegChannelModal ref="eegChannelModalRef" v-model:chNames="form.eegChNames" :fifFilePath="fifFilePath"
                :subjectId="subjectId" @addNewCard="addNewCardEeg" @stopEnter="stopEnter"
                @setEegCustomChannelList="setEegCustomChannelList" @setEegCombList="setEegCombList" />
            </a-form-item>


            <a-form-item :label="widthBig ? t('比例尺') : null" v-if="!isAllMode">
              <a-input-number class="input-big" v-model:value="ratioScale" :placeholder="t('比例尺')" addon-after="fT"
                :min="1" :step="ratioStep" v-bind="inputNumberParser" @step="onRatioStep"
                @change="changeRatioScale()" />
            </a-form-item>


          </a-space>
        </div>
      </div>

      <div class="page-bottom">

        <DragCardLeft ref="dragCradRef" :width="240" :height="leftListHeight" :left="12" :top="83"
          :zIndex="zIndexLeftList" :marginTop="0" @mousedown="clickLeftList">
          <div class="page-left">
            <div class="scroll">
              <DataList ref="dataListRef" :foldName="foldName" :subjectId="subjectId" @getCurData="getCurData" />
              <div class="bg-gray-line"></div>
              <SpikeList ref="spikeListRef" :subjectId="subjectId" :clusterTypeList="clusterTypeList"
                :isAllMode="isAllMode" @getCurSpike="getCurAlgSpike" @setClusterSlResult="setClusterSlResult"
                @pressEnterThreshold="pressEnterThreshold" @getClusterTypeList="getClusterTypeList" />
              <div class="bg-gray-line"></div>
              <ManualList ref="manualListRef" :subjectId="subjectId" :clusterTypeList="clusterTypeList"
                @getCurSpike="getCurManualSpike" @deleteSpike="deleteSpike" @getClusterTypeList="getClusterTypeList" />
              <div class="bg-gray-line"></div>
            </div>
          </div>
        </DragCardLeft>

        <div class="page-right" :class="!showSide ? 'left-right' : null">


          <LineCard v-if="isAllMode" ref="lineCardRef" class="widthP100" @successClickType="successClickType"
            @setRedLineValue="setRedLineValue" @closeButterflyModal="form.brainRegion = null"
            :filePath="curData.filePath" :brainRegion="form.brainRegion" :chNames="form.chNames"
            :startTime="form.startTime" :coregId="coregId" :niiFilePath="niiFilePath" :fifFilePath="fifFilePath"
            :locMethod="form.locMethod" :megId="megId" :subjectId="subjectId" :autoSl="form.autoSl"
            :showMarkAreaBg="form.showMarkAreaBg" :markAreaBgDuration="form.markAreaBgDuration" :curTime="form.redLine"
            :tmin="curData.tmin" :tmax="curData.tmax" :duration="form.duration" :allSpikeList="allSpikeList"
            :getFormParams="getParamsToLayoutModal" :customChannelList="customChannelList"
            :badChannelList="badChannelList" :eegCustomChannelList="eegCustomChannelList" :eegCombList="eegCombList"
            :curSpikeChannels="curSpikeChannels" :curSpikeSlChannels="curSpikeSlChannels" :megType="megType"
            @turnToGoodOrBadChannel="turnToGoodOrBadChannel" @setStartTime="setStartTime"
            @clickAllSpikeList="clickAllSpikeList" @setZIndex="setZIndex" />

          <Line v-if="!isAllMode" ref="lineRef" class="widthP100" @successClickType="getTimeIntervalSpikeList"
            @setRedLineValue="setRedLineValue" :filePath="curData.filePath" :brainRegion="form.brainRegion"
            :chNames="form.chNames" :startTime="form.startTime" :subjectId="subjectId" :tmin="curData.tmin"
            :badChannelList="badChannelList" :tmax="curData.tmax" :duration="form.duration" :allSpikeList="allSpikeList"
            :coregId="coregId" :getFormParams="getParamsToLayoutModal" :curSpikeChannels="curSpikeChannels"
            :curSpikeSlChannels="curSpikeSlChannels" :megType="megType" :showMarkAreaBg="form.showMarkAreaBg"
            :markAreaBgDuration="form.markAreaBgDuration" @setStartTime="setStartTime"
            @turnToGoodOrBadChannel="turnToGoodOrBadChannel" @clickAllSpikeList="clickAllSpikeList" />


        </div>

        <div class="fold-button" :class="{ 'fold-button-right': !showSide }" :style="{ zIndex: zIndexSideList }"
          @click="foldSide">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="80" viewBox="0 0 10 80" fill="none">
            <path
              d="M0 27.082C0 22.4247 1.08435 17.8313 3.16718 13.6656L10 0V80L3.16719 66.3344C1.08436 62.1687 0 57.5753 0 52.918V27.082Z"
              fill="var(--color-gray-icon)" />
            <path
              d="M6.14645 43.1464L3.35355 40.3536C3.15829 40.1583 3.15829 39.8417 3.35355 39.6464L6.14645 36.8536C6.46143 36.5386 7 36.7617 7 37.2071L7 42.7929C7 43.2383 6.46143 43.4614 6.14645 43.1464Z"
              fill="var(--color-white)" />
          </svg>
        </div>


        <DragCardLeft :width="195" :height="leftListHeight" :left="sideListLeft" :top="83" :zIndex="zIndexSideList"
          :marginTop="0" @mousedown="clickSideList" :class="showSide ? 'show-side' : 'hide-side'">

          <div class="page-side form-list">

            <div class="title">{{ t('筛选条件') }}</div>
            <div class="content">
              <!-- addon-after="s" -->

              <div class="pl8 pr8">
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

                    <a-button class="mr4 tooltip" :data-title="t('后退') + ' ←'"
                      :disabled="form.startTime === curData.tmin" size="small" @click="playBackward">
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
                    <IconDown class="text-12 color-t6 mr4" />
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
                    <template v-if="versionType === 'engineer'">
                      <a-form-item class="mb4" style="width: 210px;" :label="t('陷波频率')" name="notchFreq"
                        :labelCol="{ span: 11 }" :wrapperCol="{ span: 13 }">
                        <a-input-number class="input-unit" v-model:value="form.notchFreq" placeholder="" :min="0"
                          addon-after="Hz" v-bind="inputNumberParser" />
                      </a-form-item>
                    </template>
                  </template>
                </a-popover>

                <template v-if="versionType === 'engineer'">
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
                </template>

                <div class="ch-type-list flex flex-wrap" v-if="!isAllMode">
                  <div v-for="(item, index) in chTypeList" :key="index" class="item"
                    :class="{ active: !!form.chType.includes(item.value) }" @click="clickChType(item)">
                    <IconCheckbox class="mr4" v-show="!form.chType.includes(item.value)" />
                    <IconCheckboxActive class="mr4 color-blue" v-show="!!form.chType.includes(item.value)" />
                    {{ item.label }}
                  </div>
                </div>
              </div>


              <div class="title green-title" v-if="isAllMode">{{ t('溯源定位') }}</div>

              <div class="pt8 pl8 pr8">
                <a-form-item v-if="isAllMode" :label="t('选择溯源算法')" name="locMethod">
                  <a-select v-model:value="form.locMethod" :options="locMethodList" :placeholder="t('请选择')" />
                </a-form-item>

                <a-form-item v-if="isAllMode" name="autoSl">
                  <div class="flex-between">
                    <div>{{ t('自动溯源') }}:</div>
                    <a-radio-group class="ml82" v-model:value="form.autoSl" :options="yesNoList"
                      @change="changeAutoSl" />
                  </div>
                </a-form-item>
              </div>

              <div class="title purple-title" v-if="isAllMode">{{ t('布局设置') }}</div>
              <div class="title purple-title" v-if="!isAllMode">{{ t('操作') }}</div>

              <div class="pt8 pl8 pr8">
                <a-form-item v-if="isAllMode" :label="t('布局')">
                  <LayoutSet @changeLayout="changeLayout" />
                </a-form-item>

                <a-button v-if="isAllMode" class="widthP100 mb16" type="default" size="small" @click="openViewModal">
                  <span class="anticon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 19 20" fill="none">
                      <path
                        d="M5.54167 5C5.54167 3.61929 6.60499 2.5 7.91667 2.5H11.0833C12.395 2.5 13.4583 3.61929 13.4583 5V15C13.4583 16.3807 12.395 17.5 11.0833 17.5H7.91667C6.60499 17.5 5.54167 16.3807 5.54167 15V5Z"
                        stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
                      <path
                        d="M13.4583 5.83333H15.0417C15.9161 5.83333 16.625 6.57953 16.625 7.5V12.5C16.625 13.4205 15.9161 14.1667 15.0417 14.1667H13.4583V5.83333Z"
                        stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
                      <path
                        d="M5.54167 14.1667H3.95833C3.08388 14.1667 2.375 13.4205 2.375 12.5L2.375 7.5C2.375 6.57952 3.08388 5.83333 3.95833 5.83333L5.54167 5.83333L5.54167 14.1667Z"
                        stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
                    </svg>
                  </span>
                  {{ t('打开结构像窗口') }}
                </a-button>

                <a-button v-if="isAllMode" class="widthP100 mb16 long-text-button" type="default" size="small"
                  @click="openAllTimeModal">
                  <span class="anticon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 3V7M12 17V21M3 10L3 14C3 15.6569 4.34315 17 6 17L18 17C19.6569 17 21 15.6569 21 14V10C21 8.34315 19.6569 7 18 7L6 7C4.34315 7 3 8.34314 3 10Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  {{ t('打开全局时刻点窗口') }}
                </a-button>


                <a-button class="widthP100 mt8 mb16" v-if="!isAllMode && overlap" size="small"
                  @click="setOverlap(false)">
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
                <a-button class="widthP100 mt8 mb16" v-if="!isAllMode && !overlap" size="small"
                  @click="setOverlap(true)">
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

                <a-button class="widthP100 mb16" v-show="!isAllMode" size="small" @click="resetRedChannel">
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

                <a-form-item>
                  <div>
                    <BadChannel :filePath="curData.filePath" :subjectId="subjectId" :megType="megType"
                      @success="successSaveBadChannel" />
                  </div>
                </a-form-item>

                <a-form-item :label="t('是否显示棘波背景色')" name="showMarkAreaBg">
                  <a-radio-group class="ml4" v-model:value="form.showMarkAreaBg" :options="yesNoList"
                    @change="changeShowMarkAreaBg" />
                </a-form-item>
                <a-form-item :label="t('棘波背景色时长') + '(s)'" name="markAreaBgDuration">
                  <a-input-number v-model:value="form.markAreaBgDuration" placeholder="" :min="0.1" :max="form.duration"
                    :step="0.1" v-bind="inputNumberParser" @change="changeMarkAreaBgDuration" />
                </a-form-item>
              </div>

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

        </DragCardLeft>

      </div>

    </div>
  </a-form>

  <!-- 选择配准弹窗 -->
  <SelectCoregModal ref="selectCoregModalRef" @success="successSelectCoregModal" />

</template>

<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'

import { message, type FormInstance } from 'ant-design-vue'
import useKeyUp from '@/hooks/useKeyUp'
import { debounce, inputNumberParser, arraysAreEqual } from '@u/utils'
import { yesNoList } from '@u/data' // 算法列表

import DragCardLeft from './parts/DragCardLeft.vue'

import SwitchTab from '@c/SwitchTab.vue'
import SelectPatient from '@c/SelectPatient.vue'

import DataList from './DataList.vue'
import SpikeList from './SpikeList.vue'
import ManualList from './ManualList.vue'

import Line from './Line.vue'
import LineCard from './LineCard.vue'

// 顶部的组件
import UploadData from './parts/UploadData.vue'
import ExportData from './parts/ExportData.vue'

// 右侧的组件
import LayoutSet from './parts/LayoutSet.vue'
import BadChannel from './parts/BadChannel.vue'

import SelectCoregModal from './modal/SelectCoregModal.vue'

import MegChannelModal from './modal/MegChannelModal.vue'
import EegChannelModal from './eegModal/EegChannelModal.vue'

import { brainRegion16List as brainRegionList, locMethodList } from '@u/data' // 脑区列表, 算法列表

import {
  megApi,                     // 1. 查折线图
  timeIntervalSpikeApi, // 获取这段时间内的所有算法和手工标注棘波
  getBadChannelApi,
  getFifFileAllSpikeApi, // 43.  获取某个fif文件的所有时刻点
  getClusterTypeListApi, // 44.  获取聚类类别列表
} from '@/api/meg'

import {
  getCoregResultListApi, // 1. 获取配准结果列表
  getNiiFileListApi, // 2. 获取结构像文件列表
} from '@/api/sl'

import {
  getMegTypeApi, // 14. 获取患者megType，megin还是opm64
} from '@/api/subject'

import { calcUp, calcDown, setRatioStep } from '@/utils/ratioScale'

import { useCardStore } from '@/store/card'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
import { useWebSocketStore } from '@/store/websocket'

import { useOpmStore } from '@/store/opm'
const opmStore = useOpmStore()

const { t } = useI18n()

const webSocketStore = useWebSocketStore()

// 当最新上传成功的文件变化时，刷新列表
// 1：患者数据集   2：DICOM文件  3：NIFTI文件  4：脑电图文件   5：脑磁图文件
watch(() => webSocketStore.lastReceivedMessage, (newValue: any) => {
  // console.log('newValue :>> ', newValue);
  if (newValue.subjectId === subjectId.value && newValue.type === 'coreg_success') {
    message.success(t('配准算法执行完成'))
    getFifData()
  }
  if (newValue.subjectId === subjectId.value && newValue.type === 'fwd_success') {
    message.success(t('前向任务处理成功，可以进行溯源定位了'))
    getFifData()
  }
})

// 模式切换
const curMode = ref('more')
const modeList = ref([
  { label: t('单窗口'), value: 'single' },
  { label: t('多窗口'), value: 'more' },
])
function changeMode(value: any) {
  if (value === 'single') {
    clickTurnToSingle()
  } else {
    clickTurnToAllMode()
  }
}

const userStore = useUserStore()

const { versionType } = storeToRefs(userStore)

const { width: windowWidth, height: windowHeight } = useWindowSize()
const widthBig = computed(() => windowWidth.value > 2280)
const widthSmall = computed(() => windowWidth.value <= 2060)

// 左侧列表的高度
const leftListHeight = computed(() => {
  return windowHeight.value - 12 - 58 - 12 - 12
})

const sideListLeft = computed(() => {
  return windowWidth.value - 195 - 12
})

const zIndex = ref(0) // 层级的值，不停的累加
const zIndexLeftList = ref(1) // 层级的值，不停的累加
const zIndexSideList = ref(1) // 层级的值，不停的累加

function setZIndex(value: number) {
  zIndex.value = value
}

function clickLeftList() {
  if (isAllMode.value) {
    zIndexLeftList.value = Number(zIndex.value + 100)
    zIndex.value++
    lineCardRef.value.setZIndex(zIndex.value)
  }
}
function clickSideList() {
  if (isAllMode.value) {
    zIndexSideList.value = Number(zIndex.value + 100)
    zIndex.value++
    lineCardRef.value.setZIndex(zIndex.value)
  }
}

// 修改患者
function changePatientList(record: any) {
  subjectId.value = record.subjectId
  megId.value = record.megId
  document.title = `${t('脑磁图复核')} | ${megId.value}`
  nextTick(async () => {

    coregId.value = null
    niiFilePath.value = null
    fifFilePath.value = null
    curData.value = {}
    allSpikeList.value = [] // 全局时刻点先清空，否则会闪一下

    clusterTypeList.value = [] // 聚类类型也要置空，否则会用到其他患者上
    curSpikeChannels.value = [] // 高亮通道也置空
    curSpikeSlChannels.value = [] // 标红通道也置空

    // 切换的时候默认改成时间排序吧，否则聚类排序还要先请求类型接口
    spikeListRef.value.clearData()
    manualListRef.value.clearData()

    // 如果执行这一步，请求列表接口会请求2次，因为执行getClusterTypeList就会触发请求列表接口
    // if (spikeListRef.value.showType === 'cluster' || manualListRef.value.showType === 'cluster') {
    //   getClusterTypeList()
    // }

    if (lineCardRef.value) {
      lineCardRef.value.clearAllModal()
    }

    // 每次切换模式都要先选配准，把url改一下
    router.push({
      path: 'reviewMeg',
      query: {
        subjectId: subjectId.value,
        megId: megId.value,
        coregId: coregId.value,
      }
    })


    // 切换患者后保持已选模式
    if (curMode.value === 'single') {
      // 必须先请求megType，否则可能无法判断新megType是否和旧megType一致，form.chNames可能没清空就请求了megApi
      await getMegType()
      // onReload能先把tableData置空，否则在setData里，tableData一直有数据，如果是上一个的数据，target就是null了。
      dataListRef.value.onReload(true) // true默认选中第一个

      coregId.value = record.coregId || null
      turnToSingle() // 之前切换患者，默认单模式
    } else {
      getMegType()
      // onReload能先把tableData置空，否则在setData里，tableData一直有数据，如果是上一个的数据，target就是null了。
      dataListRef.value.onReload(true) // true默认选中第一个
      form.chNames = []
      form.eegChNames = []
      form.leadCombination = []
      await getFifData() // 现在切换患者，默认多模式
      turnToAllMode()
    }

  })
}


const newBrainRegionList = ref([...brainRegionList])

// let redLineEnter = false    // 是否在标记线输入框按下Enter键
// let ratioScaleEnter = false // 是否在比例尺输入框按下Enter键
// let thresholdEnter = false  // 是否在阈值输入框按下Enter键
let searchEnter = false     // 是否在搜索输入框按下Enter键，一个就够

// 子组件不能有键盘事件，否则父组件会失效
// 敲击键盘，按Enter键就查询，上下左右是移动
useKeyUp((key: string, e: any) => {
  if (searchEnter) {
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

  // code 是现代通用的标准，而 keyCode 是即将被淘汰的旧标准。
  // 好消息：e.altKey 在 macOS 上对 Option 键是完美兼容的。
  const { code, altKey } = e

  // 敲击键盘，Alt+Q键触发溯源定位 Alt+Q
  // 苹果电脑mac option+q 会变成特殊字符œ
  if (code === 'KeyQ' && altKey && isAllMode.value) {
    lineCardRef.value.clickLocation()
  }

  // alt+123456，是快速标记棘波类型的
  if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6'].includes(code) && altKey && isAllMode.value) {
    lineCardRef.value.clickType(Number(code.replace('Digit', '')))
  }

})

const route = useRoute()
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
const megType = ref<string>(String(route.query.megType || 'megin'))
const foldName = computed(() => {
  return `${megId.value}/meg`
})
document.title = `${t('脑磁图复核')} | ${megId.value}`

getMegType()

// watch(() => megId.value, async () => {
//   getMegType()
// }, { immediate: true })

// 'megin'或'opm64'或'opm64_meg_prefix'或'opm96'
async function getMegType() {
  const { code, data } = await getMegTypeApi({ megId: megId.value })
  if (code === 200) {
    // 如果切换患者，当前还是原来的meg类型,就保留form.chNames；否则，清空form.chNames；多模式下一律清空
    if (megType.value !== data) {
      if (curMode.value === 'single') {
        form.chNames = []
        form.eegChNames = []
        form.leadCombination = []
      }
    }
    // console.log('megType.value :>> ', data,new Date().getTime());
    megType.value = data || 'megin'
    // megType.value = 'opm96'
    console.log('megType:', megType.value)
    opmStore.setCurrentPatientMegType(megType.value)
  }
}

const coregId = ref<string>(String(route.query.coregId || ''))
const niiFilePath = ref<string>(String(route.query.niiFilePath || ''))
const fifFilePath = ref<string>(String(route.query.fifFilePath || ''))
const isAllMode = ref(true)  // 多窗口模式

const formRef = ref<FormInstance>()
const dataListRef = ref(null)
const spikeListRef = ref(null)
const manualListRef = ref(null)
const lineRef = ref(null)
const lineCardRef = ref(null)
const megChannelModalRef = ref(null)
const eegChannelModalRef = ref(null)

const loading = ref<boolean>(false)
const curData = ref<any>({})

const form = reactive<any>({
  startTime: null,   // 起始时间
  duration: 5,       // 显示时长
  frequency: 5,      // 步频
  playSpeed: 5,      // 自动翻页
  brainRegion: brainRegionList[0].value, // 脑区
  chNames: [],       // 通道 多选
  eegChNames: [],    // EEG通道
  leadCombination: [], // 导联组合
  isFilter: true,    // 滤波
  isBaselineCorrect: true, // 基线校正
  lowFreq: 3,        // 高通滤波频率
  highFreq: 40,      // 低通滤波频率
  notchFreq: 50,     // 陷波频率
  chType: [],        // 通道类型 多选，默认全不选中，全选中就是：['eog', 'ecg', 'gfp']
  redLine: null,     // 红色竖线数值
  locMethod: 'dip',   // 溯源算法

  autoSl: 0, // 自动溯源，默认 0 否，1 是
  showMarkAreaBg: 1, // 显示标记区域背景 ，默认 1 是
  markAreaBgDuration: 1, // 显示标记区域背景时长，默认 1 秒
})

const rules = reactive({
  startTime: [
    { required: true, message: t('请填写起始时间'), trigger: 'change' },
  ],
  duration: [
    { required: true, message: t('请填写显示时长') },
  ],
  frequency: [
    { required: true, message: t('请填写步频') },
  ],
  playSpeed: [
    { required: true, message: t('请填写自动翻页') },
  ],
})

// 通道类型
const chTypeList = [
  { label: 'eog', value: 'eog' },
  { label: 'ecg', value: 'ecg' },
  { label: 'gfp', value: 'gfp' },
]

const overlap = ref<boolean>(false)       // 重叠，默认不重叠
const isPlaying = ref<boolean>(false)     // 正在翻页
const ratioScale = ref<number>(2000)      // 比例尺
const buttonLoading = ref<boolean>(false) // 点击查询后2秒内不允许再次点击

onMounted(async () => {
  // 存在就赋值
  const local_form = JSON.parse(localStorage.getItem('megForm')) || {}
  form.lowFreq = local_form.lowFreq ?? 3
  form.highFreq = local_form.highFreq ?? 40
  form.notchFreq = local_form.notchFreq ?? 50
  form.duration = local_form.duration ?? 5 // 显示时长
  form.frequency = local_form.frequency ?? 5 // 步频
  form.playSpeed = local_form.playSpeed ?? 5 // 自动翻页
  form.isFilter = local_form.isFilter ?? true // 滤波
  form.isBaselineCorrect = local_form.isBaselineCorrect ?? true // 基线校正
  // ratioScale.value = local_form.ratioScale ?? 2000 // 比例尺

  const local_autoSl = localStorage.getItem('autoSl')
  form.autoSl = local_autoSl ? Number(local_autoSl) : 0 // 自动溯源，默认 0 否，1 是

  const local_showMarkAreaBg = localStorage.getItem('showMarkAreaBg')
  form.showMarkAreaBg = local_showMarkAreaBg ? Number(local_showMarkAreaBg) : 1 // 显示标记区域背景，默认 1 是， 0 否

  const local_markAreaBgDuration = localStorage.getItem('markAreaBgDuration')
  form.markAreaBgDuration = local_markAreaBgDuration ? Number(local_markAreaBgDuration) : 1 // 显示标记区域背景时长，默认 1 秒

  // 如果有coregId，说明是多窗口模式
  if (coregId.value && niiFilePath.value && fifFilePath.value) {
    turnToAllMode()
  } else {
    await getFifData()
    turnToAllMode()
  }
})

// 修改自动溯源
function changeAutoSl() {
  localStorage.setItem('autoSl', form.autoSl)
}
// 修改显示标记区域背景
function changeShowMarkAreaBg() {
  localStorage.setItem('showMarkAreaBg', form.showMarkAreaBg)
}
// 修改显示标记区域背景时长
function changeMarkAreaBgDuration() {
  localStorage.setItem('markAreaBgDuration', form.markAreaBgDuration)
}
//  转到多窗口模式
async function clickTurnToAllMode() {
  await getFifData()
  turnToAllMode()
  nextTick(() => {
    eegChannelModalRef.value.getEegChannelNames() // 38.  获取脑磁中的脑电通道集合
  })
}

//  转到单窗口模式
async function clickTurnToSingle() {
  turnToSingle()
  onSearch()
}


// 获取配准结果列表
async function getFifData() {
  const params = {
    megId: megId.value,
  }
  const { code, data } = await getCoregResultListApi(params)
  if (code === 200) {
    // 此时不要求必须前向完成，就可以展示结构像
    // 默认选中第一个，但第一个也必须是前向任务已完成的
    // if (data.length && data[0].fwdStatus === 1) {
    if (data.length && data[0].id) {

      coregId.value = data[0].id
      niiFilePath.value = data[0].niiFilePath
      fifFilePath.value = data[0].fifFilePath

      // 每次切换模式都要先选配准，把url改一下
      router.push({
        path: 'reviewMeg',
        query: {
          megId: megId.value,
          subjectId: subjectId.value,
          coregId: coregId.value,
          niiFilePath: niiFilePath.value,
          fifFilePath: fifFilePath.value,
        }
      })

      // 3.打开多窗口模式后再设置fif。lineCardRef还没挂载，所以要加上nextTick
      // 选择配准弹窗成功后，匹配对应的fif文件
      nextTick(() => {
        dataListRef.value.setData(fifFilePath.value)
      })

    } else {
      // message.info('当前患者尚未进行配准')
    }
  } else {
    // 接口报错
  }
}

// 获取数据
async function getNiiData() {
  const params = {
    foldName: `${megId.value}/anat`,
  }
  const { code, data } = await getNiiFileListApi(params)
  if (code === 200) {
    // 默认选中第一个，但第一个也必须是前向任务已完成的
    if (data.length && data[0].filePath) {
      niiFilePath.value = data[0].filePath
    }
  }
}


function turnToAllMode() {

  timeIndex = 0

  newBrainRegionList.value = [
    { label: t('全脑区'), value: 'all' },
  ]
  form.brainRegion = null  // 只留下全脑区一个选项后，切换后没有脑区选项

  // 原来修改MegChannelModal的newAllChannelList和givenList的地方

  isAllMode.value = true

  // nextTick(() => {
  //   // eegChannelModalRef.value.getEegChannelNames() // 38.  获取脑磁中的脑电通道集合
  //   lineCardRef.value.clearAllModal()
  // })

  getLayoutInfo()
}

function turnToSingle() {

  // 本来是clickIsAllMode()，但里面有和getCurData重复的代码，所以改成下面这样
  isAllMode.value = false
  newBrainRegionList.value = [
    ...brainRegionList
  ]
  // 只留下全脑区一个选项后，切换后只能是LT_all
  form.brainRegion = brainRegionList[0].value
  // 每次切换到单模式，都清空，再切回去都要先选配准

  // coregId.value = null
  niiFilePath.value = null
  fifFilePath.value = null

  // 切换到单模式，把url改一下
  router.push({
    path: 'reviewMeg',
    query: {
      subjectId: subjectId.value,
      megId: megId.value,
      coregId: coregId.value,
    }
  })

}


// 查询
function onSearch(type?: string) {
  if (!buttonLoading.value) {
    // 当滤波存在有值时，缓存当前值，滤波不存在时使用缓存值
    const local_form = JSON.parse(localStorage.getItem('megForm')) || {}
    localStorage.setItem('megForm', JSON.stringify({
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

    if (type === 'getBadChannel') {
      getMegData('getBadChannel')
    } else {
      getMegData()
    }
    buttonLoading.value = true
    setTimeout(() => {
      buttonLoading.value = false
    }, 2000)
  }
}

// 重置
function onReset() {
  form.startTime = curData.value.tmin
  form.brainRegion = brainRegionList[0].value
  form.chNames = []
  form.eegChNames = []
  form.leadCombination = []

  isPlaying.value = false


  // 存在就赋值
  const local_form = JSON.parse(localStorage.getItem('megForm')) || {}
  form.lowFreq = local_form.lowFreq ?? 3
  form.highFreq = local_form.highFreq ?? 40
  form.notchFreq = local_form.notchFreq ?? 50
  form.duration = local_form.duration ?? 5 // 显示时长
  form.frequency = local_form.frequency ?? 5 // 步频
  form.playSpeed = local_form.playSpeed ?? 5 // 自动翻页
  form.isFilter = local_form.isFilter ?? true // 滤波
  form.isBaselineCorrect = local_form.isBaselineCorrect ?? true // 基线校正
  // ratioScale.value = local_form.ratioScale ?? 2000 // 比例尺

  // 如果是单模式
  if (!isAllMode.value) {
    lineRef.value.resetChart() // 重置移动
  } else {
    // 多脑区模式没有脑区选项
    form.brainRegion = null
    deleteAllChNames()
  }

}

// 重置红通道
function resetRedChannel() {
  // 如果是单模式
  if (!isAllMode.value) {
    lineRef.value.resetRedChannel() // 重置红通道
  } else {
    // lineCardRef.value.resetRedChannel() // 重置红通道
  }
}


// 修改脑区，如果有值就查询
function changeBrainRegion() {
  // 如果选了脑区就清空通道
  if (form.brainRegion) {
    form.chNames = []
    form.eegChNames = []

    // 如果是单模式
    if (!isAllMode.value) {
      onSearch()
    } else {
      if (form.brainRegion === 'all') {
        nextTick(() => {
          const params = getParams()
          lineCardRef.value.setButterflyData(params)
        })
      }
    }

  }
}

// 删除所有通道
function deleteAllChNames() {
  form.chNames = []
  form.eegChNames = []
  form.leadCombination = []
  megChannelModalRef.value.deleteAllChNames()
  eegChannelModalRef.value.deleteAllChNames()
}


// 点击搜索或按下回车键时的回调，会触发方法，并会阻止useKeyUp()事件
function stopEnter() {
  searchEnter = true
  setTimeout(() => {
    searchEnter = false
  }, 1000)
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
    const local_form = JSON.parse(localStorage.getItem('megForm')) || {}
    form.lowFreq = local_form.lowFreq ?? 3
    form.highFreq = local_form.highFreq ?? 40
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

// 选择通道类型，多选
function clickChType(item: { value: any }) {
  if (form.chType.includes(item.value)) {
    form.chType = form.chType.filter((f: any) => f !== item.value)
  } else {
    form.chType.push(item.value)
  }
}

//  设置重叠
function setOverlap(value: boolean) {
  overlap.value = value
  // 如果是单模式
  if (!isAllMode.value) {
    lineRef.value.setOverlap(overlap.value, ratioScale.value)
  }
}

const ratioStep = ref<number>(0)
// 比例尺input-number点击上下箭头的回调
function onRatioStep(value: number, info: { offset: number, type: 'up' | 'down' }) {
  ratioStep.value = setRatioStep(ratioScale.value, info.type)
  // 第一次点击没反应，自己操作，但如果先点击了缩放，再点这个就有问题了
  if (info.offset === 0) {
    ratioScale.value = info.type === 'up' ? calcUp(ratioScale.value) : calcDown(ratioScale.value)
    changeRatioScale()
  }
  if (info.type === 'up' && ratioScale.value === 11) {
    ratioScale.value = 10
  }
}

// 展开收起左边的列表和side
const showSide = ref<boolean>(true)

function foldSide() {
  showSide.value = !showSide.value
  resizeChart()
}

// 点击2个展开收起，改变图表的大小
function resizeChart() {
  // 如果是单模式
  if (!isAllMode.value) {
    // 12+240+8+16+200+12 = 480 默认的，左和side都展示
    // 12+240+8+8+12 = 280 展示左，不展示side
    // 12+16+200+12 = 240 不展示左，展示side
    // 12+8+12 =32  不展示左，不展示side
    lineRef.value.resize(94, showSide.value ? 480 : !showSide.value ? 280 : 32) // 12+4+40+12=68
  }
}

// 上下左右移动
function moveUpDown(type: 'up' | 'down' | 'left' | 'right') {
  // 如果是单模式
  if (!isAllMode.value) {
    lineRef.value.setMove(type)
  }
}

// 修改比例尺
function changeRatioScale() {
  // 如果是单模式
  if (!isAllMode.value) {
    lineRef.value.setRatioScale(overlap.value, ratioScale.value)
  }
}

// 在算法检测棘波列表的阈值输入框按下Enter键，会触发它的getData()方法，并会阻止useKeyUp()事件
function pressEnterThreshold() {
  stopEnter()
}

// 上传数据成功，刷选患者数据列表
function uploadFileSuccess() {
  dataListRef.value.getData()
}

const isFirst = ref<boolean>(true) // 如果是第一次进入

// 点击了某数据，去获取棘波列表，去获取折线图数据
function getCurData(item: any) {
  fifFilePath.value = item.filePath // 切换患者数据列表时，全局的fifFilePath也要改变

  // 只能在多窗口模式下清空结构像的点位数据
  if (isAllMode.value) {
    lineCardRef.value.clearViewModalData() // 切换患者数据列表式要清空结构像的点位数据，不能写在getMegData里
  }

  curSpikeChannels.value = [] // 高亮通道也置空
  curSpikeSlChannels.value = [] // 标红通道也置空

  spikeListRef.value.setData(item)
  manualListRef.value.setData(item)

  nextTick(() => {
    if (isAllMode.value) {
      eegChannelModalRef.value.getEegChannelNames() // 38.  获取脑磁中的脑电通道集合
    }
  })

  curData.value = item // 设置当前数据
  form.startTime = item.tmin

  // 最新：现在切换fif时，不管单多，都要获取坏通道列表
  getMegData('getBadChannel')

  getFifFileAllSpike()

  // 如果是第一次进入，默认了第一条数据，就不做“把竖线去掉”的操作
  if (isFirst.value) {
    isFirst.value = false
  } else {
    // 备注：以前切换fif时，要把竖线去掉，是单模式的情况下才有。
    // 现在多模式下，切换fif时，也要把竖线去掉。
    // 只是在点击选择配准结果弹窗，选的不是当前fif文件，是其他的fif文件，也触发了切换fif，来到了这里，就出现了问题，导致多模式下的图表还没初始化完成就要设置竖线，会报错。
    // 切换患者数据列表时，要把竖线去掉
    setTimeout(() => {
      setLineRedMarkLine(null)
    }, 500)
  }
}

// 设置线的红色标记线，因为这个页面出现太多次设置，所以集中到这个方法
function setLineRedMarkLine(value: number) {
  form.redLine = value
  // 如果是单模式
  if (!isAllMode.value) {
    lineRef.value.setRedMarkLine(value)
  } else {
    lineCardRef.value.setRedMarkLine(value)
  }
}

// const curSpike = ref<any>(null)
const curSpikeChannels = ref<any[]>([])
const curSpikeSlChannels = ref<any[]>([])
const curBrainRegion = ref<string>(null)

// 点击了算法检测棘波列表某点，去获取折线图数据
function getCurAlgSpike(item: { spikeTime: number, brainRegion: string, slCoord: any, channels: any[], slChannels: any[] }) {
  // console.log('item :>> ', item);

  // curSpike.value = item || {}
  //  算法检测棘波列表，点击某个，
  // 如果有channels数据，右侧窗口里 对应通道的上下范围背景会变浅蓝。
  // 如果有slChannels数据，通道布局里的通道会变红，
  curSpikeChannels.value = item.channels || []
  curSpikeSlChannels.value = item.slChannels || []
  // console.log('item.channels :>> ', item.channels);
  // console.log('item.slChannels :>> ', item.slChannels);

  // （只在单模式下生效：脑区也要变），如果是多窗口模式，就不赋值form.brainRegion

  // 全模式 或者 单模式且brainRegion相同
  if (isAllMode.value || (isAllMode.value === false && form.brainRegion === item.brainRegion + '_all')) {
    // 如果点就在当前图中，就直接画线，否则要改动form.startTime，getMegData()，再画线
    if (item.spikeTime >= form.startTime && item.spikeTime <= form.startTime + form.duration) {
      setLineRedMarkLine(item.spikeTime)
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
      setLineRedMarkLine(item.spikeTime)
    }
  } else {
    // 如果是单模式，且brainRegion不同，那先改变脑区
    // 把要画的线放在正中间，去找form.startTime
    form.brainRegion = item.brainRegion + '_all'
    form.startTime = parseFloat((item.spikeTime - form.duration / 2).toFixed(1))
    if (form.startTime < curData.value.tmin) {
      form.startTime = curData.value.tmin
    }
    if (form.startTime >= curData.value.tmax - form.duration) {
      form.startTime = curData.value.tmax - form.duration
    }
    // 先请求数据再画线
    getMegData('', async () => setLineRedMarkLine(item.spikeTime))
  }

  // 最新：结构像窗口打开了，才要填点位，没打开就不打开
  // 全模式下，如果有slCoord，打开结构像窗口填上去
  if (isAllMode.value && item.slCoord) {
    const slCoord = JSON.parse(item.slCoord)
    const position = slCoord[form.locMethod]
    if (position) {
      // nextTick是要等 redMarkLine.value 设置完毕后再执行
      nextTick(() => {
        lineCardRef.value.clickLocationFromSpikeOrManual(position)
      })
    }
  }

  curBrainRegion.value = item.brainRegion || ''
  if (isAllMode.value && item.brainRegion) {
    nextTick(() => {
      lineCardRef.value?.changeOneModalBrain(item.brainRegion)
    })
  }

}

function setClusterSlResult(list: []) {
  nextTick(() => {
    list.forEach((item: any) => {
      const slCoord = JSON.parse(item.slCoord)
      const position = slCoord[form.locMethod]
      if (position) {
        nextTick(() => {
          lineCardRef.value.setClusterSlResult(position, item.spikeTime)
        })
      }
    })
  })
}

// 点击了手动标注列表某点，去画线
function getCurManualSpike(item: { startTime: number, slCoord?: any, brainRegion?: string, channels?: any[], }) {
  // console.log('item :>> ', item);

  // 最新：点击手动标注列表，curSpikeChannels和curSpikeSlChannels都使用channels
  // 如果有channels数据，右侧窗口里 对应通道的上下范围背景会变浅蓝。并且通道布局里的通道会变红。
  curSpikeChannels.value = item.channels || []
  curSpikeSlChannels.value = item.channels || []

  // 如果点就在当前图中，就直接画线，否则要改动form.startTime，getMegData()，再画线
  if (item.startTime >= form.startTime && item.startTime <= form.startTime + form.duration) {
    setLineRedMarkLine(item.startTime)
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
    setLineRedMarkLine(item.startTime)
  }

  // 全模式下，如果有slCoord，打开结构像窗口填上去
  if (isAllMode.value && item.slCoord) {
    const slCoord = JSON.parse(item.slCoord)
    const position = slCoord[form.locMethod]
    if (position) {
      // nextTick是要等 redMarkLine.value 设置完毕后再执行
      nextTick(() => {
        // 如果结构像窗口打开了，还有竖线，才会填上去，下面这个方法里有判断
        lineCardRef.value.clickLocationFromSpikeOrManual(position)
      })
    }
  }

  curBrainRegion.value = item.brainRegion || ''
  if (isAllMode.value && item.brainRegion) {
    nextTick(() => {
      lineCardRef.value?.changeOneModalBrain(item.brainRegion)
    })
  }
}

function clickAllSpikeList(item: any) {
  getCurManualSpike({
    startTime: Number(item.startTime),
  })
}

// 如果点就在当前图中，就获取新的棘波点
function deleteSpike(item: any) {
  if (item.startTime >= form.startTime && item.startTime <= form.startTime + form.duration) {
    getTimeIntervalSpikeList()
  }
}

// 在标记线输入框按下Enter键，会触发changeRatioScale()方法，并会阻止useKeyUp()事件
function pressEnterRedLine() {
  stopEnter()

  // 如果这个时间小于tmin或者大于tmax，其实也没必要跳转了
  if (form.redLine < curData.value.tmin || form.redLine > curData.value.tmax) {
    return message.info(`文件时间范围在[${curData.value.tmin}s, ${curData.value.tmax}s]，请重新填写时间`)
  }

  // 如果在最左边，小于tmin+0.5的范围，直接画线
  // 如果在最右边，大于tmax-0.5的范围，直接画线
  // 如果不在最左和最右边，[form.startTime+0.5,form.startTime+form.duration-0.5]的范围，直接画线
  // 其他情况，把要画的线放在正中间，修改form.startTime后getMegData()，再画线
  if (form.startTime === curData.value.tmin && form.redLine <= form.startTime + 0.5) {
    setLineRedMarkLine(form.redLine)
  } else
    if (form.startTime === curData.value.tmax - form.duration && form.redLine >= curData.value.tmax - 0.5) {
      setLineRedMarkLine(form.redLine)
    } else
      if (form.redLine >= form.startTime + 0.5 && form.redLine <= form.startTime + form.duration - 0.5) {
        setLineRedMarkLine(form.redLine)
      } else {
        form.startTime = parseFloat((form.redLine - form.duration / 2).toFixed(1))
        if (form.startTime < curData.value.tmin) {
          form.startTime = curData.value.tmin
        }
        if (form.startTime >= curData.value.tmax - form.duration) {
          form.startTime = curData.value.tmax - form.duration
        }

        // 如果修改了标记线，且调新数据，就把高亮通道清空
        curSpikeChannels.value = []
        curSpikeSlChannels.value = []
        getMegData()
        setLineRedMarkLine(form.redLine)
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

  form.redLine = parseFloat((form.redLine + num).toFixed(3))

  if (form.redLine < curData.value.tmin) {
    form.redLine = curData.value.tmin
  }
  if (form.redLine > curData.value.tmax) {
    form.redLine = curData.value.tmax
  }

  pressEnterRedLine()
}

// 设置标记线的值（从Line和LineModal画竖线而来）
function setRedLineValue(value: number) {
  form.redLine = value
  // 如果标记线和当前选中的不一样，就清掉选中的
  spikeListRef.value.setRedLineValue(value)
  manualListRef.value.setRedLineValue(value)
}


// 多窗口模式下添加窗口
async function addNewCard(listName: string, type: string) {

  // 如果有通道，就清除脑区
  if (form.chNames.length > 0) {
    form.brainRegion = null // 这里必须是''，不能是null，会报错
  }

  // 至少选择脑区或通道中的一个
  if ((!form.brainRegion || form.brainRegion === 'all') && !form.chNames.length) {
    return message.info(t('请选择脑区或通道'))
  }

  const params: any = getParams()
  if (listName) {
    params.listName = listName
  }

  params.modalType = 'meg' // 'meg','ecgeog','gfp'

  if (params.chNames.includes('EOG')) {
    params.isEog = true
  }
  if (params.chNames.includes('ECG')) {
    params.isEcg = true
  }
  if (params.chNames.includes('GFP')) {
    params.isGfp = true
  }
  // 如果有EOG、ECG、GFP，就去掉
  params.chNames = params.chNames.filter((item: string) => item !== 'EOG' && item !== 'ECG' && item !== 'GFP')

  // 在没有通道的情况下，判断是否有EEG、EOG、GFP，赋值modalType
  if (!params.chNames.length) {
    if ((params.isEcg || params.isEog) && !params.isGfp) {
      params.modalType = 'ecgeog'
      const newChNames = []
      if (params.isEcg) {
        newChNames.push('ECG')
      }
      if (params.isEog) {
        newChNames.push('EOG')
      }
      params.listName = newChNames.join(',')
    }

    if (!params.isEcg && !params.isEog && params.isGfp) {
      params.modalType = 'gfp'
      params.listName = 'GFP'
    }

    // 如果有cegg和gfp，还有gfp，这种情况一般不会出现，modalType依然是meg，但listName要加上
    if ((params.isEcg || params.isEog) && params.isGfp) {
      const newChNames = []
      if (params.isEcg) {
        newChNames.push('ECG')
      }
      if (params.isEog) {
        newChNames.push('EOG')
      }
      newChNames.push('GFP')
      params.listName = newChNames.join(',')
    }

  }

  // console.log('params.modalType :>> ', params.modalType);


  lineCardRef.value.addLineData(params)

  // 添加窗口成功后清空通道
  setTimeout(() => {
    deleteAllChNames() // 删除所有通道
  }, 300)
}

// 多窗口模式下添加窗口
async function addNewCardEeg(listName: string, type: string) {

  // 如果有通道，就清除脑区
  if (form.eegChNames.length > 0) {
    form.brainRegion = null // 这里必须是''，不能是null，会报错
  }

  // 至少选择脑区或通道中的一个
  if (!form.eegChNames.length) {
    return message.info(t('请选择脑电通道'))
  }

  const params: any = getParams()
  if (listName) {
    params.listName = listName
  }
  params.modalType = type // 'eegChannel','eegComb'

  params.isEog = false
  params.isEcg = false
  params.isGfp = false

  if (type === 'eegComb') {
    params.leadCombination = params.eegChNames || []
    params.chNames = []
  }
  if (type === 'eegChannel') {
    params.chNames = params.eegChNames
  }
  delete params.eegChNames

  // console.log('params :>> ', params);
  lineCardRef.value.addLineData(params)

  // 添加窗口成功后清空通道
  setTimeout(() => {
    deleteAllChNames() // 删除所有通道
  }, 300);
}

// 获取折线图Meg数据， cb只在getCurAlgSpike()中有用过一次
// type只有一个'getBadChannel'值，有的话，说明要获取坏通道，只在单通道时有效
async function getMegData(type?: string, cb?: () => {}) {
  // 如果有通道，就清除脑区
  if (form.chNames.length > 0) {
    form.brainRegion = null // 这里必须是''，不能是null，会报错
  }

  if (!curData.value.filePath) {
    message.info(t('请先选择患者fif文件'))
    return
  }

  if (type === 'getBadChannel') {
    getBadChannel()
  }

  // 如果是多窗口模式
  if (isAllMode.value) {
    const params = getParams()
    if (!params) {
      return
    }
    // 过滤掉那些值为null的数据，所以用Object.values和filter(item=>item)
    // const lineModalList = lineCardRef.value.getLineModalList()
    // const length = Object.values(lineModalList).filter(item=>item).length
    // console.log('length :>> ', length);

    lineCardRef.value.setAllLineData(params)
    cb && cb()

  } else {

    // 最新：可以不选脑区或通道，因为也可以只勾选EOG/ECG/GFP，
    // 但至少选择脑区或通道中或EOG/ECG/GFP的一个
    if ((!form.brainRegion) && !form.chNames.length && !form.chType.length) {
      return message.info(t('请选择脑区或通道'))
    }


    const params: any = getParams()
    if (!params) {
      return
    }

    // 切回单模式时，如果通道里存在EOG，则chNames里过滤掉，否则接口会报错，并设置isEog=true
    if (params.chNames.includes('EOG')) {
      params.isEog = true
      if (!form.chType.includes('eog')) {
        form.chType.push('eog')
      }
    }
    if (params.chNames.includes('ECG')) {
      params.isEcg = true
      if (!form.chType.includes('ecg')) {
        form.chType.push('ecg')
      }
    }
    if (params.chNames.includes('GFP')) {
      params.isGfp = true
      if (!form.chType.includes('gfp')) {
        form.chType.push('gfp')
      }
    }
    // 如果有EOG、ECG、GFP，就去掉
    params.chNames = params.chNames.filter((item: string) => item !== 'EOG' && item !== 'ECG' && item !== 'GFP')
    form.chNames = params.chNames

    if (!isPlaying.value) {
      loading.value = true
    }
    // console.log('form.chNames :>> ', form.chNames, new Date().getTime());
    const { code, data } = await megApi(params)
    loading.value = false
    // console.log('data :>> ', data);
    if (code === 200) {
      if (lineRef.value) {
        lineRef.value.setChartData(data)
      }

      // 只有在切换fif和坏通道弹窗里保存了后，才会获取新的坏通道列表，
      // 其他如前进、后退、查询，不调接口
      // if (type === 'getBadChannel') {
      //   // console.log('lineRef.value :>> ', lineRef.value);
      //   // console.log('lineCardRef.value :>> ', lineCardRef.value);
      //   lineRef.value.getBadChannel()
      // }

      getTimeIntervalSpikeList()
      cb && cb()
    }
  }

}

// 获取参数
function getParams() {
  if (!curData.value.filePath) {
    message.info(t('请先选择患者fif文件'))
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
  return {
    subjectId: subjectId.value,
    filePath: curData.value.filePath,
    startTime: form.startTime,
    duration: form.duration,
    brainRegion: form.brainRegion || '',
    chNames: form.chNames,
    eegChNames: form.eegChNames,
    leadCombination: form.leadCombination,
    isFilter: form.isFilter,
    isBaselineCorrect: form.isBaselineCorrect,
    filterFreqs: {
      lowFreq: form.lowFreq,
      highFreq: form.highFreq,
      notchFreq: form.notchFreq,
    },
    isEog: form.chType.includes('eog'),
    isEcg: form.chType.includes('ecg'),
    isGfp: form.chType.includes('gfp'),
    megType: megType.value,
  }
}

// 获取参数，通道布局窗口需要判断tmin和tmax
function getParamsToLayoutModal() {
  return {
    ...getParams(),
    tmin: curData.value.tmin,
    tmax: curData.value.tmax,
  }
}


// 选择配准弹窗
const selectCoregModalRef = ref(null)

// 点击切换单多模式
function clickIsAllMode() {


  // 如果当前是单模式
  if (!isAllMode.value) {
    // 如果有coregId，说明可以转成多窗口模式
    if (coregId.value) {
      newBrainRegionList.value = [
        { label: t('全脑区'), value: 'all' },
        // ...brainRegionList  // 只留下全脑区一个选项
      ]
      form.brainRegion = null  // 只留下全脑区一个选项后，切换后没有脑区选项

      // 原来修改MegChannelModal的newAllChannelList和givenList的地方

      isAllMode.value = true

      nextTick(() => {
        eegChannelModalRef.value.getEegChannelNames() // 38.  获取脑磁中的脑电通道集合
      })

      getLayoutInfo()

    } else {
      // 如果没有coregId，说明要先选配准
      selectCoregModalRef.value.showModal({
        subjectId: subjectId.value,
        megId: megId.value,
      })
    }

  } else {
    // 如果当前是全模式，可以直接转成单模式
    newBrainRegionList.value = [
      ...brainRegionList
    ]

    // 只留下全脑区一个选项后，切换后只能是LT_all
    form.brainRegion = brainRegionList[0].value

    // 原来修改MegChannelModal的newAllChannelList和givenList的地方

    // 每次切换到单模式，都清空，再切回去都要先选配准
    coregId.value = null
    niiFilePath.value = null
    fifFilePath.value = null

    isAllMode.value = false
    onSearch() // 这个之前是要onSearch('getBadChannel')，但我现在觉得完全没必要
    // onSearch('getBadChannel') // 解释一下，因为切换成单模式时，是要选择

    // 切换到单模式，把url改一下
    router.push({
      path: 'reviewMeg',
      query: {
        subjectId: subjectId.value,
        megId: megId.value,
        coregId: coregId.value,
      }
    })

  }

}


let timeIndex = 0
let getLayoutInfoTimer: any = null
// 获取当前布局信息
function getLayoutInfo() {
  // console.log('3 :>> ',timeIndex, new Date().getTime());

  timeIndex++

  // 怎么请求了2遍，
  // 点击左侧算法棘波，通道调了2次接口

  // 要等dataList的接口请求成功后params才有值
  // 现在监听curData.value之后，params必定有值，setTimeout可删了，保留只是
  getLayoutInfoTimer = setTimeout(async () => {

    // 次数超过10次（500*10=5秒）就要停下来了，可能DataList接口是空值，curData.value.filePath永远为空
    if (timeIndex > 10) {
      timeIndex = 0
      return
    }
    // 没有值时，说明还没拿到curData，就停下来。可能是1500ms的时候，curData还没拿到
    if (!curData.value.filePath) {
      clearTimeout(getLayoutInfoTimer)
      return getLayoutInfo()
    }
    timeIndex = 0

    fifFilePath.value = curData.value.filePath
    // console.log('curData.value :>> ', curData.value);

    // console.log('没问题 :>> ');

    // 这里也要等布局列表接口出来
    const cardStore = useCardStore()
    const { curLayoutData } = cardStore
    const { layoutInfo } = curLayoutData

    // 如果当前没有布局，就停止
    if (!layoutInfo) {
      message.info(t('当前还未设置布局'))
      return
    }

    const params = getParams()

    if (layoutInfo.butterfly) {
      lineCardRef.value?.setButterflyData({ ...params, ...layoutInfo.butterfly })
    }

    if (layoutInfo.layoutModal) {
      lineCardRef.value?.setLayoutModalData({ ...getParamsToLayoutModal(), ...layoutInfo.layoutModal })
    }

    if (layoutInfo.viewModal) {
      // 如果没有niiFilePath，就获取niiFilePath
      if (!niiFilePath.value) {
        await getNiiData()
      }
      // 如果获取niiFilePath接口里有才打开，没有就不打开了
      if (niiFilePath.value) {
        lineCardRef.value?.openViewModal(layoutInfo.viewModal)
      }
    }

    if (layoutInfo.allTimeModal) {
      lineCardRef.value?.openAllTimeModal(layoutInfo.allTimeModal)
    }


    if (layoutInfo.lineList) {
      layoutInfo.lineList.forEach((item: any) => {
        lineCardRef.value?.addLineData({ ...params, ...item })
      })
    }

  }, 500)


}

// 修改布局
function changeLayout() {
  // console.log('修改布局 :>> ');
  lineCardRef.value.clearAllModal()
  getLayoutInfo()
}

// 获取这段时间内的所有手工标注棘波
async function getTimeIntervalSpikeList() {
  // 如果是单模式
  if (!isAllMode.value) {
    const params = {
      filePath: curData.value.filePath,
      startTime: form.startTime,
      endTime: form.startTime + form.duration
    }
    const { code, data } = await timeIntervalSpikeApi(params)
    if (code === 200) {
      lineRef.value.drawSpikePointList(data?.records || [])
    }
  }
}

// 成功点击类型，点击的或者快捷键都都算
function successClickType(time: string) {
  manualListRef.value.giveTimeToRefresh(time)
}

const allSpikeList = ref([])
// 获取这段时间内的所有手工标注棘波
async function getFifFileAllSpike() {
  const params = {
    filePath: curData.value.filePath,
    subjectId: subjectId.value,
  }
  const { code, data } = await getFifFileAllSpikeApi(params)
  if (code === 200) {
    allSpikeList.value = data || []
  }
}



// 坏通道列表
const badChannelList = ref<string[]>([
  // 'MEG0141', 'MEG0222'
])

// 获取这段时间内的所有手工标注棘波
async function getBadChannel(cb?: () => void) {
  const params = {
    fifFilePath: curData.value.filePath,
    subjectId: subjectId.value,
  }
  const { code, data } = await getBadChannelApi(params)
  if (code === 200) {
    if (!arraysAreEqual(badChannelList.value, data)) {
      badChannelList.value = data || []
      cb && cb()
    }
  }
}

// 标记后再获取新的坏通道列表，再画坏通道线
function turnToGoodOrBadChannel() {
  getAndDrawNewBadChannel()
}

// 坏通道管理弹窗保存新的数据后
function successSaveBadChannel() {
  getAndDrawNewBadChannel()
}

// 获取新的坏通道列表，再画新的坏通道线
function getAndDrawNewBadChannel() {
  getBadChannel(() => {
    // 必须加nextTick，否则无法试试更改线
    nextTick(() => {
      if (!isAllMode.value) {
        lineRef.value.drawBadChannel()
      } else {
        lineCardRef.value.drawBadChannel()
      }
    })
  })
}

// 打开结构像窗口
function openViewModal() {
  lineCardRef.value.openViewModal()
}


function openAllTimeModal() {
  lineCardRef.value.openAllTimeModal()

}
const router = useRouter()

// 选择配准弹窗成功后，赋值，再打开多窗口模式
function successSelectCoregModal(res: any) {

  coregId.value = res.id
  niiFilePath.value = res.niiFilePath
  fifFilePath.value = res.fifFilePath

  clickIsAllMode() // 2.再打开多窗口模式

  // 3.打开多窗口模式后再设置fif。lineCardRef还没挂载，所以要加上nextTick
  // 选择配准弹窗成功后，匹配对应的fif文件
  nextTick(() => {
    dataListRef.value.setData(fifFilePath.value)
  })

  // 每次切换模式都要先选配准，把url改一下
  router.push({
    path: 'reviewMeg',
    query: {
      megId: megId.value,
      subjectId: subjectId.value,
      coregId: coregId.value,
      niiFilePath: niiFilePath.value,
      fifFilePath: fifFilePath.value,
    }
  })

}


// 从时间拉条设置起始时间
function setStartTime(start: number) {
  form.startTime = start
  getMegData()
}

const customChannelList = ref([])
function setCustomChannelList(list: any[]) {
  customChannelList.value = list || []
}

const eegCustomChannelList = ref([])
function setEegCustomChannelList(list: any[]) {
  eegCustomChannelList.value = list || []
}


const eegCombList = ref([])
function setEegCombList(list: any[]) {
  eegCombList.value = list || []
}


const clusterTypeList = ref([])
// 44.  获取聚类类别列表
async function getClusterTypeList() {
  const params = {
    subjectId: subjectId.value,
  }
  const { code, data } = await getClusterTypeListApi(params)
  if (code === 200) {
    clusterTypeList.value = data.map((item: any) => ({ value: item, label: item })) || []
    nextTick(() => {
      spikeListRef.value.setClusterTypeList(clusterTypeList.value)
      manualListRef.value.setClusterTypeList(clusterTypeList.value)
    })
  }
}
</script>

<style lang="less" scoped>
@import './style/index.less';

.segmented {
  margin-right: 8px;
  padding: 3px;
  border-radius: 20px;
  background: var(--color-primary-01);

  :deep(.ant-segmented-item) {
    padding: 0 8px;
    border-radius: 20px;

    .ant-segmented-item-label {
      padding: 0 5px;
      min-height: 28px;
      line-height: 28px;
    }
  }
}
</style>
