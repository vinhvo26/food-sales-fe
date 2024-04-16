import { PATH, ROUTER } from '../../core/constants'
import { resolve } from 'pathe'

export const ROUTES = [
  {
    name: ROUTER.LOGIN_PAGE,
    path: PATH.LOGIN_PAGE,
    file: resolve(__dirname, './login/index.vue'),
    meta: {
      middleware: ['auth-not-required'],
    },
  },
  {
    name: ROUTER.FORGOT_PASSWORD_PAGE,
    path: PATH.FORGOT_PASSWORD_PAGE,
    file: resolve(__dirname, './forgot-password/index.vue'),
    meta: {
      middleware: ['auth-not-required'],
    },
  },
  {
    name: ROUTER.CHANGE_PASSWORD_PAGE,
    path: PATH.CHANGE_PASSWORD_PAGE,
    file: resolve(__dirname, './change-password/index.vue'),
    meta: {
      middleware: ['auth-not-required'],
    },
  },
  {
    name: ROUTER.CREATED_USER_PAGE,
    path: PATH.CREATED_USER_PAGE,
    file: resolve(__dirname, './created-user/index.vue'),
    meta: {
      middleware: ['auth-not-required'],
    },
  },
]
