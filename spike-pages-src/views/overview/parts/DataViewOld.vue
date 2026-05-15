<!-- 数据总览 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="name">
        <div class="img-wrap">
          <img :src="item.img" alt="">
        </div>
        <span> {{ item.name }}</span>
      </div>

      <div class="value">
        <span class="num">
          <template v-if="item.code === 'ageRange'">
            <!-- {{ item.minAge }} ~ {{ item.maxAge }} -->
            <Count :data="item.minAge" :time="500" />
            ~
            <Count :data="item.maxAge" :time="500" />
          </template>
          <template v-else>
            <!-- {{ item.value }} -->
            <Count :data="item.value" :time="300" />
          </template>
        </span>
        <!-- <span class="unit mr16">{{ item.unit }}</span> -->
        <span v-if="item.code === 'dataSize'">
          <a-checkbox-group v-model:value="checkedList" :options="plainOptions"
            @change="(e: any) => changeCheckBox(e, item)" />
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
// import timeImg from '@img/overview/time.svg'

import { pipelineStatApi } from '@/api/statistics'
import Count from '@c/Count.vue'

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
  { name: '患者人数', code: 'subjectNum', value: null, unit: '人', color: '#333', img: personImg },
  { name: '年龄范围', code: 'ageRange', value: '', minAge: null, maxAge: null, unit: '岁', color: '#333', img: ageImg },
  { name: '一键溯源总数', code: 'total', value: '', unit: null, color: '#333', img: totalImg },
  { name: '算法检测棘波总数', code: 'spikeNum', value: null, unit: 'min', color: '#333', img: spikeNumImg },
  // { name: '一键溯源平均耗时', code: 'time', value: '',  unit: 'min', color: '#333', img: timeImg },
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
    T1WNum: props.allData.totalT1WSize,
    MEGNum: props.allData.totalMegSize,
    minAge: props.allData.minAge,
    maxAge: props.allData.maxAge,
  }

  // list.value.forEach((item: any) => {
  //   item.value = data[item.code]
  //   // if (item.code === 'dataSize') {
  //   //   item.T1WNum = formatFileSize(data.T1WNum)
  //   //   item.MEGNum = formatFileSize(data.MEGNum)
  //   //   item.AllNum = formatFileSize(data.T1WNum + data.MEGNum)
  //   //   item.value = formatFileSize(data.T1WNum + data.MEGNum)
  //   // }
  //   if (item.code === 'ageRange') {
  //     item.minAge = data.minAge
  //     item.maxAge = data.maxAge
  //   }
  // })

  list.value[0].value = data.subjectNum
  list.value[1].minAge = data.minAge
  list.value[1].maxAge = data.maxAge
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


getPipelineData()

// 获取数据
async function getPipelineData() {
  const { code, data } = await pipelineStatApi({})
  if (code === 200) {
    const { totalFinishedPipelineNum, spikeNum, finishedPipelineSubjectNum } = data
    list.value[2].value = totalFinishedPipelineNum
    list.value[3].value = spikeNum

    emit('setFinishedPipelineSubjectNum', finishedPipelineSubjectNum)

    // allData.value = data || []
    // genderList.value = [
    //   { name: '男性', value: data.gender.man },
    //   { name: '女性', value: data.gender.women },
    // ]
    // detectedList.value = [
    //   { name: '是', value: data.detected.yesNum },
    //   { name: '否', value: data.detected.noNum },
    // ]
    // spikeNumList.value = data.spikeNumList || []
  }
}

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

    }


  }

}
</style>