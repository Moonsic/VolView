<template>
  <a-modal v-model:open="visible" :confirm-loading="loading" :title="t('发起共注册')" :maskClosable="false"
    :destroyOnClose="true" @ok="modalOk" @cancel="modalCancel">
    <a-form ref="formRef" :model="form" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">

      <a-form-item :label="t('患者编号')" name="megId">
        <a-input v-model:value="form.megId" allowClear disabled :placeholder="t('请输入')" size="large" />
      </a-form-item>
      <a-form-item :label="t('T1结构像')" name="t1View">
        <a-select v-model:value="form.t1View" :options="t1ViewList" :loading="loadingStates.t1View" allowClear
          :placeholder="t('请选择')" size="large" optionLabelProp="fullLabel" popupClassName="golbal-text-wrap-dropdown" />
      </a-form-item>

      <!-- 非必填项使用懒加载 -->
      <a-form-item :label="t('T2结构像')" name="t2View">
        <a-select v-model:value="form.t2View" :options="t2ViewList" :loading="loadingStates.t2View" allowClear
          :placeholder="t('请选择')" size="large" popupClassName="golbal-text-wrap-dropdown"
          @dropdown-visible-change="(open) => handleDropdownVisibleChange(open, 'anat', t2ViewList)" />
      </a-form-item>

      <a-form-item :label="t('PET')" name="pet">
        <a-select v-model:value="form.pet" :options="petList" :loading="loadingStates.pet" allowClear
          :placeholder="t('请选择')" size="large" popupClassName="golbal-text-wrap-dropdown"
          @dropdown-visible-change="(open) => handleDropdownVisibleChange(open, 'pet', petList)" />
      </a-form-item>

      <a-form-item :label="t('CT')" name="ct">
        <a-select v-model:value="form.ct" :options="ctList" :loading="loadingStates.ct" allowClear
          :placeholder="t('请选择')" size="large" popupClassName="golbal-text-wrap-dropdown"
          @dropdown-visible-change="(open) => handleDropdownVisibleChange(open, 'ct', ctList)" />
      </a-form-item>

      <!-- <a-form-item :label="t('Mask')" name="mask">
        <a-select v-model:value="form.mask" :options="maskList" :loading="loadingStates.mask" allowClear
          :placeholder="t('请选择')" size="large"
          @dropdown-visible-change="(open) => handleDropdownVisibleChange(open, 'mask', maskList)" />
      </a-form-item>

      <a-form-item :label="t('Lt_hemi')" name="ltHemi">
        <a-select v-model:value="form.ltHemi" :options="ltHemiList" :loading="loadingStates.ltHemi" allowClear
          :placeholder="t('请选择')" size="large"
          @dropdown-visible-change="(open) => handleDropdownVisibleChange(open, 'ltHemi', ltHemiList)" />
      </a-form-item>

      <a-form-item :label="t('Rt_hemi')" name="rtHemi">
        <a-select v-model:value="form.rtHemi" :options="rtHemiList" :loading="loadingStates.rtHemi" allowClear
          :placeholder="t('请选择')" size="large"
          @dropdown-visible-change="(open) => handleDropdownVisibleChange(open, 'rtHemi', rtHemiList)" />
      </a-form-item> -->

    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { message, type FormInstance } from 'ant-design-vue'
import { startCoregApi } from '@/api/coreg'
import { getFileListApi } from '@/api/file'

const { t } = useI18n()

