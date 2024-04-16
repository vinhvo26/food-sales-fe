<script setup>
import { useCategoriesAdminStore } from './store.js'
import { conventDate } from '@/core/utils/constants.js'
import ModalCreateCategory from './components/ModalCreateCategory.vue'

const useCategoriesAdmin = useCategoriesAdminStore()
const toast = useToast()

useHead({
  title: 'Quản lý danh mục',
})

const key = ref('')
const loading = ref(false)
const idEdit = ref(null)
const idDelete = ref(null)
const valueEdit = ref('')

const categoryEdit = ref()

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const listCategory = ref([
  {
    category_name: 'Tất cả',
    category_id: null,
  },
])

const openModal = ref(false)
const openModalDelete = ref(false)

const selectedCategory = ref(listCategory.value[0].category_id)

const currentCategory = computed(() =>
  listCategory.value.find(value => value.category_id === selectedCategory.value)
)

const rows = computed(() => {
  return useCategoriesAdmin.listCategories.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

onMounted(async () => {
  Promise.all([handleGetListCategory(), handleGetListCategories()])
})

watch(page, async () => {
  await handleGetListCategories()
})

const handleGetListCategory = async () => {
  const res = await useCategoriesAdmin.getListCategory()
  if (res.status) {
    useCategoriesAdmin.listCategoriesLevel1 = res.data
    listCategory.value = [...listCategory.value, ...res.data]
  }
}

const handleCleanGetListCategories = async () => {
  selectedCategory.value = listCategory.value[0].category_id
  key.value = ''
  page.value = 1
  await handleGetListCategories()
}

const handleGetListCategories = async () => {
  loading.value = true
  const data = {
    category_id: selectedCategory.value,
    key: key.value,
  }
  const res = await useCategoriesAdmin.getListCategoriesAdmin(page.value, data)
  if (res.status) {
    useCategoriesAdmin.listCategories = res.data.data || []
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useCategoriesAdmin.listCategories = []
  }
  loading.value = false
}

const handleUpdateCategory = async () => {
  const data = {
    category_name: valueEdit.value,
    category_id: idEdit.value,
  }
  const res = await useCategoriesAdmin.updateCategory(data)
  if (res.status) {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
    await handleGetListCategories()
    idEdit.value = null
    valueEdit.value = ''
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

const handleDeleteCategory = async () => {
  const res = await useCategoriesAdmin.deleteCategory(idDelete.value)
  if (res.status) {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
    openModalDelete.value = false
    await handleGetListCategories()
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

// const format = date => {
//   return `${
//     date[0].getDate() < 10 ? '0' + date[0].getDate() : date[0].getDate()
//   }/${
//     date[0].getMonth() + 1 < 10
//       ? '0' + (date[0].getMonth() + 1)
//       : date[0].getMonth() + 1
//   }/${date[0].getFullYear()} - ${
//     date[1].getDate() < 10 ? '0' + date[1].getDate() : date[1].getDate()
//   }/${
//     date[1].getMonth() + 1 < 10
//       ? '0' + (date[1].getMonth() + 1)
//       : date[1].getMonth() + 1
//   }/${date[1].getFullYear()}`
// }

const columns = [
  {
    key: 'index',
    label: '#',
  },
  {
    key: 'action',
    label: 'Thao tác',
  },
  {
    key: 'category_name',
    label: 'Lĩnh vực/Ngành nghề',
  },
  {
    key: 'parent_category_name',
    label: 'Loại hình',
  },
  {
    key: 'name_update',
    label: 'Người cập nhật',
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
  },
]
</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <div class="categories-main">
        <h1>Quản lý danh mục</h1>
        <div class="flex justify-end mt-3">
          <UButton
            @click="
              () => {
                openModal = true
              }
            "
            icon="i-material-symbols-add-rounded"
            size="lg"
            color="primary"
            variant="outline"
            label="Thêm Lĩnh vực/Ngành nghề"
            :trailing="false"
          />
        </div>
        <div class="flex mt-3 flex-wrap">
          <div class="w-1/3 xl:w-1/4 2xl:w-1/6 p-1">
            <label for="">Tìm kiếm danh mục</label>
            <UInput
              v-model="key"
              size="lg"
              variant="outline"
              placeholder="Search..."
            />
          </div>
          <div class="w-1/3 xl:w-1/4 2xl:w-1/6 p-1">
            <label for="">Loại hình</label>
            <USelectMenu
              size="lg"
              v-model="selectedCategory"
              :options="listCategory"
              value-attribute="category_id"
              option-attribute="category_name"
            >
              <template #label>
                {{ currentCategory?.category_name }}
              </template>
            </USelectMenu>
          </div>
          <div class="flex w-2/4 xl:w-1/4 p-1 items-end gap-x-2">
            <UButton
              block
              class="w-1/2"
              @click="
                () => {
                  page = 1
                  handleGetListCategories()
                }
              "
              size="lg"
              >Tìm kiếm</UButton
            >
            <UButton
              color="cyan"
              variant="outline"
              @click="handleCleanGetListCategories"
              block
              class="w-1/2"
              size="lg"
              >Làm mới</UButton
            >
          </div>
        </div>

        <div class="table-user mt-4">
          <UTable
            :loading="loading"
            :empty-state="{ label: 'Không có dữ liệu' }"
            :columns="columns"
            :rows="rows"
          >
            <template #created_at-data="{ row }"
              >{{ conventDate(row.created_at) }}
            </template>
            <template #updated_at-data="{ row }"
              >{{ conventDate(row.updated_at) }}
            </template>
            <template #name_update-data="{ row }">
              {{
                [row?.first_name, row?.last_name].filter(item => item).join(' ')
              }}
            </template>
            <template #action-data="{ row }">
              <UTooltip
                class="action-button"
                text="Chỉnh sửa danh mục"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      categoryEdit = row
                    }
                  "
                  icon="i-material-symbols-edit-square-outline-sharp"
                  size="sm"
                  color="blue"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="row.parent_category_id !== 0"
                class="action-button"
                text="Xoá tin tức"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModalDelete = true
                      idDelete = row.category_id
                    }
                  "
                  icon="i-material-symbols-delete-outline-rounded"
                  size="sm"
                  color="rose"
                  square
                  variant="outline"
                  :trailing="false"
                />
              </UTooltip>
            </template>
            <template #category_name-data="{ row }">
              <div v-if="idEdit !== row.category_id">
                {{ row.category_name }}
              </div>
              <div v-else>
                <UInput
                  v-model="valueEdit"
                  :ui="{ icon: { trailing: { pointer: '' } } }"
                >
                  <template #trailing>
                    <UButton
                      color="primary"
                      variant="link"
                      icon="i-material-symbols-check-small"
                      :padded="false"
                      @click="handleUpdateCategory"
                    />
                    <UButton
                      class="ml-1"
                      color="red"
                      variant="link"
                      icon="i-heroicons-x-mark-20-solid"
                      :padded="false"
                      @click="
                        () => {
                          idEdit = null
                          valueEdit = ''
                        }
                      "
                    />
                  </template>
                </UInput>
              </div>
            </template>
          </UTable>
          <div
            class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
          >
            <UPagination
              v-model="page"
              :page-count="pageCount"
              :total="totalPage"
            />
          </div>
        </div>
        <ModalCreateCategory
          :isOpen="openModal"
          :list-category="listCategory"
          :categoryEdit="categoryEdit"
          :checkEdit="categoryEdit ? true : false"
          @handleRefreshList="handleCleanGetListCategories"
          @handleCloseModal="
            () => {
              categoryEdit = null
              openModal = false
            }
          "
        />
        <ModalConfirm
          :message="'Bạn có chắc xoá danh mục này không?'"
          :isOpen="openModalDelete"
          @handleConfirm="
            () => {
              handleDeleteCategory()
            }
          "
          @handleCloseModal="
            () => {
              openModalDelete = false
            }
          "
        />
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.categories-main {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }

  .search-categories {
    label {
      font-size: 14px;
    }
  }

  .table-user {
    .action-button {
      margin: 0 2px;
    }
  }
}
</style>
