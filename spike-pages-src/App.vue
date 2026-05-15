<template>
  <a-config-provider :locale="antdLocale" :theme="{ algorithm: algorithm, token: themeToken }">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'


import { useUserStore } from '@/store/user'
const userStore = useUserStore()

const { t, locale } = useI18n()

// 监听 store 中的语言变化，同步到 i18n
watch(
  () => userStore.language,
  (newLang) => {
    locale.value = newLang
    dayjs.locale(newLang === 'zh-CN' ? 'zh-cn' : 'en')
    // 保存到 localStorage
    localStorage.setItem('user-locale', newLang)
  },
  { immediate: true } // 立即执行一次以初始化
)

// 计算属性，根据当前语言返回对应的 antd 语言包
const antdLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS))

import { theme as antdvTheme } from 'ant-design-vue';

import { useThemeStore } from '@/store/theme'
const themeStore = useThemeStore()

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
const colorBg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
const colorBorderCard = getComputedStyle(document.documentElement).getPropertyValue('--color-border-card')
const colorT2 = getComputedStyle(document.documentElement).getPropertyValue('--color-t2')
// const colorBorder = getComputedStyle(document.documentElement).getPropertyValue('--color-border')

const algorithm = ref()

const themeToken: any = reactive({
  colorPrimary: primaryColor,
  colorLink: primaryColor,
  colorBgContainer: colorBg,
  colorBorder: colorBorderCard,
  colorText: colorT2,
  wireframe: true,
  // colorSplit: colorBorder,
  // colorBgLayout: '#fafafa',
  // colorBgBase: '#fff',
});

// 监听Pinia中主题状态的变化，根据变化更新ant-design-vue组件库的主题配置
watch(
  () => themeStore.theme,
  (newValue) => {

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
    const colorBg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
    const colorBorderCard = getComputedStyle(document.documentElement).getPropertyValue('--color-border-card')
    const colorT2 = getComputedStyle(document.documentElement).getPropertyValue('--color-t2')
    // const colorBorder = getComputedStyle(document.documentElement).getPropertyValue('--color-border')

    if (newValue === 'dark') {
      algorithm.value = antdvTheme.darkAlgorithm
    } else {
      algorithm.value = antdvTheme.defaultAlgorithm
    }
    themeToken.colorPrimary = primaryColor
    themeToken.colorLink = primaryColor
    themeToken.colorBgContainer = colorBg
    themeToken.colorBorder = colorBorderCard
    themeToken.colorText = colorT2
    // themeToken.colorSplit = colorBorder

  },
  { immediate: true }
)


message.config({
  top: `100px`,
  duration: 3, // 默认3
  prefixCls: 'my-message',
});



// //https://www.antdv.com/docs/vue/customize-theme-cn
// const theme = {
//   // fontSize: 14,
//   colorPrimary: primaryColor, // 品牌色，要和base.less里的.color-blue保持一致, // 之前是'#1677ff'
//   colorLink: primaryColor, // 链接色，用于链接的颜色，例如：a 标签的默认颜色。
//   colorBorder: '#e6e6e6', // 默认使用的边框颜色, 用于分割不同的元素，例如：表单的分割线、卡片的分割线等。	 #d9d9d9
//   // colorBgLayout: '#f0f2f5', // 该色用于页面整体布局的背景色，只有需要在页面中处于 B1 的视觉层级时才会使用该 token，其他用法都是错误的 #f5f5f5。 V3版本的#f0f2f5好看一点
//   colorBgLayout: '#fafafa', // 该色用于页面整体布局的背景色，只有需要在页面中处于 B1 的视觉层级时才会使用该 token，其他用法都是错误的 #f5f5f5。 V3版本的#f0f2f5好看一点

//   // borderRadius: 20, // 基础组件的圆角大小，例如按钮、输入框、卡片等 6（不在这里设置，在antdv.less里一个一个设置）
//   // borderRadiusSM: 8, // 基础组件的圆角大小，例如按钮、输入框、卡片等 6

//   wireframe: true, // 用于将组件的视觉效果变为线框化，如果需要使用 V4 的效果，需要开启配置项。false
//   // fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'", // 默认是这个
// }



</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

/* message的文字颜色改成彩色的 */
.my-message {
  z-index: 99999999; // 这个要最大，否则会被一些如a-popover的组件挡住

  .my-message-notice-content {
    padding: 12px 30px;
    border-radius: 30px;

    .my-message-success {
      color: green;
    }

    .my-message-error {
      color: red;
    }

    .my-message-info {
      color: #1677ff;
    }

    .my-message-warning {
      color: #cc8800;
    }
  }
}

.dark,
.eyecare {
  .my-message .my-message-notice-content {
    background-color: var(--eyecare-bg-light);
  }
}

/* font-family: Avenir, Helvetica, Arial, sans-serif; */
</style>