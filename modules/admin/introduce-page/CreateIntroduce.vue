<script setup>
import { useIntroduceAdminStore } from './store.js'
import { useSystemStore } from '@/core/store/system.js'
import { NewsStatus } from '@/core/constants/news/index.js'
import { useAuthStore } from '@/core/store/auth'
import { ROLE } from '@/core/constants/role'
import { PATH } from '@/core/constants'
import { LOCALES } from '@/core/utils/constants'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const useIntroduceAdmin = useIntroduceAdminStore()
const { setLoading } = useSystemStore()

const image = ref()
const imageView = ref()
const content = ref('')
const title = ref('')
const detailImage = ref()
const refImage = ref()
const detailIntroduce = ref({})
const statusChange = ref()
const openModal = ref(false)
const lang = ref(LOCALES[0].code)

onMounted(() => {
  if (route.params.id) {
    handleGetDetailIntroduce(route.params.id)
  }
})

const handleGetDetailIntroduce = async id => {
  const res = await useIntroduceAdmin.getDetailIntroduction(id)
  if (res.status) {
    detailIntroduce.value = res.data
    title.value = res.data.title
    content.value = res.data.content
    detailImage.value = res.data.list_img[0]
    lang.value = res.data.lang
  } else {
    router.push(PATH.ADMIN_INTRODUCE)
  }
}

const onFileSelected = event => {
  detailImage.value = null
  image.value = event.target.files[0]
  imageView.value = URL.createObjectURL(event.target.files[0])
}

