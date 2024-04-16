import { PATH, ROUTER } from '../../core/constants'
import { resolve } from 'pathe'

export const ROUTES = [
  {
    name: ROUTER.ADMIN_LOGIN,
    path: PATH.ADMIN_LOGIN,
    file: resolve(__dirname, './login/index.vue'),
    meta: {
      middleware: ['auth-not-required'],
    },
  },
  {
    name: ROUTER.ADMIN_USER,
    path: PATH.ADMIN_USER,
    file: resolve(__dirname, './user-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_POST,
    path: PATH.ADMIN_POST,
    file: resolve(__dirname, './posts-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_POST_DETAIL,
    path: PATH.ADMIN_POST_DETAIL,
    file: resolve(__dirname, './posts-page/PostDetail.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_NEWS,
    path: PATH.ADMIN_NEWS,
    file: resolve(__dirname, './news-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_NEWS_CREATE,
    path: PATH.ADMIN_NEWS_CREATE,
    file: resolve(__dirname, './news-page/CreateNews.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_NEWS_EDIT,
    path: PATH.ADMIN_NEWS_EDIT,
    file: resolve(__dirname, './news-page/CreateNews.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_ACCOUNT,
    path: PATH.ADMIN_ACCOUNT,
    file: resolve(__dirname, './account-page/index.vue'),
    meta: {
      middleware: ['auth-required-master'],
    },
  },
  {
    name: ROUTER.ADMIN_CATEGORIES,
    path: PATH.ADMIN_CATEGORIES,
    file: resolve(__dirname, './categories-page/index.vue'),
    meta: {
      middleware: ['auth-required-admin'],
    },
  },
  {
    name: ROUTER.ADMIN_PARTNER,
    path: PATH.ADMIN_PARTNER,
    file: resolve(__dirname, './partner-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_PARTNER_CREATE,
    path: PATH.ADMIN_PARTNER_CREATE,
    file: resolve(__dirname, './partner-page/CreateNews.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_PARTNER_EDIT,
    path: PATH.ADMIN_PARTNER_EDIT,
    file: resolve(__dirname, './partner-page/CreateNews.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_SERVICE,
    path: PATH.ADMIN_SERVICE,
    file: resolve(__dirname, './service-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_SERVICE_CREATE,
    path: PATH.ADMIN_SERVICE_CREATE,
    file: resolve(__dirname, './service-page/CreateNews.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_SERVICE_EDIT,
    path: PATH.ADMIN_SERVICE_EDIT,
    file: resolve(__dirname, './service-page/CreateNews.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_INTRODUCE,
    path: PATH.ADMIN_INTRODUCE,
    file: resolve(__dirname, './introduce-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_INTRODUCE_CREATE,
    path: PATH.ADMIN_INTRODUCE_CREATE,
    file: resolve(__dirname, './introduce-page/CreateIntroduce.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_INTRODUCE_EDIT,
    path: PATH.ADMIN_INTRODUCE_EDIT,
    file: resolve(__dirname, './introduce-page/CreateIntroduce.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_REPORT,
    path: PATH.ADMIN_REPORT,
    file: resolve(__dirname, './report-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_REPORT_CREATE,
    path: PATH.ADMIN_REPORT_CREATE,
    file: resolve(__dirname, './report-page/CreateReport.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_REPORT_EDIT,
    path: PATH.ADMIN_REPORT_EDIT,
    file: resolve(__dirname, './report-page/CreateReport.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_REPORT_VIEW,
    path: PATH.ADMIN_REPORT_VIEW,
    file: resolve(__dirname, './report-page/ViewReport.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_RECRUITMENT,
    path: PATH.ADMIN_RECRUITMENT,
    file: resolve(__dirname, './recruitment-page/index.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_RECRUITMENT_CREATE,
    path: PATH.ADMIN_RECRUITMENT_CREATE,
    file: resolve(__dirname, './recruitment-page/CreateRecruitment.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
  {
    name: ROUTER.ADMIN_RECRUITMENT_EDIT,
    path: PATH.ADMIN_RECRUITMENT_EDIT,
    file: resolve(__dirname, './recruitment-page/CreateRecruitment.vue'),
    meta: {
      middleware: ['auth-required-seller'],
    },
  },
]
