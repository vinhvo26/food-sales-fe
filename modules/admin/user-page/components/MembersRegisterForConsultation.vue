<script setup>
import { conventDate } from '@/core/utils/constants.js'
import { useUserAdminStore } from '../store'
import ModalDetailMember from './ModalDetailMember.vue'
import { ContactsStatus } from '@/core/constants/contacts'
import moment from 'moment'
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()
const useUserAdmin = useUserAdminStore()
const toast = useToast()

const date = ref()
const key = ref('')
const loading = ref(false)

const openModal = ref(false)
const detail = ref({})

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const rows = computed(() => {
  return useUserAdmin.listUserConsultation.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

const typeContacts = [
  {
    name: 'Tất cả',
    id: null,
  },
  {
    name: 'Đang tư vấn',
    id: 2,
  },
  {
    name: 'Chờ tư vấn',
    id: 1,
  },
  {
    name: 'Hoàn thành',
    id: 3,
  },
]

const selectedType = ref(typeContacts[0].id)

const currentType = computed(() =>
  typeContacts.find(value => value.id === selectedType.value)
)

onMounted(() => {
  handleGetConsultationUser()
})

watch(page, async () => {
  await handleGetConsultationUser()
})

const handleGetConsultationUser = async () => {
  loading.value = true
  const body = {
    key: key.value,
    status: selectedType.value,
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 00:00:00'),
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 23:59:59'),
  }
  const res = await useUserAdmin.getListUserConsultation(page.value, body)
  if (res?.status) {
    useUserAdmin.listUserConsultation = res.data.data ?? []
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useUserAdmin.listUserConsultation = []
  }
  loading.value = false
}

const handleSearchConsultationUser = async () => {
  page.value = 1
  await handleGetConsultationUser()
}

const handleClearInput = async () => {
  page.value = 1
  key.value = ''
  date.value = null
  selectedType.value = typeContacts[0].id
  await handleGetConsultationUser()
}

const handleChangeContacts = async status => {
  const body = {
    contacts_id: detail.value.contacts_id,
    status: status,
  }
  const res = await useUserAdmin.updateContacts(body)

  if (res.status) {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
    })

    const dataContacts = useUserAdmin.listUserConsultation.find(
      e => e.contacts_id === detail.value.contacts_id
    )
    if (dataContacts) {
      dataContacts.status = status
    }
    await handleGetConsultationUser()
    openModal.value = false
    detail.value = null
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
    key: 'name',
    label: 'Họ và tên',
  },
  {
    key: 'status',
    label: 'Trạng thái',
  },
  {
    key: 'posts_id',
    label: 'Mã dự án',
  },
  {
    key: 'name_update_by',
    label: 'Nhân viên tư vấn',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
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
</script>

<template>
  <div class="flex mt-3 search-user flex-wrap gap-4">
    <div class="w-64">
      <label for="">Tên thành viên</label>
      <UInput
        v-model="key"
        size="lg"
        variant="outline"
        placeholder="Search..."
      />
    </div>
    <div class="w-64">
      <label for="">Trạng thái tư vấn</label>
      <USelectMenu
        size="lg"
        v-model="selectedType"
        :options="typeContacts"
        value-attribute="id"
        option-attribute="name"
      >
        <template #label>
          {{ currentType.name }}
        </template>
      </USelectMenu>
    </div>

    <div class="w-72">
      <label for="">Ngày tạo tư vấn</label>
      <VueDatePicker
        :format="format"
        v-model="date"
        auto-apply
        placeholder="Ngày tạo tài khoản"
        range
        :enable-time-picker="false"
      />
    </div>

    <div class="flex w-64 items-end gap-x-2">
      <UButton
        block
        class="w-1/2"
        @click="handleSearchConsultationUser"
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

  <div class="table-user mt-4">
    <UTable
      :empty-state="{ label: 'Không có dữ liệu' }"
      :columns="columns"
      :rows="rows"
      :loading="loading"
    >
      <template #created_at-data="{ row }">
        {{ conventDate(row.created_at) }}
      </template>
      <template #updated_at-data="{ row }">
        {{ conventDate(row.updated_at) }}
      </template>
      <template #name-data="{ row }">
        {{ row.name }}
      </template>
      <template #action-data="{ row }">
        <div class="flex gap-x-1">
          <UTooltip
            class="action-button"
            text="Chi tiết yêu cầu"
            :popper="{ arrow: true }"
          >
            <UButton
              @click="
                () => {
                  openModal = true
                  detail = row
                }
              "
              icon="i-material-symbols-info-outline-rounded"
              size="sm"
              color="blue"
              square
              variant="outline"
            />
          </UTooltip>
        </div>
      </template>
      <template #status-data="{ row }">
        <UBadge v-if="row.status == 2" variant="solid">Đang tư vấn</UBadge>
        <UBadge v-else-if="row.status == 3" color="blue" variant="solid"
          >Hoàn thành</UBadge
        >
        <UBadge v-else-if="row.status == 1" color="yellow" variant="solid"
          >Chờ tư vấn</UBadge
        >
      </template>
      <template #name_update_by-data="{ row }">
        {{ [row?.first_name, row?.last_name].filter(item => item).join(' ') }}
      </template>
    </UTable>
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination v-model="page" :page-count="pageCount" :total="totalPage" />
    </div>
  </div>
  <ModalDetailMember
    :detailObject="detail"
    :isOpen="openModal"
    @handleCloseModal="openModal = false"
    @handleChangeContacts="handleChangeContacts"
  />
</template>

<style scoped lang="scss">
.user-main {
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

  .table-user {
    .action-button {
      margin: 0 2px;
    }
  }
}
</style>
