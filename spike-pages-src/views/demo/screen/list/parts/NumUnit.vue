<!-- 数字+单位 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="name">{{ item.name }}</div>
      <div class="value">
        <span class="num">
          <Count :data="item.value" separator="," />
        </span>
        <span class="unit">{{ item.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const list = ref([
  { name: '注册人数', code:'num1', value: 1.25, unit: '亿人' },
  { name: '浏览次数', code:'num2', value: 23.76, unit: '万次' },
  { name: '访问次数', code:'num3', value: 23.46, unit: '万次' },
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
      num1: 10000,
      num2: 20000,
      num3: 30000,
    }
    list.value.forEach(item => {
      item.value = data[item.code]
    })
  })
}

</script>

<style lang="less" scoped>
.list {
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:before,
  &:after {
    content: "";
    display: block;
  }

  .item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      font-size: 20px;
    }

    .value {

      .num {
        font-size: 36px;
        color: #FFCF5D;
        margin-right: 8px;
      }
      .unit {
        font-size: 18px;
      }
    }

  }
}
</style>