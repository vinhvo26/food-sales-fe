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
            {{
              props.checkEdit
                ? 'Cập nhật Lĩnh vực/Ngành nghề'
                : 'Thêm Lĩnh vực/Ngành nghề'
            }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="
              () => {
                cleanInput()
                emits('handleCloseModal')
              }
            "
          />
        </div>
      </template>
      <div class="flex gap-4 main-modal-create flex-col">
        <div v-if="props.categoryEdit?.parent_category_id !== 0">
          <label>Loại hình</label>
          <USelectMenu
            size="lg"
            v-model="selectedCategory"
            :options="props.listCategory"
            value-attribute="category_id"
            option-attribute="category_name"
          >
            <template #label>
              {{ currentCategory?.category_name }}
            </template>
          </USelectMenu>
        </div>
        <div>
          <label>Tên Lĩnh vực/Ngành nghề (Tiếng Việt)</label>
          <UInput size="lg" v-model="nameCategory" />
        </div>
        <div>
          <label>Tên Lĩnh vực/Ngành nghề (Tiếng Anh)</label>
          <UInput size="lg" v-model="nameCategoryEn" />
        </div>
        <div>
          <label>Tên Lĩnh vực/Ngành nghề (Tiếng Nhật)</label>
          <UInput size="lg" v-model="nameCategoryJp" />
        </div>
        <div>
          <label>Tên Lĩnh vực/Ngành nghề (Tiếng Trung Quốc)</label>
          <UInput size="lg" v-model="nameCategoryCn" />
        </div>
        <div>
          <label>Tên Lĩnh vực/Ngành nghề (Tiếng Hàn)</label>
          <UInput size="lg" v-model="nameCategoryKr" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton
            color="primary"
            @click="handleCreateCategory"
            variant="solid"
          >
            Save
          </UButton>
          <UButton
            @click="
              () => {
                cleanInput()
                emits('handleCloseModal')
              }
            "
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
import { useCategoriesAdminStore } from '../store.js'

const toast = useToast()
const useCategoriesAdmin = useCategoriesAdminStore()

const nameCategory = ref('')
const nameCategoryEn = ref('')
const nameCategoryCn = ref('')
const nameCategoryJp = ref('')
const nameCategoryKr = ref('')

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  checkEdit: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  categoryEdit: {
    type: Object,
    default: () => ({}),
  },
  listCategory: {
    type: Array,
    default: () => [],
  },
})

const emits = defineEmits(['handleCloseModal', 'handleRefreshList'])
const selectedCategory = ref(props.listCategory[0]?.category_id)
const currentCategory = computed(() =>
  props.listCategory?.find(
    value => value.category_id === selectedCategory.value
  )
)
watch(
  () => props.categoryEdit,
  newVal => {
    nameCategory.value = newVal?.category_name
    nameCategoryEn.value = newVal?.category_name_en
    nameCategoryCn.value = newVal?.category_name_cn
    nameCategoryJp.value = newVal?.category_name_jp
    nameCategoryKr.value = newVal?.category_name_kr
    selectedCategory.value =
      newVal?.parent_category_id ?? props.listCategory[0]?.category_id
  }
)

const handleCreateCategory = async () => {
  if (
    selectedCategory.value === props.listCategory[0]?.category_id ||
    !nameCategory.value?.trim()
  ) {
    toast.add({
      title: 'Notification',
      description: 'Tiếng Việt là bắt buộc!',
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
    return
  }
  const body = {
    parent_category_id: selectedCategory.value,
    category_name: nameCategory.value?.trim(),
    category_name_en: nameCategoryEn.value?.trim(),
    category_name_kr: nameCategoryKr.value?.trim(),
    category_name_cn: nameCategoryCn.value?.trim(),
    category_name_jp: nameCategoryJp.value?.trim(),
    category_id: props.categoryEdit?.category_id,
  }

  const res = await useCategoriesAdmin.createCategory(body)
  if (res.status) {
    toast.add({
      title: 'Notification',
      description: 'Thành công!',
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
    cleanInput()
    emits('handleRefreshList')
    emits('handleCloseModal')
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

const cleanInput = () => {
  nameCategory.value = ''
  nameCategoryEn.value = ''
  nameCategoryKr.value = ''
  nameCategoryCn.value = ''
  nameCategoryJp.value = ''
  selectedCategory.value = props.listCategory[0]?.category_id
}
</script>
<style scoped lang="scss">
.main-modal-create {
  .validate-error {
    border-bottom: none !important;
    :deep(input) {
      border: 1px solid #ff424e !important;

      &:focus {
        border: none !important;
      }
    }
  }
}
</style>

