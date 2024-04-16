import { defineStore } from 'pinia'

const initState = {
  isLoading: false,
}

export const useSystemStore = defineStore('system', {
  state: () => initState,
  getters: {},
  actions: {
    async setLoading(status) {
      this.isLoading = status
    },
  },
})
