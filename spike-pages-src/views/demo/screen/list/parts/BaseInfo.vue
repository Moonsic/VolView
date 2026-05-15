<!-- 基本信息 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <span class="name">{{ item.name }} ：</span>
      <span class="value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>

const list = ref([
  { name: 'IP 地址', code: 'code1', value: '11.33.56.56' },
  { name: '资源编码', code: 'code2', value: '01-04-01-0000000087' },
  { name: '所属系统', code: 'code3', value: '数据中台' },
  { name: '操作系统', code: 'code4', value: 'Centos7' },
  { name: 'CPU', code: 'code5', value: '4 核' },
  { name: '内存', code: 'code6', value: '16 GB' },
  { name: '系统盘', code: 'code7', value: '40 GB' },
  { name: '数据盘', code: 'code8', value: '200 GB' },
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
      code1: '11.33.56.56',
      code2: '01-04-01-0000000087',
      code3: '数据中台',
      code4: 'Centos7',
      code5: '4 核',
      code6: '16 GB',
      code7: '40 GB',
      code8: '200 GB',
    }
    list.value.forEach(item => {
      item.value = data[item.code]
    })
  })
}

</script>

<style lang="less" scoped>
.list {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-content: space-between;
  padding: 16px 0;
  font-size: 16px;
  color: #55a2ea;

  .item {
    width: 100%;
    display: flex;
    letter-spacing: 1px;

    .name {
      flex: 9;
      padding-right: 20px;
      text-align: right;
    }

    .value {
      flex: 10;
      text-align: left;
    }
  }
}
</style>