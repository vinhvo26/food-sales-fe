<script setup>
import Editor from '@ckeditor-super/ckeditor5-super-custom'
import { usePostAdminStore } from '../../modules/admin/posts-page/store'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:model-value'])

const postAdminStore = usePostAdminStore()

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader
  }
  upload() {
    return this.loader.file.then(
      file =>
        new Promise(async (resolve, reject) => {
          try {
            if (!file) return
            const formData = new FormData()
            formData.append('images[]', file)
            const { data } = await postAdminStore.uploadImage(formData)
            if (data.status) {
              const urlImage = data.data[0].url
              resolve({ default: urlImage })
            }
          } catch (error) {
            reject(error)
          }
        })
    )
  }
}

const editor = Editor

const editorConfig = {
  extraPlugins: [
    function (editor) {
      editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new MyUploadAdapter(loader)
      }
    },
  ],
}
</script>
<template>
  <div class="w-full">
    <ClientOnly>
      <CkeditorNuxt
        :class="{ 'ck-diabled': props.disabled }"
        :model-value="props.modelValue || ''"
        @input="emits('update:model-value', $event)"
        :editor="editor"
        :config="editorConfig"
        :disabled="props.disabled"
      />
    </ClientOnly>
  </div>
</template>

<style lang="scss">
@import '@/core/assets/scss/ck-editor.scss';
</style>
