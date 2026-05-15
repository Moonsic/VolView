<template>
  <!-- 布局： -->
  <div class="flex-center mb8">
    <a-select v-model:value="curLayoutId" :options="layoutList" :fieldNames="{ label: 'layoutName', value: 'id' }"
      :placeholder="t('请选择')" :dropdownMatchSelectWidth="false" @change="changeLayout" />
  </div>

  <div class="btn-list">
    <div class="item" :title="t('新增布局')" @click="showModal('add')">
      <PlusOutlined />
      {{ t('新增') }}
    </div>
    <div class="item" :title="t('修改布局')" @click="showModal('edit')">
      <EditOutlined />
      {{ t('修改') }}
    </div>
    <div class="item" :title="t('布局管理')" @click="showSettingModal()">
      <SettingOutlined />
      {{ t('管理') }}
    </div>
  </div>


  <a-modal v-model:open="visible" :confirm-loading="loading" :title="modalTitle" :okText="t('确定')" :cancelText="t('取消')"
    :maskClosable="false" :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">

    <a-form class="form-list mb8" ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 7 }"
      :wrapperCol="{ span: 14 }">
      <a-form-item :label="t('布局名称')" name="layoutName">
        <a-input v-model:value="form.layoutName" :placeholder="t('请输入')" />
      </a-form-item>

      <a-form-item :label="t('布局信息')" name="layoutInfo">
        <div class="form-box">
          <a-tag class="mr2 mb2" v-if="layoutData.butterfly">{{ t('全脑区蝴蝶窗口') }}</a-tag>
          <a-tag class="mr2 mb2" v-if="layoutData.layoutModal">{{ t('通道布局窗口') }}</a-tag>
          <a-tag class="mr2 mb2" v-if="layoutData.viewModal">{{ t('结构像窗口') }}</a-tag>
          <a-tag class="mr2 mb2" v-if="layoutData.allTimeModal">{{ t('全局时刻点窗口') }}</a-tag>
        </div>
      </a-form-item>
      <a-form-item :label="t('通道信息')">
        <div class="form-box">

          <template v-for="(item, index) in layoutData.lineList" :key="index">
            <!-- <a-tag class="tag mr2 mb2" v-if="item.listName" :title="item.chNames.join()">{{ item.listName }}</a-tag>
            <a-tag class="tag mr2 mb2" v-if="!item.listName && item.chNames.length <= 3">{{ item.chNames.join()
            }}</a-tag>
            <a-tag class="tag mr2 mb2" v-if="!item.listName && item.chNames.length > 3" :title="item.chNames.join()">{{
              item.chNames.slice(0, 3).join() }}...</a-tag> -->


            <a-tag class="tag" v-if="item.listNameType === 'listName'" :title="item.listName">
              {{ item.listName }}
            </a-tag>

            <template v-if="item.listNameType === 'chNames'">
              <a-tag class="tag" v-if="['meg'].includes(item.modalType)"
                :title="[...item.chNames, ...ecgeoggfpList(item)].join()">
                {{ [...item.chNames, ...ecgeoggfpList(item)].join() }}
              </a-tag>
              <a-tag class="tag" v-if="['eegChannel'].includes(item.modalType)" :title="item.chNames.join()">
                {{ item.chNames.join() }}
              </a-tag>
              <a-tag class="tag" v-if="['eegComb'].includes(item.modalType)" :title="item.leadCombination.join()">
                {{item.leadCombination.join()}}
              </a-tag>
            </template>



            <!-- <a-tag class="tag mr2 mb2" v-if="item.modalType === 'meg' && item.listNameType === 'listName'"
              :title="item.chNames.join()">{{ item.listName }}</a-tag>

            <a-tag class="tag mr2 mb2" v-if="item.modalType === 'meg' && !item.chNames.length">{{ item.listName }}</a-tag>

            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'meg' && item.listNameType === 'chNames' && item.chNames.length && item.chNames.length <= 3">{{
                item.chNames.join() }}</a-tag>

            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'meg' && item.listNameType === 'chNames' && item.chNames.length > 3"
              :title="item.chNames.join()">{{
                item.chNames.slice(0, 3).join() }}...</a-tag>


            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'eegChannel' && item.chNames.length && item.chNames.length <= 3">{{
                item.chNames.join()
              }}...</a-tag>
            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'eegChannel' && item.chNames.length && item.chNames.length > 3"
              :title="item.chNames.join()">{{ item.chNames.slice(0, 3).join() }}...</a-tag>


            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'eegComb' && Object.keys(item.leadCombination).length <= 3"
              :title="item.leadCombination.join(',')">{{
                item.listName.split(',').slice(0, 3).join(',') }}</a-tag>

            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'eegComb' && Object.keys(item.leadCombination).length > 3"
              :title="item.leadCombination.join(',')">{{
                item.listName.split(',').slice(0, 3).join(',') }}...</a-tag> -->

            <!-- <a-tag class="tag mr2 mb2">{{ item.listName}}</a-tag> -->


          </template>
        </div>

      </a-form-item>

      <a-form-item label="" name="isDefault">
        <a-checkbox v-model:checked="form.isDefault" style="margin-left: 140px;width: 100%;">{{ t('设置为默认布局') }}</a-checkbox>
      </a-form-item>
    </a-form>

  </a-modal>


  <a-modal :width="800" v-model:open="settingVisible" :confirm-loading="loading" :title="t('布局管理')" :okText="t('确定')"
    :cancelText="t('取消')" :maskClosable="false" :destroyOnClose="true" :footer="null" @ok="settingModalOk"
    @cancel="settingModalCancel">

    <a-table class="table" rowKey="id" size="small" :columns="tableColumns" :data-source="layoutList"
      :pagination="false" :scroll="{ x: true, y: 600 }">
      <template #bodyCell="{ record, column }">
        <!-- <template v-if="column.dataIndex === 'layoutName'">
            <span>{{ record.layoutName }}</span>
        </template> -->


        <template v-if="column.dataIndex === 'layoutInfo'">
          <div>
            <a-tag class="mb2" v-if="record.layoutInfo.butterfly">{{ t('全脑区蝴蝶窗口') }}</a-tag>
          </div>
          <div>
            <a-tag class="mb2" v-if="record.layoutInfo.layoutModal">{{ t('通道布局窗口') }}</a-tag>
          </div>
          <div>
            <a-tag class="mb2" v-if="record.layoutInfo.viewModal">{{ t('结构像窗口') }}</a-tag>
          </div>
          <div>
            <a-tag class="mb2" v-if="record.layoutInfo.allTimeModal">{{ t('全局时刻点窗口') }}</a-tag>
          </div>
        </template>


        <template v-if="column.dataIndex === 'channels'">

          <template v-for="(item, index) in record.layoutInfo.lineList" :key="index">
            <!-- <a-tag class="tag mr2 mb2" v-if="item.listName && item.modalType === 'meg'" :title="item.chNames.join()">{{ item.listName }}</a-tag> -->
            <!-- <a-tag class="tag mr2 mb2" v-if="item.listName" :title="item.chNames.join()">{{ item.listName }}</a-tag>
            <a-tag class="tag mr2 mb2" v-if="!item.listName && item.chNames.length <= 3">{{ item.chNames.join() }}</a-tag>
            <a-tag class="tag mr2 mb2" v-if="!item.listName && item.chNames.length > 3" :title="item.chNames.join()">
              {{item.chNames.slice(0, 3).join() }}...</a-tag> -->




            <!-- <a-tag class="tag mr2 mb2" v-if="item.modalType === 'meg'" :title="item.chNames.join()">{{item.listName.slice(0, 3).join() }}...</a-tag>
              <a-tag class="tag mr2 mb2" v-if="item.modalType === 'eegChannel' && item.chNames.length" :title="item.chNames.join()">{{item.chNames.slice(0, 3).join() }}...</a-tag>
              <a-tag class="tag mr2 mb2" v-if="item.modalType === 'eegComb'" :title="item.listName">{{item.listName.split(',').slice(0, 3).join() }}...</a-tag> -->




            <a-tag class="tag" v-if="item.listNameType === 'listName'" :title="item.listName">
              {{ item.listName }}
            </a-tag>

            <template v-if="item.listNameType === 'chNames'">
              <a-tag class="tag" v-if="['meg'].includes(item.modalType)"
                :title="[...item.chNames, ...ecgeoggfpList(item)].join()">
                {{ [...item.chNames, ...ecgeoggfpList(item)].join() }}
              </a-tag>
              <a-tag class="tag" v-if="['eegChannel'].includes(item.modalType)" :title="item.chNames.join()">
                {{ item.chNames.join() }}
              </a-tag>
              <a-tag class="tag" v-if="['eegComb'].includes(item.modalType)" :title="item.leadCombination.join()">
                {{item.leadCombination.join()}}
              </a-tag>
            </template>

            <!-- <a-tag class="tag mr2 mb2" v-if="item.modalType === 'meg' && item.listNameType === 'listName'"
              :title="item.chNames.join()">{{ item.listName }}</a-tag>

            <a-tag class="tag mr2 mb2" v-if="item.modalType === 'meg' && !item.chNames.length">{{ item.listName
              }}</a-tag>

            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'meg' && item.listNameType === 'chNames' && item.chNames.length && item.chNames.length <= 3">{{
                item.chNames.join() }}</a-tag>

            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'meg' && item.listNameType === 'chNames' && item.chNames.length > 3"
              :title="item.chNames.join()">{{
                item.chNames.slice(0, 3).join() }}...</a-tag>

            <a-tag class="tag mr2 mb2" v-if="item.modalType === 'meg' && !item.listNameType"
              :title="item.chNames.join()">{{
                item.listName || item.chNames.slice(0, 3).join() }}</a-tag>


            <a-tag class="tag mr2 mb2" v-if="item.modalType === 'eegChannel' && item.chNames.length <= 3">{{
              item.chNames.join()
            }}...</a-tag>
            <a-tag class="tag mr2 mb2" v-if="item.modalType === 'eegChannel' && item.chNames.length > 3"
              :title="item.chNames.join()">{{ item.chNames.slice(0, 3).join() }}...</a-tag>


            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'eegComb' && Object.keys(item.leadCombination).length <= 3"
              :title="item.leadCombination.join(',')">{{
                item.listName.split(',').slice(0, 3).join(',') }}</a-tag>

            <a-tag class="tag mr2 mb2"
              v-if="item.modalType === 'eegComb' && Object.keys(item.leadCombination).length > 3"
              :title="item.leadCombination.join(',')">{{
                item.listName.split(',').slice(0, 3).join(',') }}...</a-tag>


            <a-tag class="tag mr2 mb2" v-else>{{ item }}</a-tag> -->

          </template>

        </template>

        <template v-if="column.dataIndex === 'operation'">
          <!-- <a-space style="width: 100px"> -->
          <a-space>
            <a-tag class="default-tag" v-if="record.isDefault" color="blue">{{ t('默认') }}</a-tag>
            <a href="javascript:;" v-if="!record.isDefault" @click.stop="onDefault(record)">{{ t('设为默认') }}</a>
            <a href="javascript:;" @click.stop="onDelete(record)">{{ t('删除') }}</a>
          </a-space>
        </template>


      </template>
      <!-- <template #expandedRowRender="{ record, index, indent, expanded }">
        333
      </template> -->
    </a-table>

  </a-modal>

