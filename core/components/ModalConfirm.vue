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
            Xác nhận
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
      <div>
        <span>{{ props.message }}</span>
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton
            @click="emits('handleConfirm')"
            color="primary"
            variant="solid"
            >{{ props.titileBtn1 }}</UButton
          >
          <UButton
            v-if="props.showBtn2"
            @click="emits('handleConfirmV2')"
            color="amber"
            variant="solid"
            >{{ props.titileBtn2 }}</UButton
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
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  titileBtn1: {
    type: String,
    default: 'Đồng ý',
  },
  titileBtn2: {
    type: String,
    default: 'Đồng ý',
  },
  showBtn2: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'handleCloseModal',
  'handleConfirm',
  'handleConfirmV2',
])
</script>

<style></style>
