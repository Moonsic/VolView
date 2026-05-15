<template>


  <div class="main-page">
    <div class="page-top">
      <div class="flex-start">
        <Back class="page-back" :title="t('患者详情')" />
      </div>
    </div>

    <!-- <DetailList :detail="detailData" /> -->

    <div class="base-info">
      <div class="title">{{ t('基础信息') }}</div>
      <div class="list">
        <div class="item">
          <span>{{ t('患者编号') }}：</span>
          <span> {{ detailData.megId }}</span>
        </div>
        <div class="item">
          <span>{{ t('姓名') }}：</span>
          <span> {{ detailData.subjectName }}</span>
        </div>
        <div class="item">
          <span>{{ t('性别') }}：</span>
          <span v-if="detailData.gender === 1">{{ t('男') }}</span>
          <span v-else-if="detailData.gender === 2">{{ t('女') }}</span>
          <span v-else>-</span>
        </div>
        <div class="item">
          <span>{{ t('出生日期') }}：</span>
          <span>{{ detailData.birthDate || '-' }}</span>
        </div>
        <div class="item">
          <span>{{ t('扫描日期') }}：</span>
          <span>{{ detailData.scanDate || '-' }}</span>
        </div>
      </div>
    </div>

    <div class="file-box">
      <div class="header flex-between">
        <div class="flex-start">
          <span class="title">{{ t('文件目录') }}</span>
          <div class="size-list">
            <div class="item">
              <div class="name">T1W：</div>
              <div class="value">
                <span class="num"> {{ t1wSize }} </span>
              </div>
            </div>
            <div class="item">
              <div class="name">MEG：</div>
              <div class="value">
                <span class="num"> {{ megSize }} </span>
              </div>
            </div>
          </div>
        </div>
        <a-space :size="16">
          <div class="color-t5" v-if="selectedRowKeys.length">
            {{ t('被选中数据集的大小为') }}
            <span class="color-blue text-bold">{{ selectedFileSize }}</span>
          </div>

          <a-button type="primary" :disabled="!selectedRowKeys.length" :loading="downloadLoading"
            :title="!selectedRowKeys.length ? '请先选择要下载的数据' : null" @click="onDownload()">
            <IconDownload />
            {{ t('下载文件') }}
          </a-button>
          <a-button type="primary" @click="onSearch()">
            <IconSearch />
            {{ t('查询') }}
          </a-button>
        </a-space>
      </div>

      <div class="p16">

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
          <template #bodyCell="{ index, record, column }">
            <template v-if="column.dataIndex === 'theIndex'">
              <!-- type：1 文件，2 文件夹 -->
              <IconFile v-if="record.type === 1" class="icon-file-color text-18 scale12" />
              <IconFolder v-if="record.type === 2" class="text-18 scale12" />
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <a-space>
                <a href="javascript:;" @click.stop="onDelete(record)">{{ t('删除') }}</a>
              </a-space>
            </template>
          </template>
        </a-table>
      </div>

    </div>

  </div>

</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { getFileListApi, deleteFileApi } from '@/api/file'
import { getSubjectByIdApi } from '@/api/subject'
import { formatFileSize, downloadFile } from '@u/utils'
import { confirmDeleteModal } from '@u/modal'
import useKeyUp from '@/hooks/useKeyUp'
import { tableConfig } from './config'
// import DetailList from './DetailList.vue'
import { downloadFilesApi } from '@/api/file'

const { t } = useI18n()

interface IForm {
  name: string
  filePath: string
  type: number
  lastModified?: number
  size?: number
}

const tableData = ref<IForm[]>([])
const loading = ref<boolean>(false)

const t1wSize = ref<string>('')
const megSize = ref<string>('')

const breadcrumbList = ref<IForm[]>([
  {
    filePath: '',
    name: t('根目录'),
    type: 0,
  },
])
const selectedRowKeys = ref<string[]>([])
const selectedRows = ref<IForm[]>([])
const selectedFileSize = ref<string>('')
const downloadLoading = ref<boolean>(false)

