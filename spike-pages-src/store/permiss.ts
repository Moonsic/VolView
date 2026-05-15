import { defineStore } from 'pinia'

// 没用到了，都存在localstorage里了
export const usePermissStore = defineStore('permiss', {
  state: () => {
    const permissList = JSON.parse(localStorage.getItem('permissList')) || []
    return {
      permissList: permissList ? permissList : <string[]>[],
    };
  },
  actions: {
    setPermissList(list: string[]) {
      this.permissList = list
    }
  }
})
