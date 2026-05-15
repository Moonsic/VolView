// 数组转对象
export function arrayToObj(array: any[] = [], value: string = 'value', label: string = 'label'): Record<number | string, number | string> {
  const obj: any = {}
  array?.forEach(item => {
    obj[item[value]] = item[label]
  })
  return obj
}

// 对象转数组
export function objToArray(obj: any = {}, value: string = 'value', label: string = 'label'): object[] {
  const list: object[] = []
  Object.keys(obj).forEach(item => {
    list.push({
      [label]: obj[item],
      [value]: item,
    })
  })
  return list
}

// 深度拷贝
export function copyIt(data: any) {
  return data ? JSON.parse(JSON.stringify(data)) : ''
}

// 深度拷贝
// 这个深度拷贝函数实现了:
// 1. 完善的循环引用检测
// 2. 日期、正则、函数的深拷贝
// 3. Set与Map的深拷贝
// 4. File与Blob的深拷贝
// 5. 拷贝描述对象与属性的可枚举性
// 6. Symbol属性的深拷贝
// 7. prototype的正确处理
// 8. 支持更广泛的对象类型
export function deepClone(obj: any): any {

  if (obj === null) return null;

  let clone: any = Array.isArray(obj) ? [] : {};

  let map = new WeakMap();

  // 处理循环引用
  if (map.has(obj)) return map.get(obj);
  map.set(obj, clone);

  // 处理日期对象
  if (obj instanceof Date) return new Date(obj);
  // 处理正则对象
  if (obj instanceof RegExp) return new RegExp(obj);
  // 处理函数
  if (typeof obj === "function") return obj;

  // 处理Set与Map
  if (obj instanceof Set) return new Set(obj);
  if (obj instanceof Map) return new Map(obj);

  // 处理 File、Blob 等
  if (obj instanceof File || obj instanceof Blob) {
    return obj.slice(0, obj.size, obj.type);
  }

  let descs = Object.getOwnPropertyDescriptors(obj);
  // 处理getter与setter,以及其可枚举性
  Object.defineProperties(clone, {
    ...descs,
    enumerable: descs.enumerable
  });

  // 处理Symbol属性
  let symbols = Object.getOwnPropertySymbols(obj);
  symbols.forEach(s => clone[s] = deepClone(obj[s]));

  // 处理原型
  Object.setPrototypeOf(clone, Object.getPrototypeOf(obj));

  // 处理其他属性
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    clone[keys[i]] = deepClone(obj[keys[i]]);
  }

  return clone;
}

// 针对数字框，最多输入4位小数
export const inputNumberParser = {
  parser: parser,
  formatter: parser,
}

// 针对数字框，最多输入4位小数
export function parser(value: string) {
  if (value === '') {
    return '';
  }
  return parseFloat(Number(value).toFixed(4))
}

// 选择框
export const selectExtra = {
  placeholder: '请选择',
  showSearch: true,
  allowClear: true,
  filterOption,
}

// 输入筛选的功能
export function filterOption(input: string, option: { componentOptions: { children: { text: string }[] } }) {
  return (
    option.componentOptions.children[0].text
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
  )
}

// 是否为空
export function isBlank(varValue: any): boolean {
  if (varValue !== null && varValue !== undefined && varValue !== '' && varValue !== 'null' && varValue.trim().length !== 0) {
    return false
  }
  return true
}

// 判断数据是否为空，为空时返回'-'
export function emptyDisplay(data: any, unit: any): string {
  if (!isBlank(data) && data != '-' && data != 0) {
    if (unit) {
      return data + unit
    } else {
      return data
    }
  } else {
    return '-'
  }
}

// 一维数组转化为二维数组
// array: 传入数组，size:每个小数组的长度
export function splitGroup(array: string | any[], size: number): string | any[] {
  const newArray = []
  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    let start = i * size
    let end = start + size
    newArray.push(array.slice(start, end))
  }
  return newArray
}

// 判断两个数组是否相等，顺序可以乱，内容是一致的就算相等。
export function arraysAreEqual(array1: any[] = [], array2: any[] = []): boolean {
  const arr1 = array1 || []
  const arr2 = array2 || []
  if (arr1.length !== arr2.length) {
    return false
  }
  // 排序后顺序就是一样的了，在挨个比较是否相同
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index])
}

// 判断两个数组是否完全相等，顺序都不可以乱。
export function arraysAreEqualCompletely(array1: any[] = [], array2: any[] = []): boolean {
  const arr1 = array1 || []
  const arr2 = array2 || []
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])
}

