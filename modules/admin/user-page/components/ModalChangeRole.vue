<template>
  <UModal v-model="props.isOpen" prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Thay đổi vai trò người dùng
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="emits('handleCloseModal')"
          />
        </div>
      </template>
      <div class="space-y-1">
        <URadio
          v-for="method of listRole"
          :key="method.value"
          v-model="selected"
          v-bind="method"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton
            @click="emits('handleChangeRoleUser', selected)"
            v-if="authStore.userInfoData.role === ROLE.MASTERADMIN"
            >Save</UButton
          >
          <UButton
            @click="emits('handleCloseModal')"
            color="cyan"
            variant="outline"
            >Trở về</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
<script setup>
import { ROLE } from '@/core/constants/role'
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['handleCloseModal', 'handleChangeRoleUser'])

const selected = ref(ROLE.USER)

const listRole = [
  { value: ROLE.USER, label: ROLE.USER },
  { value: ROLE.ADMIN, label: ROLE.ADMIN },
  { value: ROLE.SELLER, label: ROLE.SELLER },
]
</script>
<style scoped lang="scss"></style>
