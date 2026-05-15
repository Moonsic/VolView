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
      allNum: 10000,
      redNum: 2000,
      blackNum: 3000,
      lowerNum: 4000,
      commonNum: 5000,
      higherNum: 6000,
      highNum: 70,
    }
    list.value.forEach(item => {
      item.value = data[item.code]
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
    cursor: pointer;

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