// 得到一个两数之间的随机整数，包括两个数在内，[a,b]
export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 处理大数字，返回数字和单位
export function dealNum(_num: any, type = '亿'): [number, string] {
  // debugger
  const num = Number(_num)

  const lessWan = num < 10000
  let beyondWan
  if (type === '万') {
    beyondWan = num >= 10000
  }
  if (type === '亿') {
    beyondWan = num < 100000000 && num >= 10000
  }

  const dealWan = (): [number, string] => {
    let count: number = parseFloat((num / 10000).toFixed(2))
    if (count < 100) {
      count = Number(count.toFixed(2))
    } else if (count < 1000 && count > 99) {
      count = Number(count.toFixed(1))
    } else if (count > 999) {
      count = Number(count.toFixed(0))
    }
    return [count, '万']
  }

  const dealYi = (): [number, string] => {
    let count = parseFloat((num / 100000000).toFixed(2))
    if (count < 100) {
      count = Number(count.toFixed(2))
    } else if (count < 1000 && count > 99) {
      count = Number(count.toFixed(1))
    } else if (count > 999) {
      count = Number(count.toFixed(0))
    }
    return [count, '亿']
  }

  // 低于1万
  if (lessWan) {
    let count = parseFloat(num.toFixed(2))
    return [count, '']
  } if (type === '万') {
    return dealWan()
  } if (type === '亿') {
    if (beyondWan) {
      return dealWan()
    }
    return dealYi()
  }

}

// 生成随机id
export function getRandomId(num: number = 4): string {
  let id = '';
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charsLength = chars.length;
  for (let i = 0; i < num; i++) {
    id += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return id;
}

// 生成UUID
export function getUuid() {
  let uuid = '';
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let charsLength = chars.length;

  function randomBit() {
    return Math.random() > 0.5 ? 1 : 0;
  }

  let bytes = Array.from({ length: 16 }, (v, i) => {
    switch (i) {
      case 6:
        return randomBit() * 2 + 2 << 4 | randomBit() * 12 + 4
      case 8:
        return randomBit() * 28 + 64
    }
    return randomBit() * 256;
  });

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  for (let i = 0; i < 16; i++) {
    if (i === 4 || i === 6 || i === 8 || i === 10) uuid += '-';
    uuid += chars[bytes[i] % charsLength];
  }

  return uuid;
}

// 计算年龄: 年份相减再+1
export function calculateAgeOld(birthDate: string): number | null {
  if (!birthDate) {
    return null
  }
  const currentYear = String(new Date().getFullYear())
  return Number(currentYear.slice(0, 4)) - Number(birthDate?.slice(0, 4)) + 1
}


// 计算年龄: ​​当前年份减去出生年份，然后根据月份和日期判断是否需要减1​​。
export function calculateAge(birthDate: string): number | null {
  if (!birthDate) {
    return null
  }
  const today = new Date()
  const birth = new Date(birthDate)

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()

  // 如果当前月份小于出生月份，或者月份相同但当前日期小于出生日期，年龄减1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--
  }

  return age
}


// 获取文件名称
export function getFileName(data: string, separator: string = '.'): string {
  return data.substring(0, data.lastIndexOf(separator))
}

// 获取文件后缀
export function getFileSuffix(data: string, separator: string = '.'): string {
  return data.substring(data.lastIndexOf(separator) + 1)
}

// 获取文件名称和后缀
// 输入：'sub-01/anat/test.nii'
// 输出：['test', 'nii']
// const [name, suffix] = getFileNameAndSuffix(niiFilePath)
export function getFileNameAndSuffix(data: string): [string, string] {
  const fileFullName = getFileSuffix(data, '/')
  return [getFileName(fileFullName), getFileSuffix(fileFullName)]
}

// 格式化文件大小
export function formatFileSize(fileSize: number): string {
  if (fileSize === undefined || fileSize === null) {
    return ''
  }
  const oneKB = 1024
  const oneMB = oneKB * oneKB
  const oneGB = oneMB * oneKB
  // if (!fileSize) {
  //   return '0'
  // } else
  if (fileSize < oneKB) {
    return fileSize + ' B'
  } else if (fileSize < oneMB) {
    return (fileSize / oneKB).toFixed(2) + ' KB'
  } else if (fileSize < oneGB) {
    return (fileSize / oneMB).toFixed(2) + ' MB'
  } else {
    return (fileSize / oneGB).toFixed(2) + ' GB'
  }
}

// 下载
export function downloadFile(res: Blob | ArrayBuffer, fileName: string) {
  const blob = new Blob([res], { type: '' })
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.style.cssText = 'display: none'
  a.href = window.URL.createObjectURL(blob)
  a.download = fileName
  a.click()
  a.remove()
  window.URL.revokeObjectURL(a.href)
}

