<!--
 * @Description  : 返回组件，通常在详情页返回到列表页面时使用
-->
<template>

  <span class="back-component">

    <span class="anticon icon-back mr8" v-if="showArrow" :title="t('返回')" @click="onClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none">
        <path d="M7.97502 4.94165L2.91669 9.99998L7.97502 15.0583" stroke="currentColor" stroke-width="1.66667"
          stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M17.0833 10H3.05835" stroke="currentColor" stroke-width="1.66667" stroke-miterlimit="10"
          stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>

    <span v-if="Array.isArray(displayTitle)" class="inline-flex break-all">
      <span class="main-title">{{ displayTitle[0] }}</span>
      <span class="sub-title">{{ displayTitle[1] }}</span>
    </span>
    <span v-else class="main-title break-all"> {{ displayTitle }}</span>
  </span>

</template>

<script lang="ts" setup>
const { t } = useI18n()
const props = defineProps({
  title: {
    type: [String, Array],
    default: '',
  },
  showArrow: {
    type: Boolean,
    default: true,
  },
  path: {
    type: String,
    default: '',
  },
})

// 使用计算属性处理国际化默认文本
const displayTitle = computed(() => {
  return props.title || t('返回')
})

const router = useRouter()

function onClick() {
  if (props.path) {
    router.push({
      path: props.path,
    })
  } else {
    router.go(-1)
  }
}

</script>

<style lang="less" scoped>
.back-component {
  height: 46px;
  padding-left: 8px;
  padding-right: 36px;
  display: flex;
  align-items: center;
  min-width: 200px;

  .icon-back {
    font-size: 20px;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }

  .main-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-t2);
    white-space: nowrap; // 主标题全显不换行
    align-self: center; // 上下居中
  }

  .sub-title {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-t3);
    align-self: flex-end; // 靠下
  }
}
</style>