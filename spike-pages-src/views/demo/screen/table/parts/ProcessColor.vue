<!-- 彩色进度条 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="name">{{ item.name }}</div>
      <div class="value" v-if="item.progress">
        <div class="progress">
          <div :style="{
            width: item.value + '%',
            backgroundImage: `linear-gradient(to right, ${item.color[0]} , ${item.color.length > 1 ? item.color[1] : item.color[0]})`
          }">
          </div>
        </div>
        <span class="per" :style="{ color: item.color[1] }">
          <Count :data="item.value" />%
        </span>
      </div>
      <div class="value" v-else>
        <span class="num" :style="{ color: item.color }">
          <Count :data="item.value" />
        </span>
        个
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const list = ref<any[]>([
  { name: 'CPU使用率', code: 'cpu', value: 0, color: ['#FF4F8B', '#FF7F80'], progress: true },
  { name: '内存使用率', code: 'neicun', value: 0, color: ['#5BEBD0', '#01B7AB'], progress: true },
  { name: '系统盘使用率', code: 'xitong', value: 0, color: ['#FFBC00', '#FE9B1A'], progress: true },
  { name: '数据盘使用率', code: 'shuju', value: 0, color: ['#5BEBD0', '#01B7AB'], progress: true },
  { name: '网络连接数', code: 'wangluo', value: 0, unit: '个', color: '#5DFF9A', progress: false },
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
      cpu: 20,
      neicun: 80,
      xitong: 60,
      shuju: 40,
      wangluo: 1998,
    }
    list.value.forEach(item => {
      item.value = data[item.code]
    })
  })
}

</script>

<style lang="less" scoped>
.list {
  font-size: 16px;
  color: #55a2ea;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px 0;

  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    .name {
      flex: 3;
      padding-right: 16px;
      text-align: right;
      letter-spacing: 1px;
    }

    .value {
      flex: 5;
      display: flex;
      align-items: center;
      text-align: left;
      letter-spacing: 1px;

      .progress {
        position: relative;
        overflow: hidden;
        width: 182px;
        height: 14px;
        margin: 0 16px 0 8px;
        border-radius: 20px;
        background: #113e9a;

        >div {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          border-radius: 20px;
          transition: all ease-out 1.2s;
        }
      }

      .per {
        font-size: 20px;
        font-weight: 500;
      }

      .num {
        color: #5DFF9A;
        font-size: 26px;
        margin-left: 12px;
        margin-right: 6px;
      }
    }
  }
}
</style>