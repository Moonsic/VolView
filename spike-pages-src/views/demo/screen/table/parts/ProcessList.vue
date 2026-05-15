<!-- 进度条 -->
<template>
  <div class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <div class="index"> {{ index + 1 }} </div>
      <div class="name">{{ item.name }}</div>
      <div class="right">
        <div class="progress">
          <div class="inner" :style="{
            width: item.percent + '%',
            backgroundImage: `linear-gradient(to right, #026FFF, #43BDFF)`
          }">
          </div>
        </div>
        <div class="value">
          <Count :data="item.value" />
          万次
        </div>
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
      { name: '蜀山区', value: 1001 },
      { name: '庐阳区', value: 920 },
      { name: '包河区', value: 531 },
      { name: '瑶海区', value: 710 },
      { name: '高新区', value: 610 },
      { name: '滨湖区', value: 350 },
      { name: '政务区', value: 250 },
      { name: '政务区', value: 250 },
      { name: '政务区', value: 250 },
    ]
    list.value = data.map(item => {
      return {
        ...item,
        percent: 0,
      }
    })

    // 这里必须延时,否则没有transition效果
    setTimeout(() => {
      const max = Math.max(...data.map(item => item.value))
      list.value = data.map(item => {
        return {
          ...item,
          percent: (item.value / max) * 100
        }
      })
    })
  })
}

</script>

<style lang="less" scoped>
.list {
  width: 100%;
  height: 100%;
  padding: 12px 24px 0;
  font-size: 16px;
  overflow: auto;
  overflow: overlay;

  .item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;

    >.index {
      width: 22px;
      height: 22px;
      margin-right: 16px;
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
      width: 70px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .right {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .progress {
        flex: 1;
        height: 14px;
        border-radius: 0 20px 20px 0;
        background: #113e9a;
        position: relative;
        overflow: hidden;

        .inner {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          border-radius: 0 20px 20px 0;
          transition: all ease-out 1.2s;
        }
      }

      .value {
        width: 90px;
        text-align: right;
      }
    }

  }
}
</style>