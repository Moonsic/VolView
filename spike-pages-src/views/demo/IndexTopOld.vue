<template>
  <a-layout class="layout-index" :has-sider="false">

    <a-layout-header class="layout-header flex-between" v-show="!noHeaderList.includes(String(route.name))" :style="{ backgroundImage: `url(${header_bg})` }">

      <div class="logo-text flex-start">
        <!-- <img class="logo" :src="logo" alt="" /> -->
        <div class="text"> {{ SYSTEM_NAME }} </div>
      </div>

      <div class="center">
        <TopMenu :menuData="menuData" />
      </div>

      <div class="header-right">
        <a-popover overlayClassName="header-right-popover" placement="bottomRight" trigger="click">
          <div class="user-info flex-start">
            <img class="mr8" :src="default_head" alt="" style="width: 26px;" />
            <span>欢迎您，{{ userInfo.name || "访问者" }}</span>
            <CaretDownOutlined class="icon-down" />
          </div>

          <template #content>
            <div class="dropdown">
              <!-- <div @click="router.push('setting')">
                <SettingOutlined class="icon" />
                <span>设置中心</span>
              </div> -->
              <div @click="onLoginOut">
                <ExportOutlined class="icon" />
                <span>退出系统</span>
              </div>
            </div>
          </template>
        </a-popover>
      </div>

    </a-layout-header>

    <a-layout class="layout-bottom" :class="[noHeaderList.includes(String(route.name))?'full-screen':'']">
      <a-layout-content class="layout-content">
        <div :class="[!noMarginList.includes(String(route.name))?'content':'']">

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

  <!-- websocket 连接 -->
  <WebSocketModal />

  <!-- 上传列表 -->
  <UploadList />
</template>

<script lang="ts" setup>
import { RouteRecordName } from 'vue-router'
import { message } from 'ant-design-vue'
import { permissData } from '@/router/indexPage'
import { leftMenuData } from '@u/menu'
import TopMenu from '@c/topMenu/Index.vue'
import default_head from '@img/head/man.png'
import header_bg from '@img/head/header_bg.png'

import WebSocketModal from '@c/WebSocket.vue'
import UploadList from '@c/UploadList.vue'

import { SYSTEM_NAME } from '@/utils/config'

const noHeaderList = ['reviewMeg', 'reviewEeg', 'viewResults', 'test', 'reviewMri','startAnalysis'] // 没有头部的菜单
const noMarginList = ['home',...noHeaderList]         // 没有被限制margin的菜单

const route = useRoute()
const router = useRouter()

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
    // 文件 或者有子菜单的文件夹 加入
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
.ant-popover.header-right-popover {
  top: 50px !important;

  .ant-popover-inner {
    border-radius: 2px;
  }

  .ant-popover-inner-content {
    padding: 0;
  }
}
</style>

<style lang="less">
@height: 70px;


.layout-index {
  min-height: 100vh;

  .layout-header {
    min-width: 888px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    height: @height;
    line-height: @height;
    padding: 0 0 0 16px;
    background-color: #001aa6;

    // background-color: rgba(8, 97, 255,.15);
    // background-color: rgba(255,255, 255,.15);
    background-size: cover;
    background-position: right;
    background-repeat: no-repeat;
    // box-shadow: 5px 0px 10px #ccc;
    // filter: blur(2px);


    // &::after{
    //   content:'';
    //   width: 100%;
    //   height: 100%;
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   background: inherit;
    //   filter: blur(2px);
    //   z-index: 2;
    // }
    .logo-text {
      color: #fff;
      font-weight: 500;
      font-size: 24px;

      .logo {
        width: 42px;
        height: 42px;
        margin-right: 8px;
      }

    }

    .center {
      flex: 1;
      position: relative;
    }

    .header-right {
      padding: 0 16px;
      color: #fff;
      font-size: 16px;

      .user-info {
        cursor: pointer;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .icon-down {
          margin-left: 24px;
          transform: translate(-7px, 0);
        }
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

    .layout-content {
      overflow: auto;

      >.content {
        width: 90%;
        max-width: 1440px;
        // min-width: 1000px;
        margin: 16px auto;
      }
    }
  }
}

.dropdown {
  padding: 8px 0;
  width: 144px;

  >div {
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
      background: #f3f5f9;
      color: var(--color-primary);
    }

    .icon {
      font-size: 16px;
      margin-right: 16px;
    }
  }
}
</style>