</template>

<script lang="ts" setup>
import { message, Modal, type FormInstance } from 'ant-design-vue'

import { useCardStore } from '@/store/card'

import {
  getWinsLayoutApi, // 27.  窗口布局列表
  addOrUpdateWinsLayoutApi, // 28.  添加或者更新窗口布局信息
  deleteWinsLayoutApi // 29.  删除窗口布局
} from '@/api/meg'

const { t } = useI18n()

const cardStore = useCardStore()

const layoutList = ref<any[]>([])
const curLayoutId = ref<string>('')
const curLayoutObj = ref<any>({})

getData(true)

// 最新：修改时要的，否则curLayoutObj.value没改，名称不是最新的
// 一开始要获取到默认的布局，后来添加和修改布局后，不用再设置为默认布局
async function getData(getDefalut: boolean = false) {
  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.id // 用户id
  const params = {
    userId,
  }
  const { code, data } = await getWinsLayoutApi(params)
  if (code === 200) {
    layoutList.value = []
    data?.layouts_info?.forEach((item: any) => {
      const obj = {
        id: item.id,
        layoutName: item.layout_name,
        isDefault: item.is_default,
        layoutInfo: item.layout_info,
      }
      if (getDefalut && obj.layoutName === data.default_layout) {
        curLayoutId.value = obj.id
        curLayoutObj.value = obj
        cardStore.setCurLayoutData(obj)
      }
      if (item.is_default) {
        layoutList.value.unshift(obj)
      } else {
        layoutList.value.push(obj)
      }
    })
    // 如果没有默认的布局，就取第一个布局为当前布局
    if (layoutList.value.length && !curLayoutId.value) {
      const obj = layoutList.value[0]
      curLayoutObj.value = obj
      curLayoutId.value = obj.id
      cardStore.setCurLayoutData(obj)
    }
  }

}

