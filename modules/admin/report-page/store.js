import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useReportAdminStore = defineStore('report-admin', {
  state: () => {
    return {
      listReport: [],
      detailReport: null,
    }
  },
  getters: {},
  actions: {
    async getListReport(page, data) {
      const response = await useFetchApi(
        `/api/admin/report/gets?page=${page}`,
        {
          method: 'POST',
          body: data,
        }
      )
      return response?.data
    },
    async createReport(data) {
      const response = await useFetchApi(`/api/admin/report/create`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async editReport(data) {
      const response = await useFetchApi(`/api/admin/report/edit`, {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async getDetailReport(id) {
      const response = await useFetchApi(`/api/admin/report/get/${id}`, {
        method: 'GET',
      })
      return response?.data
    },
    async getListSeller() {
      const response = await useFetchApi(`/api/admin/user/getsSeller`, {
        method: 'GET',
      })
      return response?.data
    },
    async deleteReport(id) {
      const response = await useFetchApi(`/api/admin/report/delete/${id}`, {
        method: 'GET',
      })
      return response?.data
    },
  },
})
