<template>
  <a-card>

    <div class="flex-between">
      <a-form class="form-list form-round" :model="form">
        <a-form-item :label="t('名称')" name="name">
          <a-input v-model:value="form.name" allowClear :placeholder="t('请输入')" size="large" @change="changeFormName" />
        </a-form-item>
      </a-form>

      <a-space :size="16" class="mb16 flex-end2">
        <div class="color-t5" v-if="selectedRowKeysAll.length">
          被选中数据集的大小为
          <span class="color-blue text-bold">{{ selectedFileSize }}</span>
        </div>

        <a-button type="default" :disabled="!selectedRowKeysAll.length"
          :title="!selectedRowKeysAll.length ? t('请先选择要删除的数据（可跨页多选）') : t('可跨页多选')" @click="onDeleteBatch()">
          <IconDelete />
          {{ t('批量删除') }}
        </a-button>
        <a-button type="primary" :disabled="!selectedRowKeysAll.length" :loading="downloadLoading"
          :title="!selectedRowKeysAll.length ? t('请先选择要下载的数据（可跨页多选）') : t('可跨页多选')" @click="onDownload()">
          <IconDownload />
          {{ t('下载文件') }}
        </a-button>
        <a-button type="primary" @click="onSearch()">
          <IconSearch />
          {{ t('查询') }}
        </a-button>
      </a-space>
    </div>


    <a-breadcrumb class="mb16">
      <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
        <a href="javascript:;" @click="clickFolder(item, index)">{{ item.name?.split('/')[0] }}</a>
      </a-breadcrumb-item>
    </a-breadcrumb>

    <a-table rowKey="filePath" :columns="tableConfig.columns" :data-source="tableData" :loading="loading"
      :pagination="false" :customRow="customRow" :scroll="{ x: true }"
      :row-class-name="(record: IForm) => (record.type === 2 ? 'cursor-pointer' : null)" :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: selectTable,
      }
        ">
      <!-- :size="tableData.length> 10 ? 'small':''" -->
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'theIndex'">
          <!-- type：1 文件，2 文件夹 -->
          <!-- <FileOutlined v-if="record.type === 1" :style="{ fontSize: '18px', color: '#333' }" />
          <FolderOpenFilled v-if="record.type === 2" :style="{ fontSize: '18px', color: 'var(--color-folder)', transform: 'scale(1.2)' }" /> -->

          <IconFile v-if="record.type === 1" class="icon-file-color text-18 scale12" />
          <IconFolder v-if="record.type === 2" class="text-18 scale12" />

        </template>

        <template v-if="column.dataIndex === 'name'">
          <a href="javascript:;" v-if="record.name.endsWith('.log')" title="查看日志" @click="viewLog(record)">{{ record.name }}</a>
          <span v-else>{{ record.name }}</span>
        </template>

        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <a href="javascript:;" @click.stop="onDelete(record)">{{ t('删除') }}</a>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-pagination v-model:current="pageNum" v-model:pageSize="pageSize" :total="total"
      :show-total="(total: number) => `${t('pagination.showTotal', { total })} `" :showSizeChanger="true"
      @change="changePage" />

  </a-card>

  <a-back-top class="back-top-btn" />

</template>

<script lang="ts" setup>
import { message, Modal  } from 'ant-design-vue'
import { getFileListApi, deleteFileApi, uploadFilesApi, downloadFilesApi } from '@/api/file'
import { downloadFile, formatFileSize } from '@u/utils'
import { confirmDeleteModal } from '@u/modal'
import useFold from '@/hooks/useFold'
import useKeyUp from '@/hooks/useKeyUp'
import { tableConfig } from './config'
const { t } = useI18n()
interface IForm {
  name: string
  filePath: string
  type: number
  lastModified?: number
  size?: number
  id?: string
}

const form = reactive({
  name: null,
})
let lastFormName: string = null // 保存根目录的搜索条件，点击根目录时，赋值这个搜索条件

