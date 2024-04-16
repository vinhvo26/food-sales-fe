import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useRecruitmentAdminStore = defineStore('recruitment-admin', {
  state: () => {
    return {
      listRecruitment: [],
      detailRecruitment: null,
    }
  },
  getters: {},
  actions: {
    async getListRecruitment(page, data) {
      const response = await useFetchApi(
        `/api/admin/recruitment/gets?page=${page}`,
        {
          method: 'POST',
          body: data,
        }
      )
      return response?.data
    },
    async getDetailRecruitment(slug) {
      const response = await useFetchApi(`/api/admin/recruitment/get/${slug}`, {
        method: 'GET',
      })
      return response?.data
    },
    async createRecruitment(data) {
      const response = await useFetchApi(`/api/admin/recruitment/create`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async editRecruitment(data) {
      const response = await useFetchApi(`/api/admin/recruitment/edit`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async deleteRecruitment(id) {
      const response = await useFetchApi(
        `/api/admin/recruitment/delete/${id}`,
        {
          method: 'GET',
        }
      )
      return response?.data
    },
    async changeStatusRecruitment(id) {
      const response = await useFetchApi(
        `/api/admin/recruitment/change-status/${id}`,
        {
          method: 'GET',
        }
      )
      return response?.data
    },
    async removeImage(data) {
      return await useFetchApi(`/api/upload/delete`, {
        method: 'POST',
        body: data,
      })
    },
    async uploadImage(data) {
      return await useFetchApi(`/api/upload`, {
        method: 'POST',
        body: data,
      })
    },
  },
})
