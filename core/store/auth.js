import useFetchApi from '@/core/composables/useFetchApi'
import { defineStore } from 'pinia'

const initState = {
  userlogin: '',
  username: '',
  lastName: '',
  token: '',
  isCreatedAccount: false,
  isOpenLogin: false,
  isOpenModalOtp: false,
  isOpenChangePassword: false,
  isOpenAddInformation: false,
  isOpenModalCreateAccount: false,
  isOpenModalForgotPass: false,
  isOpenUserInformation: false,
  isOpenModalShare: false,
  isAuth: false,
  userInfoData: {},
}

export const useAuthStore = defineStore('auth', {
  state: () => initState,
  getters: {},
  actions: {
    closeAllModal() {
      this.isOpenLogin = false
      this.isOpenModalOtp = false
      this.isOpenChangePassword = false
      this.isOpenAddInformation = false
      this.isOpenModalCreateAccount = false
      this.isOpenModalForgotPass = false
      this.isOpenUserInformation = false
      this.isOpenModalShare = false
    },
    // async login(payload) {
    //   const response = await useFetchApi('/api/auth/login', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async authCheck() {
    //   const response = await useFetchApi('/api/auth/check', {
    //     method: 'GET',
    //   })
    //   return response
    // },
    // async logout() {
    //   const { data } = await useFetchApi('/api/logout', {
    //     method: 'GET',
    //   })
    //   if (data.status) {
    //     localStorage.removeItem('isAuth')
    //     this.isAuth = false
    //     useRouter().push({ path: '/' })
    //   } else if (data.message) {
    //     toast.add({
    //       title: 'Notification',
    //       description: data.message,
    //       icon: 'i-heroicons-exclamation-circle-20-solid',
    //       color: 'red',
    //     })
    //   }
    // },
    // async logoutAdmin() {
    //   const { data } = await useFetchApi('/api/logout', {
    //     method: 'GET',
    //   })
    //   if (data.status) {
    //     localStorage.removeItem('isAuth')
    //     this.isAuth = false
    //     useRouter().push({ path: '/admin/login' })
    //   } else if (data.message) {
    //     toast.add({
    //       title: 'Notification',
    //       description: data.message,
    //       icon: 'i-heroicons-exclamation-circle-20-solid',
    //       color: 'red',
    //     })
    //   }
    // },
    // async createdAccount(payload) {
    //   const response = await useFetchApi('/api/auth/create', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async forgotPassword(payload) {
    //   const response = await useFetchApi('/api/auth/forgotpassword', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async resetPassword(payload) {
    //   const response = await useFetchApi('/api/auth/resetpassword', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async checkOtp(payload) {
    //   const response = await useFetchApi('/api/auth/checkotp', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async updateInfoUser(payload) {
    //   const response = await useFetchApi('/api/auth/update', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async editInfoUser(payload) {
    //   const response = await useFetchApi('/api/user/edit', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
    // async loginWithGoogle(query) {
    //   const response = await useFetchApi('/api/auth/login-google', {
    //     method: 'GET',
    //     query,
    //   })
    //   return response
    // },
    // async loginWithFacebook(query) {
    //   const response = await useFetchApi('/api/auth/login-facebook', {
    //     method: 'GET',
    //     query,
    //   })
    //   return response
    // },
    // async changepassword(payload) {
    //   const response = await useFetchApi('/api/changepassword', {
    //     method: 'POST',
    //     body: payload,
    //   })
    //   return response
    // },
  },
})
