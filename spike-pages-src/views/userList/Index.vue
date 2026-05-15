<template>
  <a-card>
    <a-space :size="16" class="mb16 flex-end">
      <a-button type="primary" @click="onAdd()">
        <PlusCircleOutlined />
        {{ t('新增') }}
      </a-button>
      <a-button type="primary" @click="onSearch()">
        <IconSearch />
        {{ t('查询') }}
      </a-button>
    </a-space>

    <a-table rowKey="id" :columns="tableConfig.columns" :data-source="tableData" :loading="loading" :pagination="false"
      :row-selection="null" :scroll="{ x: true }">
      <template #bodyCell="{ index, record, column }">
        <template v-if="column.dataIndex === 'theIndex'">
          {{ (pageNum - 1) * pageSize + index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-space v-if="record.account !== 'epilepsy_admin'">
            <a href="javascript:;" @click="onEdit(record)">{{ t('编辑') }}</a>
            <a href="javascript:;" @click="onDetail(record)">{{ t('详情') }}</a>
            <a href="javascript:;" @click="onDelete(record)">{{ t('删除') }}</a>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-pagination v-model:current="pageNum" v-model:page-size="pageSize" :total="total"
      :show-total="(total: number) => `${t('pagination.showTotal', { total })} `" :showSizeChanger="true"
      @change="changePage" />
  </a-card>

  <!--新增、修改弹窗-->
  <AddEditModal ref="addEditModalRef" :roleList="roleList" @success="getData" />

  <!-- 详情弹窗 -->
  <DetailModal ref="detailModalRef" />

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { listApi, deleteApi } from '@/api/user'
import { listApi as getRoleListApi } from '@/api/role'
import { confirmDeleteModal } from '@u/modal'
import useKeyUp from '@/hooks/useKeyUp'
import { tableConfig } from './config'

import AddEditModal from './modal/AddEditModal.vue'
import DetailModal from './modal/DetailModal.vue'

const { t } = useI18n()

const addEditModalRef = ref(null)
const detailModalRef = ref(null)

interface IForm {
  id: string
  name: string
  account: string
  createTime: string
  password: string
  gender: 1 | 2
  roleId: string
  roleName: string
}

const tableData = ref<IForm[]>([])
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)

interface IRole {
  id: string
  roleName: string
  createTime: string
}
// 角色列表
const roleList = ref<IRole[]>([])

useKeyUp('Enter', onSearch)

onMounted(() => {
  getData()
  getRoleList()
})

// 获取数据
async function getData() {
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }
  loading.value = true
  const { code, data } = await listApi(params)
  loading.value = false
  if (code === 200) {
    tableData.value = data.records || []
    total.value = data.total || 0
  }
}

// 获取角色
async function getRoleList() {
  const params = {
    pageNum: 1,
    pageSize: 1000,
  }
  const { code, data } = await getRoleListApi(params)
  if (code === 200) {
    roleList.value = data.records || []
  }
}

// 新增
function onAdd() {
  addEditModalRef.value.showModal('add')
}

// 编辑
function onEdit(record: IForm) {
  addEditModalRef.value.showModal('edit', record)
}

// 详情
function onDetail(record: IForm) {
  detailModalRef.value.showModal(record)
}

// 查询
function onSearch() {
  pageNum.value = 1
  getData()
}

// 修改页码
function changePage(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
  getData()
}

// 删除
function onDelete(record: IForm) {
  confirmDeleteModal(t('删除'), t('modal.confirmDelete', { name: record.name }), () => {
    onDeleteRequest([record.id])
  })
}

// 请求删除
async function onDeleteRequest(ids: string[]) {
  const params = {
    userId: ids[0]
  }
  const { code, msg } = await deleteApi(params)
  if (code === 200) {
    message.success(msg)
    const lastLength = total.value % pageSize.value
    const deleteNum = ids.length
    if (pageNum.value > 1 && (deleteNum === pageSize.value || deleteNum === lastLength)) {
      pageNum.value--
    }
    getData()
  }
}

</script>

<style lang="less" scoped>
:deep(.ant-table) {
  font-size: 16px;
}
</style>