<template>
  <UModal
    :ui="{
      width: 'w-full sm:max-w-3xl',
    }"
    v-model="props.isOpen"
    prevent-close
  >
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
            Thông tin yêu cầu
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
      <div class="flex gap-4 flex-col">
        <div>
          <label>Tên</label>
          <UInput disabled :value="props.detailObject?.name" size="lg" />
        </div>
        <div>
          <label>Email</label>
          <UInput disabled :value="props.detailObject?.email" size="lg" />
        </div>
        <div>
          <label>Số điện thoại</label>
          <UInput disabled :value="props.detailObject?.phone" size="lg" />
        </div>
        <div v-if="props.detailObject?.posts_id">
          <label>Mã dự án</label>
          <UInput :value="props.detailObject?.posts_id" disabled size="lg" />
        </div>
        <div v-if="props.detailObject?.posts_id">
          <label>Dự án</label>
          <UTextarea
            :rows="5"
            :value="props.detailObject?.title"
            disabled
            size="lg"
          />
        </div>
        <div v-else>
          <label>Yêu cầu</label>
          <UTextarea
            :rows="10"
            :value="props.detailObject?.content"
            disabled
            size="lg"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton
            v-if="
              props.detailObject?.status === ContactsStatus.WAITING &&
              !props.detailObject?.update_by
            "
            @click="emits('handleChangeContacts', ContactsStatus.ACCEPT)"
            color="primary"
            variant="solid"
            >Nhận tư vấn</UButton
          >
          <UButton
            v-if="
              props.detailObject?.status === ContactsStatus.ACCEPT &&
              authStore.userInfoData.id === props.detailObject?.update_by
            "
            @click="emits('handleChangeContacts', ContactsStatus.COMPLETE)"
            color="primary"
            variant="solid"
            >Hoàn thành
          </UButton>
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
import { ContactsStatus } from '@/core/constants/contacts'
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  detailObject: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['handleCloseModal', 'handleChangeContacts'])
</script>
<style scoped lang="scss"></style>
