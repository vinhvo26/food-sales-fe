<template>
  <UModal
    :ui="{
      width: 'w-full sm:max-w-3xl',
    }"
    v-model="props.isOpen"
    prevent-close
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Thay đổi mật khẩu
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="
              () => {
                emits('handleCloseModal')
              }
            "
          />
        </div>
      </template>
      <div class="flex flex-col gap-3">
        <UForm
          autocomplete="off"
          class="space-y-4"
          :state="{}"
          @submit="handleChangePassword()"
        >
          <div>
            <label>Mật khẩu cũ</label>
            <UInputCustom
              name="current-password"
              size="lg"
              ref="passwordOldRef"
              v-model="passwordOld"
              type="password"
              placeholder="Nhập mật khẩu cũ"
              :validate="{
                name: 'Mật khẩu cũ',
                minLength: 6,
                maxLength: 255,
                required: true,
              }"
            />
          </div>
          <div>
            <label>Mật khẩu mới</label>
            <UInputCustom
              name="new-password"
              size="lg"
              ref="passwordRef"
              v-model="password"
              type="password"
              placeholder="Nhập mật khẩu mới"
              :validate="{
                name: 'Mật khẩu mới',
                minLength: 6,
                maxLength: 255,
                required: true,
              }"
            />
          </div>
          <div>
            <label>Nhập lại mật khẩu mới</label>
            <UInputCustom
              name="new-password"
              size="lg"
              ref="passwordConfirmRef"
              v-model="passwordConfirm"
              type="password"
              placeholder="Nhập mật khẩu"
              :validate="
                computed(() => ({
                  name: 'Mật khẩu xác nhận',
                  required: true,
                  compare: password,
                }))
              "
            />
          </div>
        </UForm>
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton type="submit" color="primary" variant="solid"
            >Cập nhật</UButton
          >
          <UButton
            color="cyan"
            variant="outline"
            @click="emits('handleCloseModal')"
            >Trở về</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
<script setup>
import { useAuthStore } from '@/core/store/auth'
import { useSystemStore } from '@/core/store/system'
import useValidate from '@/core/composables/useValidate'

const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const { state, checkValid } = useValidate()
const toast = useToast()

const passwordOldRef = ref()
const passwordRef = ref()
const passwordConfirmRef = ref()

const password = ref('')
const passwordOld = ref('')
const passwordConfirm = ref('')

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['handleCloseModal'])

const handleChangePassword = async () => {
  try {
    setLoading(true)
    checkValid([passwordOldRef, passwordRef, passwordConfirmRef])
    if (state.isError) {
      toast.add({
        title: 'Notification',
        description: state.error,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }

    const body = {
      password: passwordOld.value,
      newpassword: password.value,
    }

    const { data } = await authStore.changepassword(body)
    if (data?.status) {
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-check-circle',
        color: 'primary',
      })
      emits('handleCloseModal')
    } else {
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  } catch (error) {
  } finally {
    setLoading(false)
  }
}
</script>
<style scoped lang="scss">
.validate-error {
  border-bottom: none !important;
  :deep(input) {
    border: 1px solid #ff424e !important;

    &:focus {
      border: none !important;
    }
  }
}
</style>
