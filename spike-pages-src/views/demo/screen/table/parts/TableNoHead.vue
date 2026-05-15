<!-- 无表头表格 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="index"> {{ index + 1 }} </div>
      <div class="name">{{ item.name }}</div>
      <div class="value">
        <Count :data="item.value" />
        万次
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const list = ref<any[]>([]) // 列表

onMounted(() => {
  init()
})

function init() {
  getData()
}

// 获取数据
function getData() {
  setTimeout(() => {
    const data = [
      { name: '户政', value: 198 },
      { name: '驾驶证', value: 123 },
      { name: '网安', value: 99 },
      { name: '边防', value: 69 },
      { name: '治安', value: 45 },
      { name: '港务', value: 43 },
      { name: '出入境证照', value: 23 },
      { name: '户政', value: 198 },
      { name: '驾驶证', value: 123 },
      { name: '网安', value: 99 },
      { name: '边防', value: 69 },
      { name: '治安', value: 45 },
      { name: '港务', value: 43 },
      { name: '出入境证照', value: 23 },
    ]
    list.value = data || []
  })
}

</script>

<style lang="less" scoped>
.list {
  padding: 12px 24px;
  font-size: 16px;
  overflow: auto;
  overflow: overlay;


  .item {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;

    >.index {
      width: 22px;
      height: 22px;
      margin-right: 24px;
      font-size: 14px;
      border-radius: 3px;
      text-align: center;
    }

    &:nth-of-type(1),
    &:nth-child(2),
    &:nth-child(3) {
      >.index {
        background: #41a2f8;
      }
    }

    >.name {
      flex: 1;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    >.value {
      text-align: right;
    }
  }
}
</style>