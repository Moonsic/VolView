<template>
  <a-layout class="layout-index" has-sider>

    <a-layout-header class="layout-header flex-between" v-show="!noHeaderList.includes(String(route.name))"
      :style="{ backgroundImage: `url(${header_bg})` }">

      <div class="logo-text flex-start">
        <!-- <img class="logo" :src="logo" alt="" /> -->
        <div class="text"> {{ SYSTEM_NAME }} </div>
      </div>

      <a-dropdown placement="bottom">
        <div class="header-right flex-start">
          <img class="mr8" :src="default_head" alt="" style="width: 26px;" />
          <span class="mr8">{{ userInfo.name || "访问者" }}</span>
          <CaretDownOutlined class="icon-down" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item class="menu-item">
              <ExportOutlined class="icon" />
              <span @click="onLoginOut">退出系统</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

    </a-layout-header>


    <a-layout class="layout-bottom" :class="[noHeaderList.includes(String(route.name)) ? 'full-screen' : '']">

      <a-layout-sider class="layout-sider" v-model:collapsed="collapsed" :trigger="null" collapsible
        v-show="!noHeaderList.includes(String(route.name))">

        <LeftMenu :menuData="menuData" :selectedKeys="selectedKeys" />

        <MenuUnfoldOutlined v-if="collapsed" class="collapsed-icon" @click="collapsed = !collapsed" />
        <MenuFoldOutlined v-else class="collapsed-icon" @click="collapsed = !collapsed" />

      </a-layout-sider>

      <a-layout-content class="layout-content">
        <div :class="[!noMarginList.includes(String(route.name)) ? 'content' : '']">

          <router-view v-slot="{ Component }">
            <component :is="Component" v-if="!route.meta.keepAlive" />
            <keep-alive>
              <component :is="Component" v-if="route.meta.keepAlive" />
            </keep-alive>
          </router-view>

        </div>
      </a-layout-content>

    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { RouteRecordName } from 'vue-router'
import { message } from 'ant-design-vue'
import { permissData } from '@/router/indexPage'
import { leftMenuData } from '@u/menu'
import LeftMenu from '@c/leftMenu/Index.vue'
import default_head from '@img/head/man.png'
import header_bg from '@img/head/header_bg.png'

import { SYSTEM_NAME } from '@/utils/config'

const noHeaderList = ['reviewMeg', 'reviewEeg', 'viewResults', 'reviewMri', 'startAnalysis'] // 没有头部的菜单
const noMarginList = ['home', ...noHeaderList]         // 没有被限制margin的菜单

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)
const selectedKeys = ref<(RouteRecordName | string)[]>([route.name])

interface IMenuData {
  path: string
  name: string
  icon: string
  permiss: string
  isFolder: boolean
  children?: IMenuData[]
}

const permissList = JSON.parse(localStorage.getItem('permissList')) || []

// 所有可跳转的菜单
const allPathMenu: string[] = []
// 根据权限筛选菜单
const permissMenuData = deleteNoChildrenMenu(formatMenu(leftMenuData))
// 最终用到的菜单
const menuData = ref<IMenuData[]>(permissMenuData)

if (route.name === 'index') {
  // 有至少一个可跳转的菜单，跳转到第一个可跳转的菜单
  if (allPathMenu.length) {
    const firstMenu = allPathMenu[0]
    selectedKeys.value = [firstMenu]
    router.push({ path: firstMenu })
  }
}

// 格式化菜单数据
function formatMenu(list: any[]) {
  let resultList: any[] = []
  list?.forEach(item => {
    if (!item.path) {
      item.isFolder = true
      item.path = 'page-' + new Date().getTime()
    }
    // 计算permiss，以前是直接在menu.ts里写的，现在从permissData里拿一下
    item.permiss = permissData[item.path]
    // 如果不需要权限 或者 在权限列表内，就加入
    if (!item.permiss || permissList.includes(item.permiss)) {
      if (!item.isFolder) {
        allPathMenu.push(item.path)
      }
      resultList.push({
        path: item.path,
        name: item.name,
        icon: item.icon,
        permiss: item.permiss,
        isFolder: item.isFolder ? true : false,
        children: item.children ? formatMenu(item.children) : null
      })
    }
  })
  return resultList
}

// 删除没有子菜单的父菜单
function deleteNoChildrenMenu(list: any[]) {
  let resultList: any[] = []
  list?.forEach(item => {
    if (!item.isFolder || (item.children && item.children.length)) {
      resultList.push(item)
    }
  })
  return resultList
}


interface IUserInfo {
  id: string
  name: string
  account: string
  permissionCodes: string
  roleId: string
  roleName: string
}

const userInfo = ref<IUserInfo>({
  id: null,
  name: null,
  account: null,
  permissionCodes: null,
  roleId: null,
  roleName: null,
})

getUserInfo()

function getUserInfo() {
  // 如果没有登录信息，就跳转到登录页面
  const user = localStorage.getItem('userInfo')
  if (!user) {
    message.error('登录失效')
    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } else {
    userInfo.value = JSON.parse(user)
  }
}

// 退出登录
function onLoginOut() {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('access_token')
  localStorage.removeItem('permissList')
  router.push('/login')
}

</script>

<style lang="less">
@height: 56px;

.layout-index {
  min-height: 100vh;

  .layout-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    height: @height;
    line-height: @height;
    margin-bottom: 16px;
    padding: 0 0 0 16px;
    background: #fff;
    // background-color: #001529;

    background-color: var(--color-primary);
    // background-color: rgba(8, 97, 255,.15);
    // background-color: rgba(255,255, 255,.15);
    background-size: cover;
    background-position: right;
    background-repeat: no-repeat;

    .logo-text {
      height: @height;
      line-height: @height;
      color: #fff;
      font-weight: 500;
      font-size: 20px;

      .logo {
        width: 38px;
        height: 38px;
        margin-right: 8px;
      }

    }

    .header-right {
      padding: 0 16px;
      color: #fff;
      font-size: 16px;

      &:hover {
        // background: rgba(37, 42, 61, .3);
        // background: #252a3d;
        cursor: pointer;
      }

      .icon-down {
        font-size: 12px;
        color: var(--color-t5);
      }
    }
  }

  .layout-bottom {
    margin-top: @height;
    height: calc(100vh - @height);


    &.full-screen {
      margin-top: 0px;
      height: 100vh;
    }

    .layout-sider {
      overflow: auto;
      background: #fff;

      .collapsed-icon {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        padding: 12px;
        font-size: 16px;
        color: var(--color-t3);
        border-top: 1px solid rgba(0, 0, 0, .06);

        &:hover {
          color: #1677ff;
        }
      }
    }

    .layout-content {
      overflow: auto;

      >.content {
        min-width: calc(768px - 216px);
        margin: 16px;
      }
    }

  }
}

.menu-item {
  padding: 8px 0 8px 16px;
  width: 144px;

  &:hover {
    background: #f3f5f9;
    color: #1677ff;
  }

  .icon {
    font-size: 16px;
    margin-right: 16px;
  }
}
</style>
