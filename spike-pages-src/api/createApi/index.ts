// 运行 npm run api 自动解析api.json，生成ts文件

// const fs = require('fs')
// const apiJson = require('./api.json')

import fs from 'node:fs' // 明确指定node协议
import apiJson from './api.json' assert { type: 'json' } // JSON导入规范

const { tags, paths } = apiJson
const newApiJson: { name: string; description: string; list: any[] }[] = []
tags.forEach((item: { name: any; description: any; }) => {
  newApiJson.push({
    name: item.name,
    description: item.description,
    list: [],
  })
})
Object.keys(paths).forEach(item => {
  const value = paths[item]
  const method = Object.keys(value)[0] // GET或POST
  const obj = value[method]
  const target = newApiJson.find(f => f.name === obj.tags[0])
  target.list.push({
    path: item,
    method,
    title: obj.summary,
    operationId: obj.operationId,
    parameters: obj.parameters,
    requestBody: obj.requestBody,
  })
})


// 生成一个模块的内容
function createContent(data: {
  description: any;list: any[]
} = {
  list: [],
  description: undefined
}) {
  let name = ''
  let content = ''
  data.list.forEach((item, index) => {
    const method = item.method.toLowerCase()
    const pathList = item.path.split('/').filter((f: any) => f)
    // const pathLast = pathList[pathList.length - 1]
    const pathLast: string = pathList.at(-1)

    let realUrl = {
      create: 'add',
      update: 'edit',
      remove: 'delete',
      find: 'list',
      findList: 'list',
      findPage: 'page',
      findById: 'detail',
      findDetail: 'getDetail',
    }[pathLast]
    if (!realUrl) {
      realUrl = pathLast
    }
    // 如果接口有中间模块，中间模块要加到realUrl里，且首字母大写
    let pathCenter = ''
    if (pathList.length === 3) {
      const characters = [...pathList[1]]
      characters[0] = characters[0].toUpperCase()
      pathList[1] = characters.join('')
      pathCenter = pathList[1]
    }

    // 第一个
    if (!index) {
      name = pathList[0]
      content = `import { get, post, baseUrl } from '@/api/axios/request'

// ${data.description}（${data.list.length}条） - ${name}`
    }

    const baseUrl = '${baseUrl}'
    const point = '`'


    let paramsList = [] // params数据数组
    // get只有parameters没有requestBody，post都有requestBody，就看parameters是指向还是本身就是数组
    if (method === 'get' || (method === 'post' && !item.parameters[0].schema['$ref'])) {
      item.parameters?.forEach((f: { schema: { type: string; items: { type: any; }; }; type: string; }) => {
        if (f.schema.type === 'integer') {
          f.type = 'number'
        } else if(f.schema.type === 'array'){
          f.type = `${f.schema.items.type}[]`
        } else {
          f.type = f.schema.type
        }
      })
      paramsList = item.parameters || []
    }
    if (method === 'post') {
      if (item.parameters[0].schema['$ref']) {
        const pathList = item.parameters[0].schema['$ref'].split('/').filter((f: any) => f)
        // const pathLast = pathList[pathList.length - 1]
        const pathLast = pathList.at(-1)
        const properties = apiJson.components.schemas[pathLast].properties || {}

        const propertiesList: any[] = []
        Object.keys(properties).forEach(item => {
          const value = properties[item]
          let type = value.type
          if(type === 'integer') {
            type = 'number'
          } else if(type === 'array'){
            type = `${value.items.type}[]`
          }
          propertiesList.push({
            name: item,
            required: value.required,
            type: type,
            description: value.description,
          })
        })
        paramsList = propertiesList
      }
    }

    // 是否paramsList內全是必填
    const allIsRequired = paramsList.every((f: any) => f.required === true)

    // 拿到列表了，先获取最长的字段，得到maxLength，之后要用
    let maxLengthFiled = ''
    paramsList?.forEach((f: { name: string; }) => {
      if(f.name.length > maxLengthFiled.length) {
        maxLengthFiled = f.name
      }
    })
    const maxLength = maxLengthFiled.length

    let paramsText = '' // params数据
    let requiredText = '' // 必填项放前面
    let noRequiredText = '' // 不必填项放后面

    // 准备工作都做完了，开始循环赋值到requiredText和noRequiredText，然后拼接到paramsText
    paramsList?.forEach((f: { name: string | any[]; required: boolean; type: any; description: any; }) => {
      //空格数组， 根据最长字段来约束其他字段的空格数量
      const emptyList: any[] = []
      // 如果paramsList都是必填，就不需要?的占位了，不需要再+1了
      emptyList.length = allIsRequired ? maxLength - f.name.length : maxLength - f.name.length + 1
      if(f.required === true) {
        emptyList.length += 1
      }
      emptyList.forEach(m=> m = '')

      const text = `
    ${f.name}${emptyList.join(' ')} ${f.required === true ? '' : '?'}: ${f.type || 'any'}  // ${f.description || '-'}${f.required === true ? ' 【必填】' : ''}`
      if(f.required === true){
        requiredText += text
      } else {
        noRequiredText += text
      }
    })
    paramsText =  requiredText + noRequiredText


    let params = 'params: {'
    if (paramsText) {
      params += `${paramsText}
  }`
    } else {
      params += `}`
    }

    // 遇到特殊的上传文件需要form-data格式的要设置config
    let config = ''
    if(item.requestBody) {
      const content = item.requestBody.content
      const headers = Object.keys(content)[0]
      if(headers === 'multipart/form-data') {
        config = `, 'formData'`
      }
      if(headers === 'application/x-www-form-urlencoded') {
        config = `, 'form'`
      }
    }
    if (method === 'get' && item.path.includes('downloadFile')) {
      config = `, 'blob'`
    }

    content += `

// ${index + 1}. ${item.title}
export const ${realUrl}${pathCenter}Api = (
  ${params}
) => ${method}(${point}${baseUrl}${item.path}${point}, params${config})`
  })
  return {
    name,
    content,
    apiNum: data.list.length
  }
}

// 多个模块循环生成内容
function createContentMore() {
  const tableList: { name: string; content: string; cName: any; apiNum: number; }[] = []

  newApiJson.forEach(item => {
    const { name, content, apiNum } = createContent(item)
    tableList.push({
      name,
      content,
      cName: item.name,
      apiNum
    })
  })
  return tableList
}

const tableList = createContentMore()

// 生成api的js文件
function createApiJs() {
  tableList.forEach(item => {
    fs.writeFile(`./src/api/${item.name}.ts`, item.content, (err: any) => {
      if (err) {
        throw err
      }
    })
  })
}

createApiJs()