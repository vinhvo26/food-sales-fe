import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

const initState = {}

export const useContactStore = defineStore('contact', {
  state: () => initState,
  getters: {},
  actions: {
    async createContact(payload) {
      const response = await useFetchApi('/api/contact/create', {
        method: 'POST',
        body: payload,
      })
      return response
    },
  },
})
