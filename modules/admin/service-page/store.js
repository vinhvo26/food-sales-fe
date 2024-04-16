import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useServicesAdminStore = defineStore('services-admin', {
  state: () => {
    return {
      listNews: [],
    }
  },
  getters: {},
  actions: {
    async getListNews(page, data) {
      const response = await useFetchApi(`/api/admin/services/gets?page=${page}`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async createNews(data) {
      const response = await useFetchApi('/api/admin/services/create', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async editNews(data) {
      const response = await useFetchApi('/api/admin/services/edit', {
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
    async getDetailNews(id) {
      const { data } = await useFetchApi(`/api/admin/services/get/${id}`, {
        method: 'GET',
      })
      return data
    },
    async changeStatusNews(id, status) {
      return await useFetchApi(`/api/admin/services/changeStatus/${id}/${status}`, {
        method: 'GET',
      })
    },
    async deleteNews(id) {
      return await useFetchApi(`/api/admin/services/delete/${id}`, {
        method: 'GET',
      })
    },
  },
})
