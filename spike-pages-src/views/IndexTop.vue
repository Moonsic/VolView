<template>
  <a-layout class="layout-index" :has-sider="false">

    <div class="header-warp" v-show="!noHeaderList.includes(String(route.name))">

      <a-layout-header class="layout-header flex-between" :class="{ 'scroll': scrolled }"
        v-show="!noHeaderList.includes(String(route.name))">

        <div class="logo-text flex-start">
          <IconLogo class="logo" />
          <div class="text"> {{ SYSTEM_NAME }} </div>
        </div>

        <div class="center">
          <TopMenu :menuData="menuData" />
        </div>

        <div class="header-right flex-start">
          <img class="img mr8" :src="userInfo.gender === 2 ? woman : man" alt="" />
          <div class="user-info">
            <span class="name">{{ userInfo.name || t('访问者') }}</span>
            <span class="role">{{ userInfo.roleName }}</span>
          </div>
          <IconDown class="icon-down color-white" @click="openMask" />

          <Teleport to="body">
            <div class="head-mask" :class="{ 'show': showMask }" v-if="showMask" @click="closeMask">
              <div class="mask-body" @click.stop="() => { }">
                <!-- <div @click="router.push('setting')">
                <SettingOutlined class="icon" />
                <span>设置中心</span>
              </div> -->

                <!-- <div class="flex-between">
                  <div>
                    <span class="anticon mr8 text-18">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 30 30" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.7717 3.50197C7.9634 4.11527 3.4375 9.02909 3.4375 15C3.4375 21.3858 8.61421 26.5625 15 26.5625C20.9709 26.5625 25.8847 22.0366 26.498 16.2283C24.8396 18.3336 22.2658 19.6875 19.375 19.6875C14.3699 19.6875 10.3125 15.6301 10.3125 10.625C10.3125 7.73423 11.6664 5.16037 13.7717 3.50197ZM1.5625 15C1.5625 7.57867 7.57867 1.5625 15 1.5625C15.8958 1.5625 16.3442 2.27657 16.4211 2.84533C16.4949 3.39247 16.2927 4.08832 15.6638 4.46834C13.5783 5.72851 12.1875 8.01478 12.1875 10.625C12.1875 14.5945 15.4055 17.8125 19.375 17.8125C21.9852 17.8125 24.2715 16.4217 25.5317 14.3362C25.9117 13.7073 26.6075 13.5051 27.1547 13.5789C27.7234 13.6558 28.4375 14.1042 28.4375 15C28.4375 22.4213 22.4213 28.4375 15 28.4375C7.57867 28.4375 1.5625 22.4213 1.5625 15Z"
                          fill="currentColor" />
                      </svg>
                    </span>
                    <span>暗黑模式</span>
                  </div>
                  <a-switch v-model:checked="isDarkMode" @change="onSwitchDarkMode" />
                </div> -->

                <div class="flex-between">
                  <div>
                    <span class="anticon mr8 text-18">

                      <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2V3M12 21V22M19.0711 4.92894L18.364 5.63605M5.63605 18.364L4.92894 19.0711M22 12H21M3 12H2M19.071 19.0711L18.3639 18.364M5.63605 5.63605L4.92894 4.92894M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>

                      <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        viewBox="0 0 30 30" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M13.7717 3.50197C7.9634 4.11527 3.4375 9.02909 3.4375 15C3.4375 21.3858 8.61421 26.5625 15 26.5625C20.9709 26.5625 25.8847 22.0366 26.498 16.2283C24.8396 18.3336 22.2658 19.6875 19.375 19.6875C14.3699 19.6875 10.3125 15.6301 10.3125 10.625C10.3125 7.73423 11.6664 5.16037 13.7717 3.50197ZM1.5625 15C1.5625 7.57867 7.57867 1.5625 15 1.5625C15.8958 1.5625 16.3442 2.27657 16.4211 2.84533C16.4949 3.39247 16.2927 4.08832 15.6638 4.46834C13.5783 5.72851 12.1875 8.01478 12.1875 10.625C12.1875 14.5945 15.4055 17.8125 19.375 17.8125C21.9852 17.8125 24.2715 16.4217 25.5317 14.3362C25.9117 13.7073 26.6075 13.5051 27.1547 13.5789C27.7234 13.6558 28.4375 14.1042 28.4375 15C28.4375 22.4213 22.4213 28.4375 15 28.4375C7.57867 28.4375 1.5625 22.4213 1.5625 15Z"
                          fill="currentColor" />
                      </svg>

                      <svg v-if="theme === 'eyecare'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2V4M21 5L19.5 6.5M2.99997 5L4.49997 6.5M12 22C15.6042 22 18.8134 19.6545 20.8772 17.6789C22.3743 16.2458 22.3743 13.7542 20.8772 12.3211C18.8134 10.3455 15.6042 8 12 8C8.3958 8 5.18661 10.3455 3.12281 12.3211C1.62573 13.7542 1.62573 16.2458 3.12281 17.6789C5.18661 19.6545 8.3958 22 12 22ZM15 15C15 16.6569 13.6568 18 12 18C10.3431 18 8.99997 16.6569 8.99997 15C8.99997 13.3431 10.3431 12 12 12C13.6568 12 15 13.3431 15 15Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                    </span>

                    <span>{{ t('系统主题') }}</span>
                  </div>
                  <a-select class="select-width" style="width: 110px;" v-model:value="theme" :options="themeList"
                    @change="onSwitcTheme" />
                </div>

                <div class="flex-between">
                  <div>
                    <UserSwitchOutlined class="mr8 text-18" />
                    <span>{{ t('切换版本') }}</span>
                  </div>
                  <a-select class="select-width" style="width: 110px;" v-model:value="versionType"
                    :options="versionTypeList" @change="changeVersionType" />
                </div>

                <div class="flex-between">
                  <div>
                    <GlobalOutlined class="mr8 text-18" />
                    <span>{{ t('语言') }}</span>
                  </div>
                  <a-select class="select-width" style="width: 110px;" v-model:value="language" :options="languageList"
                    @change="changeLanguage" />
                </div>

                <!-- 全局的opm配置不需要了，现在每个患者都有自己的配置 -->
                <!-- <div class="flex-between">
                  <div>
                    <IconSwap class="mr8 text-18" />
                    <span>{{ t('opm配置') }}</span>
                  </div>
                  <a-select class="select-width" style="width: 110px;" v-model:value="opmConfig"
                    :options="opmConfigList" @change="changeOpmConfig" />
                </div> -->

                <div class="flex-between color-red" @click="onLoginOut">
                  <div>
                    <span>{{ t('退出系统') }}</span>
                  </div>
                  <span class="anticon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M8.8999 7.56023C9.2099 3.96023 11.0599 2.49023 15.1099 2.49023H15.2399C19.7099 2.49023 21.4999 4.28023 21.4999 8.75023V15.2702C21.4999 19.7402 19.7099 21.5302 15.2399 21.5302H15.1099C11.0899 21.5302 9.2399 20.0802 8.9099 16.5402"
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M2 12H14.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                      <path d="M12.6499 8.6499L15.9999 11.9999L12.6499 15.3499" stroke="currentColor" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Teleport>
        </div>

      </a-layout-header>
    </div>

    <a-layout class="layout-bottom" :class="[noHeaderList.includes(String(route.name)) ? 'full-screen' : '']">
      <a-layout-content class="layout-content">

        <div class="header-bg" :class="[String(route.name) === 'overview' ? 'header-bg-overview' : '']"
          v-if="!noHeaderList.includes(String(route.name))">
          <div class="bg-img" :style="{ backgroundImage: `url(${curBg})` }"></div>
        </div>

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

