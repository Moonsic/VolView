<template>
  <a-modal
    :title="t('权限管理')"
    v-model:open="visible"
    :confirm-loading="loading"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="modalOk"
    @cancel="modalCancel"
  >
    <div class="modal-body">
      <a-tree
        v-if="treeData.length"
        v-model:checkedKeys="checkedKeys"
        checkable
        autoExpandParent
        defaultExpandAll
        :tree-data="treeData"
        :field-names="fieldNames"
      >
        <template #title="{ label, id }">
          {{ label }}
        </template>
      </a-tree>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { getTreeApi } from '@/api/permission'
import { getRoleInfoByIdApi, rolePermissionSetApi } from '@/api/role'
const { t } = useI18n()
// 数据
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

interface IModalContent {
  id?: string
  [key: string]: any
}
const modalContent = ref<IModalContent>({})

const checkedKeys = ref<string[]>([])

interface ITreeData {
  id: string // id
  label: string // 名称
  parentId?: string // 父级id
  children?: []
}
const treeData = ref<ITreeData[]>([])

const fieldNames = {
  children: 'children',
  title: 'label',
  key: 'id',
}

// 显示弹窗
function showModal(record: { id: string }) {
  visible.value = true
  modalContent.value = record || {}
  getTreeData(record.id)
  getPremission(record.id)
}

// 获取树数据
async function getTreeData(id: string) {
  const params = { id }
  const { code, data } = await getTreeApi(params)
  if (code === 200) {
    treeData.value = data || []
  }
}

// 获取权限
async function getPremission(id: string) {
  const params = {
    roleId: id
  }
  const { code, data } = await getRoleInfoByIdApi(params)
  if (code === 200) {
    checkedKeys.value = data.permissionCodes?.split(',') || []
  }
}

// 确定弹窗
async function modalOk() {
  const params = {
    roleId: modalContent.value.id,
    checkedPermissions: checkedKeys.value.join(','),
  }
  loading.value = true
  const { code, msg } = await rolePermissionSetApi(params)
  loading.value = false
  if (code === 200) {
    message.success(msg)
    modalCancel()
  }
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  checkedKeys.value = []
}

// 暴露方法
defineExpose({
  showModal
})

</script>
<style lang="less" scoped>
.modal-body {
  min-height: 200px;
}
</style>