const tableData = ref<IForm[]>([])
const loading = ref<boolean>(false)
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = ref<number>(20) // 默认20

const breadcrumbList = ref<IForm[]>([
  {
    filePath: '',
    name: t('根目录'),
    type: 0,
  },
])

const curFolder = ref<IForm | IAnyObject>({})

const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<IForm[]>([])
const selectedRowKeysAll = ref<string[]>([])  // 跨页所有选中项的ID
const selectedRowsAll = ref<any[]>([])        // 跨页所有选中项完整数据

const selectedFileSize = ref<string>('')
const downloadLoading = ref<boolean>(false)

// 下载文件
function onDownload() {
  if (!selectedRowKeysAll.value.length) {
    return message.info(t('请先选择要下载的数据'))
  }
  selectedRowKeysAll.value.map(async item => {
    const params = {
      foldName: item
    }
    downloadLoading.value = true
    const res: any = await downloadFilesApi(params)
    downloadLoading.value = false
    // console.log('res :>> ', res); // 正确的打印应该是 Blob {size: 1813, type: 'application/octet-stream'} ，而不是数据流，说明blob出问题了，受到了mock.js的影响
    downloadFile(res, res.headers['content-disposition'].split('=')[1])
  })
}

// 查看日志
async function viewLog(record: IForm) {
  const params = {
    foldName: record.filePath
  }
  const res: any = await downloadFilesApi(params)
  const text = await res.text()
  Modal.info({
      title: `${record.filePath}`,
      width: '80%',
      content: () => h('pre', {
        style: {
          maxHeight: '500px',
          overflow: 'auto',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }
      }, text),
      okText: '关闭'
    })
}

// 选择行
function selectTable(rowKeys: string[], rows: IForm[]) {
  selectedRowKeys.value = rowKeys
  selectedRows.value = rows

  // 合并当前页选中项（自动去重）
  selectedRowKeysAll.value = [
    ...selectedRowKeysAll.value,
    ...rowKeys
  ].filter((v, i, arr) => arr.indexOf(v) === i) // 数组去重

  // 合并完整数据（防重复）
  selectedRowsAll.value = [
    ...selectedRowsAll.value,
    ...rows.filter(row =>
      !selectedRowsAll.value.some(r => r.id === row.id)
    )
  ]

  // 处理取消选择的项（仅当前页）
  const unselectedKeys = selectedRowKeysAll.value
    .filter(key =>
      tableData.value.some(item => item.id === key) && // 属于当前页
      !rowKeys.includes(key)  // 被取消选择
    )

  selectedRowKeysAll.value = selectedRowKeysAll.value
    .filter(key => !unselectedKeys.includes(key))
  selectedRowsAll.value = selectedRowsAll.value
    .filter(row => !unselectedKeys.includes(row.id))


  // 计算选中文件大小，也要按照跨页所有选中项selectedRowsAll.value计算
  selectedFileSize.value = formatFileSize(selectedRowsAll.value.reduce((sum, obj) => sum + obj.size, 0))
}

// 修改页码
function changePage(num: number, size: number) {
  pageNum.value = num
  pageSize.value = size
  getData()
}

// 点击面包屑上的目录
function clickFolder(record: IForm, index: number) {
  if (record.name === t('根目录')) {
    form.name = lastFormName
  } else {
    form.name = null // 点击面包屑时清空搜索条件
  }
  curFolder.value = record
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1)
  onSearch()
}

// 点击表格一行
function customRow(record: IForm) {
  return {
    onClick: (event: any) => {
      // 如果点到的是多选框所在格子，则不跳转，解决一个点歪就跳转的尴尬手抖问题
      const isCheckboxCell = event.target?.children[0]?.classList[0] === 'ant-checkbox-wrapper'
      if (!isCheckboxCell && record.type === 2) {
        form.name = null // 点击文件夹时清空搜索条件
        curFolder.value = record
        breadcrumbList.value.push(record)
        onSearch()
      }
    }
  }
}

