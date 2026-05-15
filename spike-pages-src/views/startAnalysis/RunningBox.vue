<template>
  <div class="running-box">
    <div>
      <div>{{ t('开始时间') }}：</div>
      <div>{{ target.start_time }}</div>
    </div>
    <div>
      <div>{{ t('已执行时间') }}：</div>
      <div>{{ target.timeDiff }}</div>
    </div>
    <div>
      <div>{{ t('预估执行时间') }}：</div>
      <div>{{ target.planTime }}</div>
    </div>
  </div>

</template>

<script lang="ts" setup>

const { t } = useI18n()

const props = defineProps({
  megId: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => { },
  },
})

const target = ref({
  ...props.data,
  timeToDate: parseTime(props.data.start_time),
  timeDiff: '',
  planTime: '-'
})

let timerId: any = null // 模拟停止更新任务执行时间

watch(() => props.data, () => {
  // 保存当前的 timeDiff 和 planTime，避免丢失
  const oldTimeDiff = target.value.timeDiff
  const oldPlanTime = target.value.planTime

  target.value = {
    ...props.data,
    timeToDate: parseTime(props.data.start_time),
    timeDiff: oldTimeDiff,
    // 如果新数据有 planTime 则更新，否则沿用旧值
    planTime: props.data.planTime !== undefined ? (formatTimeDiff(props.data.planTime) || '-') : oldPlanTime
  }

  stopTaskTimes()
  updateTaskTimes()
  // 使用同一个定时器来更新所有任务的执行时间
  timerId = setInterval(updateTaskTimes, 1000)
}, {
  immediate: true,
  deep: true
})


onUnmounted(() => {
  stopTaskTimes()
});


// 函数：更新任务执行时间
function updateTaskTimes() {
  const now = new Date();

  const diff = Math.ceil((now - target.value.timeToDate) / 1000)
  const formattedTime = formatTimeDiff(diff)
  target.value = {
    ...target.value,
    timeDiff: formattedTime
  }
}

function stopTaskTimes() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}


// 函数：将时间字符串转换为 Date 对象
function parseTime(timeString: string): Date {
  const date = new Date(timeString.replace(/-/g, '/'))
  if (isNaN(date.getTime())) {
    console.error(`Invalid time string: ${timeString}`)
    return new Date(0)
  }
  return date
}

// 函数：格式化时间差为 HH:MM:SS 格式
function formatTimeDiff(diff: number) {
  if (!diff) {
    return '-'
  }
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = Math.floor(diff % 60)

  return [hours, minutes, seconds]
    .map(num => String(num).padStart(2, '0'))
    .join(':')
}
</script>

<style lang="less" scoped>
.running-box {
  position: absolute;
  bottom: -150px;
  z-index: -1;
  width: 198px;
  height: 171px;
  padding: 22px 8px 8px 12px;
  background: var(--color-primary-005);
  border-radius: 12px;
  font-size: 14px;
  cursor: default;

  >div {
    margin-top: 8px;

    >div:nth-child(1) {
      color: var(--color-t5);
    }

    >div:nth-child(2) {
      color: var(--color-t2);
    }
  }
}
</style>
