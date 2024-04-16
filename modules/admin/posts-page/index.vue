<script setup>
import { Config } from '@/core/utils/location'
import { usePostAdminStore } from './store'
import { conventDate } from '@/core/utils/constants.js'
import { POST } from '@/core/constants/index.js'
import moment from 'moment'
import ModalConfirm from '@/core/components/ModalConfirm'
import { JS_ConvertPrice, JS_addComma } from '@/core/utils/common'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '@/core/constants/role'
import { JS_ConvertHecta } from '@/core/utils/common'
import { LOCALES } from '@/core/utils/constants'

const authStore = useAuthStore()
const usePostAdmin = usePostAdminStore()
const toast = useToast()
const router = useRouter()

const page = ref(1)
const pageCount = ref(0)
const totalPage = ref(0)

const openModal = ref(false)
const openModalChooseLang = ref(false)
const rowChoose = ref()

const nation = ref(Config.location.nation)
const selectedNation = ref(nation.value[0].name)
const cityProvince = ref(nation.value[0].city)
const selectedCityProvince = ref('')
const district = ref([])
const selectedDistrict = ref('')
const wards = ref([])
const selectedWards = ref('')
const currency_unit = ref('Tất cả')

const loading = ref(false)

const key = ref('')
const fromPrice = ref('')
const toPrice = ref('')
const fromAcreage = ref('')
const toAcreage = ref('')
const date = ref()
const listLang = ref([{ code: null, name: 'Tất cả' }])

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

const statusChange = ref('')
const idPostChange = ref('')

useHead({
  title: 'Quản lý đăng tin',
})

watch(
  [selectedNation, selectedCityProvince, selectedDistrict],
  async (
    [newNation, newCity, newDistrict],
    [preNation, prevCity, prevDistrict]
  ) => {
    if (newNation !== preNation) {
      selectedCityProvince.value = ''
      selectedDistrict.value = ''
      selectedWards.value = ''
    }
    if (newCity !== prevCity) {
      selectedDistrict.value = ''
      selectedWards.value = ''
    }
    if (newDistrict !== prevDistrict) {
      selectedWards.value = ''
    }
    handleChangeLocation()
  }
)

const handleChangeLocation = () => {
  const cityProvinceFilter = nation.value.find(
    nati => nati.name === selectedNation.value
  )
  cityProvince.value = cityProvinceFilter.city
  const districtFilter = cityProvince.value.find(
    city => city.name === selectedCityProvince.value
  )
  district.value = districtFilter?.districts
  const wardsFilter = district.value?.find(
    district => district.name === selectedDistrict.value
  )
  wards.value = wardsFilter?.wards
}

onMounted(() => {
  listLang.value = [...listLang.value, ...LOCALES]
  handleGetListPost()
  handleGetListCategory()
})

const typePost = [
  {
    name: 'Tất cả',
    id: null,
  },
  {
    name: 'Tin bán/cho thuê',
    id: 2,
  },
  {
    name: 'Tin mua/thuê',
    id: 1,
  },
]

const status = [
  {
    name: 'Tất cả',
    id: null,
  },
  {
    name: 'Đã Duyệt',
    id: 2,
  },
  {
    name: 'Chờ Duyệt',
    id: 1,
  },
  {
    name: 'Từ Chối',
    id: 3,
  },
]

const listCategory = ref([
  {
    category_name: 'Tất cả',
    category_id: null,
  },
])

const listChilldrenCategory = ref([
  {
    category_name: 'Tất cả',
    category_id: null,
  },
])

const selectedStatus = ref(status[0].id)
const selectedType = ref(typePost[0].id)

const selectedLang = ref(listLang.value[0].code)

const currentLang = computed(() =>
  listLang.value.find(value => value.code === selectedLang.value)
)

const selectedCategory = ref(listCategory.value[0].category_id)
const selectedChilldrenCategory = ref(
  listChilldrenCategory.value[0].category_id
)

