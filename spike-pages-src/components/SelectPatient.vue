<template>
  <div class="select-patient-component flex-start mr8" :style="{ width: isEnglish ? '350px' : '310px' }">
    <span>{{ t('选择患者') }}：</span>

    <AntSelect class="select-style" v-model:value="subjectId" :open="open"
      @dropdownVisibleChange="handleDropdownVisibleChange" popupClassName="select-patient-dropdown"
      :placeholder="t('请先选择患者')" :listHeight="360" showSearch optionFilterProp="label" :dropdownMatchSelectWidth="false"
      @change="changePatientList">
      <a-select-option v-for="(item) in tableData" :value="item.subjectId" :key="item.subjectId"
        :label="item.searchLabel">
        <div class="option-item" :class="statusColor[item.pipelineStatus]">
          {{ item.searchLabel }}
        </div>
      </a-select-option>

      <template #suffixIcon>
        <span class="anticon" @click.stop="toggleDropdown">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 8" fill="none">
            <path
              d="M9.79623 0.571427L2.20377 0.571426C1.34461 0.571426 0.885432 1.58335 1.45119 2.22993L5.24742 6.56848C5.64583 7.02381 6.35417 7.02381 6.75258 6.56848L10.5488 2.22993C11.1146 1.58335 10.6554 0.571427 9.79623 0.571427Z"
              fill="currentColor" />
          </svg>
        </span>
      </template>
    </AntSelect>

  </div>
</template>

<!--1. 用 :options="tableData" :fieldNames="{ label: 'searchLabel', value: 'subjectId' }"的方式 -->

<!-- <AntSelect class="select-style" v-model:value="subjectId" :options="tableData"
      :fieldNames="{ label: 'searchLabel', value: 'subjectId' }" popupClassName="select-patient-dropdown"
      placeholder="请先选择患者" :listHeight="360" showSearch optionFilterProp="searchLabel" @change="changePatientList">
      <template #suffixIcon>
        <span class="anticon">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 12 8" fill="none">
            <path
              d="M9.79623 0.571427L2.20377 0.571426C1.34461 0.571426 0.885432 1.58335 1.45119 2.22993L5.24742 6.56848C5.64583 7.02381 6.35417 7.02381 6.75258 6.56848L10.5488 2.22993C11.1146 1.58335 10.6554 0.571427 9.79623 0.571427Z"
              fill="currentColor" />
          </svg>
        </span>
      </template>
</AntSelect> -->


<!-- 2. 用 <a-select-option>的方式-->


<!-- 旧：目前用 :options="tableData" :fieldNames="{ label: 'searchLabel', value: 'subjectId' }" showSearch optionFilterProp="searchLabel"的方式是最简单的 -->
<!-- 复杂的方式就是展示的时候用<a-select-option v-for>，搜索时用:filterOption="filterOption"和:dataRef="item"，也可以用label  -->

<!-- <a-select class="select-style" v-model:value="subjectId" popupClassName="select-patient-dropdown"
      placeholder="请先选择患者" :listHeight="360" showSearch optionFilterProp="label" @change="changePatientList">
      <a-select-option v-for="(item) in tableData" :value="item.subjectId" :key="item.subjectId"
        :label="`${item.megId  ?? ''}${item.subjectName  ?? ''}`" :dataRef="item">
        <div class="option-item">
          {{ item.megId }}
          <span class="ml2" v-if="item.subjectName"> ( {{ item.subjectName }} )</span>
        </div>
      </a-select-option>
    </a-select> -->

<!-- 不用:getPopupContainer="(triggerNode: any) => triggerNode.parentNode"的话，就用 popupClassName="select-patient-dropdown"，但不能写在<style scoped>里， -->
<!-- 用:getPopupContainer="(triggerNode: any) => triggerNode.parentNode"的话，父级就不能有overflow: hidden， -->

<script lang="ts" setup>
// 因为要改<template #suffixIcon>的样式，所以用AntSelect
import { Select as AntSelect } from 'ant-design-vue'

// import {
//   getAllSubjectBaseInfoApi, // 7. 获取所有患者列表
// } from '@/api/subject'

import { storeToRefs } from 'pinia' // 引入 storeToRefs 便于响应式解构
import { usePatientStore } from '@/store/patient' // 引入你刚创建的 store

const patientStore = usePatientStore(); // 实例化 store
const { patientList: tableData } = storeToRefs(patientStore); // 使用 storeToRefs 使解构后的数据保持响应性

const { t, locale } = useI18n()

const isEnglish = computed(() => locale.value === 'en-US')

const route = useRoute()
const router = useRouter()

// const tableData = ref<any[]>([]) // 列表

// 初始化把url的megId和subjectId赋值给当前的megId和subjectId
const megId = ref<string>(String(route.query.megId || ''))
const subjectId = ref<string>(String(route.query.subjectId || ''))

