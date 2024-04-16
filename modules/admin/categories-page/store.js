import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const useCategoriesAdminStore = defineStore('categories-admin', {
  state: () => {
    return {
      listCategories: [],
      listCategoriesLevel1: [],
    }
  },
  getters: {},
  actions: {
    async getListCategoriesAdmin(page, data) {
      const response = await useFetchApi(
        `/api/admin/category/gets?page=${page}`,
        {
          method: 'POST',
          body: data,
        }
      )
      return response?.data
    },
    async getListCategory() {
      const response = await useFetchApi('/api/category/gets', {
        method: 'GET',
      })
      return response?.data
    },
    async updateCategory(data) {
      const response = await useFetchApi('/api/admin/category/edit', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async createCategory(data) {
      const response = await useFetchApi('/api/admin/category/create', {
        method: 'POST',
        body: data,
      })
      return response?.data
    },
    async deleteCategory(id) {
      const response = await useFetchApi(`/api/admin/category/delete/${id}`, {
        method: 'GET',
      })
      return response?.data
    },
  },
})
