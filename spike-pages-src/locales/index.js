import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

// 创建 i18n 实例
export const i18n = createI18n({
  legacy: false, // false 表示使用 Compostion API 模式
  locale: 'zh-CN', // 默认语言
  fallbackLocale: false, // 回退语言,'zh-CN'或者 false: 禁用回退
  messages,
  missing: (locale, key) => {
    // console.log(key);
    // 不管在哪种语言环境下，如果找不到翻译，直接返回键名
    return key
  },
  // // 禁用缺失翻译的警告，
  // missingWarn: false,
  // fallbackWarn: false
})


// export default i18n

// 直接导出全局的 t 函数，方便在非组件中使用
export const t = i18n.global.t