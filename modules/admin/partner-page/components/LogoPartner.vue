<script setup>
import { usePartnerAdminStore } from '../store'
import { useSystemStore } from '@/core/store/system.js'

const { setLoading } = useSystemStore()
const usePartnerAdmin = usePartnerAdminStore()
const toast = useToast()

const urlImageListFile = ref([])
const urlImageList = ref([])
const listSeq = ref([])

onMounted(async () => {
  await handleGetListLogo()
})

const handleGetListLogo = async () => {
  const res = await usePartnerAdmin.getListLogo()
  if (res.status) {
    usePartnerAdmin.listLogo = res.data
  } else {
    usePartnerAdmin.listLogo = []
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
  usePartnerAdmin.listLogo.list_img = usePartnerAdmin.listLogo.list_img.filter(
    e => e.seq !== seq
  )
  listSeq.value.push(seq)
}

const handleUploadImage = async () => {
  try {
    setLoading(true)
    let id = null
    if (urlImageListFile.value.length > 0) {
      const formData = new FormData()
      urlImageListFile.value.forEach(file => {
        formData.append('images[]', file)
      })

      if (usePartnerAdmin.listLogo) {
        formData.append('upload_id', usePartnerAdmin.listLogo.upload_id)
      }

      const { data } = await usePartnerAdmin.uploadImage(formData)
      if (!data?.status) {
        toast.add({
          title: 'Thông báo',
          description: data.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
        return
      } else {
        id = data?.data[0].id
      }
    }
    if (listSeq.value.length > 0) {
      const res = await usePartnerAdmin.removeImage({
        upload_id: usePartnerAdmin.listLogo.upload_id,
        list_seq: listSeq.value,
      })
      
    }
    if (!usePartnerAdmin.listLogo) {
      const res = await usePartnerAdmin.addLogo({ upload_id: id })
      if (res.status) {
        toast.add({
          title: 'Notification',
          description: res.message,
          icon: 'i-heroicons-check-circle',
        })
      } else {
        toast.add({
          title: 'Thông báo',
          description: res.message,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
      }
    } else {
      toast.add({
        title: 'Notification',
        description: 'Thành công',
        icon: 'i-heroicons-check-circle',
      })
    }
  } catch (e) {
    console.log(e)
  } finally {
    setLoading(false)
  }
}
</script>

<template>
  <div class="news-main grid mt-3 grid-cols-6 gap-4">
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

    <div class="list-image" :key="index" v-for="(item, index) in urlImageList">
      <img :src="item" alt="logo" />
      <span @click="removeImageList(item, index)" class="close-image">
        <UIcon class="text-white" name="i-material-symbols-close-rounded" />
      </span>
    </div>
    <div
      class="list-image"
      :key="index"
      v-for="(item, index) in usePartnerAdmin.listLogo?.list_img"
    >
      <img :src="item.url" alt="logo" />
      <span @click="handleRemoveImage(item.seq)" class="close-image">
        <UIcon class="text-white" name="i-material-symbols-close-rounded" />
      </span>
    </div>
  </div>
  <div class="flex justify-end">
    <UButton class="px-14" @click="handleUploadImage" size="lg" label="Lưu" />
  </div>
</template>

<style scoped lang="scss">
.news-main {
  padding: 20px;

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
}
</style>
