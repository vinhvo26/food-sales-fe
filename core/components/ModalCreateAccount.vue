<template>
  <div class="relative">
    <UModal v-model="authStore.isOpenModalCreateAccount" prevent-close>
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
          maxWidth: 'max-w-3xl',
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
          <div class="create-account">{{ $t('create_account') }}</div>
          <div class="title-create-account">
            {{ $t('phone_number_or_email') }}
          </div>
          <UForm class="space-y-4" :state="{}" @submit="handleLogin()">
            <InputAuth
              ref="usernameRef"
              v-model="username"
              name="username"
              :placeholder="$t('phone_number') + ' / Email'"
              :validate="{
                name: $t('phone_number') + ' / Email',
                type: ['email', 'phone'],
                maxLength: 255,
                required: true,
              }"
              autofocus
            />
            <InputAuth
              ref="passwordRef"
              v-model="password"
              type="password"
              class="mt-3"
              name="password"
              :placeholder="$t('password')"
              :validate="{
                name: $t('password'),
                minLength: 6,
                maxLength: 255,
                required: true,
              }"
            />
            <InputAuth
              ref="passwordConfirmRef"
              v-model="passwordConfirm"
              type="password"
              class="mt-3"
              name="password"
              :placeholder="$t('enter_the_password')"
              :validate="
                computed(() => ({
                  name: $t('password'),
                  required: true,
                  compare: password,
                }))
              "
            />
            <div
              v-if="state.isError"
              class="error-msg mt-5 text-center text-[13px]"
            >
              {{ state.error }}
            </div>
            <div class="button-create-account">
              <UButton block type="submit">{{ $t('create_account') }}</UButton>
            </div>
          </UForm>
          <UDivider :label="$t('or_continue_with')" class="divider-created" />
          <div class="icon-facebook-gmail flex">
            <div
              class="p-4 rounded-full shadow-sm overflow-hidden w-[58px] h-[58px] border cursor-pointer mx-2"
              @click="loginWithFacebook"
            >
              <img src="@/core/assets/img/facebook.png" />
            </div>
            <div
              class="p-4 rounded-full shadow-sm overflow-hidden w-[58px] h-[58px] border cursor-pointer mx-2"
              @click="loginWithGoogle"
            >
              <img src="@/core/assets/img/gmail.png" />
            </div>
          </div>
          <div class="terms-of-use">
            <span v-if="locale === 'vi'" class="text-gray">
              Bằng việc tiếp tục, bạn đã đọc và đồng ý với
              <span class="text-blue"> điều khoản sử dụng </span>
              và
              <span class="text-blue"> chính sách bảo mật </span>
              thông tin cá nhân của Vạn Phúc.
            </span>
            <span v-else-if="locale === 'en'" class="text-gray">
              By continuing, you have read and agreed to
              <span class="text-blue"> Van Phuc's terms of use </span>and
              personal information
              <span class="text-blue"> privacy policy</span>.
            </span>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/core/store/auth'
import useValidate from '@/core/composables/useValidate'
import { useSystemStore } from '@/core/store/system'

const { locale, t } = useI18n()
const { state, checkValid } = useValidate()
const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const toast = useToast()
const route = useRoute()

const usernameRef = ref()
const passwordRef = ref()
const passwordConfirmRef = ref()

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')

const handleLogin = async () => {
  try {
    setLoading(true)
    checkValid([usernameRef, passwordRef, passwordConfirmRef])
    if (state.isError) {
      return false
    }
    const dataRequest = {
      username: username.value,
      password: password.value,
    }
    const { data } = await authStore.createdAccount(dataRequest)
    if (data.status) {
      authStore.userlogin = username.value
      authStore.closeAllModal()
      authStore.isCreatedAccount = true
      authStore.isOpenModalOtp = true
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

const loginWithGoogle = async () => {
  try {
    setLoading(true)
    const query = {
      redirect: route.fullPath,
    }
    const { data } = await authStore.loginWithGoogle(query)
    if (data.status) {
      window.location.href = data.data
    } else {
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

const loginWithFacebook = async () => {
  try {
    setLoading(true)
    const query = {
      redirect: route.fullPath,
    }
    const { data } = await authStore.loginWithFacebook(query)
    if (data.status) {
      window.location.href = data.data
    } else {
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
  () => authStore.isOpenModalCreateAccount,
  newVal => {
    if (!newVal) {
      username.value = ''
      password.value = ''
      passwordConfirm.value = ''
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
  .create-account {
    font-size: 24px;
    font-weight: 500;
  }
  .title-create-account {
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 30px;
  }
  .hello-login {
    font-size: 24px;
    font-weight: 500;
  }
  .button-create-account {
    margin-top: 43px;
    :deep(button) {
      height: 40px;
      font-size: 16px;
      margin-bottom: 20px;
    }
  }

  .divider-created {
    margin-top: 50px;
    margin-bottom: 24px;
    :deep(span) {
      color: #4e4e4e;
      font-size: 18px;
      padding: 0px 35px;
    }
  }
  .icon-facebook-gmail {
    justify-content: center;
  }
  .terms-of-use {
    font-size: 12px;
    margin-top: 24px;
    margin-bottom: 20px;
    .text-gray {
      color: #787878;
    }
    .text-blue {
      color: #0d5cb6;
    }
  }
}
@media only screen and (max-width: 355px) {
  .divider-created {
    padding: 0px 20px;
    :deep(span) {
      padding: 0px !important;
    }
  }
}
</style>
