<script setup>
import { conventDate } from '@/core/utils/constants.js'
import { useUserAdminStore } from '../store'
import moment from 'moment'
import { ROLE } from '@/core/constants/role'
import ModalConfirm from '@/core/components/ModalConfirm'
import ModalChangeRole from './ModalChangeRole.vue'
import { UserStatus } from '@/core/constants/status/UserStatus.js'
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()

const toast = useToast()
const useUserAdmin = useUserAdminStore()

const key = ref('')
const loading = ref(false)

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const openModalChangeRole = ref(false)
const openModal = ref(false)
const idUserChange = ref('')
const statusUserChange = ref()

const date = ref()

const rows = computed(() => {
  return useUserAdmin.listUser.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

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

onMounted(async () => {
  loading.value = true
  await handleGetListUser()
  loading.value = false
})

watch(page, async () => {
  await handleGetList()
})

const handleGetListUser = async () => {
  page.value = 1
  await handleGetList()
}

const handleGetList = async () => {
  const res = await useUserAdmin.getListUser(page.value, {
    key: key.value,
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 00:00:00'),
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 23:59:59'),
  })
  if (res?.status) {
    useUserAdmin.listUser = res.data.data ?? []
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useUserAdmin.listUser = []
  }
}

const handleClearInput = async () => {
  page.value = 1
  key.value = ''
  date.value = null
  await handleGetListUser()
}

const handleChangeStatusUser = async () => {
  const res = await useUserAdmin.changeStatusUser(idUserChange.value)
  if (res.status) {
    openModal.value = false
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
    })
    let user = useUserAdmin.listUser.find(e => e.id === idUserChange.value)
    if (user) {
      user.status = res.data.status
    }
    idUserChange.value = ''
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

const handleChangeRoleUser = async role => {
  const res = await useUserAdmin.changeRoleUser(idUserChange.value, {
    role: role,
  })
  if (res.status) {
    openModalChangeRole.value = false
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
    })
    useUserAdmin.listUser = useUserAdmin.listUser.filter(
      e => e.id !== idUserChange.value
    )
    idUserChange.value = ''
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
]
</script>

<template>
  <div class="flex mt-3 search-user flex-wrap gap-4">
    <div class="w-64">
      <label for="">Tìm kiếm thành viên</label>
      <UInput
        v-model="key"
        size="lg"
        variant="outline"
        placeholder="Search..."
      />
    </div>
    <div class="w-72">
      <label for="">Ngày tạo</label>
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
      <UButton @click="handleGetListUser" block class="w-1/2" size="lg"
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

  <div class="table-user">
    <UTable
      :empty-state="{ label: 'Không có dữ liệu' }"
      :columns="columns"
      :rows="rows"
      :loading="loading"
    >
      <template #created_at-data="{ row }"
        >{{ conventDate(row.created_at) }}
      </template>
      <template #name-data="{ row }">
        {{ (row.first_name ?? '') + ' ' + (row.last_name ?? '') }}
      </template>
      <template #action-data="{ row }">
        <div class="flex gap-x-1">
          <UTooltip
            v-if="row.status === 2"
            text="Chặn tài khoản"
            :popper="{ arrow: true }"
          >
            <UButton
              @click="
                () => {
                  openModal = true
                  idUserChange = row.id
                  statusUserChange = row.status
                }
              "
              icon="i-material-symbols-lock-person-outline-sharp"
              size="sm"
              color="red"
              square
              variant="outline"
            />
          </UTooltip>
          <UTooltip
            v-if="row.status === 3"
            text="Mở chặn tài khoản"
            :popper="{ arrow: true }"
          >
            <UButton
              @click="
                () => {
                  openModal = true
                  idUserChange = row.id
                }
              "
              icon="i-material-symbols-lock-open-right-outline-sharp"
              size="sm"
              square
              variant="outline"
            />
          </UTooltip>
          <UTooltip
            v-if="authStore.userInfoData.role === ROLE.MASTERADMIN"
            text="Thay đổi vai trò người dùng"
            :popper="{ arrow: true }"
          >
            <UButton
              @click="
                () => {
                  openModalChangeRole = true
                  idUserChange = row.id
                }
              "
              icon="i-material-symbols-edit-square-outline-sharp"
              size="sm"
              color="cyan"
              square
              variant="outline"
            />
          </UTooltip>
          <UTooltip v-if="row.phone" text="Liên hệ" :popper="{ arrow: true }">
            <UButton
              :to="`tel:${row.phone}`"
              icon="i-ri-phone-fill"
              size="sm"
              color="cyan"
              square
              variant="outline"
            />
          </UTooltip>
        </div>
      </template>
      <template #status-data="{ row }">
        <UBadge size="xs" v-if="row.status == 2" variant="solid"
          >Kích hoạt</UBadge
        >
        <UBadge v-else-if="row.status == 3" color="red" variant="solid"
          >Chặn</UBadge
        >
      </template>
    </UTable>
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination v-model="page" :page-count="pageCount" :total="totalPage" />
    </div>
  </div>
  <ModalChangeRole
    :is-open="openModalChangeRole"
    @handleCloseModal="
      () => {
        openModalChangeRole = false
      }
    "
    @handleChangeRoleUser="handleChangeRoleUser"
  />
  <ModalConfirm
    :message="
      statusUserChange === UserStatus.ACTIVATED
        ? 'Bạn có chắc khoá tài khoản này không?'
        : 'Bạn có chắc mở khoá tài khoản này không?'
    "
    :isOpen="openModal"
    @handleConfirm="
      () => {
        handleChangeStatusUser()
      }
    "
    @handleCloseModal="
      () => {
        openModal = false
      }
    "
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
