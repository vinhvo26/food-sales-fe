<script setup>
import { Config } from '@/core/utils/location'
import { POST } from '@/core/constants'
import { usePostAdminStore } from './store'
import { useSystemStore } from '@/core/store/system'
import { PATH } from '@/core/constants'
import useValidate from '@/core/composables/useValidate'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '@/core/constants/role'
import { conventDate } from '@/core/utils/constants.js'
import { JS_ConvertHecta } from '@/core/utils/common'
import { LOCALES } from '@/core/utils/constants'

const authStore = useAuthStore()
const { state, checkValid } = useValidate()
const { setLoading } = useSystemStore()
const router = useRouter()
const route = useRoute()
const postAdminStore = usePostAdminStore()
const {
  getDetailPost,
  changeStatusPost,
  editPost,
  getListCategory,
  removeImage,
  uploadImage,
  uploadFile,
  removeFile,
} = postAdminStore

const toast = useToast()
const fistWeb = ref(true)
const isPrivatePhone = ref(false)
const isPrivatePrice = ref(false)
const isPrivateName = ref(false)
const postItem = ref({})
const openModal = ref(false)

const statusChange = ref('')

const nation = ref(Config.location.nation)
const selectedNation = ref(nation.value[0].name)
const cityProvince = ref(nation.value[0].city)
const selectedCityProvince = ref('')
const district = ref([])
const selectedDistrict = ref('')
const wards = ref([])
const selectedWards = ref('')
const listSeq = ref([])
const listSeqFile = ref([])
const urlImageList = ref([])
const urlImageListFile = ref([])
const urlFileList = ref([])
const listCategory = ref([])
const listChilldrenCategory = ref([])

const dateCreate = ref('')

const selectedCategory = ref()
const selectedChilldrenCategory = ref()

const currentCategory = ref('')

const currentChilldrenCategory = ref('')

const titleRef = ref()
const priceRef = ref()
const acreageRef = ref()

watch(selectedCategory, value => {
  postItem.value.parent_category_id = value
  currentCategory.value = listCategory.value.find(
    e => e.category_id === value
  )?.category_name

  let listChilldren = listCategory.value.find(
    e => e.category_id === value
  ).children
  listChilldren
    ? (listChilldrenCategory.value = listChilldren)
    : (listChilldrenCategory.value = [])
  if (!fistWeb.value) {
    selectedChilldrenCategory.value =
      listChilldrenCategory.value.length > 0
        ? listChilldrenCategory.value[0].category_id
        : null
    postItem.value.category_id = selectedChilldrenCategory.value
    currentChilldrenCategory.value =
      listChilldrenCategory.value.length > 0
        ? listChilldrenCategory.value[0].category_id
        : null
  }
})

watch(selectedChilldrenCategory, value => {
  postItem.value.category_id = value
  currentChilldrenCategory.value = listChilldrenCategory.value.find(
    e => e.category_id === value
  )?.category_name
})