const curSubject = ref<any>({
  megId: megId.value,
  subjectId: subjectId.value,
  searchLabel: megId.value
}) // 默认患者

// 初始化一个默认患者，就不会闪烁了
patientStore.setDefaultPatient(curSubject.value)

onMounted(async () => {
  // 这里调用 store 中的方法，它会自动处理缓存逻辑
  await patientStore.fetchPatientList()
})

// const pipelineStatus = ref<number>(null) // -2已终止，-1已失败，0进行中，1溯源成功，null 未开始
// 获取meg列表
// async function getAllMegList() {
//   const { code, data } = await getAllSubjectBaseInfoApi({})
//   if (code === 200) {
//     tableData.value = data?.map((item: any) => {
//       return {
//         megId: item.megId,
//         subjectId: item.subjectId,
//         pipelineStatus: item.pipelineStatus,
//         coregId: item.coregId,
//         searchLabel: item.subjectName ? `${item.megId} ( ${item.subjectName} )` : `${item.megId}`,
//       }
//     })
//   }
// }

const emit = defineEmits(['change'])

// 修改患者
function changePatientList(e: string) {
  subjectId.value = e
  const target = tableData.value.find(f => f.subjectId === e)
  if (target) {
    curSubject.value = target
    megId.value = target.megId

    // 每次切换，把url改一下，下次刷新页面就不是旧的url了
    router.push({
      path: route.path,
      query: {
        subjectId: subjectId.value,
        megId: megId.value,
      }
    })

    nextTick(() => {
      emit('change', target)
    })
  }
}

const open = ref(false) // 打开下拉框

// 切换下拉框状态
const toggleDropdown = () => {
  open.value = !open.value
}

// 下拉框状态改变，不能删
const handleDropdownVisibleChange = (visible: boolean) => {
  open.value = visible
}

// function filterOption(input: string, option: any) {
//   // // 获取绑定的原始数据对象（关键步骤！）
//   // const dataItem = option.dataRef  || {}
//   // return (
//   //   dataItem.megId?.toLowerCase().includes(input.toLowerCase())  ||
//   //   dataItem.subjectName?.toLowerCase().includes(input.toLowerCase())
//   // )

//   // 获取绑定的原始数据对象（关键步骤！）
//   const label = option.label || ''
//   return (label?.toLowerCase().includes(input.toLowerCase()))
// }

// const pipelineStatus = ref<number>(null) // -2已终止，-1已失败，0进行中，1溯源成功，null 未开始
// 小圆点颜色，null 未开始就不显示小圆点
const statusColor = ref<any>({
  '-2': 'tag-gray',
  '-1': 'tag-red',
  '0': 'tag-yellow',
  '1': 'tag-green',
})

</script>

<style lang="less">
// 改变下拉框打开时的选项样式
.ant-select-dropdown.select-patient-dropdown {
  // display: block !important; // 测试的时候把这个打开就行了
  padding: 4px 2px 4px 4px; // 让滚动条有边距

  .ant-select-item-option {
    padding: 4px 8px;

    .option-item {
      white-space: normal;
      word-break: break-all;

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        margin-right: 5px;
        border-radius: 50%;
        transform: translateY(-2px);
      }

      &.tag-red::before {
        background: var(--color-red);
      }

      &.tag-green::before {
        background: var(--color-green);
      }

      &.tag-yellow::before {
        background: var(--color-yellow);
      }

      &.tag-gray::before {
        background: var(--color-t5);
      }
    }
  }


  // 下拉框的滚动条要显示出来，否则数据太多滑的太麻烦
  .rc-virtual-list-holder {
    padding-right: 2px; // 让滚动条有边距

    &::-webkit-scrollbar {
      width: 8px;
    }
  }

}
</style>

<style lang="less" scoped>
.select-patient-component {
  width: 310px;

  >span {
    font-size: 16px;
    font-weight: 500;
  }
}

// 必须要加上 :getPopupContainer="(triggerNode: any) => triggerNode.parentNode"，否则会在body下，无法生效
:deep(.select-style) {
  width: 230px;

  .ant-select-selector {
    color: var(--color-primary);
    background: var(--color-primary-01) !important; // 背景要加!important
    border: var(--border-transparent);
    font-size: 16px;
    height: 40px; // 高一点。默认32px


    // 搜索框的高度和文字大小
    .ant-select-selection-search {
      .ant-select-selection-search-input {
        height: 40px;
        font-size: 16px;
      }
    }

    .ant-select-selection-item {
      white-space: normal;
      word-break: break-all;
      line-height: 40px; // 高一点。默认32px

      &::after {
        display: none;
      }
    }

  }

  // 选择患者的下拉箭头颜色加深
  .ant-select-arrow {
    color: var(--color-primary);
  }
}
</style>