function ecgeoggfpList(item: any) {
  const list: any = []
  if (item.isEcg) {
    list.push('ECG')
  }
  if (item.isEog) {
    list.push('EOG')
  }
  if (item.isGfp) {
    list.push('GFP')
  }
  return list
}

// 弹窗相关
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const modalType = ref<string>('')

// 弹窗标题
const modalTitle = computed(() => {
  return {
    add: t('新增布局'),
    edit: t('修改布局'),
  }[modalType.value]
})

const formRef = ref<FormInstance>()
const form = reactive<any>({
  layoutName: '',
  isDefault: false,
})
const rules = {
  layoutName: [
    { required: true, message: t('请填写布局名称') },
  ],
}

const layoutData = ref<any>({})
let isWaiting = false


// 点击按钮
async function showModal(type: string) {
  visible.value = true
  modalType.value = type

  nextTick(() => {
    if (type === 'add') {
      form.layoutName = ''
      form.isDefault = false
    }
    if (type === 'edit') {
      form.layoutName = curLayoutObj.value.layoutName

      // 因为修改了默认的布局，当前的不一定是默认的，所以要从layoutList里找最新的
      const target = layoutList.value.find((f: any) => f.id === curLayoutId.value)
      form.isDefault = target ? target.isDefault : curLayoutObj.value.isDefault
    }
  })

  // console.log('1 :>> ', new Date().getTime());
  cardStore.setIsCollecting(true)
  isWaiting = true

  // nextTick(()=>{
  // console.log('3 :>> ', new Date().getTime());
  // })

  // 假设这里有个逻辑判断何时结束收集，如等待一个延时或事件
  await new Promise(resolve => setTimeout(resolve, 500)); // 示例延时0.5秒

  cardStore.setIsCollecting(false)
  isWaiting = false

  layoutData.value = cardStore.layoutData

  // console.log('layoutData.value :>> ', layoutData.value);
  // 收集完毕，可以在这里处理收集到的数据
  // console.log('Collected data:', cardStore.layoutData)

}