// 下载文件
function onDownload() {
  if (!selectedRowKeys.value.length) {
    return message.info(t('请先选择要下载的数据'))
  }
  selectedRowKeys.value.map(async item => {
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

// 选择行
function selectTable(rowKeys: string[], rows: IForm[]) {
  selectedRowKeys.value = rowKeys
  selectedRows.value = rows
  selectedFileSize.value = formatFileSize(rows.reduce((sum, obj) => sum + obj.size, 0))
}

const curFolder = ref<IForm | IAnyObject>({})

const subjectId = ref<string>('')
const detailData = ref<IAnyObject>({})

const route = useRoute()
subjectId.value = String(route.query.subjectId)

getDetail()

// 获取详情
async function getDetail() {
  const params = {
    subjectId: subjectId.value
  }
  const { code, data } = await getSubjectByIdApi(params)
  if (code === 200) {
    detailData.value = data || {}
    t1wSize.value = formatFileSize(data.t1wSize || 0)
    megSize.value = formatFileSize(data.megSize || 0)

    // 第一次请求会判断根目录是否有同名文件夹
    getData(true)
  }
}

useKeyUp('Enter', getDetail)

// 获取数据
async function getData(isFirstRequest: boolean = false) {
  const { filePath } = curFolder.value
  const params = {
    foldName: filePath || '',
    subjectId: subjectId.value,
    pageNum: 1,
    pageSize: 10000, // 这里不分页，查所有
  }
  loading.value = true
  const { code, data } = await getFileListApi(params)
  loading.value = false
  if (code === 200) {
    // 文件夹在上，文件在下
    const folderList: IForm[] = []
    const fileList: IForm[] = []
    data.records?.forEach((item: IForm) => {
      if (item.type === 1) {
        fileList.push(item)
      }
      if (item.type === 2) {
        folderList.push(item)
      }
    })
    tableData.value = [...folderList, ...fileList]

    // 在查根目录的情况下，有一个文件夹且和megId同名
    if (isFirstRequest) {
      if (data && data.length && data[0].type === 2 && data[0].name === detailData.value.megId) {
        curFolder.value = data[0]
        breadcrumbList.value.push(data[0])
        getData()
      }
    }

  }
}

// 点击面包屑上的目录
function clickFolder(record: IForm, index: number) {
  curFolder.value = record
  breadcrumbList.value = breadcrumbList.value.slice(0, index + 1)
  selectTable([], []) // 先取消选中数据
  getData()
}

// 点击表格一行
function customRow(record: IForm) {
  return {
    onClick: (event: any) => {
      // 如果点到的是多选框所在格子，则不跳转，解决一个点歪就跳转的尴尬手抖问题
      const isCheckboxCell = event.target?.children[0]?.classList[0] === 'ant-checkbox-wrapper'
      if (!isCheckboxCell && record.type === 2) {
        curFolder.value = record
        breadcrumbList.value.push(record)
        selectTable([], []) // 先取消选中数据
        getData()
      }
    }
  }
}

// 查询
function onSearch() {
  getData()
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
    getData()
  }
}

</script>

<style lang="less" scoped>
@space: 12px; // 间距

:deep(.ant-table) {
  font-size: 16px;
}

.size-list {
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  margin-left: 24px;

  .item {
    width: 180px;
    padding: 8px 16px;
    background: var(--color-bg-gray);
    border-radius: 2px;

    display: flex;
    align-items: center;

    &:nth-child(2) {
      text-align: right;
    }

    .name {
      font-size: 14px;
      margin-right: 4px;
      color: var(--color-gray);
    }

    .value {
      .num {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}


// 页面根class
.main-page {
  position: relative;

  .page-top {
    margin-bottom: 16px;
    box-shadow: var(--box-shadow);
  }

  .base-info {
    background: var(--color-bg);
    margin-bottom: 16px;
    border-radius: 8px;
    font-size: 16px;
    box-shadow: var(--box-shadow);
    border: var(--border-card);

    .title {
      padding: 16px 0;
      margin: 0 16px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: var(--border);

      &:before {
        content: '';
        display: inline;
        border-left: 4px solid var(--color-modal-title-before);
        border-right: 4px solid var(--color-modal-title-before);
        border-radius: 2px;
        margin-right: 16px;
      }
    }

    .list {
      display: flex;
      align-items: center;
      padding: 24px;
      font-weight: 500;

      .item {
        width: 18%;
        display: flex;
        align-items: center;
        margin-right: 24px;

        .name {
          font-size: 14px;
        }

        >span:nth-child(1) {
          color: var(--color-gray);
          margin-right: 6px;
        }
      }

    }
  }

  .file-box {
    background: var(--color-bg);
    margin-bottom: 16px;
    border-radius: 8px;
    box-shadow: var(--box-shadow);
    border: var(--border-card);

    .header {
      padding: 16px 0;
      margin: 0 16px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: var(--border-card);
      display: flex;
      align-items: center;

      .title {
        &:before {
          content: '';
          display: inline;
          border-left: 4px solid var(--color-modal-title-before);
          border-right: 4px solid var(--color-modal-title-before);
          border-radius: 2px;
          margin-right: 16px;
        }
      }
    }

  }
}
</style>