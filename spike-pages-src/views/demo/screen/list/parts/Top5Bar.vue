<!-- 切换菜单 -->
<template>
  <!-- <div class="list">
    <div class="item" :class="{ active: item.value == active.value }" v-for="(item, index) in list" :key="index"
      @click="clickItem(item)">
      <div class="name">{{ item.name }}</div>
      <div class="icon"></div>
    </div>
  </div> -->

  <fx-top5Bar :datas="list" />
</template>

<script lang="ts" setup>

const active = ref<any>({}) // 选中
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
      { name: '户政', value: 98 },
      { name: '驾驶证', value: 23 },
      { name: '网安', value: 99 },
      { name: '边防', value: 69 },
      { name: '治安', value: 45 },
      { name: '港务', value: 43 },
    ]
    list.value = data || []
  })
}

// 点击
function clickItem(item: any) {
  active.value = item
  console.log('active.value :>> ', active.value)
}

</script>

<style lang="less" scoped>
@space: 12px; // 间距

.list {
  padding: @space @space 0;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: calc((100% - @space * 2) / 3);
    height: calc((100% - @space * 3) / 3);
    margin-right: @space;
    margin-bottom: @space;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: rgba(0, 35, 98, 0.57);
    border: 1px solid #40a1f7;
    cursor: pointer;

    &:nth-of-type(3n) {
      margin-right: 0;
    }

    &.active {
      border: 2px solid #ffcb10;

      .icon {
        border-bottom: 10px solid #ffcb10; // 朝上
      }
    }

    .name {
      font-size: 16px;
      text-align: center;
    }

    .icon {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      border: 10px solid transparent;
      border-bottom: 10px solid #40a1f7; // 朝上
    }

  }
}
</style>