<!-- 数据总览 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="name">
        <div class="img-wrap">
          <img :src="item.img" alt="" />
        </div>
        <span> {{ item.name }}</span>
      </div>
      <div class="value">
        <span class="num">

          <template v-if="item.code !== 'current'">
            <Count :data="item.value" :time="300" />
          </template>
          <template v-else>
            <span class="no-value" v-if="item.code === 'current' && !item.value"> {{ t('暂未执行溯源任务') }}</span>
            <span class="has-value" v-else> {{ item.value || '' }}</span>
          </template>

        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import personImg from '@img/overview/person.svg'
import ageImg from '@img/overview/age.svg'
import totalImg from '@img/overview/total.svg'
import spikeNumImg from '@img/overview/spikeNum.svg'
import timeImg from '@img/overview/time.svg'

import { pipelineStatApi } from '@/api/statistics'
import Count from '@c/Count.vue'

const { t } = useI18n()

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  allData: {
    type: Object,
    default: () => { },
  },
})


const list = ref([
  { name: t('总人数'), code: 'subjectNum', value: null, unit: '人', color: '#333', img: personImg },
  { name: t('已溯源患者人数'), code: 'subjectNum', value: null, unit: '人', color: '#333', img: ageImg },
  { name: t('待溯源患者人数'), code: 'subjectNum', value: null, unit: '人', color: '#333', img: ageImg },
  { name: t('当前溯源患者编号'), code: 'current', value: null, unit: '', color: '#333', img: timeImg },
]) // 列表

const checkedList = ref(['T1WNum', 'MEGNum'])
const plainOptions = ref([
  { label: 'T1W', value: 'T1WNum' },
  { label: 'MEG', value: 'MEGNum' }
])


watch(() => props.allData, () => {
  getData()
})

// 获取数据
function getData() {
  const data = {
    subjectNum: props.allData.subjectNum,
    totalFinishedPipelineNum: props.allData.totalFinishedPipelineNum,
    totalUnfinishedPipelineNum: props.allData.totalUnfinishedPipelineNum,
    runningPipelineSubjectCode: props.allData.runningPipelineSubjectCode,
  }

  list.value[0].value = data.subjectNum
  list.value[1].value = data.totalFinishedPipelineNum
  list.value[2].value = data.totalUnfinishedPipelineNum
  list.value[3].value = data.runningPipelineSubjectCode
}

// 修改多选框
function changeCheckBox(e: any[], item: IAnyObject) {
  if (!e.length) {
    item.value = 0
  } else if (e.length === 1) {
    item.value = item[e[0]]
  } else if (e.length === 2) {
    item.value = item.AllNum
  }
}

const emit = defineEmits(['setFinishedPipelineSubjectNum'])


// getPipelineData()

// // 获取数据
// async function getPipelineData() {
//   const { code, data } = await pipelineStatApi({})
//   if (code === 200) {
//     const { totalFinishedPipelineNum, spikeNum, finishedPipelineSubjectNum } = data
//     list.value[2].value = totalFinishedPipelineNum
//     list.value[3].value = spikeNum
//     emit('setFinishedPipelineSubjectNum', finishedPipelineSubjectNum)
//   }
// }

</script>

<style lang="less" scoped>
@space: 18px; // 间距

.list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 18px;

  .item {
    width: calc((100% - @space * 3) / 4);
    margin-right: @space;
    margin-bottom: @space;
    padding: 32px 0 32px 32px;
    background: var(--color-bg);
    border-radius: 18px;
    box-shadow: var(--box-shadow);
    border: var(--border-card);

    &:nth-of-type(4n) {
      margin-right: 0;
    }

    .name {
      display: flex;
      align-items: center;
      font-size: 18px;
      margin-bottom: 16px;

      .img-wrap {
        width: 50px;
        height: 50px;
        margin-right: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--color-primary-005);
        border-radius: 6px;
      }
    }

    .value {

      .num {
        font-size: 28px;
        font-weight: 600;
        margin-left: 4px;
        margin-right: 4px;
        font-size: 40px;
      }

      .unit {
        font-size: 16px;
      }

      .no-value {
        display: inline-block;
        font-size: 20px;
        font-weight: 400;
        transform: translateY(-10px);
        color: var(--color-t5);
      }

      .has-value {
        display: inline-block;
        font-size: 28px;
        line-height: 1;
      }
    }


  }

}
</style>