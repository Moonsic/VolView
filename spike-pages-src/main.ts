import { createApp } from 'vue'
import App from './App.vue'
// import i18n from './locales' // 导入 i18n 配置
import { i18n } from './locales' // 导入上面创建的实例

import router from './router'

import { createPinia } from 'pinia'

// 按需引入antdv组件，不全量引入
// import Antdv from '@u/antdv'
// import AntIcons from '@u/antIcons'
// 全量引入antdv
import Antd from "ant-design-vue"

// 引入图片预览查看器
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

// 引入mock，不需要时不引入
// 一定要注释掉，太离谱了，会影响下载文件接口，blob效果会失效，下载的文件打不开。https://www.jianshu.com/p/5ce6448c078d
// import "@u/mock.ts"

// 里面有一个ling-height挺恶心的
// import 'ant-design-vue/dist/reset.css';



// 引入全局css文件
import './assets/less/color.less';
import "./assets/less/antdv.less"
import "./assets/less/common.less"
import "./assets/less/base.less" // 这个要放在最后，否则base.less中的样式会被覆盖
import "./assets/less/animation.less"

// iconfont组件, https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=4461144
import "@a/iconfont/iconfont.js"
import IconFont from '@c/IconFont.vue'

// 返回组件
import Back from '@c/Back.vue'
import NoData from '@c/NoData.vue'
import Question from '@c/Question.vue'
import AntSelect from '@c/AntSelect.vue' // 自定义的 Select 组件，修改了后缀箭头图标

// 最新：2个饼状图不用echarts-components里的组件了，所以注释掉
// 引入图表组件库，在数据总览页面用到2个饼状图
// import EchartsComponents from '../echarts-components'


const app = createApp(App)

app.component('IconFont', IconFont)
app.component('Back', Back)
app.component('NoData', NoData)
app.component('Question', Question)
app.component('a-select', AntSelect)

// 注册图标, 全部注册，会使包体积很大
import * as antIcons from '@ant-design/icons-vue'
for (const [key, component] of Object.entries(antIcons)) {
  app.component(key, component)
}

// 全局注册自己的图标
import * as MyIcons from '@c/icons/Index'
for (const [key, component] of Object.entries(MyIcons)) {
  app.component(key, component)
}

app.use(i18n)

// 将 t 函数挂载到全局，这样在任何地方都可以直接使用
// app.config.globalProperties.t = i18n.global.t

// 如果需要在非 Vue 上下文中使用，也可以挂载到 window
window.t = i18n.global.t

app
  .use(router)
  .use(createPinia())
  .use(Antd)
  // .use(AntIcons)
  .use(VueViewer)
  // .use(EchartsComponents)
  .mount('#app')