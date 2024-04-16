<script setup>
import { useRecruitmentAdminStore } from './store'
import useValidate from '@/core/composables/useValidate.js'
import { useSystemStore } from '@/core/store/system.js'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '@/core/constants/role'
import { PATH } from '@/core/constants'
import { LOCALES } from '@/core/utils/constants'

const authStore = useAuthStore()
const { state, checkValid } = useValidate()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const useRecruitmentAdmin = useRecruitmentAdminStore()
const { setLoading } = useSystemStore()

const titleRef = ref()
const positionRef = ref()
const number_of_recruitmentRef = ref()
const salaryRef = ref()
const professional_requirementRef = ref()
const requires_expertiseRef = ref()
const contactRef = ref()

const title = ref('')
const position = ref('')
const number_of_recruitment = ref('')
const salary = ref('')
const professional_requirement = ref('')
const other_requirement = ref('')
const requires_expertise = ref('')
const contact = ref('')
const lang = ref(LOCALES[0].code)

const urlImageListFile = ref([])
const urlImageList = ref([])
const listSeq = ref([])

const openModal = ref(false)

onMounted(async () => {
  useRecruitmentAdmin.detailRecruitment = null
  if (route.params.id) {
    await handleGetDetail()
  }
})

const handleGetDetail = async () => {
  const res = await useRecruitmentAdmin.getDetailRecruitment(route.params.id)
  if (res.status) {
    useRecruitmentAdmin.detailRecruitment = res.data

    title.value = useRecruitmentAdmin.detailRecruitment?.title
    position.value = useRecruitmentAdmin.detailRecruitment?.position
    number_of_recruitment.value =
      useRecruitmentAdmin.detailRecruitment.number_of_recruitment
    salary.value = useRecruitmentAdmin.detailRecruitment?.salary
    professional_requirement.value =
      useRecruitmentAdmin.detailRecruitment.professional_requirement
    other_requirement.value =
      useRecruitmentAdmin.detailRecruitment.other_requirement
    requires_expertise.value =
      useRecruitmentAdmin.detailRecruitment.requires_expertise
    contact.value = useRecruitmentAdmin.detailRecruitment?.contact
    lang.value = useRecruitmentAdmin.detailRecruitment.lang
  } else {
    useRecruitmentAdmin.detailRecruitment = null
    router.push(PATH.ADMIN_RECRUITMENT)
  }
}

