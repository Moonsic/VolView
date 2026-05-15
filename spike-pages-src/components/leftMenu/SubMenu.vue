<template>
  <a-sub-menu :key="menuInfo.path">
    <template #icon>
      <component :is='antIconList[menuInfo.icon]'></component>
    </template>
    <template #title>
      {{ menuInfo.name }}
    </template>
    <template v-for="item in menuInfo.children">
      <template v-if="!item.children || !item.children.length">
        <a-menu-item :key="item.path" @click="clickMenuTitle(item)">
          <template #icon>
            <component :is='antIconList[item.icon]'></component>
          </template>
          {{ item.name }}
        </a-menu-item>
      </template>
      <template v-else>
        <SubMenu :menu-info="item" :key="item.path" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts" setup>

import { antIconList } from '@u/antIcons'

const router = useRouter()

const props = defineProps({
  menuInfo: {
    type: Object,
    default: () => ({}),
  },
})
const { menuInfo } = props

interface IMenuData {
  path: string
  name: string
  icon: string
  permiss: string
  isFolder: boolean
  children?: IMenuData[]
}

// 点击菜单标题
function clickMenuTitle(item: IMenuData) {
  if (!item.isFolder) {
    router.push(item.path)
  }
}

</script>