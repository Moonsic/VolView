<template>
  <div class="tab-component">

    <div class="back-button" :class="{ 'before': props.tab === 1 }" @click="goBack">
      <div class="inner" :title="t('返回列表')">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none">
          <path d="M7.97502 4.94165L2.91669 9.99998L7.97502 15.0583" stroke="currentColor" stroke-width="1.66667"
            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17.0833 10H3.05835" stroke="currentColor" stroke-width="1.66667" stroke-miterlimit="10"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <div class="tab-item" v-for="(item, index) in tabList" :key="index"
      :class="{ 'active': props.tab === item.id, 'before': item.before, 'after': item.after, 'last': index === tabList.length - 1 }"
      @click="changeTab(item, index)">

      <div class="inner">
        <div class="inner2">
          {{ item.name }}
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'
const { t } = useI18n()
const userStore = useUserStore()

const props = defineProps({
  tab: {
    type: Number,
    default: 1,
  },
  megId: {
    type: String,
    default: '',
  },
  subjectId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['change'])

// 别名
const { versionType } = storeToRefs(userStore)

// 定义当前激活的标签索引
const tab = ref(1)

// 定义标签数组 12345
const tabList = ref<any[]>([
  { id: 1, name: t('溯源发起'), value: 'startAnalysis' },
  { id: 5, name: t('结果查看'), value: 'viewResults' },
  { id: 3, name: t('结构像复核'), value: 'reviewMri' },
  { id: 2, name: t('脑磁图复核'), value: 'reviewMeg' },
  { id: 6, name: '', value: '' }, // 最后一个空白的点击无效
])

// 统一的响应式更新函数
// 同时监听用户类型和标签变化
watch([() => versionType.value, () => props.tab], () => {
  // console.log('versionType.value, props.tab :>> ', versionType.value, props.tab);
  // 根据用户类型确定标签结构
  if (versionType.value === 'doctor') {
    tabList.value = [
      { id: 1, name: t('溯源发起'), value: 'startAnalysis' },
      { id: 5, name: t('结果查看'), value: 'viewResults' },
      { id: 3, name: t('结构像复核'), value: 'reviewMri' },
      { id: 2, name: t('脑磁图复核'), value: 'reviewMeg' },
      { id: 6, name: '', value: '' }, // 最后一个空白的点击无效
    ]
  } else {
    tabList.value = [
      { id: 1, name: t('溯源发起'), value: 'startAnalysis' },
      { id: 5, name: t('结果查看'), value: 'viewResults' },
      { id: 3, name: t('结构像复核'), value: 'reviewMri' },
      { id: 2, name: t('脑磁图复核'), value: 'reviewMeg' },
      { id: 4, name: t('脑电图复核'), value: 'reviewEeg' },
      { id: 6, name: '', value: '' }, // 最后一个空白的点击无效
    ]
  }

  // 确保当前激活标签有效
  nextTick(() => {
    tabList.value.forEach(item => {
      item.before = false
      item.after = false
    })
    const index = tabList.value.findIndex(item => item.id === props.tab)
    // 找不到对应标签或无效索引时跳过设置
    if (index === -1) return
    // 设置前一个标签的before状态
    if (index >= 1) {
      tabList.value[index - 1].before = true
    }
    // 设置后一个标签的after状态（确保不是最后一个元素）
    if (index < tabList.value.length - 1) {
      tabList.value[index + 1].after = true
    }
  })
}, { immediate: true })


// 切换标签的方法
function changeTab(item: any, index: number) {
  // console.log('index :>> ', index)
  // 最后一个空白的点击无效
  if (index === tabList.value.length - 1) {
    return
  }
  tab.value = item.id

  // emit('change', item.value)

  router.push({
    path: item.value,
    query: {
      subjectId: props.subjectId,
      megId: props.megId,
    }
  })
}


const router = useRouter()
function goBack() {
  router.push({
    path: 'patientList',
  })
  toggleFullScreen()
}

// 检查是否处于全屏状态
function checkFullScreen() {
  return document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;
};

// 切换全屏状态
function toggleFullScreen() {
  if (checkFullScreen()) {
    // 已是全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};


// 暴露方法
defineExpose({
})

</script>

<style lang="less" scoped>
@height: 58px;

.tab-component {
  // width: 566px;
  height: @height;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--tab-component-bg);
  background: var(--color-page-bg);
  font-size: 16px;
  font-size: 18px;
  font-weight: 500;
}

.tab-item {
  height: @height;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  background: var(--tab-component-bg);

  .inner {
    height: @height;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;

    .inner2 {
      height: @height - 10;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px;
      border-radius: 8px;
      padding: 0px 16px;
      background: var(--tab-component-bg);
    }

  }


  &:hover {
    .inner2 {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  &.active {
    color: var(--tab-component-bg);

    .inner {
      border-radius: 10px 10px 0 0;

      background: var(--color-page-bg);
      transform: translateY(4px);

      .inner2 {
        background-color: #fff;
        transform: translateY(-1px);
      }
    }
  }

  &.last {
    border-radius: 0 8px 8px 0;
    width: 16px;

    .inner {
      padding: 0;

      .inner2 {
        padding: 0;

      }
    }
  }

  &.before {
    border-radius: 0 0 8px 0;
  }

  &.after {
    border-radius: 0 0 0 8px;
  }

  &.after.last {
    border-radius: 0 8px 8px 8px;
  }

}

.eyecare {
  .tab-item.active .inner .inner2 {
    background-color: var(--eyecare-bg-light);
  }
}

.back-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  background-color: var(--tab-component-bg);

  .inner {
    width: 30px;
    height: 30px;
    margin: 0 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: rgba(255, 255, 255, 0.4);

      svg {
        transform: scale(1.2);
      }
    }
  }

  &.before {
    border-radius: 8px 0 8px 8px;
  }

}

// 暗黑模式下降低背景的亮度
.dark {
  .tab-component {
    filter: brightness(96%);
  }
}
</style>
