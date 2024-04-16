<script setup>
import { UserStatus } from '@/core/constants/status/UserStatus.js'
import { conventDate } from '@/core/utils/constants.js'
import ModalCreateAccount from './components/ModalCreateAccount.vue'
import { useAccountAdminStore } from './store.js'
import { ROLE } from '@/core/constants/role/index.js'
import moment from 'moment/moment.js'

const useAccountAdmin = useAccountAdminStore()
const toast = useToast()

useHead({
  title: 'Tài khoản nhân viên',
})

const key = ref('')
const loading = ref(false)

const openModal = ref(false)
const openModalConfirm = ref(false)

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const idUserChange = ref('')
const statusUserChange = ref()
const detailUserChange = ref(null)

const role = ['Tất cả', ROLE.ADMIN, ROLE.SELLER]

const selectedRole = ref(role[0])

const rows = computed(() => {
  return useAccountAdmin.listAccountAdmin.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

const date = ref()

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
  await handleGetListAdmin()
})

watch(page, async () => {
  await handleGetListAdmin()
})

const handleGetListAdmin = async () => {
  loading.value = true
  const data = {
    key: key.value,
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 00:00:00'),
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 23:59:59'),
    role: selectedRole.value === role[0] ? null : selectedRole.value,
  }

  const res = await useAccountAdmin.getListAccountAdmin(page.value, data)
  if (res.status) {
    useAccountAdmin.listAccountAdmin = res.data.data || []
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useAccountAdmin.listAccountAdmin = []
  }
  loading.value = false
}

const handleClearInput = async () => {
  key.value = ''
  date.value = ''
  selectedRole.value = role[0]
  page.value = 1
  await handleGetListAdmin()
}

const handleChangeStatusUser = async () => {
  const res = await useAccountAdmin.changeStatusUser(idUserChange.value)
  if (res.status) {
    openModalConfirm.value = false
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
    })
    let user = useAccountAdmin.listAccountAdmin.find(
      e => e.id === idUserChange.value
    )
    if (user) {
      user.status = res.data.status
    }
    idUserChange.value = null
    statusUserChange.value = null
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
    key: 'role',
    label: 'Role',
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
  <div>
    <NuxtLayout name="admin">
      <div class="user-main">
        <h1>Tài khoản nhân viên</h1>
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
            label="Tạo tài khoản"
            :trailing="false"
          />
        </div>
        <div class="flex flex-wrap search-user">
          <div class="w-1/3 xl:w-1/4 2xl:w-1/6 p-1">
            <label for="">Tìm kiếm thành viên</label>
            <UInput
              v-model="key"
              size="lg"
              variant="outline"
              placeholder="Search..."
            />
          </div>
          <div class="w-1/3 xl:w-1/4 2xl:w-1/6 p-1">
            <label>Role</label>
            <USelectMenu size="lg" v-model="selectedRole" :options="role" />
          </div>
          <div class="w-1/3 xl:w-1/4 2xl:w-1/6 p-1">
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

          <div class="flex w-2/4 xl:w-1/4 p-1 items-end gap-x-2">
            <UButton
              block
              class="w-1/2"
              size="lg"
              @click="
                () => {
                  page = 1
                  handleGetListAdmin()
                }
              "
              >Tìm kiếm</UButton
            >
            <UButton
              @click="handleClearInput"
              color="cyan"
              variant="outline"
              block
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
            ><template #created_at-data="{ row }">{{
              conventDate(row.created_at)
            }}</template
            ><template #name-data="{ row }">
              {{ (row.first_name ?? '') + ' ' + (row.last_name ?? '') }}
            </template>
            <template #action-data="{ row }">
              <div class="flex gap-x-1">
                <UTooltip
                  v-if="row.status === UserStatus.ACTIVATED"
                  text="Chặn tài khoản"
                  :popper="{ arrow: true }"
                >
                  <UButton
                    @click="
                      () => {
                        openModalConfirm = true
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
                  v-if="row.status === UserStatus.BLOCK"
                  text="Mở chặn tài khoản"
                  :popper="{ arrow: true }"
                >
                  <UButton
                    @click="
                      () => {
                        openModalConfirm = true
                        idUserChange = row.id
                        statusUserChange = row.status
                      }
                    "
                    icon="i-material-symbols-lock-open-right-outline-sharp"
                    size="sm"
                    square
                    variant="outline"
                  />
                </UTooltip>
                <UTooltip text="Thông tin chi tiết" :popper="{ arrow: true }">
                  <UButton
                    @click="
                      () => {
                        openModal = true
                        detailUserChange = row
                      }
                    "
                    icon="i-material-symbols-person-search-outline"
                    size="sm"
                    color="cyan"
                    square
                    variant="outline"
                  />
                </UTooltip>
              </div>
            </template>
            <template #status-data="{ row }">
              <UBadge
                size="xs"
                v-if="row.status === UserStatus.ACTIVATED"
                variant="solid"
                >Kích hoạt</UBadge
              >
              <UBadge
                v-else-if="row.status === UserStatus.BLOCK"
                color="red"
                variant="solid"
                >Chặn</UBadge
              >
            </template>
            <template #role-data="{ row }">
              <UBadge
                size="xs"
                :color="row.role === ROLE.ADMIN ? 'orange' : 'violet'"
                variant="outline"
                >{{ row.role }}</UBadge
              >
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

        <ModalCreateAccount
          :isOpen="openModal"
          :detail-user="detailUserChange"
          :check="detailUserChange ? true : false"
          @handleCloseModal="
            () => {
              openModal = false
              detailUserChange = null
            }
          "
        />
        <ModalConfirm
          :message="
            statusUserChange === UserStatus.ACTIVATED
              ? 'Bạn có chắc khoá tài khoản này không?'
              : 'Bạn có chắc mở khoá tài khoản này không?'
          "
          :isOpen="openModalConfirm"
          @handleConfirm="
            () => {
              handleChangeStatusUser()
            }
          "
          @handleCloseModal="
            () => {
              openModalConfirm = false
            }
          "
        />
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.user-main {
  padding: 20px;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }

  .search-user {
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
