import { useAuthStore } from '@/core/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const toast = useToast()
  const isAuth = localStorage.getItem('isAuth')
  authStore.isAuth = isAuth ? JSON.parse(isAuth) : false

  if (!isAuth) {
    authStore.isOpenLogin = true
    return navigateTo('/')
  }

  // const { data } = await authStore.authCheck()
  // if (data?.status) {
  //   const { role } = data.data
  //   if (role !== 'SELLER' && role !== 'USER' && role !== 'ADMIN' && role !== 'MASTERADMIN') {
  //     throw showError({
  //       statusCode: 403,
  //       statusMessage: 'Forbidden',
  //       fatal: true,
  //     })
  //   }
  //   authStore.userInfoData = data.data
  // } else {
  //   authStore.isAuth = false

  // }
})
