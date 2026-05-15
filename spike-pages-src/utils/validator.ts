// 校验类工具
const validators = {
  /**校验手机号 */
  isPhoneNum: (value: string) => {
    // 简化版：11位纯数字，首位是1
    const regexp = /^1\d{10}$/
    return regexp.test(value)
  },
  /**校验邮箱 */
  isEmail: (value: string) => {
    // 更通用的邮箱正则
    const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return regexp.test(value)
  },
  /**校验url地址 */
  isUrl: (value: string) => {
    const regexp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    return regexp.test(value)
  },
  /**校验身份证 */
  isIDCard: (value: string) => {
    const regexp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return regexp.test(value)
  },
  //不允许输入特殊字符
  isSpecialCharacters: (value: string) => {
    const regexp = /^[A-Za-z0-9\s*\u4e00-\u9fa5-_,.，。！？：“”‘’；、·@+-=《》【】{}￥*&#-——()]+$/
    return regexp.test(value)
  },

  // 是否是中文
  isChinese: (value: string) => {
    return /^[\u4e00-\u9fa5]+$/.test(value)
  },
  //以字母开头的、由字母、数字或下划线组成
  isCombination: (value: string) => {
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)
  },
  //由字母、数字或下划线组成
  isComb: (value: string) => {
    return /^[a-zA-Z0-9_]*$/.test(value)
  },
  //是否是正整数
  isInteger: (value: string) => {
    return /^[0-9]*[1-9][0-9]*$/.test(value)
  },
  //只能输入数字和字母
  isIntergerAndEn: (value: string) => {
    return /^[a-zA-Z0-9]+$/.test(value)
  },
}