const emit = defineEmits(['changeLayout'])

// 修改布局
function changeLayout() {
  curLayoutObj.value = layoutList.value.find((item: any) => item.id === curLayoutId.value)
  cardStore.setCurLayoutData(curLayoutObj.value)
  emit('changeLayout', curLayoutObj.value)
}


// 确定弹窗
async function modalOk() {
  if (isWaiting) {
    return
  }
  // if (!layoutData.value) {
  //   layoutData.value = cardStore.layoutData
  // }
  // console.log('layoutData.value :>> ', layoutData.value);
  // return
  formRef.value.validate().then(async values => {
    const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.id // 用户id
    const params: any = {
      userId,
      layoutName: form.layoutName,
      isDefault: form.isDefault,
      layoutInfo: layoutData.value
    }
    if (modalType.value === 'edit') {
      params.id = curLayoutObj.value.id
    }
    loading.value = true
    const { code, msg } = await addOrUpdateWinsLayoutApi(params)
    loading.value = false
    if (code === 200) {
      message.success(msg)
      getData(false) // 确定修改后，要更新列表，但不把当前布局改成默认的布局，而是保持现在已选的布局
      modalCancel()
    }
  })
}

// 取消弹窗
function modalCancel() {
  visible.value = false
  loading.value = false
  modalType.value = ''
  formRef.value.resetFields()
}

