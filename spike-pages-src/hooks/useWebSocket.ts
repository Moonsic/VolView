import { ref, onBeforeUnmount } from 'vue'
// import { defineStore } from 'pinia'
import { useWebSocketStore } from '@/store/websocket'

const webSocketStore = useWebSocketStore()
const store = webSocketStore

// export function useWebSocket(url: string, store: ReturnType<typeof defineStore>) {
export function useWebSocket(url: string) {
  const socketRef = ref<WebSocket | null>(null)
  const heartBeatTimer = ref<NodeJS.Timeout | null>(null)
  const isOpen = ref(false)
  const lastMessage = ref<any | null>(null)

  let reconnectAttempts = 0
  const maxReconnectAttempts = 5 // 自定义最大重试次数
  const reconnectInterval = 3000 // 重试间隔时间（毫秒）


  onMounted(() => {
    init();
  });

  onBeforeUnmount(() => {
    if (socketRef.value) {
      socketRef.value.close()
      stopHeartBeat()
    }
  })


  // 初始化websocket
  function init() {
    // console.log('初始化websocket :>> ')
    if (socketRef.value) {
      socketRef.value.close()
      socketRef.value = null
    }


    const socket = new WebSocket(url)

    // 建立连接
    socket.onopen = () => {
      isOpen.value = true
      store.setConnectionStatus(true)
      startHeartBeat()
    }

    // 关闭连接
    socket.onclose = () => {
      isOpen.value = false
      store.setConnectionStatus(false)
      clearInterval(heartBeatTimer.value)

      // 重连
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts++
          init()
        }, reconnectInterval)
      }
    }

    // 错误处理和消息处理
    socket.onerror = (err: Event) => {
      console.error('WebSocket Error:', err)
    }

    // 接收消息
    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data)
        // 把pong排除掉
        if (data?.response !== 'pong') {
          lastMessage.value = data
          store.handleMessage(data)
        }
      } catch (error) {
        console.error('Failed to parse received WebSocket message:', error, event.data)
      }
    }

    socketRef.value = socket
  }


  // 主动发送消息
  function send(data: any) {
    if (socketRef.value && isOpen.value) {
      socketRef.value.send(JSON.stringify(data))
    } else {
      console.error('WebSocket is not open')
    }
  }

  // 开始心跳逻辑 30秒一次
  function startHeartBeat(freq: number = 30) {
    heartBeatTimer.value = setInterval(() => {
      send('ping')
    }, freq * 1000)
  }

  // 停止心跳逻辑
  function stopHeartBeat() {
    clearInterval(heartBeatTimer.value)
    heartBeatTimer.value = null
  }


  // return {
  //   init,
  //   send,
  //   startHeartBeat,
  //   stopHeartBeat,
  //   isOpen,
  //   lastMessage,
  // }


  return {
    connection: {
      init,
      send,
      startHeartBeat,
      stopHeartBeat,
      isOpen,
      lastMessage,
    },
  }

}