watch(
  [selectedNation, selectedCityProvince, selectedDistrict],
  async (
    [newNation, newCity, newDistrict],
    [preNation, prevCity, prevDistrict]
  ) => {
    if (!fistWeb.value) {
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

onMounted(async () => {
  setLoading(true)
  await handleGetListCategory()
  await handleGetDetailPost()
  setLoading(false)
})

const handleGetListCategory = async () => {
  const res = await getListCategory()
  if (res.status) {
    postAdminStore.listCategory = res.data ?? []
    listCategory.value = [...listCategory.value, ...postAdminStore.listCategory]
  } else {
    usePostAdmin.listCategory = []
  }
}

const handleGetDetailPost = async () => {
  const data = await getDetailPost(route.params.id)
  if (data.status) {
    postItem.value = data.data
    selectedCategory.value = postItem.value.parent_category_id
    currentCategory.value = postItem.value.parent_category_name
    currentChilldrenCategory.value = postItem.value.category_name
    selectedNation.value = postItem.value.country ?? 'Tất cả'
    selectedCityProvince.value = postItem.value.city
    selectedDistrict.value = postItem.value.district
    isPrivatePhone.value = postItem.value.isPrivatePhone === 1 ? true : false
    isPrivatePrice.value = postItem.value.isPrivatePrice === 1 ? true : false
    isPrivateName.value = postItem.value.isPrivateName === 1 ? true : false

    postItem.value.acreage = parseInt(postItem.value.acreage).toString()

    if (postItem.value.unit_area === 'hecta') {
      postItem.value.acreage = JS_ConvertHecta(
        postItem.value.acreage?.toString().replaceAll(',', ''),
        'get_hecta'
      )
    }

    postItem.value.price = parseInt(postItem.value.price).toString()
    dateCreate.value = conventDate(postItem.value.created_at)
    if (postItem.value.category_id === postItem.value.parent_category_id) {
      selectedChilldrenCategory.value =
        listChilldrenCategory.value[0]?.category_id
    } else {
      selectedChilldrenCategory.value = postItem.value.category_id
    }

    handleOnKeyUp()
    setTimeout(() => {
      fistWeb.value = false
    }, 2000)
  } else {
    router.push(PATH.ADMIN_POST)
  }
}

const handleChangeStatus = async slug => {
  const { data } = await changeStatusPost(
    slug ? slug : route.params.id,
    statusChange.value
  )
  if (data?.status) {
    openModal.value = false
    toast.add({ title: 'Cập nhật trạng thái bài đăng thành công' })
    router.push(PATH.ADMIN_POST)
  } else {
    openModal.value = false
    toast.add({ title: 'Cập nhật trạng thái bài đăng thất bại', color: 'red' })
  }
}

const handleSaveAndChange = async () => {
  await handleEditPost(true)
}

const handleEditPost = async check => {
  try {
    if (
      !currentCategory.value ||
      currentCategory.value === 'Dự án/tài sản' ||
      currentCategory.value === 'Đất'
    ) {
      checkValid([titleRef, acreageRef, priceRef], 'input-custom')
    } else if (currentCategory.value === 'Doanh nghiệp') {
      checkValid([titleRef, priceRef], 'input-custom')
    } else checkValid([titleRef, priceRef], 'input-custom')
    if (state.isError) {
      toast.add({
        title: 'Notification',
        description: state.error,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      const elementErr = document.querySelectorAll('.validate-error-custome')
      if (elementErr.length) elementErr[0].focus()
      return false
    }
    setLoading(true)
    if (urlImageList.value.length > 0) {
      const formData = new FormData()
      urlImageListFile.value.forEach(file => {
        formData.append('images[]', file)
      })
      postItem.value.upload_id &&
        formData.append('upload_id', postItem.value.upload_id)
      const { data } = await uploadImage(formData)
      if (!data?.status) {
        toast.add({
          title: 'Thông báo',
          description: data.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
        return
      } else {
        if (!postItem.value.upload_id) {
          postItem.value.upload_id = data?.data[0].id
        }
      }
    }

    if (urlFileList.value.length) {
      const formData = new FormData()
      urlFileList.value.forEach(file => {
        formData.append('file[]', file)
      })
      postItem.value.file_upload_id &&
        formData.append('upload_id', postItem.value.file_upload_id)
      const { data } = await uploadFile(formData)
      if (!data?.status) {
        toast.add({
          title: 'Notification',
          description: data.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
        return
      } else {
        if (!postItem.value.file_upload_id) {
          postItem.value.file_upload_id = data?.data[0].id
        }
      }
    }

    if (listSeq.value.length > 0) {
      const { data } = await removeImage({
        upload_id: postItem.value.upload_id,
        list_seq: listSeq.value,
      })
    }

    if (listSeqFile.value.length > 0) {
      const { data } = await removeFile({
        upload_id: postItem.value.file_upload_id,
        list_seq: listSeqFile.value,
      })
    }
    postItem.value.country =
      selectedNation.value == 'Tất cả' ? null : selectedNation.value
    postItem.value.city = selectedCityProvince.value
    postItem.value.district = selectedDistrict.value

    postItem.value.isPrivatePhone = isPrivatePhone.value
    postItem.value.isPrivateName = isPrivateName.value
    postItem.value.isPrivatePrice = isPrivatePrice.value

    postItem.value.acreage = postItem.value.acreage.replace(/[^0-9]/g, '')
    postItem.value.price = postItem.value.price.replace(/[^0-9]/g, '')

    postItem.value.authorized_capital = postItem.value.authorized_capital
    postItem.value.total_value_of_assets_owned_by_the_company =
      postItem.value.total_value_of_assets_owned_by_the_company
    postItem.value.financial_statements = postItem.value.financial_statements
    postItem.value.total_equity = postItem.value.total_equity
    postItem.value.number_of_branches_facilities_in_operation =
      postItem.value.number_of_branches_facilities_in_operation
    if (postItem.value.unit_area === 'hecta') {
      postItem.value.acreage = JS_ConvertHecta(
        postItem.value.acreage?.toString().replaceAll(',', ''),
        'set_hecta'
      )
    }
    postItem.value.lang = route.query.lang

    const { data } = await editPost(postItem.value)
    if (data?.status) {
      if (check) {
        await handleChangeStatus(data.data.slug)
        return
      }
      toast.add({ title: 'Cập nhật thành công' })
      router.push(PATH.ADMIN_POST)
    } else {
      toast.add({ title: 'Cập nhật thất bại', color: 'red' })
    }
  } catch (error) {
  } finally {
    setLoading(false)
  }
}

const handleRemoveImage = (type, seq) => {
  if (type === 'image') {
    postItem.value.list_img = postItem.value.list_img.filter(e => e.seq !== seq)
    listSeq.value.push(seq)
  } else {
    postItem.value.list_file = postItem.value.list_file.filter(
      e => e.seq !== seq
    )
    listSeqFile.value.push(seq)
  }
}

const onFileSelected = (typeFile, event) => {
  const lengthEvent = event.target.files.length
  for (let index = 0; index < lengthEvent; index++) {
    if (typeFile === 'image') {
      urlImageListFile.value.push(event.target.files[index])
      urlImageList.value.push(URL.createObjectURL(event.target.files[index]))
    } else {
      urlFileList.value.push(event.target.files[index])
    }
  }
}

const removeImageList = (type, image) => {
  if (type === 'image') {
    urlImageList.value = urlImageList.value.filter(img => img !== image)
  } else urlFileList.value = urlFileList.value.filter(file => file !== image)
}

const handleOnKeyUp = () => {
  postItem.value.acreage = new Intl.NumberFormat('en-US').format(
    Number(postItem.value.acreage.replace(/[^0-9]/g, ''))
  )
  postItem.value.price = new Intl.NumberFormat('en-US').format(
    Number(postItem.value.price.replace(/[^0-9]/g, ''))
  )
}

const getLangName = () => {
  const lang = route.query.lang
  return LOCALES.find(item => item.code == lang)?.name || LOCALES[0].name
}
</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <Head>
        <Title>{{ postItem.title || 'Thông tin chi tiết bài đăng' }}</Title>
      </Head>
      <div class="detail-main">
        <div class="flex gap-x-6">
          <h1>Thông tin chi tiết bài đăng</h1>
          <UBadge variant="subtle" color="purple">{{ getLangName() }}</UBadge>
          <template v-if="!route.query.new">
            <UBadge variant="subtle" v-if="postItem.isAvailable == POST.ACTIVE"
              >Đã duyệt</UBadge
            >
            <UBadge
              variant="subtle"
              v-else-if="postItem.isAvailable == POST.PENDING"
              color="yellow"
              >Chờ duyệt</UBadge
            >
            <UBadge variant="subtle" v-else color="red">Từ chối</UBadge>
          </template>
        </div>
        <div class="detail-body mt-3 grid w-full space-y-5">
          <div class="grid grid-cols-2 gap-4 w-full">
            <div class="">
              <label for="">Hình thức</label>
              <UInput
                disabled
                size="md"
                :value="
                  postItem.posts_type == POST.BUY
                    ? POST.BUY_STRING
                    : postItem.posts_type == POST.SELL
                    ? POST.SELL_STRING
                    : POST.FOR_RENT_STRING
                "
              />
            </div>
            <div>
              <label for="">Ngày đăng tin</label>
              <UInput size="md" v-model="dateCreate" disabled />
            </div>
            <div v-if="postItem.posts_type === 2">
              <label for=""
                >Thông tin về tổ chức/cá nhân cần bán/cho thuê</label
              >
              <UInput size="md" v-model="postItem.information_about" disabled />
            </div>
            <div v-if="postItem.posts_type === 1">
              <label for="">Thông tin về tổ chức/cá nhân cần mua/thuê</label>
              <UInput size="md" v-model="postItem.information_about" disabled />
            </div>
            <div>
              <label for="">Loại hình</label>
              <USelectMenu
                size="lg"
                v-model="selectedCategory"
                :options="listCategory"
                value-attribute="category_id"
                option-attribute="category_name"
              >
                <template #label>
                  {{ currentCategory }}
                </template>
              </USelectMenu>
            </div>
            <div>
              <label for="">Tiêu đề</label>
              <UInputCustom
                ref="titleRef"
                :validate="{
                  name: 'Tiêu đề bài đăng',
                  required: true,
                }"
                size="md"
                v-model="postItem.title"
              />
            </div>
            <div v-if="listChilldrenCategory.length > 0">
              <label for="">Lĩnh vực/Ngành nghề</label>
              <USelectMenu
                size="lg"
                v-model="selectedChilldrenCategory"
                :options="listChilldrenCategory"
                value-attribute="category_id"
                option-attribute="category_name"
              >
                <template #label>
                  {{ currentChilldrenCategory }}
                </template>
              </USelectMenu>
            </div>
            <div>
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
            <div>
              <label for="">Tỉnh/Thành phố</label>
              <USelectMenu
                size="lg"
                v-model="selectedCityProvince"
                :options="cityProvince"
                placeholder="Tỉnh/Thành phố"
                value-attribute="name"
                option-attribute="name"
                class="select-location"
              >
              </USelectMenu>
            </div>
            <div>
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

            <div
              v-if="
                postItem.parent_category_id === 4 && postItem.posts_type === 2
              "
            >
              <label for="">Địa điểm trụ sở chính và số chi nhánh</label>
              <UInputCustom
                ref="aaaRef"
                :validate="{
                  name: 'Địa điểm trụ sở chính và số chi nhánh',

                  maxLength: 5,
                }"
                size="md"
                v-model="postItem.head_office_location_and_branch_number"
              />
            </div>
            <div
              v-if="
                postItem.parent_category_id === 4 && postItem.posts_type === 2
              "
            >
              <label for="">Số lượng chi nhánh/cơ sở đã hoạt động</label>
              <UInputCustom
                size="md"
                v-model="postItem.number_of_branches_facilities_in_operation"
              />
            </div>
            <div
              v-if="
                postItem.parent_category_id === 4 && postItem.posts_type === 2
              "
            >
              <label for=""
                >Hỗ trợ cho bên nhận chuyển nhượng/nhượng quyền</label
              >
              <UInput
                size="md"
                v-model="postItem.support_for_transferees_franchisees"
              />
            </div>

            <div
              v-if="
                postItem.parent_category_id === 3 && postItem.posts_type === 2
              "
            >
              <label for="">Năm thành lập</label>
              <VueDatePicker
                auto-apply
                currentYear
                v-model="postItem.founded_year"
                year-picker
              />
            </div>
            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4
              "
            >
              <label for="">Diện tích khu đất</label>
              <div class="w-full gap-x-1 flex">
                <UInputCustom
                  ref="acreageRef"
                  :validate="{
                    name: 'Diện tích khu đất',
                    type: ['number'],
                    required: true,
                  }"
                  @keyup="handleOnKeyUp"
                  size="md"
                  class="w-4/5"
                  v-model="postItem.acreage"
                />
                <USelectMenu
                  class="w-1/5"
                  size="lg"
                  v-model="postItem.unit_area"
                  :options="['hecta', 'm²']"
                />
              </div>
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4
              "
              class="grid grid-cols-2 gap-x-4"
            >
              <div>
                <label for="">Năm bắt đầu</label>
                <VueDatePicker
                  currentYear
                  auto-apply
                  v-model="postItem.year_start"
                  year-picker
                />
              </div>
              <div>
                <label for="">Năm kết thúc</label>
                <VueDatePicker
                  currentYear
                  auto-apply
                  v-model="postItem.year_end"
                  year-picker
                />
              </div>
            </div>
            <div v-if="postItem.posts_type === 2">
              <label for="">Giá bán/cho thuê</label>
              <div class="w-full gap-x-1 flex">
                <UInputCustom
                  ref="priceRef"
                  :validate="{
                    name: 'Giá bán/cho thuê',
                    type: ['number'],
                    required: true,
                  }"
                  size="md"
                  class="w-4/5"
                  @keyup="handleOnKeyUp"
                  v-model="postItem.price"
                />
                <USelectMenu
                  class="w-1/5"
                  size="lg"
                  v-model="postItem.currency_unit"
                  :options="['VND', 'USD']"
                />
              </div>
              <UCheckbox
                class="mt-2"
                v-model="isPrivatePrice"
                name="price"
                label="Hiển thị giá bán"
              />
            </div>
            <div v-else>
              <label for="">Giá Mua/Thuê</label>
              <UInputCustom
                size="md"
                ref="priceRef"
                :validate="{
                  name: 'Giá Mua/Thuê',
                  type: ['number'],
                  required: true,
                }"
                @keyup="handleOnKeyUp"
                v-model="postItem.price"
              />
              <UCheckbox
                class="mt-2"
                v-model="isPrivatePrice"
                name="price"
                label="Hiển thị giá bán"
              />
            </div>

            <div>
              <label for="">Hình thức thanh toán</label>
              <UInput size="md" v-model="postItem.payments" />
            </div>

            <div
              v-if="
                postItem.parent_category_id === 1 && postItem.posts_type === 1
              "
            >
              <label for="">Thời gian sử dụng đất</label>
              <UInput size="md" v-model="postItem.land_use_term" />
            </div>

            <div v-if="postItem.parent_category_id === 3">
              <label for="">Địa bàn hoạt động của Công ty</label>
              <UInput
                size="md"
                v-model="postItem.area_of_operation_of_the_company"
              />
            </div>
            <div v-if="postItem.parent_category_id === 3">
              <label for="">Vốn điều lệ</label>
              <UInputCustom size="md" v-model="postItem.authorized_capital" />
            </div>
            <div v-if="postItem.parent_category_id === 3">
              <label for=""
                >Tốc độ tăng trưởng doanh thu bình quân 03 năm gần nhất</label
              >
              <UInput
                size="md"
                v-model="
                  postItem.average_revenue_growth_rate_in_the_last_3_years
                "
              />
            </div>
            <div v-if="postItem.parent_category_id === 3">
              <label for="">Doanh thu 03 năm gần nhất</label>
              <UInputCustom size="md" v-model="postItem.financial_statements" />
            </div>
            <div v-if="postItem.parent_category_id === 3">
              <label for="">Tổng giá trị tài sản công ty đang sở hữu</label>
              <UInputCustom
                size="md"
                v-model="postItem.total_value_of_assets_owned_by_the_company"
              />
            </div>

            <div
              v-if="
                postItem.parent_category_id === 3 && postItem.posts_type === 2
              "
            >
              <label for="">Tổng vốn chủ sở hữu </label>
              <UInputCustom size="md" v-model="postItem.total_equity" />
            </div>
            <div
              v-if="
                postItem.parent_category_id === 3 && postItem.posts_type === 2
              "
            >
              <label for="">Cơ cấu cổ đông</label>
              <UInput size="md" v-model="postItem.shareholder_structure" />
            </div>
            <div
              v-if="
                postItem.parent_category_id === 3 && postItem.posts_type === 2
              "
            >
              <label for="">Số cổ phần cần bán</label>
              <UInputCustom
                size="md"
                v-model="postItem.number_of_shares_to_sell"
              />
            </div>
            <div
              v-if="
                postItem.parent_category_id === 3 && postItem.posts_type === 1
              "
            >
              <label for="">Số cổ phần cần mua</label>
              <UInputCustom
                size="md"
                v-model="postItem.number_of_shares_to_sell"
              />
            </div>
            <div
              v-if="
                postItem.parent_category_id === 3 && postItem.posts_type === 2
              "
            >
              <label for=""
                >Bán cổ phần của cổ đông hiện hữu hay cổ phần phát hành
                thêm</label
              >
              <UInput
                size="md"
                v-model="
                  postItem.sell_shares_of_existing_shareholders_or_additional_shares_issued
                "
              />
            </div>

            <div
              v-if="
                postItem.parent_category_id === 2 && postItem.posts_type === 2
              "
            >
              <label for="">Cơ sở vật chất và máy móc thiết bị sản xuất</label>
              <UInput
                size="md"
                v-model="postItem.facilities_and_machinery_and_equipment"
              />
            </div>
            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for="">Hệ thống giao thông </label>
              <UInput size="md" v-model="postItem.traffic_system" />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for="">Hệ thống cung cấp điện</label>
              <UInput size="md" v-model="postItem.electric_supply_system" />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for="">Hệ thống cung cấp nước</label>
              <UInput size="md" v-model="postItem.water_supply_system" />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for="">Công trình xử lý môi trường</label>
              <UInput
                size="md"
                v-model="postItem.environmental_treatment_works"
              />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for="">Công trình PCCC</label>
              <UInput size="md" v-model="postItem.fire_protection_works" />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for=""
                >Dịch vụ tiện ích: xe buýt, trường học, bệnh viện</label
              >
              <UInput size="md" v-model="postItem.utility_services" />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 3 &&
                postItem.parent_category_id !== 4 &&
                postItem.posts_type === 2
              "
            >
              <label for="">Ưu đãi, hỗ trợ đầu tư</label>
              <UInput
                size="md"
                v-model="postItem.incentives_and_investment_support"
              />
            </div>

            <div
              v-if="
                postItem.parent_category_id !== 1 && postItem.posts_type === 2
              "
            >
              <label for="">Hiện trạng</label>
              <UInput size="md" v-model="postItem.curren_status" />
            </div>

            <div
              v-if="
                postItem.parent_category_id === 1 && postItem.posts_type === 2
              "
            >
              <label for="">Tình trạng</label>
              <UInput size="md" v-model="postItem.curren_status" />
            </div>
            <div>
              <label for="">Số điện thoại</label>
              <UInput size="md" v-model="postItem.phone" disabled />
              <UCheckbox
                class="mt-2"
                v-model="isPrivatePhone"
                name="price"
                label="Hiển thị số điện thoại"
              />
            </div>
            <div>
              <label for="">Người đăng bài</label>
              <UInput
                size="md"
                :value="
                  (postItem.first_name ?? '') + ' ' + (postItem.last_name ?? '')
                "
                disabled
              />
              <UCheckbox
                class="mt-2"
                v-model="isPrivateName"
                name="price"
                label="Hiển thị người đăng"
              />
            </div>
          </div>
          <div v-if="postItem.posts_type === 2" class="w-full">
            <label for="">Thông tin cơ bản dự án</label>
            <UTextarea
              :rows="10"
              v-model="postItem.project_basic_information"
            />
          </div>
          <div v-if="postItem.posts_type === 1" class="w-full">
            <label for="">Yêu cầu khác</label>
            <UTextarea :rows="10" v-model="postItem.uses" />
          </div>
          <div class="w-full h-fit">
            <label for="">Mô tả chi tiết</label>
            <CKEditer v-model="postItem.content" />
          </div>
          <div class="project_category w-full mt-5">
            <div class="title-field">
              Upload file (Dung lượng file tối đa 40mb)
            </div>
            <div class="list-image flex flex-wrap">
              <div class="upload-image upload-file relative">
                <UInput
                  @change="onFileSelected('file', $event)"
                  type="file"
                  accept=".doc, .pdf, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  multiple
                  class="h-full z-50"
                />
                <div class="flex icon-upload-file absolute">
                  <UIcon
                    class="w-6 h-6"
                    name="i-material-symbols-drive-folder-upload"
                  />
                  <span class="select-file pl-2 pt-px">Chọn file</span>
                </div>
              </div>
            </div>
            <div
              class="file-list-upload relative flex mt-2"
              v-for="(url, index) in postItem.list_file"
              :key="index"
            >
              <UIcon
                class="w-6 h-6 icon-file"
                name="i-material-symbols-file-copy"
              />

              <span class="name-file-upload">
                <ULink :to="url.url"> {{ url.name_image }} </ULink>
              </span>

              <UIcon
                @click="handleRemoveImage('file', url.seq)"
                class="w-6 h-6 icon-remove"
                name="i-material-symbols-cancel-outline-rounded"
              />
            </div>
            <div
              class="file-list-upload relative flex mt-2"
              v-for="(file, index) in urlFileList"
              :key="file.lastModified"
            >
              <UIcon
                class="w-6 h-6 icon-file"
                name="i-material-symbols-file-copy"
              />
              <span class="name-file-upload"> {{ file.name }} </span>

              <UIcon
                @click="removeImageList('file', file)"
                class="w-6 h-6 icon-remove"
                name="i-material-symbols-cancel-outline-rounded"
              />
            </div>
          </div>
          <div class="w-full" v-if="postItem.posts_type === 2">
            <label for="">Ảnh dự án</label>
            <div class="image-show flex flex-wrap">
              <div class="upload-image relative">
                <UInput
                  type="file"
                  multiple
                  @change="onFileSelected('image', $event)"
                  accept=".png, .jpg, .jpeg"
                  class="h-full z-50"
                />
                <UIcon
                  class="icon-upload-image absolute"
                  name="i-material-symbols-upload-file"
                />
              </div>
              <div
                class="div-image"
                v-for="(url, index) in postItem.list_img"
                :key="index"
              >
                <span
                  @click="handleRemoveImage('image', url.seq)"
                  class="close-image"
                  ><UIcon
                    class="text-white"
                    name="i-material-symbols-close-rounded"
                /></span>
                <img :src="url.url" alt="img" />
              </div>
              <div
                class="div-image"
                v-for="(image, index) in urlImageList"
                :key="image.lastModified"
              >
                <span
                  @click="removeImageList('image', image)"
                  class="close-image"
                  ><UIcon
                    class="text-white"
                    name="i-material-symbols-close-rounded"
                /></span>
                <img :src="image" alt="img" />
              </div>
            </div>
          </div>

          <div class="w-full flex justify-end gap-x-3">
            <UButton
              v-if="
                !route.query.new &&
                (postItem.isAvailable == POST.PENDING ||
                  postItem.isAvailable == POST.REJECT) &&
                authStore.userInfoData?.role !== ROLE.SELLER
              "
              @click="
                () => {
                  openModal = true
                  statusChange = POST.ACTIVE
                }
              "
              size="lg"
              color="lime"
              label="Duyệt bài"
            />
            <UButton
              @click="handleEditPost(false)"
              size="lg"
              color="blue"
              :label="route.query.new ? 'Tạo bản dịch' : 'Cập nhật'"
            />
            <UButton
              v-if="
                !route.query.new &&
                (postItem.isAvailable == POST.PENDING ||
                  postItem.isAvailable == POST.ACTIVE) &&
                authStore.userInfoData?.role !== ROLE.SELLER
              "
              @click="
                () => {
                  openModal = true
                  statusChange = POST.REJECT
                }
              "
              size="lg"
              color="red"
              label="Không duyệt"
            />
            <UButton
              @click="router.back()"
              size="lg"
              label="Trở về"
              variant="outline"
            />
          </div>
        </div>
      </div>
      <ModalConfirm
        :message="
          statusChange === 2
            ? 'Bạn có chắc lưu thay đổi và duyệt bài đăng này không?'
            : 'Bạn có chắc không duyệt bài đăng này không?'
        "
        :isOpen="openModal"
        @handleConfirm="
          () => {
            handleChangeStatus()
          }
        "
        @handleConfirmV2="
          () => {
            handleSaveAndChange()
          }
        "
        :showBtn2="statusChange === 2 ? true : false"
        :titileBtn1="statusChange === 2 ? 'Duyệt' : 'Đồng ý'"
        :titileBtn2="statusChange === 2 ? 'Lưu và duyệt' : 'Đồng ý'"
        @handleCloseModal="
          () => {
            openModal = false
          }
        "
      />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.detail-main {
  padding: 20px;

  h1 {
    font-size: 24px;
    font-weight: 400;
  }

  .detail-body {
    :deep(input:not([type='checkbox'])) {
      height: 40px;
    }
    :deep(select) {
      height: 40px;
    }
    .list-image {
      margin-left: -15px;
      .upload-file {
        height: 40px !important;
        border: 1px dashed #37cab8 !important;
        .icon-upload-file {
          top: 7px;
          left: 32px;
          color: #37cab8;
        }
        .select-file {
          font-size: 14px;
          color: black !important;
        }
      }
      .upload-image {
        width: 14%;
        height: 150px;
        border: 1px solid #37cab8;
        cursor: pointer;
        border-radius: 5px;
        margin: 15px;
        :deep(input) {
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        .icon-upload-image {
          top: 45px;
          left: 55px;
          width: 50px;
          height: 50px;
          color: #37cab8;
        }
      }
      .image-list-upload {
        width: 14%;
        height: 150px;
        border: 1px solid #37cab8;
        border-radius: 5px;
        margin: 15px;
        .image-upload {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 5px;
        }
        .icon-close-image {
          bottom: 90%;
          left: 88%;
          width: 31px;
          height: 30px;
          background-color: #ff494f;
          color: #fafafa;
          border-radius: 50%;
        }
      }
    }

    .file-list-upload {
      width: 280px;
      height: 30px;
      border-radius: 5px;
      border: 1px solid #eaeeed;
      .icon-file {
        color: #30998f;
        margin: 2px 10px 0px;
        width: 40px;
      }
      .icon-remove {
        margin: 2px 10px 0px;
        color: #ff494f;
        cursor: pointer;
        width: 40px;
      }
      .name-file-upload {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 280px;
        padding-top: 2px;
        font-size: 14px;
      }
    }
    .image-show {
      .upload-image {
        width: 157px;
        height: 150px;
        border: 1px solid #37cab8;
        cursor: pointer;
        border-radius: 5px;
        margin: 15px;

        :deep(input) {
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .icon-upload-image {
          top: 45px;
          left: 55px;
          width: 50px;
          height: 50px;
          color: #37cab8;
          cursor: pointer;
        }
      }
      .div-image {
        position: relative;
        height: 150px;
        width: 150px;
        margin: 15px;

        .close-image {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: red;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