// 格式化时间
export function formatDateOld(date: string | Date = new Date(), format = 'YYYY-MM-DD hh:mm:ss'): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  let Y: any = date.getFullYear()
  let M: any = date.getMonth() + 1
  let D: any = date.getDate()
  let h: any = date.getHours()
  let m: any = date.getMinutes()
  let s: any = date.getSeconds()
  let ms: any = date.getMilliseconds()
  const check = ((v: number, type = ''): string => {
    if (type === 'ms') {
      return v < 10 ? '00' + v : v < 100 ? '0' + v : String(v)
    }
    return v < 10 ? '0' + v : String(v)
  })
  M = check(M)
  D = check(D)
  h = check(h)
  m = check(m)
  s = check(s)
  ms = check(ms, 'ms')
  let fullTime = format.replace(/YYYY/g, Y).replace(/MM/g, M).replace(/DD/g, D).replace(/hh/g, h).replace(/mm/g, m).replace(/ss/g, s).replace(/ms/g, ms)
  return fullTime
}

// 格式化时间(chatGPT给出的优化)
export function formatDate(date: string | Date = new Date(), format = 'YYYY-MM-DD hh:mm:ss'): string {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const Y: string = String(date.getFullYear())
  const M: string = String(date.getMonth() + 1)
  const D: string = String(date.getDate())
  const h: string = String(date.getHours())
  const m: string = String(date.getMinutes())
  const s: string = String(date.getSeconds())
  const ms: string = String(date.getMilliseconds()).padStart(3, '0')
  const fullTime = format.replace(/YYYY|MM|DD|hh|mm|ss|ms/g, (match: string) => {
    switch (match) {
      case 'YYYY':
        return Y
      case 'MM':
        return M.padStart(2, '0')
      case 'DD':
        return D.padStart(2, '0')
      case 'hh':
        return h.padStart(2, '0')
      case 'mm':
        return m.padStart(2, '0')
      case 'ss':
        return s.padStart(2, '0')
      case 'ms':
        return ms
      default:
        return ''
    }
  })
  return fullTime
}

// 格式化时间
export function formatDate2(date = new Date()): string {
  // 2020-01-03T15:50:03.387Z
  return new Date(date.getTime() + 8 * 60 * 60 * 1000).toJSON().replace(/T/g, ' ').replace(/\./g, ':').replace(/Z/g, '').slice(0, 19)
}

// 格式化时间字符串
export function formatDateString(date: string): string {
  return date?.slice(0, 19).replace('T', ' ').replace('Z', '') || ''
}

// 两个时间的时间差
export function timeDifference(date1: Date, date2: Date): string | null {
  if (!date1 && !date2) {
    // console.log('未传值')
    return
  }
  if (date1 && !date2) {
    date2 = new Date()
  }
  const time1 = date1.getTime()
  const time2 = date2.getTime()
  const diff = Math.abs(time1 - time2) // 绝对值
  const days = Math.floor(diff / (24 * 3600 * 1000))
  const leavel1 = diff % (24 * 3600 * 1000)
  const hours = Math.floor(leavel1 / (3600 * 1000))
  const leavel2 = leavel1 % (3600 * 1000)
  const minutes = Math.floor(leavel2 / (60 * 1000))
  const leavel3 = leavel2 % (60 * 1000)
  const seconds = Math.floor(leavel3 / 1000)
  // console.log(`${days}天${hours}小时${minutes}分钟${seconds}秒`)
  return `${days}天${hours}小时${minutes}分钟${seconds}秒`
}

// 2小时30分钟转化成 2.5
// 不能没有“小时”两个字，不能有除了“小时分钟”其他的字。
export function timeTextToHour(a: string = '0小时0分钟', num: number = 2): number {
  let result = null
  if (a?.includes('小时')) {
    let b: any = a.replace('小时', ',').replace('分钟', '').split(',')
    let [hour, min] = b
    result = parseFloat((Number(hour) + Number(min / 60)).toFixed(num))
  } else if (a?.includes('分钟')) {
    let min: any = a.replace('分钟', '')
    result = parseFloat(Number(min / 60).toFixed(num))
  }
  return result
}

//获得季度
export function getQuarterSeasonStartMonth(dateStr: string | number | Date): string {
  if (!dateStr) {
    return ''
  }
  const month = new Date(dateStr).getMonth()
  const year = new Date(dateStr).getFullYear()
  // 月份从0-11
  if (month < 3) {
    return year + '第一季度'
  }
  if (month < 6) {
    return year + '第二季度'
  }
  if (month < 9) {
    return year + '第三季度'
  }
  return year + '第四季度'
}