const handleCreateRecruitment = async check => {
  try {
    checkValid([
      titleRef,
      positionRef,
      number_of_recruitmentRef,
      salaryRef,
      contactRef,
      professional_requirementRef,
      requires_expertiseRef,
    ])
    if (state.isError) {
      toast.add({
        title: 'Notification',
        description: state.error,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return
    }

    if (urlImageListFile.value.length <= 0 && !route.params.id) {
      toast.add({
        title: 'Notification',
        description: 'Vui lòng chọn hình ảnh!',
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return
    }
    setLoading(true)

    const formData = new FormData()
    urlImageListFile.value.forEach(file => {
      formData.append('images[]', file)
    })

    if (route.params.id) {
      if (useRecruitmentAdmin.detailRecruitment?.upload_id) {
        formData.append(
          'upload_id',
          useRecruitmentAdmin.detailRecruitment?.upload_id
        )
      }
    }

    let uploadId = useRecruitmentAdmin.detailRecruitment?.upload_id || null

    if (urlImageListFile.value.length > 0) {
      const { data } = await useRecruitmentAdmin.uploadImage(formData)
      if (!data?.status) {
        toast.add({
          title: 'Thông báo',
          description: data.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
        return
      }
      uploadId = data?.data[0].id
    }

    if (listSeq.value.length > 0) {
      await useRecruitmentAdmin.removeImage({
        upload_id: useRecruitmentAdmin.detailRecruitment?.upload_id,
        list_seq: listSeq.value,
      })
    }

    const body = {
      title: title.value,
      position: position.value,
      number_of_recruitment: number_of_recruitment.value,
      salary: salary.value,
      professional_requirement: professional_requirement.value,
      other_requirement: other_requirement.value,
      requires_expertise: requires_expertise.value,
      contact: contact.value,
      upload_id: uploadId,
      recruitment_id: route.params.id
        ? useRecruitmentAdmin.detailRecruitment?.recruitment_id
        : null,
      lang: lang.value,
    }

    let res = null

    if (route.params.id) {
      res = await useRecruitmentAdmin.editRecruitment(body)
      if (check) {
        await handleChangeStatusRecruitment()
        return
      }
    } else {
      res = await useRecruitmentAdmin.createRecruitment(body)
    }

    if (res.status) {
      toast.add({
        title: 'Notification',
        description: res.message,
        icon: 'i-heroicons-check-circle',
        color: 'primary',
      })
      router.back()
    } else {
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

const onFileSelected = event => {
  const lengthEvent = event.target.files.length
  for (let index = 0; index < lengthEvent; index++) {
    urlImageListFile.value.push(event.target.files[index])
    urlImageList.value.push(URL.createObjectURL(event.target.files[index]))
  }
}

const removeImageList = (image, index) => {
  urlImageList.value = urlImageList.value.filter(img => img !== image)
  if (index > -1) {
    urlImageListFile.value.splice(index, 1)
  }
}

const handleRemoveImage = seq => {
  useRecruitmentAdmin.detailRecruitment.list_img =
    useRecruitmentAdmin.detailRecruitment.list_img.filter(e => e.seq !== seq)
  listSeq.value.push(seq)
}

const handleSaveAndChange = async () => {
  await handleCreateRecruitment(true)
}

const handleChangeStatusRecruitment = async () => {
  const res = await useRecruitmentAdmin.changeStatusRecruitment(
    useRecruitmentAdmin.detailRecruitment.recruitment_id
  )
  if (res.status) {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
      color: 'primary',
    })
    openModal.value = false
    router.back()
  } else {
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}
</script>
<template>
  <div>
    <NuxtLayout name="admin">
      <Head>
        <Title>{{
          route.params.id ? 'Cập nhật bài tuyển dụng' : 'Tạo bài tuyển dụng'
        }}</Title>
      </Head>
      <div class="detail-main">
        <h1>
          {{
            route.params.id ? 'Cập nhật bài tuyển dụng' : 'Tạo bài tuyển dụng'
          }}
        </h1>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label>Ngôn ngữ</label>
            <USelect
              v-model="lang"
              :options="LOCALES"
              value-attribute="code"
              option-attribute="name"
              size="lg"
            />
          </div>
          <div>
            <div>
              <label for="">Tiêu đề tuyển dụng</label>
              <UInputCustom
                v-model="title"
                ref="titleRef"
                :validate="{
                  name: 'Tiêu đề tuyển dụng',
                  required: true,
                }"
                size="lg"
              />
            </div>
          </div>
          <div>
            <label for="">Vị trí tuyển dụng</label>
            <UInputCustom
              v-model="position"
              ref="positionRef"
              :validate="{
                name: 'Vị trí tuyển dụng',
                required: true,
              }"
              size="lg"
            />
          </div>
          <div>
            <label for="">Số lượng tuyển dụng</label>
            <UInputCustom
              type="number"
              v-model="number_of_recruitment"
              ref="number_of_recruitmentRef"
              :validate="{
                name: 'Số lượng tuyển dụng',
                required: true,
              }"
              size="lg"
            />
          </div>
          <div>
            <label for="">Mức lương</label>
            <UInputCustom
              v-model="salary"
              ref="salaryRef"
              :validate="{
                name: 'Mức lương tuyển dụng',
                required: true,
              }"
              size="lg"
            />
          </div>
          <div>
            <label for="">Liên hệ</label>
            <UInputCustom
              v-model="contact"
              ref="contactRef"
              :validate="{
                name: 'Liên hệ',
                required: true,
              }"
              size="lg"
            />
          </div>
          <div class="col-span-2">
            <label for="">Công việc chính</label>
            <UTextareaCustom
              v-model="professional_requirement"
              ref="professional_requirementRef"
              :validate="{
                name: 'Công việc chính',
                required: true,
              }"
              size="lg"
              :rows="10"
            />
          </div>
          <div>
            <label for="">Yêu cầu chuyên môn</label>
            <UTextareaCustom
              v-model="requires_expertise"
              ref="requires_expertiseRef"
              :validate="{
                name: 'Yêu cầu chuyên môn',
                required: true,
              }"
              size="lg"
              :rows="10"
            />
          </div>
          <div>
            <label for="">Yêu cầu khác</label>
            <UTextarea size="lg" v-model="other_requirement" :rows="10" />
          </div>
          <div class="col-span-2">
            <label for="">Hình ảnh</label>
            <div class="grid-cols-6 grid gap-4">
              <div class="upload-image relative">
                <UInput
                  type="file"
                  multiple
                  @change="onFileSelected($event)"
                  accept=".png, .jpg, .jpeg"
                  class="z-50 w-full h-full input-file"
                />
                <UIcon class="icon" name="i-material-symbols-upload-rounded" />
              </div>

              <div
                class="list-image"
                :key="index"
                v-for="(item, index) in urlImageList"
              >
                <img :src="item" alt="logo" />
                <span @click="removeImageList(item, index)" class="close-image">
                  <UIcon
                    class="text-white"
                    name="i-material-symbols-close-rounded"
                  />
                </span>
              </div>
              <div
                class="list-image"
                :key="index"
                v-for="(item, index) in useRecruitmentAdmin.detailRecruitment
                  ?.list_img"
              >
                <img :src="item.url" alt="logo" />
                <span @click="handleRemoveImage(item.seq)" class="close-image">
                  <UIcon
                    class="text-white"
                    name="i-material-symbols-close-rounded"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex mt-3 justify-end gap-x-3">
          <div
            v-if="
              route.params.id && authStore.userInfoData?.role !== ROLE.SELLER
            "
            class="flex gap-x-3"
          >
            <UButton
              v-if="useRecruitmentAdmin.detailRecruitment?.status === 2"
              @click="
                () => {
                  openModal = true
                }
              "
              size="lg"
              color="lime"
              label="Duyệt đăng tuyển"
            />

            <UButton
              v-else
              @click="
                () => {
                  openModal = true
                }
              "
              size="lg"
              color="red"
              label="Không duyệt"
            />
          </div>

          <UButton
            @click="handleCreateRecruitment"
            size="lg"
            :label="
              route.params.id ? 'Cập nhật bài tuyển dụng' : 'Lưu bài tuyển dụng'
            "
          />

          <UButton
            @click="router.back()"
            size="lg"
            label="Trở về"
            variant="outline"
          />
        </div>
      </div>
      <ModalConfirm
        :message="
          useRecruitmentAdmin.detailRecruitment?.status === 2
            ? 'Bạn có chắc duyệt bài đăng tuyển này không?'
            : 'Bạn có chắc huỷ duyệt bài đăng tuyển này không?'
        "
        :isOpen="openModal"
        @handleConfirm="
          () => {
            handleChangeStatusRecruitment()
          }
        "
        @handleConfirmV2="
          () => {
            handleSaveAndChange()
          }
        "
        :showBtn2="true"
        :titileBtn1="
          useRecruitmentAdmin.detailRecruitment?.status === 2
            ? 'Duyệt'
            : 'Không duyệt'
        "
        :titileBtn2="
          useRecruitmentAdmin.detailRecruitment?.status === 2
            ? 'Lưu và duyệt'
            : 'Lưu và không duyệt'
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
.detail-main {
  padding: 20px;

  h1 {
    font-size: 24px;
    font-weight: 400;
  }

  .validate-error {
    border-bottom: none !important;
    :deep(input) {
      border: none !important;

      &:focus {
        border: none !important;
      }
    }
  }

  .upload-image {
    border: 1px #37cab8 solid;
    aspect-ratio: 1/1;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    .input-file {
      position: absolute;
      left: 0;
      top: 0;
      cursor: pointer;
      :deep(input) {
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }

    .icon {
      width: 50px;
      height: 50px;
    }
  }

  .list-image {
    aspect-ratio: 1/1;
    position: relative;
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
      border-radius: 10px;
    }
  }
}
</style>

