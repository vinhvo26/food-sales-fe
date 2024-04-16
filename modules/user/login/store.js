import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login-user', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    async login(payload) {
      const response = await useFetchApi('/api/auth/login', {
        method: 'POST',
        body: payload,
      })
      return response
    },
  },
})