// 获得年月
export function getYearMonth(dateStr: string | number | Date): string {
  const month = new Date(dateStr).getMonth() + 1
  const year = new Date(dateStr).getFullYear()
  return year + '年' + month + '月'
}

// 获得某个月的天数
export function getDays(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

// 去掉空格，默认所有
export function trim(str: string, type = 'all') {
  switch (type) {
    case 'all':
      return str.replace(/(^\s*)|(\s*$)/g, "")
    case 'left':
      return str.replace(/(^\s*)/g, "")
    case 'right':
      return str.replace(/(\s*$)/g, "")
  }
}

// 防抖，防抖是指在一系列连续的操作中，只在最后一次操作后的一段时间内执行一次操作
export function debounce<T extends Function>(fn: T, delay: number): T {
  let timer: number = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  } as unknown as T;
}

// 节流，节流是指在一定时间内，只允许执行一次操作，不管这段时间内触发了多少次操作。
export function throttle<T extends Function>(fn: T, delay: number): T {
  let lastTime = 0;
  let timer: number = null;
  return function (this: any, ...args: any[]) {
    const now = new Date().getTime()
    const remaining = delay - (now - lastTime)
    clearTimeout(timer)
    if (remaining <= 0) {
      fn.apply(this, args)
      lastTime = now
    } else {
      timer = window.setTimeout(() => {
        fn.apply(this, args)
        lastTime = new Date().getTime()
      }, remaining)
    }
  } as unknown as T;
}

// 大量数据分批 放入页面
export function bigDataBatchToList(list: any[] = [], allList: any[] = [], num: number = 500) {
  let index = 0
  const fn = () => {
    if (index >= allList.length / num) {
      return false
    }
    for (let i = num * index; i < num * (index + 1); i++) {
      if (allList[i]) {
        list.push(allList[i])
      }
    }
    index++
    if (num * index < allList.length) {
      setTimeout(() => {
        fn()
      }, 500)
    }
  }
  fn()
}

// 树，递归，排序, asc用于升序，desc用于降序
export function sortTreeByKey(data: any, key: string | number, mode: string = 'asc') {
  const fn = (list: any[]) => {
    if (mode === 'asc') {
      list.sort((a, b) => a[key] - b[key])
    } else {
      list.sort((a, b) => b[key] - a[key])
    }
    list?.forEach(item => {
      if (Array.isArray(item.children)) {
        fn(item.children)
      }
    })
  }
  fn(data)
  return data
}

// JS中获取当前计算机的操作系统类型
// window: \\  linux: /
export function getSystem() {
  const userAgent = navigator.userAgent.toLowerCase()
  console.log('userAgent:>> ', userAgent);
  // var isWin = /windows/i.test(userAgent)
  if (/windows/i.test(userAgent)) {
    return 'windows'
  } else if (/mac/i.test(userAgent)) {
    return 'mac'
  } else if (/linux/i.test(userAgent)) {
    return 'linux'
  } else {
    return 'other'
  }

}


// 输入2个数字，比如35,40，返回一个数组，数组是35到40之间的所有3位数： [35,35.001,35.002,35.003,.......,39.998,39.999,40]
export function getXData(start: number, end: number) {
  const array = [];
  start = parseFloat((start).toFixed(3));
  end = parseFloat((end).toFixed(3));
  // 使用步长为0.001，并通过Math.ceil处理可能因浮点数误差导致的数组不包含end的情况
  for (let current = start; current <= end; current += 0.001) {
    array.push(parseFloat((current).toFixed(3)));
  }
  return array;
}

//  格式化毫秒数为天、小时、分钟、秒、毫秒
export function formatMilliseconds(milliseconds: number) {
  const timeUnits = [
    { unit: '天', value: 86400000 },
    { unit: '小时', value: 3600000 },
    { unit: '分钟', value: 60000 },
    { unit: '秒', value: 1000 },
    { unit: '毫秒', value: 1 }
  ];
  let result = '';

  for (let i = 0; i < timeUnits.length; i++) {
    const { unit, value } = timeUnits[i];
    const amount = Math.floor(milliseconds / value);

    if (amount > 0 || result !== '') {
      result += `${amount}${unit}`;
      milliseconds %= value;
    }

    if (milliseconds === 0) {
      break;
    }
  }
  return result === '' ? '0' : result;
}


import { message } from 'ant-design-vue'

