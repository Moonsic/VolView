<!--  -->
<template>
  <div class="page">
    <div class="left">
        <Back class="page-back" :title="'设置'" :showArrow="false" />

      <div class="menu-list">
        <div class="item" v-for="(item, index) in menuList" :key="index"
          :class="{ active: item.value === curItem.value }" @click="clickItem(item)">
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="right">
      <component :is="curComponent" />
    </div>
  </div>
</template>

<script lang="ts">

import SameName from './SameName.vue'
import SplitArray from './SplitArray.vue'
import SortTree from './SortTree.vue'

export default {
  components: {
    SameName,
    SplitArray,
    SortTree,
  },
  setup() {

    // 左侧菜单 value为string比较好，方便url跳转
    const menuList = ref([
      { value: '1', label: '溯源定位', component: 'SameName' },
      { value: '2', label: '溯源定位', component: 'SplitArray' },
      { value: '3', label: '溯源定位', component: 'SortTree' },
    ])

    const curItem = ref<any>(menuList.value[0])
    const curComponent = ref(menuList.value[0].component)

    const router = useRouter()
    // 点击
    function clickItem(item: any) {
      curItem.value = item
      curComponent.value = item.component

      router.push({
        path: 'setting',
        query: {
          tab: item.value,
        }
      })
    }

    // 根据url的value值，找到对应的组件
    const route = useRoute()
    const queryTab = String(route.query.tab || '')
    const target = menuList.value.find((item: any) => item.value === queryTab)
    if (target) {
      curItem.value = target
      curComponent.value = target.component
    } else {
      router.push({
        path: 'setting',
        query: {
          tab: curItem.value.value,
        }
      })
    }

    return {
      menuList,
      curItem,
      curComponent,
      clickItem
    }
  }
}

</script>

<style lang='less' scoped>
.page {
  display: flex;
  // background: #fff;
  height: calc(100vh - 70px - 16px - 16px);
  position: relative;

  .left {
    width: 220px;
    min-width: 220px;
    margin-right: 12px;
    overflow: hidden;
    display: inline-block;
    vertical-align: top;
    background: #fff;
    border-radius: 4px;

    .menu-list {
      width: 100%;
      height: calc(100% - 46px - 4px - 4px);
      font-size: 16px;
      color: var(--color-t2);
      background: #fff;
      overflow: auto;

      .item {
        margin: 8px;
        padding-left: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        height: 48px;
        // 先hover
        &:hover {
          background: rgba(8, 97, 255, 0.3);
          border-radius: 4px;
        }

        // 再选中
        &.active {
          color: #fff;
          background: rgb(8, 97, 255);
          border-radius: 4px;
        }

      }
    }
  }

  .right {
    width: calc(100% - 220px - 12px);
    display: inline-block;
    vertical-align: top;
    position: relative;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
    overflow: auto;
  }
}
</style>