// 布局管理弹窗相关
const settingVisible = ref<boolean>(false)
const tableColumns = [
  {
    title: t('布局名称'),
    dataIndex: 'layoutName',
    width: 120,
  },
  {
    title: t('布局信息'),
    dataIndex: 'layoutInfo',
  },
  {
    title: t('通道信息'),
    dataIndex: 'channels',
  },

  {
    title: t('操作'),
    dataIndex: 'operation',
    width: 120,
  }
]
const selectedRowKeys = ref<string[]>([])

// 点击按钮
async function showSettingModal() {
  settingVisible.value = true
  // console.log('layoutList :>> ', layoutList.value);
}

// 选择行
function selectTable(rowKeys: string[], rows: any[]) {
  selectedRowKeys.value = rowKeys
}


// 设置为默认
async function onDefault(record: any) {
  const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.id // 用户id
  const params: any = {
    id: record.id,
    userId,
    layoutName: record.layoutName,
    layoutInfo: record.layoutInfo,
    isDefault: true,
  }
  loading.value = true
  const { code, msg } = await addOrUpdateWinsLayoutApi(params)
  loading.value = false
  if (code === 200) {
    message.success(t('设置成功'))
    getData()
  }
}


// 删除
function onDelete(record: any) {
  Modal.confirm({
    title: t('删除'),
    content: t('确认删除')+`【${record.layoutName}】？`,
    okType: 'danger',
    okText: t('删除'),
    async onOk() {
      const params = {
        id: record.id,
      }
      const { code, msg } = await deleteWinsLayoutApi(params)
      if (code === 200) {
        message.success(msg)
        getData()
      }
    },
  })
}


// 布局管理的确定弹窗
async function settingModalOk() {
  settingModalCancel()
}

// 布局管理的取消弹窗
function settingModalCancel() {
  settingVisible.value = false
  loading.value = false
  selectedRowKeys.value = []
}

</script>

<style lang="less" scoped>
.form-list {

  .ant-form-item {
    margin-bottom: 8px;
  }

}

.btn-list {
  display: flex;
  justify-content: space-between;
  font-size: 12px;

  .item {
    height: 30px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    cursor: pointer;
    position: relative;
    border-radius: 4px;
    border: var(--border-card);
    color: var(--color-t2);
    background: var(--color-bg-btn);

    &:nth-of-type(3n) {
      margin-right: 0;
    }

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .anticon {
      margin-right: 3px;
    }
  }
}

.form-box {
  min-height: 35px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid var(--color-01);
  background: var(--color-bg-gray);

  >.tag {
    display: inline-block;
    white-space: normal;
    max-width: 265px;
    margin-right: 2px;
    margin-bottom: 2px;
  }
}

.table {
  .tag {
    display: inline-block;
    white-space: normal;
    max-width: 330px;
    margin-right: 2px;
    margin-bottom: 2px;
  }
  .default-tag {
    margin: 0;
  }
}
</style>
