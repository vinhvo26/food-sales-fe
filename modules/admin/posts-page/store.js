import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

export const usePostAdminStore = defineStore('post-admin', {
  state: () => {
    return {
      listPost: [],
      postItem: {
        posts_id: '',
        title: '',
        content: '',
        country: '',
        city: '',
        district: '',
        price: '',
        acreage: '',
        phone: '',
        isAvailable: '',
        posts_type: '',
        category_name: '',
        last_name: '',
        first_name: '',
        list_img: [],
        year_start: '',
        year_end: '',
        payments: '',
        infrastructure_and_utility_services: '',
        traffic_system: '',
        electric_supply_system: '',
        water_supply_system: '',
        environmental_treatment_works: '',
        fire_protection_works: '',
        utility_services: '',
        service_charge: '',
        incentives_and_investment_support: '',
        founded_year: '',
        manufacturing_facilities: '',
        financial_statements: '',
        distributor_system: '',
        curren_status: '',
        isPrivateName: '',
        isPrivatePhone: '',
        isPrivatePrice: '',
        information_about: '',
      },
      listCategory: [],
    }
  },
  getters: {},
  actions: {
    async getListPost(page, data) {
      const response = await useFetchApi(
        `/api/admin/post/search?page=${page}`,
        {
          method: 'POST',
          body: data,
        }
      )
      return response?.data
    },
    async getListCategory() {
      const response = await useFetchApi('/api/admin/category/listCategory', {
        method: 'GET',
      })
      return response?.data
    },
    async editPost(data) {
      return await useFetchApi('/api/admin/post/edit', {
        method: 'POST',
        body: data,
      })
    },
    async getDetailPost(id) {
      const { data } = await useFetchApi(`/api/admin/post/get/${id}`, {
        method: 'GET',
      })
      return data
    },
    async changeStatusPost(id, status) {
      return await useFetchApi(`/api/admin/post/changeStatus/${id}/${status}`, {
        method: 'GET',
      })
    },
    async removeImage(data) {
      return await useFetchApi(`/api/upload/delete`, {
        method: 'POST',
        body: data,
      })
    },
    async removeFile(data) {
      return await useFetchApi(`/api/upload/delete-file`, {
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
    async uploadFile(data) {
      return await useFetchApi(`/api/upload/file`, {
        method: 'POST',
        body: data,
      })
    },
  },
})
