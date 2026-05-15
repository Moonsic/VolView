import qs from 'qs'
import axios from './index'

export const baseUrl = '/api'

// 封装 request 请求并导出
export function request(url = '', params = {}, type = 'post', config = 'json'): Promise<IRes> {
  const method = type.toLowerCase()
  const ContentType = {
    form: 'application/x-www-form-urlencoded', // 传参方式表单
    formData: 'multipart/form-data', // 文件
    json: 'application/json;charset=UTF-8', // 传参方式json
  }[config]
  // 设置 url params type 的默认值
  return new Promise((resolve, reject) => {
    let promise
    if (method === 'get') {
      const axiosConfig: any = {
        method,
        url,
        params,
        headers: {
          'Content-Type': ContentType,
        },
        responseType: config === 'blob' ? 'blob' : '', // 所有下载类的接口都要加'blob'，否则下载下来的文件有问题！
      }
      promise = axios(axiosConfig)
    } else if (method === 'post') {
      const newParams = config === 'form' ? qs.stringify(params) : params
      promise = axios({
        method,
        url,
        data: newParams,
        headers: {
          'Content-Type': ContentType,
        },
        responseType: config === 'blob' ? 'blob' : null, // 所有下载类的接口都要加'blob'，否则下载下来的文件有问题！
      })
    } else if (method === 'delete') {
      const axiosConfig: any = {
        method,
        url,
        headers: {
          'Content-Type': ContentType,
        },
      }
      promise = axios(axiosConfig)
    }
    // 处理返回
    promise.then(res => {
      resolve(res || {})
    }).catch(err => {
      reject(err || {})
    })
  })
}

// 封装 GET 请求并导出
export function get(url = '', params = {}, config = ''): Promise<IRes> {
  return request(url, params, 'get', config)
}

// 封装 POST 请求并导出
export function post(url = '', params = {}, config = ''): Promise<IRes> {
  return request(url, params, 'post', config)
}

// 封装 DELETE 请求并导出
export function deleteItem(url = '', params = {}, config = ''): Promise<IRes> {
  return request(url, params, 'delete', config)
}