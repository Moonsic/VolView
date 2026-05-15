<template>

  <div class="main-page">
    <div class="page-top-tab">
      <SwitchTab :tab="1" :megId="megId" :subjectId="subjectId" />

      <div class="flex-between">
        <div class="flex-start">

          <SelectPatient :megId="megId" :subjectId="subjectId" @change="changePatientList" />

          <a-button type="primary" class="light-primary-btn ml8" size="small" shape="round" @click="getNewStatus">
            <IconReload />
            <span>{{ t('刷新状态') }}</span>
          </a-button>

        </div>

        <!-- <a-segmented class="segmented" v-model:value="curLayout" :options="layoutList" @change="changeLayout">
          <template #label="{ value }">
            <div v-if="value === 'horizontal'">
              <ApartmentOutlined style="transform: rotate(90deg);" title="横向" />
            </div>
            <div v-if="value === 'vertical'">
              <ApartmentOutlined style="transform: rotate(180deg);" title="竖向" />
            </div>
          </template>
</a-segmented> -->

      </div>

    </div>
    <div class="page-bottom">
      <div class="left">
        <Progress ref="progressRef" :megId="megId" :subjectId="subjectId" :detailData="detailData">
        </Progress>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import SwitchTab from '@c/SwitchTab.vue'
import SelectPatient from '@c/SelectPatient.vue'

import Progress from './Progress.vue'

import { getSubjectByIdApi } from '@/api/subject'

import { message } from 'ant-design-vue'

const { t } = useI18n()


const route = useRoute()

const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))
document.title = `${t('溯源发起')} | ${megId.value}`

const progressRef = ref(null)

// 修改患者
function changePatientList(record: any) {
  subjectId.value = record.subjectId
  megId.value = record.megId
  document.title = `${t('溯源发起')} | ${megId.value}`

  getDetail()
  nextTick(() => {
    getNewStatus()
  })
}

// 执行中的刷新按钮
function getNewStatus() {
  progressRef.value.getData()
  progressRef.value.clearData()
  message.success(t('已刷新'), 0.6)
}

onMounted(() => {
  getDetail()
})


const detailData = ref<IAnyObject>({})
// 获取详情
async function getDetail() {
  const params = {
    subjectId: subjectId.value
  }
  const { code, data } = await getSubjectByIdApi(params)
  if (code === 200) {
    data.checked = data.checked === 1 ? true : false
    detailData.value = data || {}
  }
}


</script>

<style lang="less" scoped>
@margin: 12px; // margin

// 页面根class
.main-page {
  padding: @margin;
  background: var(--color-page-bg);

  .bg-gray-line {
    background: var(--color-bg);
    width: 100%;
    height: 6px;
  }

  .page-top {

    .top {

      .unit {
        transform: translateY(-8px);
        margin-left: 2px;
      }

      .input-number {
        width: 70px;
      }
    }
  }

  .page-bottom {
    display: flex;
    height: calc(100vh - 58px - 12px - @margin - @margin);
    min-height: calc(100vh - 58px - 12px - @margin - @margin);
    position: relative;

    .left {
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: var(--color-bg);
      border: var(--border-card);
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
      position: relative;

      >div {
        background: var(--color-bg);
        border-radius: 8px;
        overflow: hidden;
        border: var(--border-card);

        &:nth-child(1) {
          height: 270px;
        }

        &:nth-child(2) {
          flex: 1;
        }
      }

    }
  }

}



:deep(.segmented) {
  &.ant-segmented .ant-segmented-item-label {
    padding: 0 5px;
  }
}
</style>
