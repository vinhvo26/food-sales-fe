import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useIntroduceAdminStore = defineStore('introduce-admin', {
  state: () => {
    return {
      listIntroduction: [],
    }
  },
  getters: {},
  actions: {
    async getListIntroduction(page, data) {
      const response = await useFetchApi(`/api/admin/introduction/gets?page=${page}`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async createIntroduction(data) {
      const response = await useFetchApi('/api/admin/introduction/create', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async editIntroduction(data) {
      const response = await useFetchApi('/api/admin/introduction/edit', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async uploadImage(data) {
      return await useFetchApi(`/api/upload`, {
        method: 'POST',
        body: data,
      })
    },
    async removeImage(data) {
      return await useFetchApi(`/api/upload/delete`, {
        method: 'POST',
        body: data,
      })
    },
    async getDetailIntroduction(id) {
      const { data } = await useFetchApi(`/api/admin/introduction/get/${id}`, {
        method: 'GET',
      })
      return data
    },
    async changeStatusIntroduction(id, status) {
      return await useFetchApi(`/api/admin/introduction/changeStatus/${id}/${status}`, {
        method: 'GET',
      })
    },
    async deleteIntroduction(id) {
      return await useFetchApi(`/api/admin/introduction/delete/${id}`, {
        method: 'GET',
      })
    },
  },
})
