<script setup>
import { useNewsAdminStore } from './store.js'
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
const useNewsAdmin = useNewsAdminStore()
const { setLoading } = useSystemStore()

const image = ref()
const imageView = ref()
const content = ref('')
const title = ref('')
const detailImage = ref()
const refImage = ref()
const detailNews = ref({})
const statusChange = ref()
const openModal = ref(false)
const lang = ref(LOCALES[0].code)

onMounted(async () => {
  if (route.params.id) {
    await handleGetDetailNews(route.params.id)
  }
})

const handleGetDetailNews = async id => {
  const res = await useNewsAdmin.getDetailNews(id)
  if (res.status) {
    detailNews.value = res.data
    title.value = res.data.title
    content.value = res.data.content
    detailImage.value = res.data.list_img[0]
    lang.value = res.data.lang
  } else {
    router.push(PATH.ADMIN_NEWS)
  }
}

const onFileSelected = event => {
  detailImage.value = null
  image.value = event.target.files[0]
  imageView.value = URL.createObjectURL(event.target.files[0])
}

const handleCreateNews = async () => {
  try {
    if (!title.value) {
      toast.add({
        title: 'Notification',
        description: 'Thiếu tiêu đề tin tức',
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }

    if (!content.value) {
      toast.add({
        title: 'Notification',
        description: 'Thiếu nội dung tin tức',
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
        formData.append('upload_id', detailNews.value.upload_id)
      }
      const { data } = await useNewsAdmin.uploadImage(formData)
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
          const { data } = await useNewsAdmin.removeImage({
            list_seq: [detailNews.value.list_img[0].seq],
            upload_id: detailNews.value.upload_id,
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

        await handleUpdateNews(false)
        return false
      }

      const dataCreate = {
        title: title.value,
        content: content.value,
        upload_id: data.data[0].id,
        lang: lang.value,
      }
      const res = await useNewsAdmin.createNews(dataCreate)
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
        await handleUpdateNews(false)
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
  await handleUpdateNews(true)
}

const handleChangeStatus = async () => {
  try {
    setLoading(true)
    const { data } = await useNewsAdmin.changeStatusNews(
      detailNews.value?.new_id,
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

const handleUpdateNews = async check => {
  const data = {
    title: title.value,
    content: content.value,
    upload_id: detailNews.value.upload_id,
    new_id: detailNews.value.new_id,
    lang: lang.value,
  }
  const res = await useNewsAdmin.editNews(data)
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
          route.params.id ? 'Cập nhật bài đăng tin tức' : 'Tạo bài đăng tin tức'
        }}</Title>
      </Head>
      <div class="detail-main">
        <div class="flex gap-x-6">
          <h1 v-if="!route.params.id">Tạo bài đăng tin tức</h1>
          <h1 v-else>Cập nhật bài đăng tin tức</h1>
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
            <label>Tiêu đề tin tức</label>
            <UInput size="lg" v-model="title" />
          </div>
          <div class="relative overflow-hidden">
            <label>Nội dung tin tức</label>
            <CKEditer v-model="content" />
          </div>
          <div>
            <label>Hình ảnh đại diện tin tức</label>
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
              @click="handleCreateNews"
              size="lg"
              label="Tạo tin tức"
            />
            <div
              v-else-if="authStore.userInfoData?.role !== ROLE.SELLER"
              class="flex gap-x-3"
            >
              <UButton
                v-if="
                  detailNews.status === NewsStatus.REJECT ||
                  detailNews.status === NewsStatus.PENDING
                "
                @click="
                  () => {
                    statusChange = NewsStatus.ACTIVE
                    openModal = true
                  }
                "
                size="lg"
                color="lime"
                label="Duyệt tin tức"
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
              @click="handleCreateNews"
              size="lg"
              label="Cập nhật tin tức"
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
            ? 'Bạn có chắc duyệt bài tin tức này không?'
            : 'Bạn có chắc huỷ duyệt bài tin tức này không?'
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

