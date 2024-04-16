<script setup>
import { PATH } from '@/core/constants/index.js'
import { useReportAdminStore } from './store'
import { conventDate } from '@/core/utils/constants.js'
import { useSystemStore } from '@/core/store/system.js'
import { useAuthStore } from '@/core/store/auth'
import moment from 'moment'
import { ROLE } from '@/core/constants/role'

const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const toast = useToast()
const useReportAdmin = useReportAdminStore()

const loading = ref(false)
const openModal = ref(false)
const idReport = ref()

const date = ref()
const key = ref('')

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const rows = computed(() => {
  return useReportAdmin.listReport.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

const listSeller = ref([
  {
    name: 'Tất cả',
    id: null,
  },
])

const selected = ref(listSeller.value[0].id)

const current = computed(() =>
  listSeller.value.find(value => value.id === selected.value)
)

useHead({
  title: 'Quản lý báo cáo',
})

onMounted(async () => {
  await handleGetListReport()
  if (authStore.userInfoData?.role != ROLE.SELLER) {
    await handleGetListSeller()
  }
})

watch(page, async () => {
  await handleGetListReport()
})

const handleGetListSeller = async () => {
  const res = await useReportAdmin.getListSeller()
  if (res?.status) {
    res?.data.forEach(element => {
      listSeller.value.push({
        id: element.id,
        name: [element?.first_name, element?.last_name]
          .filter(item => item)
          .join(' '),
      })
    })
  } else {
    listSeller.value = [
      {
        name: 'Tất cả',
        id: null,
      },
    ]
  }
}

const handleClearInput = async () => {
  page.value = 1
  key.value = ''
  date.value = ''
  selected.value = listSeller.value[0].id
  await handleGetListReport()
}

const handleGetListReport = async () => {
  loading.value = true
  const data = {
    key: key.value,
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 00:00:00'),
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 23:59:59'),
    seller_id: selected,
  }
  const res = await useReportAdmin.getListReport(page.value, data)
  if (res.status) {
    useReportAdmin.listReport = res.data?.data
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useReportAdmin.listReport = []
    totalPage.value = 1
    pageCount.value = 1
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
  loading.value = false
}

const handleDeleteReport = async () => {
  try {
    const res = await useReportAdmin.deleteReport(idReport.value)
    if (res.status) {
      toast.add({
        title: 'Notification',
        description: res.message,
        icon: 'i-heroicons-check-circle',
      })
      await handleGetListReport()
      openModal.value = false
      setLoading(false)
    } else {
      setLoading(false)
      toast.add({
        title: 'Notification',
        description: res.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  } catch (error) {
  } finally {
    setLoading(false)
  }
}

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

const handleCompareDate = date => {
  if (
    new Date(date).getFullYear() === new Date().getFullYear() &&
    new Date(date).getMonth() === new Date().getMonth() &&
    new Date(date).getDate() === new Date().getDate()
  ) {
    return true
  } else {
    return false
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
    label: 'Báo cáo',
  },
  {
    key: 'name',
    label: 'Người báo cáo',
  },
  {
    key: 'created_at',
    label: 'Ngày báo cáo',
  },
]
</script>
<template>
  <div>
    <NuxtLayout name="admin">
      <div class="report-main">
        <h1>Quản lý báo cáo</h1>
        <div class="flex justify-end">
          <UButton
            :to="PATH.ADMIN_REPORT_CREATE"
            icon="i-material-symbols-add-rounded"
            size="lg"
            color="primary"
            variant="outline"
            label="Tạo báo cáo"
            :trailing="false"
          />
        </div>
        <div class="flex mt-3 search-user flex-wrap gap-4">
          <div class="w-64">
            <label for="">Tìm kiếm báo cáo</label>
            <UInput
              v-model="key"
              size="lg"
              variant="outline"
              placeholder="Search..."
            />
          </div>
          <div v-if="authStore.userInfoData?.role !== ROLE.SELLER" class="w-72">
            <label for="">Danh sách Seller</label>
            <USelectMenu
              size="lg"
              v-model="selected"
              :options="listSeller"
              placeholder="Danh sách Seller"
              value-attribute="id"
              option-attribute="name"
            >
              <template #label>
                {{ current.name }}
              </template>
            </USelectMenu>
          </div>
          <div class="w-72">
            <label for="">Ngày tạo báo cáo</label>
            <VueDatePicker
              :format="format"
              v-model="date"
              auto-apply
              placeholder="Ngày tạo báo cáo"
              range
              :enable-time-picker="false"
            />
          </div>
          <div class="flex w-64 items-end gap-x-2">
            <UButton
              block
              class="w-1/2"
              @click="
                () => {
                  page = 1
                  handleGetListReport()
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
            <template #title-data="{ row }">
              Báo cáo:
              {{
                [row?.first_name, row?.last_name]
                  .filter(item => item)
                  .join(' ') +
                ' - ' +
                conventDate(row.created_at)
              }}
            </template>
            <template #created_at-data="{ row }">
              {{ conventDate(row.created_at) }}
            </template>
            <template #updated_at-data="{ row }">
              {{ conventDate(row.updated_at) }}
            </template>
            <template #name-data="{ row }">
              {{
                [row?.first_name, row?.last_name].filter(item => item).join(' ')
              }}
            </template>
            <template #action-data="{ row }">
              <UTooltip
                class="action-button"
                text="Chi tiết báo cáo"
                :popper="{ arrow: true }"
              >
                <UButton
                  :to="`${PATH.ADMIN_REPORT}/${row.report_id}`"
                  icon="i-ri-eye-line"
                  size="sm"
                  color="cyan"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="
                  authStore.userInfoData?.id === row.create_by &&
                  handleCompareDate(row.created_at)
                "
                class="action-button"
                text="Chỉnh sửa báo cáo"
                :popper="{ arrow: true }"
              >
                <UButton
                  :to="`${PATH.ADMIN_REPORT_CREATE}/${row.report_id}`"
                  icon="i-material-symbols-edit-square-outline-sharp"
                  size="sm"
                  color="blue"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="
                  authStore.userInfoData?.id === row.create_by &&
                  handleCompareDate(row.created_at)
                "
                class="action-button"
                text="Xoá báo cáo"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      idReport = row.report_id
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
        :message="'Bạn có chắc xoá báo cáo này không?'"
        :isOpen="openModal"
        @handleConfirm="
          () => {
            handleDeleteReport()
          }
        "
        @handleCloseModal="
          () => {
            openModal = false
          }
        "
      />
    </NuxtLayout>
  </div>
</template>
<style lang="scss" scoped>
.report-main {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }

  .search-user {
    margin: 24px 0;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 15px 10px;

    div {
      label {
        font-size: 14px;
      }
    }
  }

  .table-news {
    .action-button {
      margin: 0 2px;
    }
  }
}
</style>