import man from '@img/head/man.png'
import woman from '@img/head/woman.png'

import bg_overview from '@img/head/bg_overview.png'
import bg_patientList from '@img/head/bg_patientList.png'
import bg_fileManagement from '@img/head/bg_fileManagement.png'
import bg_userList from '@img/head/bg_userList.png'
import bg_roleList from '@img/head/bg_roleList.png'

import TopMenu from '@c/topMenu/Index.vue'
import WebSocketModal from '@c/WebSocket.vue'
import UploadList from '@c/UploadList.vue'
import { throttle } from '@u/utils'

import { useThemeStore } from '@/store/theme'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
// import { useOpmStore } from '@/store/opm'

import { SYSTEM_NAME } from '@/utils/config'

const { t, locale } = useI18n()

const themeStore = useThemeStore()
const userStore = useUserStore()
// const opmStore = useOpmStore()

const route = useRoute()
const router = useRouter()

const curBg = ref(bg_patientList)
// 从详情页回来不重置，从其他页面过来重置接口
watch(() => route.path, (newPath, oldPath) => {
  const imgList: any = {
    '/overview': bg_overview,
    '/patientList': bg_patientList,
    '/fileManagement': bg_fileManagement,
    '/userList': bg_userList,
    '/roleList': bg_roleList,
  }
  curBg.value = imgList[newPath] || bg_patientList // 默认图片，用于403、聚类列表、详情页
}, {
  immediate: true
})

