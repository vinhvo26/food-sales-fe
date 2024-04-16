<template>
  <div class="w-full flex justify-end pt-5 pb-5">
    <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton
        color="white"
        :label="
          [
            authStore.userInfoData?.first_name,
            authStore.userInfoData?.last_name,
          ]
            .filter(item => item)
            .join(' ')
        "
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
    </UDropdown>
  </div>
</template>
<script setup>
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()

const emits = defineEmits(['handleOpenModal'])

const items = [
  [
    {
      label: 'Thay đổi mật khẩu',
      icon: 'i-heroicons-lock-closed',
      click: () => emits('handleOpenModal'),
    },
    {
      label: 'Đăng xuất',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => authStore.logoutAdmin(),
    },
  ],
]

</script>
