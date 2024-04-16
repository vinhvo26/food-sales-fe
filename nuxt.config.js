const path = require('path')

const getPath = (str = '') => {
  let pathTemp = path.join(process?.env?.BASE_PATH || '/', '/api')

  if (str) {
    pathTemp = path.join(str, process?.env?.BASE_PATH || '/', '/api')
  }

  return pathTemp.split(path.sep).join('/')
}

export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      baseUrl: process?.env?.BASE_URL,
      baseApiUrl: process?.env?.BASE_API_URL,
      mode: process?.env?.NODE_ENV,
    },
  },

  plugins: [
    { src: '@/core/plugins/loading.js', ssr: false, mode: 'client' },
    { src: '@/core/plugins/datepicker.js', ssr: false, mode: 'client' },
    { src: '@/core/plugins/ckeditor.js', ssr: false, mode: 'client' },
  ],

  routeRules: {
    '/**': { ssr: false, prerender: true },
    '/admin': { redirect: '/admin/user', prerender: false },
  },

  app: {
    baseURL: process?.env?.BASE_PATH || '/',
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Vạn Phúc',
        },
        {
          name: 'robots',
          content:
            'follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large',
        },
        {
          name: 'zalo-platform-site-verification',
          content: 'MSUu8vdO7XWJnhubcD06V5porcgmX0GoD3ar',
        },
        {
          property: 'og:url',
          content: 'https://ketnoidautu.com',
        },
        {
          property: 'og:title',
          content: 'Kết nối đầu tư',
        },
        {
          property: 'og:image',
          content: 'https://ketnoidautu.com/image/logo.png',
        },
        {
          property: 'og:description',
          content:
            'Cổng thông tin KẾT NỐI ĐẦU TƯ ra đời nhằm đáp ứng các nhu cầu cấp thiết trong việc tổ chức các hoạt động XÚC TIẾN ĐẦU TƯ cho các Nhà đầu tư nước trong nước và quốc tế vào các khu công nghiệp, cụm công nghiệp, khu chế xuất, khu công nghệ cao, khu kinh tế trên cả nước.',
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'fb:app_id',
          content: '1395095367777620',
        },
      ],
    },
  },

  build: {
    extractCSS: true,
  },

  devServer: {
    host: 'localhost',
    port: 3002,
  },

  modules: [
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@vee-validate/nuxt',
    'vue3-carousel-nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxt/image',
  ],

  css: ['@/core/assets/css/main.css'],

  // module::pinia
  pinia: {
    autoImports: [['defineStore', 'definePiniaStore']],
  },

  vite: {
    server: {
      proxy: {
        [getPath()]: {
          target: process?.env?.BASE_API_URL,
          secure: true,
          changeOrigin: true,
          rewrite: path =>
            (process?.env?.BASE_PATH || '/') !== '/'
              ? path.replace(process?.env?.BASE_PATH, '')
              : path,
        },
      },
    },
  },

  components: [{ path: '@/core/components/' }],

  googleFonts: {
    families: {
      Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      Catamaran: [400, 800],
      Montserrat: [400, 600, 700],
    },
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  i18n: {
    locales: [
      {
        code: 'vi',
        name: 'Việt Nam',
        icon: 'i-cif-vn',
        file: 'vn-VN.json',
      },
      {
        code: 'en',
        name: 'English',
        icon: 'i-cif-us',
        file: 'en-US.json',
      },
      {
        code: 'ja',
        name: '日本語',
        icon: 'i-cif-jp',
        file: 'ja-JP.json',
      },
      {
        code: 'ko',
        name: '한국인',
        icon: 'i-cif-kr',
        file: 'kr-KR.json',
      },
      {
        code: 'zh',
        name: '中国人',
        icon: 'i-cif-cn',
        file: 'cn-CN.json',
      },
    ],
    strategy: 'no_prefix',
    langDir: 'locales',
  },

  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },
})
