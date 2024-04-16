import ApiResponse from '@/core/utils/handleResponse'
import { useAuthStore } from '@/core/store/auth'

export default async function useFetchApi(url, options = {}) {
  const config = useRuntimeConfig()
  const router = useRouter()
  const authStore = useAuthStore

  const response = await useFetch(url, {
    ...options,
    key: options?.body?.key || `${Math.random()}`,
    server: options?.body?.server || false,
    baseURL:
      config.public.mode === 'production'
        ? config.public.baseApiUrl
        : config.public.baseUrl,
    onResponseError({ request, response, options }) {
      switch (response?.status) {
        case 401:
          localStorage.removeItem('isAuth')
          authStore.isAuth = false
          router.push({ path: '/' })
          break
        case 429:
          throw showError({
            statusCode: response?.status,
            statusMessage: response?.statusText,
            fatal: true,
          })
        case 503:
          throw showError({
            statusCode: response?.status,
            statusMessage: response?.statusText,
            fatal: true,
          })
        default:
          break
      }
    },
  })

  return new ApiResponse(response)
}
