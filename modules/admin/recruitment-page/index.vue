<script setup>
import { PATH } from '@/core/constants/index.js'
import { useRecruitmentAdminStore } from './store'
import moment from 'moment'
import { conventDate } from '@/core/utils/constants.js'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '@/core/constants/role'
import { LOCALES } from '@/core/utils/constants'

const authStore = useAuthStore()
const useRecruitmentAdmin = useRecruitmentAdminStore()
const toast = useToast()

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)
const loading = ref(false)

const openModal = ref(false)

const idRecruitment = ref()
const isChangeStatus = ref(false)

const listLang = ref([{ code: null, name: 'Tất cả' }, ...LOCALES])

const selectedLang = ref(listLang.value[0].code)

const currentLang = computed(() =>
  listLang.value.find(value => value.code === selectedLang.value)
)

const date = ref()
const key = ref('')

const status = [
  {
    name: 'Tất cả',
    id: null,
  },
  {
    name: 'Đang đăng tuyển',
    id: 1,
  },
  {
    name: 'Huỷ đăng tuyển',
    id: 2,
  },
]

const selectedStatus = ref(status[0].id)

const current = computed(() =>
  status.find(value => value.id === selectedStatus.value)
)

const rows = computed(() => {
  return useRecruitmentAdmin.listRecruitment.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

useHead({
  title: 'Quản lý tuyển dụng',
})

onMounted(async () => {
  await handleGetListRecruitment()
})

watch(page, async () => {
  await handleGetListRecruitment()
})

const handleClearInput = async () => {
  page.value = 1
  key.value = ''
  date.value = ''
  selectedLang.value = null
  selectedStatus.value = status[0].id
  await handleGetListRecruitment()
}

const handleGetListRecruitment = async () => {
  loading.value = true
  const data = {
    key: key.value,
    status: selectedStatus.value,
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 00:00:00'),
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 23:59:59'),
    lang: selectedLang.value,
  }
  const res = await useRecruitmentAdmin.getListRecruitment(page.value, data)

  if (res.status) {
    useRecruitmentAdmin.listRecruitment = res.data.data
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useRecruitmentAdmin.listRecruitment = []
    totalPage.value = 0
    pageCount.value = 0
  }
  loading.value = false
}

const handleChangeRecruitment = async () => {
  if (isChangeStatus.value) {
    await handleChangeStatusRecruitment()
  } else {
    await handleDeleteRecruitment()
  }
}

const handleDeleteRecruitment = async () => {
  const res = await useRecruitmentAdmin.deleteRecruitment(idRecruitment.value)
  if (res.status) {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
    idRecruitment.value = null
    openModal.value = false
    await handleGetListRecruitment()
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

const handleChangeStatusRecruitment = async () => {
  const res = await useRecruitmentAdmin.changeStatusRecruitment(
    idRecruitment.value
  )
  if (res.status) {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
    idRecruitment.value = null
    openModal.value = false
    isChangeStatus.value = false
    await handleGetListRecruitment()
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

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
    key: 'title',
    label: 'Tiêu đề',
  },
  {
    key: 'lang',
    label: 'Ngôn ngữ',
  },
  {
    key: 'status',
    label: 'Trạng thái',
  },
  {
    key: 'name',
    label: 'Người đăng',
  },
  {
    key: 'update_by',
    label: 'Người cập nhật',
  },
  {
    key: 'accept_by',
    label: 'Người Duyệt/Huỷ đăng',
  },
  {
    key: 'created_at',
    label: 'Ngày đăng',
  },
  {
    key: 'accept_at',
    label: 'Ngày Duyệt/Huỷ đăng',
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
  },
]

const format = date => {
  return `${
    date[0].getDate() < 10 ? '0' + date[0].getDate() : date[0].getDate()
  }/${
    date[0].getMonth() + 1 < 10
      ? '0' + (date[0].getMonth() + 1)
      : date[0].getMonth() + 1
  }/${date[0].getFullYear()} - ${
    date[1].getDate() < 10 ? '0' + date[1].getDate() : date[1].getDate()
  }/${
    date[1].getMonth() + 1 < 10
      ? '0' + (date[1].getMonth() + 1)
      : date[1].getMonth() + 1
  }/${date[1].getFullYear()}`
}

const getLangName = lang => {
  return LOCALES.find(item => item.code == lang)?.name || LOCALES[0].name
}
</script>
<template>
  <div>
    <NuxtLayout name="admin">
      <div class="recruitment-main">
        <h1>Quản lý tuyển dụng</h1>
        <div class="flex justify-end">
          <UButton
            :to="PATH.ADMIN_RECRUITMENT_CREATE"
            icon="i-material-symbols-add-rounded"
            size="lg"
            color="primary"
            variant="outline"
            label="Tạo bài tuyển dụng"
            :trailing="false"
          />
        </div>
        <div class="flex mt-3 search-user flex-wrap gap-4">
          <div class="w-64">
            <label for="">Tìm kiếm tuyển dụng</label>
            <UInput
              v-model="key"
              size="lg"
              variant="outline"
              placeholder="Search..."
            />
          </div>
          <div class="w-64">
            <label for="">Trạng thái tuyển dụng</label>
            <USelectMenu
              size="lg"
              v-model="selectedStatus"
              :options="status"
              value-attribute="id"
              option-attribute="name"
            >
              <template #label>
                {{ current.name }}
              </template>
            </USelectMenu>
          </div>
          <div class="w-72">
            <label for="">Ngày tạo tuyển dụng</label>
            <VueDatePicker
              :format="format"
              v-model="date"
              auto-apply
              placeholder="Ngày tạo tuyển dụng"
              range
              :enable-time-picker="false"
            />
          </div>
          <div class="w-72">
            <label for="">Ngôn ngữ</label>
            <USelectMenu
              size="lg"
              v-model="selectedLang"
              :options="listLang"
              value-attribute="code"
              option-attribute="name"
            >
              <template #label>
                {{ currentLang.name }}
              </template>
            </USelectMenu>
          </div>
          <div class="flex w-64 items-end gap-x-2">
            <UButton
              block
              class="w-1/2"
              @click="
                () => {
                  page = 1
                  handleGetListRecruitment()
                }
              "
              size="lg"
              >Tìm kiếm</UButton
            >
            <UButton
              color="cyan"
              variant="outline"
              block
              @click="handleClearInput()"
              class="w-1/2"
              size="lg"
              >Làm mới</UButton
            >
          </div>
        </div>
        <div class="table-news">
          <UTable
            :empty-state="{ label: 'Không có dữ liệu' }"
            :columns="columns"
            :rows="rows"
            :loading="loading"
          >
            <template #created_at-data="{ row }">
              {{ conventDate(row.created_at) }}
            </template>
            <template #lang-data="{ row }">
              <div class="min-w-[60px]">
                {{ getLangName(row.lang) }}
              </div>
            </template>
            <template #updated_at-data="{ row }">
              {{ conventDate(row.updated_at) }}
            </template>
            <template #status-data="{ row }">
              <UBadge size="xs" v-if="row.status === 1" variant="solid">
                Đang đăng tuyển
              </UBadge>
              <UBadge v-else-if="row.status == 2" color="red" variant="solid">
                Huỷ đăng tuyển
              </UBadge>
            </template>
            <template #accept_at-data="{ row }"
              >{{ conventDate(row.accept_at) }}
            </template>
            <template #accept_by-data="{ row }">
              {{
                [row?.accept_first_name, row?.accept_last_name]
                  .filter(item => item)
                  .join(' ')
              }}
            </template>
            <template #update_by-data="{ row }">
              {{
                [row?.update_first_name, row?.update_last_name]
                  .filter(item => item)
                  .join(' ')
              }}
            </template>
            <template #name-data="{ row }">
              {{
                [row?.first_name, row?.last_name].filter(item => item).join(' ')
              }}
            </template>
            <template #title-data="{ row }">
              <p class="truncate w-60">{{ row.title }}</p>
            </template>

            <template #action-data="{ row }">
              <UTooltip
                class="action-button"
                text="Chỉnh sửa tuyển dụng"
                :popper="{ arrow: true }"
              >
                <UButton
                  :to="`${PATH.ADMIN_RECRUITMENT_CREATE}/${row.slug}`"
                  icon="i-material-symbols-edit-square-outline-sharp"
                  size="sm"
                  color="blue"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="
                  row.status === 1 &&
                  authStore.userInfoData?.role !== ROLE.SELLER
                "
                class="action-button ml-1"
                text="Dừng đăng tuyển dụng"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      isChangeStatus = true
                      openModal = true
                      idRecruitment = row.recruitment_id
                    }
                  "
                  icon="i-material-symbols-cancel-outline"
                  size="sm"
                  color="red"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-else-if="authStore.userInfoData?.role !== ROLE.SELLER"
                class="action-button ml-1"
                text="Đăng tuyển dụng"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      isChangeStatus = true
                      openModal = true
                      idRecruitment = row.recruitment_id
                    }
                  "
                  icon="i-material-symbols-check-circle-outline"
                  size="sm"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="authStore.userInfoData?.role !== ROLE.SELLER"
                class="action-button ml-1"
                text="Xoá tuyển dụng"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      idRecruitment = row.recruitment_id
                    }
                  "
                  icon="i-material-symbols-delete-outline-rounded"
                  size="sm"
                  color="rose"
                  square
                  variant="solid"
                  :trailing="false"
                />
              </UTooltip>
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
      </div>
      <ModalConfirm
        :message="
          isChangeStatus
            ? 'Bạn có chắc chỉnh sửa trạng thái tin tuyển dụng này không?'
            : 'Bạn có chắc xoá tin tuyển dụng này không?'
        "
        :isOpen="openModal"
        @handleConfirm="
          () => {
            handleChangeRecruitment()
          }
        "
        @handleCloseModal="
          () => {
            openModal = false
            isChangeStatus = false
            idRecruitment = null
          }
        "
      />
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped>
.recruitment-main {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }

  .search-user {
    margin: 24px 0;

    div {
      label {
        font-size: 14px;
      }
    }
  }
}
</style>