useKeyUp('Enter', onSearch)

// 查询
function onSearch() {
  pageNum.value = 1
  selectedRowKeysAll.value = []
  selectedRowsAll.value = []
  getData()
}

onMounted(() => {
  getData()
})

// 获取数据
async function getData() {

  selectedRowKeys.value = [] // 先取消选中数据。selectTable([], [])这种方式在跨页不行了
  selectedRows.value = []


  const { filePath } = curFolder.value
  // filePath没有值，说明在根目录，保存lastFormName
  if (!filePath) {
    lastFormName = form.name
  }
  const params = {
    foldName: filePath || '',
    subjectId: '',
    queryFileName: form.name || null,

    pageNum: pageNum.value,
    pageSize: pageSize.value,
  }
  loading.value = true
  const { code, data } = await getFileListApi(params)
  loading.value = false
  if (code === 200) {
    // 文件夹在上，文件在下
    const folderList: IForm[] = []
    const fileList: IForm[] = []
    data.records?.forEach((item: IForm) => {
      item.id = item.filePath
      if (item.type === 1) {
        fileList.push(item)
      }
      if (item.type === 2) {
        folderList.push(item)
      }
    })
    tableData.value = [...folderList, ...fileList]

    total.value = data.total || 0

    // 从全局选中列表中恢复当前页选中状态
    selectedRowKeys.value = tableData.value
      .map(item => item.id) // 没有id，用filePath代替
      .filter(id => selectedRowKeysAll.value.includes(id))
  }
}

// 如果清空了，就马上发起请求
function changeFormName() {
  if (!form.name) {
    onSearch()
  }
}

// 批量删除
function onDeleteBatch() {
  if (!selectedRowKeysAll.value.length) {
    //  message.success('请先选择要删除的数据')
    //  message.warn('请先选择要删除的数据')
    //  message.error('请先选择要删除的数据')
    return message.info(t('请先选择要删除的数据'))
  }

  const pList: any[] = []
  pList.push(h('div', { class: 'mb16' }, t('确认删除选中文件？')))
  selectedRowKeysAll.value.forEach((item) => {
    pList.push(h('div', {
      style: {
        padding: '6px 12px',
        margin: '6px 12px 0 0',
        background: 'var(--color-bg-gray)',
        borderRadius: '8px'
      }
    }, item))
  })

  confirmDeleteModal(`${t('批量删除')}？（${selectedRowsAll.value.length}）`, h('div', { class: 'break-all' }, pList), () => {

    let deletedNum = 0 // 已删除的数量

    selectedRowKeysAll.value.map(async (item, index) => {
      const params = {
        subjectId: '',
        filePath: item
      }
      const { code, msg } = await deleteFileApi(params)
      deletedNum += 1 // 不管成功还是失败都要加1
      if (code === 200) {
        message.success(`${item} ${msg}`)

        // 都删除完了再刷新页面
        if (deletedNum === selectedRowKeysAll.value.length) {
          onSearch()
        }
      }
    })
  })
}

// 删除
function onDelete(record: IForm) {
  confirmDeleteModal(t('删除'), t('modal.confirmDelete', { name: record.name }), () => {
    onDeleteRequest(record.filePath)
  })
}

// 请求删除
async function onDeleteRequest(filePath: string) {
  const params = {
    subjectId: '',
    filePath: filePath
  }
  const { code, msg } = await deleteFileApi(params)
  if (code === 200) {
    message.success(msg)
    if (pageNum.value > 1 && (pageSize.value === 1 || total.value % pageSize.value === 1)) {
      pageNum.value--
    }
    getData()
    // onSearch()
  }
}

</script>
<style lang="less" scoped>
:deep(.form-list) {
  .ant-form-item {
    margin-bottom: 16px;

    .ant-form-item-label>label {
      height: 38px;
    }
  }
}

:deep(.ant-table) {
  font-size: 16px;
}
</style>