const rows = computed(() => {
  return usePostAdmin.listPost.map((item, index) => ({
    ...item,
    index: index + 1,
  }))
})
const current = computed(() =>
  status.find(value => value.id === selectedStatus.value)
)
const currentType = computed(() =>
  typePost.find(value => value.id === selectedType.value)
)

const currentCategory = computed(() =>
  listCategory.value.find(value => value.category_id === selectedCategory.value)
)

const currentChilldrenCategory = computed(() =>
  listChilldrenCategory.value.find(
    value => value.category_id === selectedChilldrenCategory.value
  )
)

watch(selectedCategory, value => {
  let listChilldren = listCategory.value.find(
    e => e.category_id === value
  ).children
  listChilldren
    ? (listChilldrenCategory.value = [
        ...[
          {
            category_name: 'Tất cả',
            category_id: null,
          },
        ],
        ...listChilldren,
      ])
    : (listChilldrenCategory.value = [
        {
          category_name: 'Tất cả',
          category_id: null,
        },
      ])
  selectedChilldrenCategory.value = listChilldrenCategory.value[0].category_id
})

const handleGetListCategory = async () => {
  const res = await usePostAdmin.getListCategory()
  if (res.status) {
    usePostAdmin.listCategory = res.data ?? []
    listCategory.value = [...listCategory.value, ...usePostAdmin.listCategory]
  } else {
    usePostAdmin.listCategory = []
  }
}

watch(page, async () => {
  await handleGetListPost()
})

const handleGetListPost = async () => {
  const body = {
    key: key.value,
    status: selectedStatus.value,
    postsType: selectedType.value,
    fromPrice: fromPrice.value.replace(/[^0-9]/g, ''),
    toPrice: toPrice.value.replace(/[^0-9]/g, ''),
    fromAcreage: fromAcreage.value.replace(/[^0-9]/g, ''),
    toAcreage: toAcreage.value.replace(/[^0-9]/g, ''),
    ward: selectedWards.value,
    district: selectedDistrict.value,
    city: selectedCityProvince.value,
    country: selectedNation.value === 'Tất cả' ? '' : selectedNation.value,
    category_id: selectedChilldrenCategory.value ?? selectedCategory.value,
    startDate:
      date.value &&
      moment(new Date(date.value[0])).format('yyyy/MM/DD 00:00:00'),
    endDate:
      date.value &&
      moment(new Date(date.value[1])).format('yyyy/MM/DD 23:59:59'),
    currency_unit:
      currency_unit.value === 'Tất cả' ? null : currency_unit.value,
    lang: selectedLang.value,
  }

  loading.value = true

  const res = await usePostAdmin.getListPost(page.value, body)
  if (res.status) {
    usePostAdmin.listPost = res.data.data ?? []
    totalPage.value = res.data.total
    pageCount.value = res.data.per_page
  } else {
    usePostAdmin.listPost = []
  }
  loading.value = false
}

const handleClearInput = async () => {
  key.value = ''
  fromPrice.value = ''
  toPrice.value = ''
  fromAcreage.value = ''
  toAcreage.value = ''
  date.value = ''
  currency_unit.value = 'Tất cả'
  selectedNation.value = nation.value[0].name
  selectedDistrict.value = ''
  selectedCityProvince.value = ''
  selectedCategory.value = listCategory.value[0].category_id
  selectedChilldrenCategory.value = listChilldrenCategory.value[0].category_id
  selectedStatus.value = status[0].id
  selectedType.value = typePost[0].id
  page.value = 1
  selectedLang.value = null
  await handleGetListPost()
}

const handleChangeStatus = async () => {
  if (idPostChange.value && statusChange.value) {
    const { data } = await usePostAdmin.changeStatusPost(
      idPostChange.value,
      statusChange.value
    )
    if (data.status) {
      openModal.value = false
      idPostChange.value = ''
      statusChange.value = ''
      usePostAdmin.postItem = data.data
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-check-circle',
      })
      await handleGetListPost()
    } else {
      openModal.value = false
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      usePostAdmin.postItem = data.data
    }
  }
}

