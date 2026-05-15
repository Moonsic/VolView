<!-- 数据总览 -->
<template>
  <div class="list">
    <div class="item" :class="{ width33: index < 3 }" v-for="(item, index) in list" :key="index">
      <div class="value" :style="{ color: item.color }">
        <span class="num">
          <Count :data="item.value" separator="," />
        </span>
        <span class="unit">{{ item.unit }}</span>
      </div>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { dealNum } from '@u/utils'

const list = ref([
  { name: '企业数量', code: 'allNum', value: 0, unit: '个', color: '#6CF7FC' },
  { name: '红名单企业数量', code: 'redNum', value: 0, unit: '个', color: '#6CF7FC' },
  { name: '黑名单企业数量', code: 'blackNum', value: 0, unit: '个', color: '#6CF7FC' },
  { name: '低风险企业', code: 'lowerNum', value: 0, unit: '个', color: '#6CF7FC' },
  { name: '一般风险企业', code: 'commonNum', value: 0, unit: '个', color: '#6CF7FC' },
  { name: '较高风险企业', code: 'higherNum', value: 0, unit: '个', color: '#6CF7FC' },
  { name: '高风险企业', code: 'highNum', value: 0, unit: '个', color: '#ffab00' },
]) // 列表

onMounted(() => {
  init()
})

function init() {
  getData()
}

// 获取数据
function getData() {
  setTimeout(() => {
    const data = {
      allNum: 12345678901,
      redNum: 1234567890,
      blackNum: 1234567,
      lowerNum: 10000,
      commonNum: 12345,
      higherNum: 1234.5678,
      highNum: 7.89101,
    }
    list.value.forEach(item => {
      const [value, unit] = dealNum(data[item.code])
      item.value = value
      item.unit = `${unit}${item.unit}`
    })
  })
}

</script>

<style lang="less" scoped>
.list {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 25%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &.width33 {
      width: 33.33%;
    }

    .value {
      margin-bottom: 4px;

      .num {
        font-size: 32px;
        margin-right: 4px;
      }

      .unit {
        font-size: 16px;
      }

    }

    .name {
      font-size: 18px;
    }
  }

}
</style>