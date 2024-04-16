<template>
  <div class="relative">
    <UModal v-model="authStore.isOpenModalForgotPass" prevent-close>
      <UButton
        class="absolute top-3 right-3 rounded-full shadow-gray-50"
        color="gray"
        variant="soft"
        icon="i-heroicons-x-mark-20-solid"
        @click="authStore.closeAllModal"
      />
      <UCard
        class="px-4 pt-5"
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <div class="button-back-modal mb-3">
          <UIcon
            class="text-[25px] cursor-pointer"
            name="i-heroicons-chevron-left"
            @click="
              () => {
                authStore.closeAllModal()
                authStore.isOpenLogin = true
              }
            "
          />
        </div>
        <div class="modal-content">
          <div class="forgot-password">{{ $t('forgot_password') }}?</div>
          <div class="user-information-text">
            {{ $t('please_enter') }}
          </div>
          <UForm class="space-y-4" :state="{}" @submit="handleForgotPassword()">
            <InputAuth
              ref="usernameRef"
              v-model="username"
              name="username"
              class="mt-3"
              :placeholder="$t('phone_number') + ' / Email'"
              :validate="{
                name: $t('phone_number') + ' / Email',
                type: ['email', 'phone'],
                maxLength: 255,
                required: true,
              }"
              autofocus
            />
            <div
              v-if="state.isError"
              class="error-msg mt-5 text-center text-[13px]"
            >
              {{ state.error }}
            </div>
            <div class="button-change-password">
              <UButton block type="submit">{{
                $t('password_retrieval')
              }}</UButton>
            </div>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/core/store/auth'
import { useSystemStore } from '@/core/store/system'
import useValidate from '@/core/composables/useValidate'

const { t } = useI18n()
const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const { state, checkValid } = useValidate()
const toast = useToast()

const usernameRef = ref()

const username = ref('')

const handleForgotPassword = async () => {
  try {
    setLoading(true)
    checkValid([usernameRef])
    if (state.isError) {
      return false
    }
    const dataRequest = {
      username: username.value,
    }
    const { data } = await authStore.forgotPassword(dataRequest)
    if (data.status) {
      authStore.closeAllModal()
      authStore.isCreatedAccount = false
      authStore.isOpenModalOtp = true
      authStore.userlogin = username.value
    } else if (data.message) {
      toast.add({
        title: t('notification'),
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
watch(
  () => authStore.isOpenModalForgotPass,
  newVal => {
    if (!newVal) {
      username.value = ''
      state.error = ''
      state.isError = false
    }
  }
)
</script>
<style lang="scss" scoped>
.button-close-modal {
  right: 5px;
  top: 5px;
  border-radius: 50%;
  :deep(span) {
    width: 30px;
    height: 30px;
  }
}
.modal-content {
  .hello-login {
    font-size: 24px;
    font-weight: 500;
  }
  .title-login {
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 37px;
  }
  .forgot-password {
    font-size: 24px;
    font-weight: 500;
  }
  .user-information-text {
    font-size: 15px;
    font-weight: 400;
  }
  .button-change-password {
    margin-top: 43px;
    :deep(button) {
      height: 40px;
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
}
</style>
