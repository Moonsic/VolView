<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    @openChange="onOpenChange"
  >
    <template v-for="item in props.menuData">
      <template v-if="!item.children || !item.children.length">
        <a-menu-item :key="item.path" @click="clickMenuTitle(item)">
          <component :is='antIconList[item.icon]'></component>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <SubMenu :key="item.path" :menu-info="item" />
      </template>
    </template>
  </a-menu>
</template>

<script lang="ts" setup>

import { PropType } from 'vue'
import { RouteRecordName } from 'vue-router'
import { antIconList } from '@u/antIcons'
import SubMenu from './SubMenu.vue'

const router = useRouter()

const props = defineProps({
  menuData: {
    type: Array as PropType<IMenuData[]>,
    default: () => [],
  },
  selectedKeys: {
    type: Array as PropType<(RouteRecordName | string)[]>,
    default: () => [],
  },
})

const selectedKeys = ref<(RouteRecordName | string)[]>(props.selectedKeys)
const openKeys = ref<string[]>([])
// const rootSubmenuKeys = ref<string[]>([])

interface IMenuData {
  path: string
  name: string
  icon: string
  permiss: string
  isFolder: boolean
  children?: IMenuData[]
}

onMounted(() => {
  setOpenKeys()
})

// 设置打开的菜单
function setOpenKeys() {
  let parentKey: string[] = []
  // console.log('menuData :>> ', menuData);
  props.menuData?.forEach(item => {
    parentKey.push(item.path)
    // if (item.children && item.children.length) {
    //   rootSubmenuKeys.value.push(item.path)
    //   if (item.children.find(f => f.path == route.name)) {
    //     parentKey = [item.path]
    //   }
    //   if (!parentKey.length) {
    //     item.children && item.children.forEach(item2 => {
    //       if (item2.children && item2.children.length && item2.children.find(f => f.path == route.name)) {
    //         parentKey = [item.path, item2.path]
    //       }
    //     })
    //   }
    // }
  })
  openKeys.value = parentKey

}

// 菜单只打开选中的
function onOpenChange(keys: string[]) {
  // const latestOpenKey = keys.find(item => openKeys.value.indexOf(item) === -1 )
  // if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
  //   openKeys.value = keys
  // } else {
  //   openKeys.value = latestOpenKey ? [latestOpenKey] : []
  // }
}

// 点击菜单标题
function clickMenuTitle(item: IMenuData) {
  if (!item.isFolder) {
    router.push(item.path)
  }
}

</script>
<style lang='less' scoped>
// 子级背景色为白色，默认fafafa
:deep(.ant-menu-sub.ant-menu-inline) {
  background: #fff;
}
</style>