const noHeaderList = ['reviewMeg', 'reviewEeg', 'viewResults', 'reviewMri', 'startAnalysis', 'multiImageCoreg'] // 没有头部的菜单
const noMarginList = ['home', ...noHeaderList]         // 没有被限制margin的菜单

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
  gender: number
}

const userInfo = ref<IUserInfo>({
  id: null,
  name: null,
  account: null,
  permissionCodes: null,
  roleId: null,
  roleName: null,
  gender: null
})

getUserInfo()

function getUserInfo() {
  // 如果没有登录信息，就跳转到登录页面
  const user = localStorage.getItem('userInfo')
  if (!user) {
    message.error(t('登录失效'))
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



// 显示右上角退出登录的弹窗
const showMask = ref(false)
function openMask() {
  showMask.value = true
}
function closeMask() {
  showMask.value = false
}


// 页面滚动，导航栏置顶并加上背景色
const scrolled = ref(false) // 是否已滚动，window.scrollY > 0 就是已滚动


onMounted(() => {
  themeStore.initTheme();
  themeStore.initChartTheme();

  userStore.getWebPageSet()

  nextTick(() => {
    window.addEventListener("scroll", throttle(scrollFn, 50))
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollFn)
});

function scrollFn() {
  scrolled.value = window.scrollY > 100  // 大于100再生效
  themeStore.setIsScrollTop(scrolled.value)
}


const { theme } = storeToRefs(themeStore)

const themeList = [
  { label: t('浅色主题'), value: 'light' },
  { label: t('暗色主题'), value: 'dark' },
  { label: t('护眼主题'), value: 'eyecare' },
]

function onSwitcTheme() {
  themeStore.switchTheme(theme.value)
  themeStore.switchChartTheme(theme.value)
  setTimeout(() => {
    closeMask()
  }, 500)
}


const { versionType, language } = storeToRefs(userStore)

const versionTypeList = [
  { label: t('医生版'), value: 'doctor' },
  { label: t('工程师版'), value: 'engineer' },
]

// const local_versionType = localStorage.getItem('versionType')
// if (local_versionType) {
//   versionType.value = local_versionType || 'doctor'
// } else {
//   localStorage.setItem('versionType', 'doctor')
// }

function changeVersionType() {
  // localStorage.setItem('versionType', String(versionType.value))
  userStore.updateWebPageSet({
    versionType: versionType.value,
  })
  setTimeout(() => {
    closeMask()
  }, 500)
}


// const { opmConfig } = storeToRefs(opmStore)

// const opmConfigList = [
//   { label: t('opmMeg'), value: 'opmMeg' },
//   { label: t('opmHuaxi'), value: 'opmHuaxi' },
// ]

// function changeOpmConfig() {
//   localStorage.setItem('opmConfig', opmConfig.value)
//   setTimeout(() => {
//     closeMask()
//   }, 500)
//   // 这里可以触发页面重新加载，而不是响应式更新
//   window.location.reload()
// }

const languageList = [
  { label: t('中文'), value: 'zh-CN' },
  { label: t('英文'), value: 'en-US' },
]

const local_language = localStorage.getItem('language')
userStore.setLanguage(local_language || 'zh-CN')
locale.value = userStore.language
// console.log('locale.value :>> ', locale.value);


function changeLanguage() {
  localStorage.setItem('language', language.value)
  locale.value = language.value
  // userStore.updateWebPageSet({
  //   language: language.value,
  // })
  setTimeout(() => {
    closeMask()
  }, 500)
  // 这里可以触发页面重新加载，而不是响应式更新
  window.location.reload()
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
@height: 280px;


.layout-index {
  min-height: 100vh;
  overflow: auto;

  .header-warp {
    // height: 280px;
    background-color: var(--color-primary);
    background-size: cover;
    background-position: right;
    background-repeat: no-repeat;
  }

  .layout-header {
    min-width: 1380px;
    position: fixed;
    top: 20px;
    left: 0;
    right: 0;
    z-index: 999;
    height: 70px;
    padding: 0;
    background-color: transparent;

    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    transition: top 0.1s;

    &.scroll {
      top: 0;
      background-color: var(--color-primary); // #1a4c9d
      z-index: 99999999; // 必须要8个9才能挡住数据总览页面的饼状图的tooltip
    }


    .logo-text {
      min-width: 530px;
      color: #fff;
      font-weight: 500;
      font-size: 26px;
      padding: 0 100px 0 80px;

      .logo {
        margin-right: 16px;
        font-size: 44px;
      }

      .text {
        line-height: 1.2;
      }

    }

    .center {
      flex: 1;
      min-width: 620px;
      position: relative;
    }

    .header-right {
      padding: 0 50px 0 16px;
      color: #fff;
      font-size: 16px;
      line-height: 1.5;

      .img {
        width: 50px;
        height: 50px;
        margin-right: 16px;
      }

      .user-info {
        display: flex;
        flex-direction: column;

        .name {
          font-family: Lexend;
          font-size: 20px;
          font-weight: 600;
        }

        .role {
          font-family: Lexend;
          font-size: 15px;
          font-weight: 300;
        }

      }

      .icon-down {
        font-size: 18px;
        margin-left: 16px;
        cursor: pointer;

        &:hover {
          transform: scale(1.2);
        }
      }
    }


  }

  .layout-bottom {
    background: var(--color-page-bg-1);

    &.full-screen {
      margin-top: 0px;
      height: 100vh;
    }

    .layout-content {
      overflow: auto;

      .header-bg {
        height: 280px;
        position: relative;
        background: #235cac;

        &.header-bg-overview {
          height: 495px;


          .bg-img {
            height: 495px;
          }
        }

        .bg-img {
          height: 280px;
          background-size: auto;
          background-position: top;
          background-repeat: no-repeat;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
        }
      }


      >.content {
        width: 90%;
        min-width: 900px; // 900px是让patientList顶部表单都在卡片内部
        max-width: 1600px;
        margin: 16px auto;
        margin-top: -50px;
      }
    }
  }
}

// 暗黑模式下降低背景的亮度
.dark,
.eyecare {
  .header-bg {
    filter: brightness(80%);
  }

  .header-right img {
    filter: brightness(95%);
  }

  .layout-header {
    &.scroll {
      top: 0;
      background-color: #224787;
    }
  }

}

.head-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(1, 4, 9, 0.1);
  /* 添加这行代码来实现毛玻璃效果，这里模糊半径设置为3px，你可以根据实际需求调整数值 */
  /* 为了兼容 Safari 浏览器等 WebKit 内核的浏览器 */
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  .mask-body {
    position: absolute;
    top: 90px;
    right: 50px;
    width: 300px;
    color: var(--color-t2);
    background: var(--color-bg);
    border: var(--border-transparent);
    border-radius: 16px;
    overflow: hidden;
    padding: 12px;
    animation: popup 0.3s ease-in-out;
    /* 应用名为popup的动画，持续时间0.3秒，缓动函数为 ease-in-out */
    animation-fill-mode: forwards;
    /* 动画结束后保持最后一帧的状态，也就是保持显示出来的状态 */


    >div {
      padding: 12px 16px;
      cursor: pointer;
      border-radius: 12px;

      &:hover {
        background: var(--color-bg-gray);
      }

      &:not(:last-child):hover {
        color: var(--color-primary);
      }

    }
  }
}

@keyframes popup {
  from {
    opacity: 0;
    // width: 100px;
    // height: 20px;
  }

  to {
    opacity: 1;
    // width: 300px;
    // height: auto;
  }
}
</style>