const props = defineProps({
  megId: {
    type: String,
    default: ''
  },
  subjectId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['success'])

const formRef = ref<FormInstance>()

const visible = ref<boolean>(false)
const loading = ref<boolean>(false)

// 加载状态管理
const loadingStates = reactive({
  t1View: false,
  t2View: false,
  pet: false,
  ct: false,
  mask: false,
  ltHemi: false,
  rtHemi: false
})

// 标记数据是否已加载
const dataLoaded = reactive({
  t1View: false,
  t2View: false,
  pet: false,
  ct: false,
  mask: false,
  ltHemi: false,
  rtHemi: false
})

// 数据
interface IForm {
  subjectId: string
  megId: string
  t1View: string
  t2View: string
  pet: string
  ct: string
  mask: string
  ltHemi: string
  rtHemi: string
}

const form = reactive<IForm>({
  subjectId: null,
  megId: null,
  t1View: null,
  t2View: null,
  pet: null,
  ct: null,
  mask: null,
  ltHemi: null,
  rtHemi: null
})

const rules = {
  t1View: [
    { required: true, message: t('请选择T1结构像') },
  ],
  // 其他字段暂时注释掉验证规则
}

const t1ViewList = ref<any[]>([])
const t2ViewList = ref<any[]>([])
const petList = ref<any[]>([])
const ctList = ref<any[]>([])
const maskList = ref<any[]>([])
const ltHemiList = ref<any[]>([])
const rtHemiList = ref<any[]>([])

// 显示弹窗 - 只加载必填项数据
function showModal() {
  visible.value = true
  nextTick(() => {
    formRef.value.resetFields()
    form.subjectId = props.subjectId
    form.megId = props.megId

    // 只加载必填项数据（t1View）
    if (!dataLoaded.t1View) {
      loadData('t1View', t1ViewList.value, 't1View')
    }
  })
}

// 处理下拉框可见性变化 - 仅在展开时且未加载数据时加载
function handleDropdownVisibleChange(
  open: boolean,
  folderName: string,
  list: any[]
) {
  // 仅当下拉框展开且数据未加载时才加载数据
  if (open && !dataLoaded[folderName]) {
    loadData(folderName, list, folderName as keyof typeof dataLoaded)
  }
}

// 加载数据
async function loadData(folderName: string, list: any[], field: keyof typeof dataLoaded) {

  const params = {
    foldName: `${props.megId}/${folderName}`,
    subjectId: props.subjectId,
    pageNum: 1,
    pageSize: 10000, // 这里不分页，查所有
  }
  // T1: foldName=derivatives/fsprep/chenyulai
  // t1是选择derivatives文件夹下的mgz文件，t2是选择anat文件夹下的nii文件
  if (folderName === 't1View') {
    params.foldName = `derivatives/fsprep/${props.megId}`
  }
  // 标记正在加载
  loadingStates[field] = true
  const { code, data } = await getFileListApi(params)
  loadingStates[field] = false

  if (code === 200) {
    // 标记数据已加载
    dataLoaded[field] = true

    if (folderName !== 't1View') {
      // 只保留nii文件的，有的是.nii.gz文件，用includes
      const niiList = data.records?.filter((item: any) => item.filePath.includes('.nii') || item.filePath.includes('.mgz')) || []
      // 更新列表数据
      list.splice(0, list.length, ...setOptions(niiList || []))
    } else {
      // t1View的需要再选择下一层
      const folderList = data.records?.filter((item: any) => item.name.endsWith('/')) || []
      if (folderList.length) {
        await Promise.all(
          folderList.map((item: any) =>
            loadT1Data(item.filePath, list)
          )
        )
      }

    }

  }

}

async function loadT1Data(filePath: string, list: any[]) {
  // 取文件夹名字做分组名
  const folderName = filePath.split('/').pop()
  const params = {
    foldName: filePath + '/mri',
    subjectId: props.subjectId,
    pageNum: 1,
    pageSize: 10000, // 这里不分页，查所有
  }
  const { code, data } = await getFileListApi(params)
  if (code === 200) {
    // 只保留nii文件的，有的是.nii.gz文件，用includes
    const niiList = data.records?.filter((item: any) => item.filePath.includes('T1_target.mgz')) || []
    // 改成追加
    list.push({
      label: folderName,
      options: niiList.map((item: any) => {
        return {
          label: item.name,
          value: item.filePath,
          fullLabel: `${folderName}/${item.name}`,
        }
      })
    })
  }
}

// 确定弹窗
function modalOk() {
  formRef.value.validate().then(async values => {
    const params = {
      megId: props.megId,
      t1FilePath: values.t1View,
      t2FilePath: values.t2View,
      petFilePath: values.pet,
      ctFilePath: values.ct,
    }
    loading.value = true
    const { code, msg } = await startCoregApi(params)
    loading.value = false
    if (code === 200) {
      message.success(msg)
      emit('success')
      modalCancel()
    }
  })
}

// 取消弹窗 - 清空所有状态
function modalCancel() {
  visible.value = false
  loading.value = false

  // 清空表单
  formRef.value?.resetFields()

  // 清空所有列表数据
  t1ViewList.value = []
  t2ViewList.value = []
  petList.value = []
  ctList.value = []
  maskList.value = []
  ltHemiList.value = []
  rtHemiList.value = []

  // 重置加载状态标记
  Object.keys(dataLoaded).forEach(key => {
    dataLoaded[key as keyof typeof dataLoaded] = false
  })

  // 重置加载状态
  Object.keys(loadingStates).forEach(key => {
    loadingStates[key as keyof typeof loadingStates] = false
  })
}

// 暴露方法
defineExpose({
  visible,
  showModal
})

function setOptions(list: any[]) {
  return list.map(item => {
    return {
      label: item.name,
      value: item.filePath,
    }
  })
}
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
  .ant-form-item-label>label {
    height: 38px;
  }
}
</style>