const handleCreateIntroduce = async () => {
  try {
    if (!title.value) {
      toast.add({
        title: 'Notification',
        description: 'Thiếu tiêu đề giới thiệu',
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }

    if (!content.value) {
      toast.add({
        title: 'Notification',
        description: 'Thiếu nội dung giới thiệu',
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }

    if (image.value) {
      setLoading(true)
      const formData = new FormData()
      formData.append('images[]', image.value)
      if (route.params.id) {
        formData.append('upload_id', detailIntroduce.value.upload_id)
      }
      const { data } = await useIntroduceAdmin.uploadImage(formData)
      if (!data.status) {
        toast.add({
          title: 'Notification',
          description: data.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
        setLoading(false)
        return false
      }
      if (route.params.id) {
        if (!detailImage.value) {
          const { data } = await useIntroduceAdmin.removeImage({
            list_seq: [detailIntroduce.value.list_img[0].seq],
            upload_id: detailIntroduce.value.upload_id,
          })
          if (!data.status) {
            toast.add({
              title: 'Notification',
              description: data.message,
              icon: 'i-heroicons-exclamation-circle-20-solid',
              color: 'red',
            })
            setLoading(false)
            return false
          }
        }

        await handleUpdateIntroduce(false)
        return false
      }

      const dataCreate = {
        title: title.value,
        content: content.value,
        upload_id: data.data[0].id,
        lang: lang.value,
      }
      const res = await useIntroduceAdmin.createIntroduction(dataCreate)
      if (res.status) {
        toast.add({
          title: 'Notification',
          description: res.message,
          icon: 'i-heroicons-check-circle',
        })
        setLoading(false)
        router.back()
      } else {
        setLoading(false)
        toast.add({
          title: 'Notification',
          description: res.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
      }
    } else {
      if (detailImage.value && route.params.id) {
        await handleUpdateIntroduce(false)
        return false
      }

      toast.add({
        title: 'Notification',
        description: 'Vui lòng chọn hình ảnh đại diện',
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
  }
}

const handleSaveAndChange = async () => {
  await handleUpdateIntroduce(true)
}

const handleChangeStatus = async () => {
  try {
    setLoading(true)
    const { data } = await useIntroduceAdmin.changeStatusIntroduction(
      detailIntroduce.value?.new_id,
      statusChange.value
    )
    if (data.status) {
      setLoading(false)
      openModal.value = false
      router.back()
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-check-circle',
      })
    } else {
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
    setLoading(false)
  }
}

const handleUpdateIntroduce = async check => {
  const data = {
    title: title.value,
    content: content.value,
    upload_id: detailIntroduce.value.upload_id,
    new_id: detailIntroduce.value.new_id,
    lang: lang.value,
  }
  const res = await useIntroduceAdmin.editIntroduction(data)
  if (res.status) {
    if (check) {
      await handleChangeStatus()
      return
    }
    setLoading(false)
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-check-circle',
    })
    router.back()
  } else {
    setLoading(false)
    toast.add({
      title: 'Notification',
      description: res.message,
      icon: 'i-heroicons-exclamation-circle-20-solid',
      color: 'red',
    })
  }
}

const handleRemoveImage = type => {
  if (type) {
    imageView.value = null
    image.value = null
  } else {
    detailImage.value = null
  }
}
</script>

<template>
  <div>
    <NuxtLayout name="admin">
      <Head>
        <Title>{{
          route.params.id
            ? 'Cập nhật bài đăng giới thiệu'
            : 'Tạo bài đăng giới thiệu'
        }}</Title>
      </Head>
      <div class="detail-main">
        <div class="flex gap-x-6">
          <h1 v-if="!route.params.id">Tạo bài đăng giới thiệu</h1>
          <h1 v-else>Cập nhật bài đăng giới thiệu</h1>
        </div>
        <div class="detail-body mt-3 w-full flex flex-col gap-y-3">
          <div>
            <label>Ngôn ngữ</label>
            <USelect
              v-model="lang"
              :options="LOCALES"
              value-attribute="code"
              option-attribute="name"
            />
          </div>
          <div>
            <label>Tiêu đề giới thiệu</label>
            <UInput size="lg" v-model="title" />
          </div>
          <div class="relative overflow-hidden">
            <label>Nội dung giới thiệu</label>
            <CKEditer v-model="content" />
          </div>
          <div>
            <label>Hình ảnh đại diện giới thiệu</label>
            <form>
              <label class="block">
                <span class="sr-only">Choose profile photo</span>
                <input
                  ref="refImage"
                  type="file"
                  @change="onFileSelected($event)"
                  accept=".png, .jpg, .jpeg"
                  class="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-ice-cold-600 file:text-white hover:file:bg-ice-cold-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:file:bg-ice-cold-500 dark:hover:file:bg-ice-cold-400"
                />
              </label>
            </form>
            <div v-if="image" class="mt-3 flex justify-center">
              <div class="image-upload">
                <span @click="handleRemoveImage(true)" class="close-image">
                  <UIcon
                    class="text-white"
                    name="i-material-symbols-close-rounded"
                  />
                </span>
                <img
                  class="image-view-news object-cover h-full w-full"
                  :src="imageView"
                  alt="logo"
                />
              </div>
            </div>
            <div v-if="detailImage && !image" class="mt-3 flex justify-center">
              <div class="image-upload">
                <span @click="handleRemoveImage(false)" class="close-image">
                  <UIcon
                    class="text-white"
                    name="i-material-symbols-close-rounded"
                  />
                </span>
                <img
                  class="image-view-news object-cover h-full w-full"
                  :src="detailImage.url"
                  alt="logo"
                />
              </div>
            </div>
          </div>
          <div class="w-full flex mt-3 justify-end gap-x-3">
            <UButton
              v-if="!route.params.id"
              @click="handleCreateIntroduce"
              size="lg"
              label="Tạo giới thiệu"
            />
            <div
              v-else-if="authStore.userInfoData?.role !== ROLE.SELLER"
              class="flex gap-x-3"
            >
              <UButton
                v-if="
                  detailIntroduce.status === NewsStatus.REJECT ||
                  detailIntroduce.status === NewsStatus.PENDING
                "
                @click="
                  () => {
                    statusChange = NewsStatus.ACTIVE
                    openModal = true
                  }
                "
                size="lg"
                color="lime"
                label="Duyệt giới thiệu"
              />

              <UButton
                v-else
                @click="
                  () => {
                    openModal = true
                    statusChange = NewsStatus.REJECT
                  }
                "
                size="lg"
                color="red"
                label="Không duyệt"
              />
            </div>
            <UButton
              v-if="route.params.id"
              @click="handleCreateIntroduce"
              size="lg"
              label="Cập nhật giới thiệu"
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
          statusChange === NewsStatus.ACTIVE
            ? 'Bạn có chắc duyệt bài giới thiệu này không?'
            : 'Bạn có chắc huỷ duyệt bài giới thiệu này không?'
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
        :showBtn2="true"
        :titileBtn1="statusChange === 2 ? 'Duyệt' : 'Không duyệt'"
        :titileBtn2="statusChange === 2 ? 'Lưu và duyệt' : 'Lưu và không duyệt'"
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
    .image-upload {
      position: relative;
      width: 70%;
      height: 550px;

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
    }
  }
}
</style>

