<template>
<div class="button" @click="onAdd">新增</div>
  <Teleport to="body">
    <div class="msg-list" :class="{ 'fold-list': showType === 'fold' }">
      <div class="buttons" v-if="msgList.length">
        <!-- <div class="button" @click="onAdd">新增</div> -->
        <div class="button" v-if="msgList.length >= 2 && showType === 'list'" @click="foldAll">收起</div>
        <div class="button" v-if="msgList.length >= 2 && showType === 'fold'" @click="unfoldAll">展开</div>
        <div class="button close-all" @click="closeAll">清空</div>
      </div>
      <TransitionGroup name="fade" tag="div" class="container">
        <div class="item" v-for="(item, index) in msgList" :key="item.id">

          <CheckCircleOutlined v-if="item.type === 'success'" class="left-icon color-green text-24" />
          <CloseCircleOutlined v-if="item.type === 'error'" class="left-icon color-red text-24" />
          <div class="title">{{ item.title }}</div>
          <div class="desc" v-for="(item2, index2) in item.desc" :key="index2">{{ item2 }}</div>
          <close-outlined class="close" @click="closeItem(item, index)" />
          <div class="time">{{ item.timeText }}</div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>

</template>

<script lang="ts" setup>

import { getRandomId } from '@u/utils'
import { useWebSocket } from '@/hooks/useWebSocket';

const userId = JSON.parse(localStorage.getItem('userInfo') || '{}')?.id // 用户id

