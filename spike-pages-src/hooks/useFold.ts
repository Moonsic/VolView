// 展开收起-Hook
import { ref, onMounted, watch } from 'vue'
export default function useFold(listNode: string) {

  const formItemLength = ref<number>(null)

  //状态: true: 收起状态， false: 展开状态
  const isFold = ref<boolean>(false)
  // 显示和隐藏 展开收起按钮
  const showFold = ref<boolean>(false)
  // 一行有几列
  const colNum = ref<number>(null)
  // 根据colNum对应的样式：grid-1/grid-2/grid-3/grid-4
  const formClass = ref<string>('')

  onMounted(() => {
    formItemLength.value = getFormItemList().length
    setColNum()
  })

  // 现在不考虑缩小宽度了
  // // 页面宽度发生变化
  // window.onresize = () => {
  //   setColNum()
  // }

  // 获取节点
  function getFormItemList() {
    return document.querySelectorAll(`${listNode} > *`)
    // return document.querySelectorAll('.ant-form > .ant-form-item')
  }

  // 设置colNum
  // 现在不考虑缩小宽度了
  function setColNum() {
    colNum.value = 4
    // if (window.innerWidth >= 1280) {
    //   colNum.value = 4
    // } else if (window.innerWidth >= 1000 && window.innerWidth < 1280) {
    //   colNum.value = 3
    // } else if (window.innerWidth >= 768 && window.innerWidth < 1000) {
    //   colNum.value = 2
    // } else {
    //   colNum.value = 1
    // }
  }

  // 当colNum发生变化是，如果当前是收起状态，则要onFold()
  watch(colNum, () => {
    showFold.value = formItemLength.value > colNum.value
    formClass.value = `grid-${colNum.value}`
    if (isFold.value) {
      onFold(true, true)
    }
  })

  // 点击展开与收起, 当页面宽度导致colNum变化时，要收起对应formItemLength的form-item，skip=true,要跳过e === isFold.value的判断
  function onFold(value: boolean, skip: boolean = false) {
    if (!skip && value === isFold.value) {
      return
    }
    isFold.value = value
    const list = getFormItemList()
    if (!value) {
      // 展开全部
      list.forEach((item: any) => {
        item.style.display = 'block'
      })
    } else {
      // 收起来
      list.forEach((item: any, index) => {
        item.style.display = index < colNum.value ? 'block' : 'none'
      })
    }
  }

  return {
    formClass,
    isFold,
    showFold,
    onFold
  }
}