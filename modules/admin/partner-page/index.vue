<script setup>
import { ROLE } from '@/core/constants/role'
import LogoPartner from './components/LogoPartner.vue'
import ManagerPartner from './components/ManagerPartner.vue'
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()
const activeTab = ref(1)

const handleChangeTabs = index => {
  activeTab.value = index
}

useHead({
  title: 'Quản lý đối tác',
})

const tabs = [
  {
    tille: 'Quản lý đối tác',
    index: 1,
  },
  { tille: 'Quản lý logo đối tác', index: 2 },
]
</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <div class="user-main">
        <h1>Quản lý đối tác</h1>

        <div
          class="mt-2 text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
        >
          <ul class="flex flex-wrap -mb-px">
            <li v-for="(item, index) in tabs" :key="index" class="me-2">
              <a
                @click="handleChangeTabs(item.index)"
                href="#"
                class="inline-block p-4 border-b-2"
                :class="
                  ROLE.SELLER === authStore.userInfoData.role &&
                  item.index === 2
                    ? 'hidden'
                    : activeTab === item.index
                    ? 'text-primary-600 border-primary-600 rounded-t-lg active dark:text-primary-500 dark:border-primary-500'
                    : 'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                "
                >{{ item.tille }}</a
              >
            </li>
          </ul>
        </div>

        <component v-if="activeTab === 1" :is="ManagerPartner" />
        <component v-else :is="LogoPartner" />
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.user-main {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }

  .table-user {
    .action-button {
      margin: 0 2px;
    }
  }
}
</style>
