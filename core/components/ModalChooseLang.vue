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
            Chọn ngôn ngữ
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
        <span>Vui lòng chọn ngôn ngữ cần dịch</span>
        <USelect
          v-model="lang"
          :options="listLangOptions"
          option-attribute="name"
        />
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton
            @click="emits('handleChoose', lang)"
            color="primary"
            variant="solid"
          >
            Xác nhận
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
import { LOCALES } from '@/core/utils/constants'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  listLang: {
    type: Array,
    default: [],
  },
})

const lang = ref()

const listLangOptions = computed(() => {
  return LOCALES.filter(
    item => !props.listLang.some(el => el.lang === item.code)
  ).map(item => ({ name: item.name, value: item.code }))
})

watch(lang, (newValue, oldValue) => {
  console.log(newValue)
})

watch(
  () => props.isOpen,
  (newValue, oldValue) => {
    if (newValue) {
      lang.value = listLangOptions.value[0].value
    }
  }
)

const emits = defineEmits(['handleCloseModal', 'handleChoose'])
</script>

<style></style>
