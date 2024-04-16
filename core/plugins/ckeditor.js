import { defineNuxtPlugin } from '#app'
import CKEditor from '@ckeditor/ckeditor5-vue'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('CkeditorNuxt', CKEditor.component)
})
