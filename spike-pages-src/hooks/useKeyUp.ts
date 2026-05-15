/**
 * @description : 键盘事件
 * @param
 * 两种传参方式：
 * 1、传键盘keyCode 和 回调函数 ：useKeyUp('Enter', onSearch)
 * 2、只传回调函数 ：useKeyUp(key = > {})
 *
 */
export default function useKeyUp(...args: any[]) {
  function onkeyUpEvent() {
    document.onkeyup = e => {
      if (args.length === 1) {
        args[0](e.key, e)
      }
      if (args.length === 2) {
        if (e.key === args[0]) {
          args[1]()
        }
      }
    }
  }

  onMounted(() => {
    onkeyUpEvent()
  })

  onActivated(() => {
    onkeyUpEvent()
  })

  onBeforeUnmount(() => {
    document.onkeyup = null
  })

  onDeactivated(() => {
    document.onkeyup = null
  })
}