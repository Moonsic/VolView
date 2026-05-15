<!-- 表格 -->
<template>
  <div class="list">
    <div class="header">
      <span v-for="(item, index) in header" :key="index">{{ item }}</span>
    </div>
    <div class="body">
      <div class="item" v-for="(item, index) in list" :key="index">
        <span>{{ index + 1 }}</span>
        <span>{{ item.name }}</span>
        <span>{{ item.code }}</span>
        <span>{{ item.reason }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const header = ref(['序号', '企业名称', '企业信用代码', '列入原因']) // 表头
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
      { id: 1, name: 'XX科技有限公司1', code: '34081272312312', reason: '老赖' },
      { id: 2, name: 'XX有限责任公司2', code: '34081272876349', reason: '老赖' },
      { id: 3, name: 'XX公司3', code: '34081272311231', reason: '经营异常' },
      { id: 4, name: 'XX股份有限公司4', code: '34081223123123', reason: '经营异常' },
      { id: 5, name: 'XX集团5', code: '34081272317611', reason: '严重失信' },
      { id: 1, name: 'XX科技有限公司6', code: '34081272312312', reason: '老赖' },
      { id: 2, name: 'XX有限责任公司7', code: '34081272876349', reason: '老赖' },
      { id: 3, name: 'XX公司8', code: '34081272311231', reason: '经营异常' },
      { id: 4, name: 'XX股份有限公司9', code: '34081223123123', reason: '经营异常' },
      { id: 5, name: 'XX集团10', code: '34081272317611', reason: '严重失信' },
    ]

    list.value = data || []
  })
}

</script>

<style lang="less" scoped>
.list {
  width: 100%;
  height: calc(100% - 34px);
  padding: 8px;
  font-size: 16px;

  .header {
    display: flex;
    align-items: center;
    width: calc(100%);
    height: 42px;
    background: linear-gradient(90deg, #2260e2, rgba(32, 68, 144, 1));
  }

  .body {
    height: calc(100% - 42px);
    overflow: auto;
    // outline: 1px solid yellow;
  }

  .item {
    width: 100%;
    height: calc(100% / 5);
    display: flex;
    align-items: center;
    cursor: pointer;

    &:nth-child(odd) {
      background: #022F84;
    }

    &:nth-child(even) {
      background: #062B79;
    }

    &:hover {
      background: #124ab1;
    }

    &.header {
      height: 42px;
      background: linear-gradient(90deg, #2260e2, rgba(32, 68, 144, 0.66));
    }

    >span {
      &:nth-child(4) {
        color: #FF7F80;
      }
    }
  }

  .header,
  .item {
    >span {
      text-align: center;

      &:nth-child(1) {
        width: 10%;
      }

      &:nth-child(2) {
        width: 30%;
      }

      &:nth-child(3) {
        width: 30%;
      }

      &:nth-child(4) {
        width: 30%;
      }
    }
  }
}
</style>