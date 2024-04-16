import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useUserAdminStore = defineStore('user-admin', {
  state: () => {
    return {
      listUser: [],
      listUserConsultation: [],
    }
  },
  getters: {},
  actions: {
    async getListUser(page, data) {
      const response = await useFetchApi(`/api/admin/user/gets?page=${page}`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async getListUserConsultation(page, body) {
      const response = await useFetchApi(
        `/api/admin/contact/gets?page=${page}`,
        {
          method: 'POST',
          body: body,
        }
      )
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
    async updateContacts(data) {
      const response = await useFetchApi('/api/admin/contact/edit', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async changeRoleUser(id, data) {
      const response = await useFetchApi(`/api/admin/user/change-role/${id}`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
  },
})