const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}notification/${userId}`;
const { connection } = useWebSocket(wsUrl);

// 监听最后一条消息
// 更新UI或处理新消息
watch(connection.lastMessage, (message) => {
  // console.log('message :>> ', message);
  if (message?.code) {
    if (message.code === 200) {
      openNotification('success', message)
    } else {
      openNotification('error', message)
    }
  }
});

// 收到消息后，打开通知框
function openNotification(type: string, message: any) {
  // websocket描述根据\n换行
  const msgList: string[] = message.msg.split('\n')

  addNewMsg({
    type: type,
    title: message.title,
    desc: msgList
  })
};

const msgList = ref<any[]>([
  // { id: 1, title: '标题1', type: 'success', desc: ['凄凄切切群群群群群群群群群群群群群群群凄凄切切群群群群群群群群'], time: '' },
  // { id: 2, title: '标题2', type: 'error', desc: 'lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  // { id: 3, title: '标题3', type: 'success', desc: 'lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  // { id: 4, title: '标题4', type: 'success', desc: 'lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  // { id: 5, title: '标题5', type: 'success', desc: 'lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  // { id: 6, title: '标题6', type: 'success', desc: 'lorem ipsum dolor sit amet, consectetur adipiscing elit' },
])

// 新增通知
function addNewMsg(content: any) {
  // console.log('content :>> ', content);
  const now = new Date()

  msgList.value.unshift({
    id: getRandomId(),
    type: content.type,
    title: content.title,
    desc: content.desc,
    time: now,
    timeText: getTimeText(now)[0]
  })

  nextTick(() => {
    if (showType.value === 'fold') {
      foldAll()
    } else {
      unfoldAll()
    }
  })
}

function onAdd() {
  // const i = Math.round(Math.random() * msgList.value.length)
  const now = new Date()
  msgList.value.unshift({
    id: getRandomId(),
    type: 'success',
    title: '标题' + new Date().getTime(),
    desc: ['lorem'],
    time: now,
    timeText: getTimeText(now)[0]
  })


  nextTick(() => {
    if (showType.value === 'fold') {
      foldAll()
    } else {
      unfoldAll()
    }
  })
}


function closeItem(item: any, index: number) {
  msgList.value.splice(index, 1)

  setTimeout(() => {
    if (showType.value === 'fold') {
      foldAll()
    } else {
      unfoldAll()
    }
  }, 320)
}

function closeAll() {
  msgList.value = []
}


const showType = ref('fold') // list, fold，默认折叠吧

// 点击折叠
function foldAll() {
  showType.value = 'fold'
  const items = document.querySelectorAll('.msg-list .item')
  items.forEach((item: any, index) => {
    item.style.position = 'absolute'
    item.style.top = `${index * 5 + 30}px`
    item.style.right = '0'
    item.style.zIndex = 1000 - index
    item.style.boxShadow = '0 3px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 3px -2px rgba(0, 0, 0, 0.06), 0 4px 14px 4px rgba(0, 0, 0, 0.02)';
    item.style.border = '1px solid #eee';
    item.style.width = (350 - index * 10) < 0 ? '0' : (350 - index * 10) + 'px'

    // console.log('item.style.width :>> ', item.style.width);
    if (index !== 0) {
      item.style.height = '65px'; // 65正好看不到第二行
      // item.classList.add('text-ellipsis')
    } else {
      item.style.height = 'auto'; // 65正好看不到第二行
    }
    // item.classList.add('folded')
  });
}

// 点击展开

function unfoldAll() {
  showType.value = 'list'
  const items = document.querySelectorAll('.msg-list .item')
  items.forEach((item: any, index) => {
    item.style.position = 'relative'
    item.style.top = ''
    item.style.right = ''
    item.style.boxShadow = '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
    item.style.border = 'none';
    item.style.width = '350px'
    item.style.height = 'auto';

    // item.classList.remove('text-ellipsis')
    // item.classList.remove('folded')
    // item.classList.add('unfolded')
  });
}

onMounted(() => {
  // 初始化时展开所有通知，默认折叠吧
  foldAll()
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})

// // 监听 msgList 的变化，当有值时启动定时器
// watch(msgList, (newValue) => {
//   if (newValue.length > 0) {
//     startTimer();
//   } else {
//     stopTimer();
//   }
// });

let timer: any = null;

function startTimer() {
  timer = setInterval(updateTime, 60000) // 每60秒更新一次时间
}

function stopTimer() {
  clearInterval(timer);
}

function updateTime() {
  msgList.value?.forEach(item => {
    const [text, diffSeconds] = getTimeText(item.time)
    item.timeText = text
    item.diffSeconds = diffSeconds
  });

  msgList.value = msgList.value.filter(item => item.diffSeconds < 60 * 3) // 只保留3分钟内的通知

  // 重新渲染模版中的显示
  // msgList.value = [...msgList.value]
}

function getTimeText(time: any) {
  if (!time) {
    return ''
  }
  const now = new Date()
  const itemTime = new Date(time)
  const diffSeconds = Math.floor((now.getTime() - itemTime.getTime()) / 1000)
  let text = ''
  if (diffSeconds < 60) {
    text = '刚刚'
  } else {
    const minutes = Math.floor(diffSeconds / 60)
    text = `${minutes}分钟前`
  }
  return [text, diffSeconds]
}

</script>
<style lang="less" scoped>
.msg-list {
  position: fixed;
  top: 76px;
  right: 8px;
  z-index: 999;

  .buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;

    .button {
      margin-left: 6px;
      margin-right: 2px;
      padding: 5px 10px;
      font-size: 12px;
      background: rgba(128, 128, 128, 0.7);
      color: #fff;
      border-radius: 10px;
      line-height: 1;
      cursor: pointer;

      &:hover {
        background: rgba(128, 128, 128, 0.9);
      }
    }
  }

  .item {
    position: relative;
    width: 350px;
    padding: 12px 16px;
    margin-bottom: 8px;
    background: #fff;
    font-size: 14px;
    border-radius: 4px;
    // box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    // transition: all 0.3s ease-in-out;
    box-sizing: border-box;

    overflow: hidden;

    &.folded {}

    &.unfolded {}

    .left-icon {
      position: absolute;
      top: 12px;
      left: 12px;
    }

    .title {
      font-size: 16px;
      margin-left: 30px;
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .desc {
      margin-top: 8px;
      margin-left: 30px;
      color: rgba(0, 0, 0, 0.88);
      word-break: break-all;
      // white-space: nowrap;
      // text-overflow: ellipsis;
    }

    .time {
      position: absolute;
      top: 14px;
      right: 38px;
      color: var(--color-t5);
      font-size: 12px;

    }

    .close {
      position: absolute;
      top: 15px;
      right: 12px;
      color: var(--color-t5);
      transition: all .2s;

      &:hover {
        color: var(--color-t2);
      }
    }
  }

}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.fade-leave-active {
  position: absolute;
}
</style>