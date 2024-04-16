import { useAuthStore } from '@/core/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const toast = useToast()

  const isAuth = localStorage.getItem('isAuth')
  authStore.isAuth = isAuth ? JSON.parse(isAuth) : false

  if (isAuth) {
    // const { data } = await authStore.authCheck()
    // if (data?.status) {
    //   authStore.userInfoData = data.data
    // } else {
    //   authStore.isAuth = false
    // }
    // if (to.name === 'admin-login') {
    //   return navigateTo('/admin/user')
    // }
  }
})
