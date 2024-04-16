<template>
  <div class="user-header">
    <USlideover
      class="header-sp"
      v-model="isShowHeader"
      :overlay="false"
      :transition="false"
      :ui="{
        width: 'max-w-xs',
      }"
    >
      <div class="p-4 flex-1 overflow-scroll">
        <div class="flex justify-center mt-2">
          <img
            src="@/core/assets/img/logo-header.png"
            alt=""
            width="80"
            height="80"
          />
        </div>
        <ul>
          <div v-if="!isAuth" class="flex justify-between px-6 mt-5">
            <UButton
              @click="toggleShowUserModal"
              class="w-28 justify-center"
              color="white"
              variant="solid"
              >{{ $t('log_in') }}</UButton
            >
            <UButton
              @click="
                () => {
                  authStore.closeAllModal()
                  authStore.isOpenModalCreateAccount = true
                }
              "
              class="w-28 justify-center"
              variant="solid"
              >{{ $t('register') }}</UButton
            >
          </div>
          <li class="user-navbar-item pt-6">
            <div class="flex justify-between">
              <div class="flex py-1 active-link">
                <UIcon class="mr-1 text-2xl" name="i-material-symbols-home" />
                <NuxtLink
                  @click="isShowHeader = false"
                  class="item-parent"
                  to="/"
                  >{{ $t('HOME_PAGE') }}</NuxtLink
                >
              </div>
              <UIcon
                @click="isShowHome = !isShowHome"
                class="mr-1 text-2xl"
                :name="
                  isShowHome
                    ? 'i-material-symbols-keyboard-arrow-up'
                    : 'i-material-symbols-keyboard-arrow-down'
                "
              />
            </div>
            <ul class="dropdown-content pl-7 mt-1" v-show="isShowHome">
              <li class="py-1.5 active-link-li">
                <NuxtLink @click="isShowHeader = false" to="/introduce">{{
                  $t('introduce')
                }}</NuxtLink>
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink @click="isShowHeader = false" to="/service">{{
                  $t('services')
                }}</NuxtLink>
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink @click="isShowHeader = false" to="/news">{{
                  $t('news')
                }}</NuxtLink>
              </li>
            </ul>
          </li>
          <li class="user-navbar-item dropdown pt-6 py-1">
            <div class="flex justify-between">
              <div
                class="flex"
                :class="{
                  'active-link':
                    route.query.posts_type === '2' &&
                    !route.query.parent_category_id,
                }"
                @click="isShowHeader = false"
              >
                <UIcon
                  class="mr-1 text-2xl"
                  name="i-material-symbols-home-work"
                />
                <NuxtLink
                  to="/project?posts_type=2&typefillter=created_at&selectPriceFrom=Triệu&selectPriceTo=Triệu&selectAcreageFrom=m²&selectAcreageTo=m²&page=1"
                  >{{ $t('seller_renter') }}</NuxtLink
                >
              </div>
              <UIcon
                class="mr-1 text-2xl"
                @click="isShowSeller = !isShowSeller"
                :name="
                  isShowSeller
                    ? 'i-material-symbols-keyboard-arrow-up'
                    : 'i-material-symbols-keyboard-arrow-down'
                "
              />
            </div>
            <ul class="dropdown-content pl-7 mt-1" v-show="isShowSeller">
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '2' &&
                      route.query.parent_category_id === '1',
                  }"
                  @click="handleRouter(1, 2), (isShowHeader = false)"
                  >{{ $t('land') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '2' &&
                      route.query.parent_category_id === '2',
                  }"
                  @click="handleRouter(2, 2), (isShowHeader = false)"
                  >{{ $t('projects_assets') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '2' &&
                      route.query.parent_category_id === '3',
                  }"
                  @click="handleRouter(3, 2), (isShowHeader = false)"
                  >{{ $t('business') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '2' &&
                      route.query.parent_category_id === '4',
                  }"
                  @click="handleRouter(4, 2), (isShowHeader = false)"
                  >{{ $t('brand') }}</NuxtLink
                >
              </li>
            </ul>
          </li>
          <li class="user-navbar-item dropdown pt-6 py-1">
            <div class="flex justify-between">
              <div
                class="flex"
                :class="{
                  'active-link':
                    route.query.posts_type === '1' &&
                    !route.query.parent_category_id,
                }"
                @click="isShowHeader = false"
              >
                <UIcon
                  class="mr-1 text-2xl"
                  name="i-material-symbols-house-rounded"
                />
                <NuxtLink
                  to="/project?posts_type=1&typefillter=created_at&selectPriceFrom=Triệu&selectPriceTo=Triệu&selectAcreageFrom=m²&selectAcreageTo=m²&page=1"
                  >{{ $t('buyer_renter') }}</NuxtLink
                >
              </div>
              <UIcon
                @click="isShowBuyer = !isShowBuyer"
                class="mr-1 text-2xl"
                :name="
                  isShowBuyer
                    ? 'i-material-symbols-keyboard-arrow-up'
                    : 'i-material-symbols-keyboard-arrow-down'
                "
              />
            </div>
            <ul class="dropdown-content pl-7 mt-1" v-show="isShowBuyer">
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '1' &&
                      route.query.parent_category_id === '1',
                  }"
                  @click="handleRouter(1, 1), (isShowHeader = false)"
                  >{{ $t('land') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '1' &&
                      route.query.parent_category_id === '2',
                  }"
                  @click="handleRouter(2, 1), (isShowHeader = false)"
                  >{{ $t('projects_assets') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '1' &&
                      route.query.parent_category_id === '3',
                  }"
                  @click="handleRouter(3, 1), (isShowHeader = false)"
                  >{{ $t('business') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      route.query.posts_type === '1' &&
                      route.query.parent_category_id === '4',
                  }"
                  @click="handleRouter(4, 1), (isShowHeader = false)"
                  >{{ $t('brand') }}</NuxtLink
                >
              </li>
            </ul>
          </li>
          <li class="user-navbar-item pt-6 flex active-link-li">
            <UIcon
              class="mr-1 text-2xl"
              name="i-material-symbols-partner-exchange"
            />
            <NuxtLink to="/partner" @click="isShowHeader = false">{{
              $t('partner')
            }}</NuxtLink>
          </li>
          <li class="user-navbar-item pt-6 flex active-link-li">
            <UIcon
              class="mr-1 text-2xl"
              name="i-material-symbols-account-child-outline"
            />
            <NuxtLink to="/career" @click="isShowHeader = false">{{
              $t('recruitment')
            }}</NuxtLink>
          </li>
          <li class="user-navbar-item pt-6 flex active-link-li">
            <UIcon
              class="mr-1 text-2xl"
              name="i-material-symbols-contact-emergency"
            />
            <NuxtLink @click="scrollToContact">{{ $t('contact') }}</NuxtLink>
          </li>
          <li class="user-navbar-item dropdown pt-6">
            <div
              class="flex justify-between"
              @click="isShowLanguage = !isShowLanguage"
            >
              <div class="flex active-link">
                <UIcon
                  class="mr-1 text-2xl"
                  name="i-material-symbols-globe-asia"
                />
                <NuxtLink class="flex items-center">
                  {{ $t('language') }}
                </NuxtLink>
              </div>
              <UIcon
                class="mr-1 text-2xl"
                :name="
                  isShowLanguage
                    ? 'i-material-symbols-keyboard-arrow-up'
                    : 'i-material-symbols-keyboard-arrow-down'
                "
              />
            </div>
            <ul
              class="dropdown-content dropdown-content-language pl-7 mt-1"
              v-show="isShowLanguage"
            >
              <li v-for="localeItem in locales" class="py-1.5 active-link-li">
                <NuxtLink
                  class="cursor-pointer"
                  :class="{
                    'active-link-language': localeItem.code === locale,
                  }"
                  @click.prevent.stop="
                    () => {
                      setLocale(localeItem.code)
                      isShowHeader = false
                      reload()
                    }
                  "
                >
                  <UIcon
                    class="mr-1 text-2xl"
                    :name="localeItem.icon"
                    dynamic
                  />
                  {{ localeItem.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li class="user-navbar-item pt-6" :class="{ dropdown: isAuth }">
            <div
              class="flex justify-between"
              v-if="isAuth"
              @click="isShowUser = !isShowUser"
            >
              <NuxtLink class="cursor-pointer flex items-center">
                <UIcon
                  class="mr-1 text-2xl"
                  name="i-material-symbols-account-circle"
                  :class="[
                    'text-black-custom',
                    {
                      'text-white-custom':
                        route.path === '/manage-sales-information',
                    },
                  ]"
                />
                <span
                  :class="[
                    'text-black-custom',
                    {
                      'text-white-custom':
                        route.path === '/manage-sales-information',
                    },
                  ]"
                  >{{ username }}</span
                >
              </NuxtLink>
              <UIcon
                class="mr-1 text-2xl"
                :name="
                  isShowUser
                    ? 'i-material-symbols-keyboard-arrow-up'
                    : 'i-material-symbols-keyboard-arrow-down'
                "
              />
            </div>
            <ul
              class="dropdown-content right-0 dropdown-content-user pl-7 mt-1"
              v-show="isAuth && isShowUser"
            >
              <li
                v-if="
                  authStore.userInfoData.role == 'ADMIN' ||
                  authStore.userInfoData.role == 'SELLER' ||
                  authStore.userInfoData.role == 'MASTERADMIN'
                "
                class="py-1.5 active-link"
              >
                <NuxtLink to="/admin" @click="isShowHeader = false">
                  {{ $t('admin_page') }}
                </NuxtLink>
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  to="/manage-sales-information?posts_type=2"
                  class="text-black-custom"
                  @click="isShowHeader = false"
                  >{{ $t('manage_buy_sell') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink
                  :class="{
                    'router-link-active router-link-exact-active':
                      authStore.isOpenUserInformation,
                  }"
                  @click="
                    () => {
                      ;(authStore.isOpenUserInformation = true),
                        (isShowHeader = false)
                    }
                  "
                  >{{ $t('account_info') }}</NuxtLink
                >
              </li>
              <li class="py-1.5 active-link-li">
                <NuxtLink @click="handleLogout">{{ $t('logout') }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </USlideover>
    <div class="user-logo">
      <NuxtLink to="/"
        ><img src="@/core/assets/img/logo.png" alt=""
      /></NuxtLink>
    </div>
    <ul class="user-navbar select-none h-full">
      <li class="user-navbar-item dropdown pt-6">
        <NuxtLink
          to="/"
          :class="[
            'text-black-custom',
            {
              'text-white-custom': nameChildHome.includes(
                router.currentRoute.value.path
              ),
            },
          ]"
          >{{ $t('HOME_PAGE') }}</NuxtLink
        >
        <ul class="dropdown-content">
          <li>
            <NuxtLink to="/introduce">{{ $t('introduce') }}</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/service"
              :class="{
                'router-link-active router-link-exact-active':
                  router.currentRoute.value.path.includes('/service'),
              }"
              >{{ $t('services') }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/news"
              :class="{
                'router-link-active router-link-exact-active':
                  router.currentRoute.value.path.includes('/news'),
              }"
              >{{ $t('news') }}</NuxtLink
            >
          </li>
        </ul>
      </li>
      <li class="user-navbar-item dropdown pt-6">
        <NuxtLink
          to="/project?posts_type=2&typefillter=created_at&selectPriceFrom=Triệu&selectPriceTo=Triệu&selectAcreageFrom=m²&selectAcreageTo=m²&page=1"
          :class="[
            'text-black-custom',
            {
              'text-white-custom':
                route.query.posts_type === '2' &&
                router.currentRoute.value.path.includes('/project'),
            },
          ]"
          >{{ $t('seller_renter') }}</NuxtLink
        >
        <ul class="dropdown-content">
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '2' &&
                  route.query.parent_category_id === '1',
              }"
              @click="handleRouter(1, 2)"
              >{{ $t('land') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '2' &&
                  route.query.parent_category_id === '2',
              }"
              @click="handleRouter(2, 2)"
              >{{ $t('projects_assets') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '2' &&
                  route.query.parent_category_id === '3',
              }"
              @click="handleRouter(3, 2)"
              >{{ $t('business') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '2' &&
                  route.query.parent_category_id === '4',
              }"
              @click="handleRouter(4, 2)"
              >{{ $t('brand') }}</NuxtLink
            >
          </li>
        </ul>
      </li>
      <li class="user-navbar-item dropdown pt-6">
        <NuxtLink
          to="/project?posts_type=1&typefillter=created_at&selectPriceFrom=Triệu&selectPriceTo=Triệu&selectAcreageFrom=m²&selectAcreageTo=m²&page=1"
          :class="[
            'text-black-custom',
            {
              'text-white-custom':
                route.query.posts_type === '1' &&
                router.currentRoute.value.path.includes('/project'),
            },
          ]"
          >{{ $t('buyer_renter') }}</NuxtLink
        >
        <ul class="dropdown-content">
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '1' &&
                  route.query.parent_category_id === '1',
              }"
              @click="handleRouter(1, 1)"
              >{{ $t('land') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '1' &&
                  route.query.parent_category_id === '2',
              }"
              @click="handleRouter(2, 1)"
              >{{ $t('projects_assets') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '1' &&
                  route.query.parent_category_id === '3',
              }"
              @click="handleRouter(3, 1)"
              >{{ $t('business') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  route.query.posts_type === '1' &&
                  route.query.parent_category_id === '4',
              }"
              @click="handleRouter(4, 1)"
              >{{ $t('brand') }}</NuxtLink
            >
          </li>
        </ul>
      </li>
      <li class="user-navbar-item pt-6">
        <NuxtLink to="/partner">{{ $t('partner') }}</NuxtLink>
      </li>
      <li class="user-navbar-item pt-6">
        <NuxtLink to="/career">{{ $t('recruitment') }}</NuxtLink>
      </li>
      <li class="user-navbar-item pt-6 cursor-pointer">
        <NuxtLink @click="scrollToContact">{{ $t('contact') }}</NuxtLink>
      </li>
      <li class="user-navbar-item dropdown pt-6">
        <NuxtLink class="flex items-center">
          <UIcon class="mr-1 text-2xl" name="i-material-symbols-globe-asia" />{{
            $t('language')
          }}
        </NuxtLink>
        <ul class="dropdown-content dropdown-content-language">
          <li v-for="localeItem in locales">
            <NuxtLink
              class="cursor-pointer"
              @click.prevent.stop="
                () => {
                  setLocale(localeItem.code)
                  reload()
                }
              "
            >
              <UIcon class="mr-1 text-2xl" :name="localeItem.icon" dynamic />
              {{ localeItem.name }}
              <UIcon
                v-if="locale === localeItem.code"
                class="ml-3 text-xl text-green-500"
                name="i-material-symbols-check-circle-outline"
              />
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li class="user-navbar-item pt-6" :class="{ dropdown: isAuth }">
        <NuxtLink
          class="cursor-pointer flex items-center"
          :class="[
            'text-black-custom',
            {
              'text-white-custom':
                nameChildUser.includes(router.currentRoute.value.path) ||
                router.currentRoute.value.path === '/edit-post',
            },
          ]"
        >
          <UIcon
            v-if="isAuth"
            class="mr-1 text-2xl"
            name="i-material-symbols-account-circle"
          />
          <span v-if="isAuth">{{
            authStore.userInfoData?.last_name ||
            authStore.userInfoData?.first_name ||
            'Người dùng'
          }}</span>
          <span v-else @click="toggleShowUserModal"
            >{{ $t('log_in') }} | {{ $t('register') }}</span
          >
        </NuxtLink>
        <ul class="dropdown-content right-0 dropdown-content-user">
          <li
            v-if="
              authStore.userInfoData.role == 'ADMIN' ||
              authStore.userInfoData.role == 'SELLER' ||
              authStore.userInfoData.role == 'MASTERADMIN'
            "
          >
            <NuxtLink to="/admin"> {{ $t('admin_page') }} </NuxtLink>
          </li>
          <li>
            <NuxtLink
              :class="{
                'router-link-active router-link-exact-active':
                  router.currentRoute.value.path.includes('/edit-post') ||
                  router.currentRoute.value.path.includes('created-post'),
              }"
              to="/manage-sales-information?posts_type=2"
              >{{ $t('manage_buy_sell') }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              @click="
                () => {
                  authStore.isOpenUserInformation = true
                }
              "
              >{{ $t('account_info') }}</NuxtLink
            >
          </li>
          <li class="cursor-pointer">
            <NuxtLink @click="handleLogout">{{ $t('logout') }}</NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
    <div class="mobile-dehaze-icon hidden">
      <UIcon
        class="mr-1 text-2xl"
        name="i-material-symbols-dehaze-rounded"
        @click="isShowHeader = true"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/core/store/auth'
import { ROUTER } from '@/core/constants'

const { locale, locales, setLocale, t } = useI18n()

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isAuth = computed(() => authStore.isAuth)
const username = computed(() => authStore.username)
const isShowUserModal = ref(false)
const isPostsType = ref()
const isShowHeader = ref(false)
const usernameStorage = localStorage.getItem('user_name')
const isShowHome = ref(false)
const isShowSeller = ref(false)
const isShowBuyer = ref(false)
const isShowLanguage = ref(false)
const isShowUser = ref(false)
const nameChildHome = ref(['/service', '/news', '/'])
const nameChildUser = ref(['/manage-sales-information'])

const toggleShowUserModal = () => {
  authStore.isAuth
    ? (isShowUserModal.value = !isShowUserModal.value)
    : (authStore.isOpenLogin = true)
}

const handleLogout = async () => {
  await authStore.logout()
}

const handleRouter = (index, type) => {
  isPostsType.value = type
  router.replace({
    name: ROUTER.PROJECT_PAGE,
    query: {
      parent_category_id: index,
      posts_type: type,
      typefillter: 'created_at',
    },
  })
}

const scrollToContact = () => {
  isShowHeader.value = false
  if (router.currentRoute.value.name !== ROUTER.HOME_PAGE) {
    router.push({
      name: ROUTER.HOME_PAGE,
    })
  }
  setTimeout(() => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, 1000)
}

const reload = () => {
  reloadNuxtApp({ ttl: 500 })
}

watch([isShowHeader], () => {
  isShowSeller.value = false
  isShowBuyer.value = false
  isShowHome.value = false
  if (isShowHeader.value) {
    if (
      route.query.posts_type === '2' &&
      route.query.parent_category_id * 1 < 5
    ) {
      isShowSeller.value = true
    }
    if (
      route.query.posts_type === '1' &&
      route.query.parent_category_id * 1 < 5
    ) {
      isShowBuyer.value = true
    }
    const listUrlHome = ['/introduce', '/service', '/news']
    if (listUrlHome.includes(router.currentRoute.value.path)) {
      isShowHome.value = true
    }
  }
})

onMounted(() => {
  authStore.username = usernameStorage ? usernameStorage : t('users')
})
</script>

<style lang="scss" scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 100px;
  height: 80px;
  background-color: #2ba395;
}
.user-navbar {
  display: flex;
  .user-navbar-item {
    margin: 0 15px;
    font-size: 16px;
    font-weight: 600;
    .text-black-custom {
      color: #072c2c !important;
    }
    .text-white-custom {
      color: #ffffff !important;
    }
    a {
      color: #072c2c;
      &.router-link-active.router-link-exact-active {
        color: #ffffff;
      }
      &:hover {
        color: #ffffff;
      }
    }
    .dropdown-content {
      a {
        &.router-link-active.router-link-exact-active {
          background-color: #1e7970;
        }
      }
    }
  }
  &-sub {
    visibility: hidden;
    opacity: 0;
    width: 200px;
    left: 83%;
    top: 80px;
    transform: translateX(-50%);
    background: white;
    padding: 10px 15px;
    box-shadow: rgba(21, 142, 130, 0.2) 0px 4px 12px;
    z-index: 9999;
    li {
      color: #072c2c !important;
      font-size: medium;
      padding: 5px 5px;
      border-radius: 5px;
      &:hover {
        background: #76c5bc;
      }
    }
    a {
      color: #072c2c !important;
      font-size: medium;
    }
    &.active {
      visibility: visible;
      opacity: 1;
    }
  }
  .dropdown {
    float: left;
    overflow: hidden;
  }

  .dropdown .dropbtn {
    font-size: 17px;
    border: none;
    outline: none;
    color: white;
    padding: 14px 16px;
    background-color: inherit;
    font-family: inherit;
    margin: 0;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    top: 80px;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 99;
    border-top: 4px solid #37cab8;
  }

  .dropdown-content-language {
    min-width: 200px !important;
  }

  .dropdown-content-user {
    min-width: 235px !important;
  }

  .dropdown-content-language a {
    display: flex !important;
    align-items: center;
  }

  .dropdown-content a {
    float: none;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    border-bottom: 1px solid #cacaca;
  }

  .topnav a:hover,
  .dropdown:hover .dropbtn {
    background-color: #555;
    color: white;
  }

  .dropdown-content a:hover {
    background-color: #a4ccc7;
    color: black;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }
}
.user-logo {
  width: 100px;
}
.user-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
}

@media only screen and (max-width: 1410px) {
  .user-header {
    padding: 0 10px;
  }
}
@media only screen and (max-width: 1228px) {
  .user-header {
    .user-logo {
      margin: 0 auto;
      padding-left: 28px;
    }
    .user-navbar {
      display: none;
    }
  }
  .mobile-dehaze-icon {
    display: block;
  }
}
.header-sp {
  ul {
    .active-link-li .router-link-active.router-link-exact-active {
      color: #1e7970;
      font-weight: bold;
    }
    .dropdown-content-language {
      .active-link-language {
        color: #1e7970;
        font-weight: bold;
      }
    }
    li {
      .active-link:has(.router-link-active.router-link-exact-active) {
        color: #1e7970;
        font-weight: bold;
      }
    }
  }
}
</style>
