import { Modal } from 'ant-design-vue'
// 提示框
export function confirmModal(title: string = t('提示'), content: string | VNode, callback: () => void) {
  Modal.confirm({
    title: title || t('提示'),
    content,
    // okText: '确定',
    // cancelText: '取消',
    onOk() {
      if (typeof callback === 'function') {
        callback()
      }
    },
    onCancel() { }
  })
}


// 提示框
export function confirmDeleteModal(title: string = t('删除'), content: string | VNode, callback: () => void) {
  Modal.confirm({
    title: title || t('删除'),
    content,
    okType: 'danger',
    okText: t('删除'),
    onOk() {
      if (typeof callback === 'function') {
        callback()
      }
    },
    onCancel() { }
  })
}