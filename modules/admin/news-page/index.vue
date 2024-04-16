<template>
  <div>
    <NuxtLayout name="admin">
      <div class="news-main">
        <h1>Quản lý tin tức</h1>
        <div class="flex justify-end">
          <UButton
            :to="PATH.ADMIN_NEWS_CREATE"
            icon="i-material-symbols-add-rounded"
            size="lg"
            color="primary"
            variant="outline"
            label="Tạo tin tức"
            :trailing="false"
          />
        </div>
        <div class="flex mt-3 search-user flex-wrap gap-4">
          <div class="w-64">
            <label for="">Tìm kiếm tin tức</label>
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
              placeholder="Ngày tạo tin tức"
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
                  handleListNews()
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
            <template #lang-data="{ row }">
              <div class="min-w-[60px]">
                {{ getLangName(row.lang) }}
              </div>
            </template>
            <template #title-data="{ row }">
              <p class="truncate w-60">{{ row.title }}</p>
            </template>
            <template #created_at-data="{ row }"
              >{{ conventDate(row.created_at) }}
            </template>
            <template #updated_at-data="{ row }"
              >{{ conventDate(row.updated_at) }}
            </template>
            <template #accept_at-data="{ row }"
              >{{ conventDate(row.accept_at) }}
            </template>
            <template #update_by-data="{ row }">
              {{
                [row?.update_first_name, row?.update_last_name]
                  .filter(item => item)
                  .join(' ')
              }}
            </template>
            <template #accept_by-data="{ row }">
              {{
                [row?.accept_first_name, row?.accept_last_name]
                  .filter(item => item)
                  .join(' ')
              }}
            </template>
            <template #name-data="{ row }">
              {{ (row.first_name ?? '') + ' ' + (row.last_name ?? '') }}
            </template>
            <template #status-data="{ row }">
              <UBadge
                size="xs"
                v-if="row.status === NewsStatus.ACTIVE"
                variant="solid"
                >Đã duyệt</UBadge
              >
              <UBadge
                v-else-if="row.status === NewsStatus.PENDING"
                color="yellow"
                variant="solid"
                >Chờ duyệt</UBadge
              >
              <UBadge v-else color="red" variant="solid">Từ chối</UBadge>
            </template>
            <template #action-data="{ row }">
              <UTooltip
                v-if="
                  (row.status === NewsStatus.PENDING ||
                    row.status === NewsStatus.REJECT) &&
                  authStore.userInfoData?.role !== ROLE.SELLER
                "
                class="action-button"
                text="Duyệt tin tức"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      statusChange = NewsStatus.ACTIVE
                      idNewsChange = row.new_id
                    }
                  "
                  icon="i-material-symbols-check-circle-outline"
                  size="sm"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="
                  row.status === NewsStatus.ACTIVE &&
                  authStore.userInfoData?.role !== ROLE.SELLER
                "
                class="action-button"
                text="Huỷ tin tức"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      statusChange = NewsStatus.REJECT
                      idNewsChange = row.new_id
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
                class="action-button"
                text="Chỉnh sửa bài đăng"
                :popper="{ arrow: true }"
              >
                <UButton
                  :to="PATH.ADMIN_NEWS + `/${row.slug}`"
                  icon="i-material-symbols-edit-square-outline-sharp"
                  size="sm"
                  color="blue"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="authStore.userInfoData?.role !== ROLE.SELLER"
                class="action-button"
                text="Xoá tin tức"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      statusChange = NewsStatus.DELETE
                      idNewsChange = row.new_id
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
          statusChange === NewsStatus.ACTIVE
            ? 'Bạn có chắc duyệt bài tin tức này không?'
            : statusChange === NewsStatus.DELETE
            ? 'Bạn có chắc xoá bài tin tức này không?'
            : 'Bạn có chắc huỷ duyệt bài tin tức này không?'
        "
        :isOpen="openModal"
        @handleConfirm="
          () => {
            handleChangeStatus()
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
<script setup>
import { PATH } from '@/core/constants/index.js'
import { useNewsAdminStore } from './store.js'
import { conventDate } from '@/core/utils/constants.js'
import { NewsStatus } from '@/core/constants/news/index.js'
import moment from 'moment/moment.js'
import { useSystemStore } from '@/core/store/system.js'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '@/core/constants/role'
import { LOCALES } from '@/core/utils/constants'

const authStore = useAuthStore()
const useNewsAdmin = useNewsAdminStore()
const { setLoading } = useSystemStore()
const toast = useToast()

const loading = ref(false)

const date = ref()
const key = ref('')

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const statusChange = ref()
const idNewsChange = ref()
const openModal = ref(false)
const listLang = ref([{ code: null, name: 'Tất cả' }, ...LOCALES])

const selectedLang = ref(listLang.value[0].code)

const currentLang = computed(() =>
  listLang.value.find(value => value.code === selectedLang.value)
)

const rows = computed(() => {
  return useNewsAdmin.listNews.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})

useHead({
  title: 'Quản lý tin tức',
})

onMounted(async () => {
  await handleListNews()
})

watch(page, async () => {
  await handleListNews()
})

const handleClearInput = async () => {
  page.value = 1
  selectedLang.value = null
  key.value = ''
  date.value = ''
  await handleListNews()
}

const handleListNews = async () => {
  loading.value = true
  const data = {
    key: key.value,
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 00:00:00'),
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 23:59:59'),
    lang: selectedLang.value,
  }
  const res = await useNewsAdmin.getListNews(page.value, data)
  if (res.status) {
    useNewsAdmin.listNews = res.data.data || []
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    useNewsAdmin.listNews = []
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
  loading.value = false
}

const handleChangeStatus = async () => {
  try {
    setLoading(true)
    if (statusChange.value === NewsStatus.DELETE) {
      const { data } = await useNewsAdmin.deleteNews(idNewsChange.value)
      if (data.status) {
        await handleListNews()
        openModal.value = false
        setLoading(false)
        toast.add({
          title: 'Notification',
          description: data.message,
          icon: 'i-heroicons-check-circle',
        })
      } else {
        openModal.value = false
        setLoading(false)
        toast.add({
          title: 'Notification',
          description: data.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
      }
      return
    }
    const { data } = await useNewsAdmin.changeStatusNews(
      idNewsChange.value,
      statusChange.value
    )
    if (data.status) {
      await handleListNews()
      openModal.value = false
      setLoading(false)
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-check-circle',
      })
    } else {
      openModal.value = false
      setLoading(false)
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  } catch (e) {
    console.log(e)
  } finally {
    openModal.value = false
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

const getLangName = lang => {
  return LOCALES.find(item => item.code == lang)?.name || LOCALES[0].name
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
    label: 'Tiêu đề bài viết',
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
    key: 'updated_at',
    label: 'Ngày cập nhật',
  },
  {
    key: 'accept_at',
    label: 'Ngày Duyệt/Huỷ đăng',
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
  },
]
</script>
<style scoped lang="scss">
.news-main {
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
