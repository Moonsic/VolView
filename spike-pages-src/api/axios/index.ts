import axios from 'axios'
import qs from 'qs'
import message from 'ant-design-vue/es/message'
import router from '@/router'

// 延长超时时间到30分钟，因为患者数据集太大的话，dealSubImageZipApi要处理特别久，10分钟可能不行。
// 设置接口超时时间，现在改成600秒，即10分钟 | 1800秒，即30分钟
axios.defaults.timeout = 1000 * 1800
// 跨域cookie
axios.defaults.withCredentials = true
// 转码中括号
axios.defaults.paramsSerializer = {
  serialize: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
}

const isProduction = process.env.NODE_ENV === 'production' // 是否为生产环境

// 请求拦截器
axios.interceptors.request.use(
  req => {
    const { url, params } = req
    if (!url) {
      message.error('请求地址为空')
      if (!isProduction) {
        console.log('前端报错：请求的url为空，可能是api里没注册或单词拼写错误')
      }
    }
    req.headers.Authentication = localStorage.getItem('access_token')

    const language = localStorage.getItem('language') || 'zh-CN'
    req.headers['Accept-Language'] = {
      'zh-CN': 'zh-hans',
      'en-US': 'en',
    }[language]

    const newParams: any = {}
    if (params) {
      Object.entries(params).forEach(item => {
        const [key, value] = item
        if (value && typeof value === 'string') {
          newParams[key] = value.replace(/^\s+|\s+$/g, '')
        } else {
          newParams[key] = value
        }
      })
    }
    req.params = newParams
    return req
  }, error => {
    return Promise.reject(error)
  }
)
// 登录失效
let loginInvalid = false

// 响应拦截器
axios.interceptors.response.use(
  async response => {
    // console.log('response :>> ', JSON.parse(JSON.stringify(response)))

    const { data, config } = response || {}

    if (data && config) {

      if (config.url.includes('/user/login')) {
        data.token = response.headers.token
      }
      if (config.url.includes('/file/downloadFiles')) {
        data.headers = response.headers
      }
      if (config.url.includes('/meg/exportEvent')) {
        data.headers = response.headers
      }

      if (data.message) {
        data.msg = data.message
        delete data.message
      }
      const { code, msg } = data
      // 如果没有code，则可能是下载接口
      if (code) {
        // 300002 是token为空， 300003 是token过期，
        if (code === 401 || code === 403 || code === 300002 || code === 300003) {
          onLoginOut()
        } else if (code >= 210000 && code < 220000) {
          message.error(`${msg}`, 4)
          if (!isProduction) {
            console.log(`后台主动报错：${code}，${msg}，${config.url}`)
          }
        } else if (code !== 200) {
          message.error(`${msg}`, 4)
          if (!isProduction) {
            console.log(`接口报错：${code}，${msg}，${config.url}`)
          }
        }
      }
    }
    return config ? response.data : response
  },
  error => {
    if (error && error.response) {
      const { status, config } = error.response
      const statusList: { [k: number]: string } = {
        400: '请求错误',
        401: '登录失效',
        403: '拒绝访问',
        404: '请求地址不存在',
        408: '请求超时',
        500: '服务器内部错误',
        501: '服务未实现',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
        505: 'HTTP版本不受支持'
      }
      if (status === 401 || status === 403) {
        onLoginOut()
      } else {
        message.error(`${statusList[status]}`)
        if (!isProduction) {
          console.log(`http报错：${status}，${statusList[status]}，${config.url}`)
        }
      }
    }
    return error.response?.data || {}
  }
)

// 退出登录
function onLoginOut() {
  // 多个接口只弹出一次登录失效
  if (!loginInvalid) {
    message.error('登录失效')
    loginInvalid = true
    setTimeout(() => {
      loginInvalid = false
      localStorage.removeItem('userInfo')
      localStorage.removeItem('access_token')
      localStorage.removeItem('permissList')
      router.push('/login')
    }, 2000)
  }
}

export default axios