import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const usePartnerAdminStore = defineStore('partner-admin', {
  state: () => {
    return {
      listPartner: [],
      listLogo: null,
    }
  },
  getters: {},
  actions: {
    async getListNews(page, data) {
      const response = await useFetchApi(
        `/api/admin/partner/gets?page=${page}`,
        {
          method: 'POST',
          body: data,
        }
      )
      return response?.data
    },
    async createNews(data) {
      const response = await useFetchApi('/api/admin/partner/create', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async editNews(data) {
      const response = await useFetchApi('/api/admin/partner/edit', {
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
      const { data } = await useFetchApi(`/api/admin/partner/get/${id}`, {
        method: 'GET',
      })
      return data
    },
    async changeStatusNews(id, status) {
      return await useFetchApi(
        `/api/admin/partner/changeStatus/${id}/${status}`,
        {
          method: 'GET',
        }
      )
    },
    async deleteNews(id) {
      return await useFetchApi(`/api/admin/partner/delete/${id}`, {
        method: 'GET',
      })
    },
    async addLogo(data) {
      const response = await useFetchApi('/api/admin/partner/add/logo', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async getListLogo() {
      const response = await useFetchApi('/api/admin/partner/logo', {
        method: 'GET',
      })
      return response?.data
    },
  },
})