const handleChooseLang = lang => {
  router.push(`/admin/post/${rowChoose.value.slug}?lang=${lang}&new=true`)
}

const handleOnKeyUp = () => {
  fromPrice.value = fromPrice.value
    ? parseInt(fromPrice.value.replace(/[^0-9]/g, '')).toLocaleString('en')
    : ''

  toPrice.value = toPrice.value
    ? parseInt(toPrice.value.replace(/[^0-9]/g, '')).toLocaleString('en')
    : ''

  fromAcreage.value = fromAcreage.value
    ? parseInt(fromAcreage.value.replace(/[^0-9]/g, '')).toLocaleString('en')
    : ''

  toAcreage.value = toAcreage.value
    ? parseInt(toAcreage.value.replace(/[^0-9]/g, '')).toLocaleString('en')
    : ''
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
    key: 'posts_id',
    label: 'Mã số',
  },
  {
    key: 'lang',
    label: 'Ngôn ngữ',
  },
  {
    key: 'action',
    label: 'Thao tác',
  },
  {
    key: 'title',
    label: 'Tên dự án',
  },
  {
    key: 'parent_category_name',
    label: 'Loại hình',
  },
  {
    key: 'category_name',
    label: 'Lĩnh vực/Ngành nghề',
  },
  {
    key: 'posts_type',
    label: 'Loại bài đăng',
  },
  {
    key: 'isAvailable',
    label: 'Trạng thái',
  },
  {
    key: 'price',
    label: 'Giá tiền',
  },
  {
    key: 'acreage',
    label: 'Diện tích',
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

<template>
  <div>
    <NuxtLayout name="admin">
      <div class="posts-main">
        <h1>Quản lý đăng tin</h1>
        <div class="flex flex-wrap search-post">
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Tìm kiếm dự án</label>
            <UInput
              v-model="key"
              size="lg"
              variant="outline"
              placeholder="Search..."
            />
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Trạng thái đăng bài</label>
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
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Loại bài đăng</label>
            <USelectMenu
              size="lg"
              v-model="selectedType"
              :options="typePost"
              value-attribute="id"
              option-attribute="name"
            >
              <template #label>
                {{ currentType.name }}
              </template>
            </USelectMenu>
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Loại tiền tệ</label>
            <USelectMenu
              v-model="currency_unit"
              size="lg"
              :options="['Tất cả', 'VND', 'USD']"
            />
          </div>
          <div class="w-2/3 2xl:w-2/6 p-1">
            <label for="">Giá tiền</label>
            <div class="grid grid-cols-2 gap-x-1">
              <UInput
                @keyup="handleOnKeyUp"
                v-model="fromPrice"
                size="lg"
                variant="outline"
                placeholder="Từ"
              />
              <UInput
                @keyup="handleOnKeyUp"
                v-model="toPrice"
                size="lg"
                variant="outline"
                placeholder="Đến"
              />
            </div>
          </div>
          <div class="w-2/3 2xl:w-2/6 p-1">
            <label for=""
              >Quy mô diện tích
              <span style="color: #ff494f">(m<sup>2</sup>)</span></label
            >
            <div class="grid grid-cols-2 gap-x-1">
              <UInput
                @keyup="handleOnKeyUp"
                v-model="fromAcreage"
                size="lg"
                variant="outline"
                placeholder="Từ"
              />
              <UInput
                @keyup="handleOnKeyUp"
                v-model="toAcreage"
                size="lg"
                variant="outline"
                placeholder="Đến"
              />
            </div>
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Quốc gia</label>
            <USelectMenu
              size="lg"
              v-model="selectedNation"
              :options="nation"
              placeholder="Nation"
              value-attribute="name"
              option-attribute="name"
              class="select-location"
            >
            </USelectMenu>
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Tỉnh/Thành phố</label>
            <USelectMenu
              size="lg"
              v-model="selectedCityProvince"
              :options="cityProvince"
              placeholder="Tỉnh/Thành phố"
              value-attribute="name"
              option-attribute="name"
              class="select-location"
              :disabled="selectedNation === 'Tất cả'"
            >
            </USelectMenu>
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Quận/Huyện</label>
            <USelectMenu
              size="lg"
              v-model="selectedDistrict"
              :options="district"
              placeholder="Quận/Huyện"
              value-attribute="name"
              option-attribute="name"
              class="select-location"
              :disabled="!selectedCityProvince"
            >
            </USelectMenu>
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
            <label for="">Ngày đăng bài</label>
            <VueDatePicker
              :format="format"
              v-model="date"
              auto-apply
              placeholder="Ngày đăng bài"
              range
              :enable-time-picker="false"
            />
          </div>
          <div class="w-full 2xl:w-2/6 xl:w-2/3 p-1">
            <label for="">Loại hình dự án</label>
            <div class="grid grid-cols-2 gap-x-1">
              <USelectMenu
                size="lg"
                v-model="selectedCategory"
                :options="listCategory"
                value-attribute="category_id"
                option-attribute="category_name"
              >
                <template #label>
                  {{ currentCategory.category_name }}
                </template>
              </USelectMenu>
              <USelectMenu
                size="lg"
                v-model="selectedChilldrenCategory"
                :options="listChilldrenCategory"
                placeholder="Danh mục chi tiết"
                value-attribute="category_id"
                option-attribute="category_name"
              >
                <template #label>
                  {{ currentChilldrenCategory.category_name }}
                </template>
              </USelectMenu>
            </div>
          </div>
          <div class="w-1/3 2xl:w-1/6 p-1">
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
          <div class="flex w-2/3 2xl:w-2/6 xl:w-1/3 p-1 items-end gap-x-3">
            <UButton
              block
              @click="
                () => {
                  page = 1
                  handleGetListPost()
                }
              "
              class="w-1/2"
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

        <div class="table-post">
          <UTable
            :empty-state="{ label: 'Không có dữ liệu' }"
            :columns="columns"
            :rows="rows"
            :loading="loading"
          >
            <template #title-data="{ row }">
              <p class="truncate w-60">{{ row.title }}</p>
            </template>
            <template #category_name-data="{ row }">
              <div class="min-w-[150px]">{{ row.category_name }}</div>
            </template>
            <template #accept_at-data="{ row }">
              <div class="min-w-[150px]">
                {{ conventDate(row.accept_at) }}
              </div>
            </template>
            <template #accept_by-data="{ row }">
              <div class="min-w-[170px]">
                {{
                  [row?.accept_first_name, row?.accept_last_name]
                    .filter(item => item)
                    .join(' ')
                }}
              </div>
            </template>
            <template #update_by-data="{ row }">
              <p class="truncate w-28">
                {{
                  [row?.update_first_name, row?.update_last_name]
                    .filter(item => item)
                    .join(' ')
                }}
              </p>
            </template>
            <template #created_at-data="{ row }">{{
              conventDate(row.created_at)
            }}</template>
            <template #updated_at-data="{ row }">{{
              conventDate(row.updated_at)
            }}</template>
            <template #posts_type-data="{ row }">
              <UBadge
                size="xs"
                v-if="row.posts_type == POST.BUY"
                color="orange"
                variant="solid"
                >Tin Mua/Thuê</UBadge
              >
              <UBadge
                v-else-if="row.posts_type == POST.SELL"
                color="violet"
                variant="solid"
                >Tin Bán/Cho Thuê</UBadge
              >
              <UBadge v-else color="lime" variant="solid">Cho thuê</UBadge>
            </template>
            <template #isAvailable-data="{ row }">
              <UBadge
                class="min-w-[70px] text-center"
                size="xs"
                v-if="row.isAvailable == POST.ACTIVE"
                variant="solid"
                >Đã duyệt</UBadge
              >
              <UBadge
                class="min-w-[70px]"
                v-else-if="row.isAvailable == POST.PENDING"
                color="yellow"
                variant="solid"
                >Chờ duyệt</UBadge
              >
              <UBadge class="min-w-[70px]" v-else color="red" variant="solid"
                >Từ chối</UBadge
              >
            </template>
            <template #action-data="{ row }">
              <UTooltip
                class="action-button"
                text="Chi tiết bài đăng"
                :popper="{ arrow: true }"
              >
                <UButton
                  target="_blank"
                  :to="`/project/${row.slug}`"
                  icon="i-ri-eye-line"
                  size="sm"
                  color="cyan"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                class="action-button"
                v-if="
                  (row.isAvailable == POST.PENDING ||
                    row.isAvailable == POST.REJECT) &&
                  authStore.userInfoData?.role !== ROLE.SELLER
                "
                text="Duyệt bài đăng"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      statusChange = POST.ACTIVE
                      idPostChange = row.slug
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
                  (row.isAvailable == POST.PENDING ||
                    row.isAvailable == POST.ACTIVE) &&
                  authStore.userInfoData?.role !== ROLE.SELLER
                "
                class="action-button"
                text="Không duyệt bài đăng"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      openModal = true
                      statusChange = POST.REJECT
                      idPostChange = row.slug
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
                  :to="`/admin/post/${row.slug}?lang=${row.lang}`"
                  icon="i-material-symbols-edit-square-outline-sharp"
                  size="sm"
                  color="blue"
                  square
                  variant="outline"
                />
              </UTooltip>
              <UTooltip
                v-if="row.listLang.length < 5"
                class="action-button"
                text="Dịch bài đăng"
                :popper="{ arrow: true }"
              >
                <UButton
                  @click="
                    () => {
                      rowChoose = row
                      openModalChooseLang = true
                    }
                  "
                  icon="i-heroicons-globe-asia-australia"
                  size="sm"
                  color="purple"
                  square
                  variant="outline"
                />
              </UTooltip>
            </template>
            <template #lang-data="{ row }">
              <div class="min-w-[60px]">
                {{ getLangName(row.lang) }}
              </div>
            </template>
            <template #price-data="{ row }">
              <div class="min-w-[60px]">
                {{
                  JS_ConvertPrice(row?.price).num +
                  $t(JS_ConvertPrice(row?.price, false).txt) +
                  ' ' +
                  row?.currency_unit
                }}
              </div>
            </template>
            <template #acreage-data="{ row }">
              <div
                class="min-w-[60px]"
                v-if="row.acreage && parseFloat(row.acreage) > 0"
              >
                {{
                  row.unit_area === 'hecta'
                    ? JS_addComma(
                        JS_ConvertHecta(row.acreage?.toString(), 'get_hecta')
                      )
                    : JS_addComma(row?.acreage)
                }}
                <span v-if="row.unit_area === 'hecta'"> hecta </span>
                <span v-else> m<sup>2</sup></span>
              </div>
              <div class="min-w-[60px]" v-else></div>
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
          statusChange === 2
            ? 'Bạn có chắc duyệt bài đăng này không?'
            : 'Bạn có chắc không duyệt bài đăng này không?'
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
      <ModalChooseLang
        :listLang="rowChoose?.listLang"
        :isOpen="openModalChooseLang"
        @handleChoose="
          lang => {
            handleChooseLang(lang)
          }
        "
        @handleCloseModal="
          () => {
            openModalChooseLang = false
          }
        "
      />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.posts-main {
  padding: 20px;
  overflow-y: auto;

  h1 {
    font-size: 25px;
    font-weight: 500;
  }

  .search-post {
    div {
      label {
        font-size: 14px;
      }
    }
  }

  .table-post {
    .action-button {
      margin: 0 2px;
    }
  }
}
</style>
