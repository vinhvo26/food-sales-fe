import Loading from '@/core/components/Loading.vue'
import { createApp } from 'vue'

export default defineNuxtPlugin(nuxtApp => {
  const body = document.getElementsByTagName('body')[0]
  const div = document.createElement('div')
  body.appendChild(div)
  const app = createApp(Loading)
  app.mount(div)
})
