import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    connectionStatus: false,
    lastReceivedMessage: null as any | null,
  }),
  actions: {
    setConnectionStatus(status: boolean) {
      this.connectionStatus = status
    },
    handleMessage(message: any) {
      this.lastReceivedMessage = message
      // 其他业务逻辑处理...
    },
  },
})



// // store/websocket.js
// import { defineStore } from 'pinia'
// import WebSocketService from '@/utils/websocket'

// export const useWebSocketStore = defineStore('websocket', {
//   state: () => ({
//     socketOpen: false,
//     lastMessage: null,
//   }),
//   actions: {
//     handleMessage(message) {
//       this.lastMessage = message
//       // 其他业务逻辑处理...
//     },
//     initWebSocket(uid, token) {
//       const url = `${process.env.VUE_APP_SOCKET_URL}/webSocket/v1/${uid}/${token}`
//       const wsService = new WebSocketService(url, this)
//       wsService.startHeartbeat(/* 你的心跳频率 */)
//       wsService.setupUnmountedCleanup(onUnmounted)
//     },
//   },
// })