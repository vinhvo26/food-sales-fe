import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useAccountAdminStore = defineStore('account-admin', {
  state: () => {
    return {
      listAccountAdmin: [],
    }
  },
  getters: {},
  actions: {
    async getListAccountAdmin(page, data) {
      const response = await useFetchApi(
        `/api/admin/user/listAdmin?page=${page}`,
        {
          method: 'POST',
          body: data,
        }
      )
      return response?.data
    },
    async createAccount(data) {
      const response = await useFetchApi('/api/admin/user/create', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async updateAccount(data) {
      const response = await useFetchApi('/api/admin/user/update-admin', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async changeStatusUser(id) {
      const response = await useFetchApi(
        `/api/admin/user/change-status/${id}`,
        {
          method: 'GET',
        }
      )
      return response?.data
    },
  },
})
