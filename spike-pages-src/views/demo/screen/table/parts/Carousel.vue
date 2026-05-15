<!-- 轮播 -->
<template>
  <div ref="tableRef">

    <a-carousel class="p8" :style="{ width: width }" arrows autoplay :autoplaySpeed="5000">
      <template #prevArrow>
        <left-circle-outlined class="arrow-left" />
      </template>
      <template #nextArrow>
        <right-circle-outlined class="arrow-right" />
      </template>

      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="item" v-for="(subItem, subIndex) in item" :key="subIndex">
          <span>{{ subItem.index }}</span>
          <span>{{ subItem.name }}</span>
          <span>{{ subItem.code }}</span>
          <span>{{ subItem.reason }}</span>
        </div>
      </div>

    </a-carousel>

  </div>
</template>

<script lang="ts" setup>
import { splitGroup } from '@u/utils'

const list = ref<any>([]) // 列表
const width = ref<any>(0) // 宽度
const tableRef = ref(null)

onMounted(() => {
  init()
})

function init() {
  width.value = tableRef.value.getBoundingClientRect().width * 1920 / window.innerWidth + 'px'
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
      { id: 5, name: 'XX集团11', code: '34081272317611', reason: '严重失信' },
      { id: 5, name: 'XX集团12', code: '34081272317611', reason: '严重失信' },
    ]

    data.forEach((item: any, index: number) => {
      item.index = index + 1
    })

    const rowNum = 5 // 一页5行
    list.value = splitGroup(data, rowNum)
    // 在最后一页补满{}
    const restNum = rowNum - (data.length % rowNum)
    for (let i = 0; i < restNum; i++) {
      list.value[list.value.length - 1].push({})
    }
  })
}

</script>

<style lang="less" scoped>
/deep/.ant-carousel {

  .slick-dots {
    bottom: -14px;
  }

  .arrow-left,
  .arrow-right {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    opacity: 0.3;
    z-index: 1;

    &:hover {
      opacity: 0.6;
    }
  }

  .arrow-left {
    left: 8px;
  }

  .arrow-right {
    right: 8px;
  }

}


.list {
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #c5e3ff;
  overflow: hidden;
  position: relative;

  .item {
    width: 100%;
    height: calc(100% / 5);
    display: flex;
    align-items: center;
    cursor: pointer;
    overflow: hidden;

    &:nth-child(odd) {
      background: #022F84;
    }

    &:nth-child(even) {
      background: #062B79;
    }

    &:hover {
      background: #124ab1;
    }

    >span {
      text-align: center;

      &:nth-child(1) {
        width: 10%;
        text-align: right;
      }

      &:nth-child(2) {
        width: 30%;
      }

      &:nth-child(3) {
        width: 30%;
      }

      &:nth-child(4) {
        width: 30%;
        color: #FF7F80;
      }
    }
  }
}
</style>