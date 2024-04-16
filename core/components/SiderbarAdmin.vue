<template>
  <div class="siderbar-main bg-primary">
    <div class="flex justify-center">
      <NuxtLink to="/"
        ><img src="@/core/assets/img/logo.png" alt=""
      /></NuxtLink>
    </div>
    <div class="list-item-sibar flex flex-col space-y-4 mt-10">
      <NuxtLink
        v-for="(item, index) in dataMenu"
        :key="index"
        :class="
          item.role.includes(authStore.userInfoData.role)
            ? path.includes(item.url)
              ? 'active-link'
              : ''
            : 'hidden'
        "
        class="link"
        :to="item.url"
      >
        <div class="item flex items-center space-x-3">
          <UIcon class="icon" :name="item.icon" />
          <span class="color-primary">{{ item.label }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { PATH } from '@/core/constants'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '~/core/constants/role/index.js'

const router = useRouter()

const authStore = useAuthStore()

const path = ref('')

onMounted(() => {
  path.value = router.currentRoute.value.path
})

const dataMenu = ref([
  {
    icon: 'i-heroicons-users',
    label: 'Quản lý thành viên',
    url: PATH.ADMIN_USER,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-heroicons-folder-plus',
    label: 'Quản lý đăng tin',
    url: PATH.ADMIN_POST,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-material-symbols-newsmode-outline-rounded',
    label: 'Quản lý tin tức',
    url: PATH.ADMIN_NEWS,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-material-symbols-account-circle-full',
    label: 'Tài khoản nhân viên',
    url: PATH.ADMIN_ACCOUNT,
    role: [ROLE.MASTERADMIN],
  },
  {
    icon: 'i-material-symbols-format-list-bulleted-rounded',
    label: 'Quản lý danh mục',
    url: PATH.ADMIN_CATEGORIES,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN],
  },
  {
    icon: 'i-ep-data-analysis',
    label: 'Quản lý giới thiệu',
    url: PATH.ADMIN_INTRODUCE,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-ep-service',
    label: 'Quản lý dịch vụ',
    url: PATH.ADMIN_SERVICE,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-material-symbols-partner-exchange-outline-rounded',
    label: 'Quản lý đối tác',
    url: PATH.ADMIN_PARTNER,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-iconoir-reports',
    label: 'Quản lý báo cáo',
    url: PATH.ADMIN_REPORT,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
  {
    icon: 'i-material-symbols-person-search-outline-rounded',
    label: 'Quản lý tuyển dụng',
    url: PATH.ADMIN_RECRUITMENT,
    role: [ROLE.MASTERADMIN, ROLE.ADMIN, ROLE.SELLER],
  },
])
</script>

<style lang="scss" scoped>
.siderbar-main {
  padding: 30px 15px;
  height: 100%;
  width: 270px;
  border-right: 1px solid rgb(229, 234, 239);

  div {
    img {
      height: 80px;
      object-fit: cover;
    }
  }

  .list-item-sibar {
    height: calc(100% - 80px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
    .link {
      &:last-child {
        margin-bottom: 20px;
      }
      div {
        padding: 15px;
      }
    }
    .active-link {
      div {
        background-color: white;

        border-radius: 7px;

        span {
          font-weight: 400;
          color: #1eae9e;
        }
      }
    }
    .items-center {
      .icon {
        width: 20px;
        height: 20px;
      }

      span {
        font-weight: 400;
        color: white;
      }
    }
  }
}
</style>
