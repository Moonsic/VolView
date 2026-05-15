<template>
  <a-card>
    <a-tabs v-model:activeKey="tab" @change="changeTab">
      <a-tab-pane v-for="item in tabList" :key="item.component" :tab="item.name">
        <!-- <component :is="item.component" v-if="tab===item.component" /> -->
      </a-tab-pane>
    </a-tabs>

    <component :is="curComponent" />
  </a-card>
</template>

<script>

import ListTable from './ListTable/Index.vue'

import SameName from './SameName.vue'
import BigDataFor from './BigDataFor.vue'
import SplitArray from './SplitArray.vue'
import SortTree from './SortTree.vue'
import ChangeList from './ChangeList.vue'

import MyIframe from './MyIframe.vue'

export default {
  components: {
    ListTable,
    BigDataFor,
    SameName,
    SplitArray,
    SortTree,
    ChangeList,
    MyIframe
  },
  setup() {
    const tab = ref('MyIframe')
    const curComponent = ref('MyIframe')

    const tabList = ref([

      { name: 'MyIframe', component: 'MyIframe' },
      { name: '列表', component: 'ListTable' },

      { name: '过滤重名', component: 'SameName' },
      { name: '大数据for循环', component: 'BigDataFor' },
      { name: '大数组分割成多个小数组', component: 'SplitArray' },
      { name: '树排序', component: 'SortTree' },
      { name: '改变原来数组', component: 'ChangeList' },
    ])

    function changeTab(e) {
      console.log('e :>> ', e);
      tab.value = e
      curComponent.value = e
    }

    return {
      tab,
      tabList,
      curComponent,
      changeTab
    }
  }
}

</script>
<style lang="less" scoped>
</style>