// 封装获取文件并返回blob的函数
// 使用时应加上async/await: const blob = await getUrlBlob(data)
export function getUrlBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob' // 记住不要设置xhr.withCredentials = true，不要设置，默认不写就是false。
    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response // 这里获取到了文件对应的blob对象
        resolve(blob)
      } else {
        message.error('数据获取失败')
        reject(new Error('数据获取失败'))
      }
    }
    xhr.onerror = function (e) {
      message.error('数据获取失败')
      reject(new Error('数据获取失败'))
    }
    xhr.send()
  })
}

let FONT_SIZE: string = '14px'

// 设置一个短名字，把中间变成3个点.
export function getShortName(name: string, MAX_WIDTH: number = 188, SUFFIX: string = '', _FONT_SIZE: string = '14px') {
  FONT_SIZE = _FONT_SIZE
  const nameWidth = getStringWidth(name);
  if (nameWidth > MAX_WIDTH) {
    const combinedWidth = getStringWidth('...' + SUFFIX);
    const nameWithoutFif = name.slice(0, name.length - SUFFIX.length);
    const remainingWidth = MAX_WIDTH - combinedWidth;

    let left = Math.floor(nameWithoutFif.length / 2);
    let right = Math.ceil(nameWithoutFif.length / 2);

    // 从剩余字符串中间向两边逐步调整截断位置，直到满足宽度要求或者达到合适边界条件
    while (left > 0 && right < nameWithoutFif.length && (getStringWidth(nameWithoutFif.slice(0, left)) + getStringWidth(nameWithoutFif.slice(right))) > remainingWidth) {
      left--;
      right++;
    }

    // 正常情况，按照从剩余字符串中间截取，左右部分加上省略号和.fif拼接新字符串
    const newStr = nameWithoutFif.slice(0, left) + '...' + nameWithoutFif.slice(right) + SUFFIX;

    return newStr;
  }
  return name;
}

// 辅助函数，用于获取给定字符串的宽度
export function getStringWidth(str: string) {
  const span = document.createElement('span');
  span.textContent = str;
  span.style.fontSize = FONT_SIZE;
  document.body.appendChild(span);
  const range = document.createRange();
  range.selectNodeContents(span);
  const rect = range.getBoundingClientRect();
  const width = rect.width;
  document.body.removeChild(span);
  return width;
}

// data.forEach((item: any, index: number) => {
//   item.name = "MMMMMMMMMM" + "MMM" + "M" + ".fif"
//   item.name = "1111111111" + "111" + "M" + ".fif"
//   if (index === 0) {
//     item.name = "1111111111" + "111" + "M" + ".fif"
//   }
//   if (index === 1) {
//     item.name = "MMMMMMMMMM" + "M" + "M1" + ".fif"
//   }
//   if (index === 2) {
//     item.name = "MMMMMMMMMM" + "MMMMMMMMMM" + "111" + "1" + ".fif"
//   }
// })

// // 设置一个短名字，把中间变成3个点.
// function setShortName2(name: string) {
//   const manLength = 17
//   if (name.length > manLength) {
//     const startLength = Math.floor((manLength - 3) / 2); // 计算开头部分保留的长度，减去3是给省略号预留3个字符长度
//     const endLength = manLength - 3 - startLength; // 计算结尾部分保留的长度
//     return name.slice(0, startLength) + '...' + name.slice(-endLength);
//   }
//   return name;
// }



// 统一处理函数
export async function convertAllUrlsToBase64(data: any): Promise<void> {
  const promises: Promise<void>[] = [];

  const process = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key in obj) {
      const value = obj[key];

      // 处理字符串值
      if (typeof value === 'string' && value.startsWith('http://')) {
        promises.push((async () => {
          try {
            // 这里可选加时间戳，根据需要决定
            const newUrl = value + '?t=' + Date.now();
            obj[key] = await convertToBase64(newUrl);
          } catch (e) {
            console.error(`Failed to convert ${value}`, e);
          }
        })());
      }
      // 递归处理对象和数组
      else if (typeof value === 'object' && value !== null) {
        process(value);
      }
    }
  };

  process(data);
  await Promise.all(promises);
}


export const convertToBase64 = (url: string) => {
  // 添加空值检查
  if (!url || typeof url !== 'string') return url

  if (url.startsWith('data:image')) return url

  return new Promise((resolve) => { // 移除reject防止中断整个流程
    const img = new Image()
    img.crossOrigin = 'Anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg'))
      } catch (e) {
        console.error('Base64转换失败', e)
        resolve(url) // 转换失败返回原URL
      }
    }

    img.onerror = () => {
      console.warn(`图片加载失败: ${url}`)
      resolve(url) // 失败时返回原始URL
    }

    img.src = url
  })
}