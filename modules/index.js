import { defineNuxtModule } from '@nuxt/kit'

import { ROUTES as USER_ROUTES } from './user/routes'
import { ROUTES as ADMIN_ROUTES } from './admin/routes'

export default defineNuxtModule({
  setup(options, nuxt) {
    const routes = [...USER_ROUTES, ...ADMIN_ROUTES]
    nuxt.hook('pages:extend', pages => {
      routes.forEach(page => {
        pages.push(page)
      })
    })
  },
})
