<template>
  <div class="relative">
    <UModal class="modal-login" v-model="authStore.isOpenLogin" prevent-close>
      <UButton
        class="absolute top-3 right-3 rounded-full shadow-gray-50"
        color="gray"
        variant="soft"
        icon="i-heroicons-x-mark-20-solid"
        @click="authStore.closeAllModal"
      />
      <UCard
        class="modal-login-card px-4 pt-5"
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <div class="modal-content">
          <div class="hello-login">{{ $t('hello') }},</div>
          <div class="title-login">{{ $t('log_in') }}</div>
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
              name="password"
              type="password"
              class="mt-5"
              :placeholder="$t('password')"
              :validate="{
                name: $t('password'),
                minLength: 6,
                maxLength: 255,
                required: true,
              }"
            />
            <div
              v-if="state.isError"
              class="error-msg mt-5 text-center text-[13px]"
            >
              {{ state.error }}
            </div>
            <div class="button-login">
              <UButton block type="submit">{{ $t('log_in') }}</UButton>
            </div>
          </UForm>
          <div
            class="forgot-password"
            @click="
              () => {
                authStore.closeAllModal()
                authStore.isOpenModalForgotPass = true
              }
            "
          >
            {{ $t('forgot_password') }}?
          </div>
          <div class="created-account-user">
            <span class="no-account">{{ $t('no_account') }}?</span>
            <span
              class="created-account"
              @click="
                () => {
                  authStore.closeAllModal()
                  authStore.isOpenModalCreateAccount = true
                }
              "
              >{{ $t('create_account') }}</span
            >
          </div>
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
const route = useRoute()
const { state, checkValid } = useValidate()
const { setLoading } = useSystemStore()
const authStore = useAuthStore()
const toast = useToast()

const username = ref('')
const password = ref('')
const usernameRef = ref(null)
const passwordRef = ref(null)

const handleLogin = async () => {
  try {
    setLoading(true)
    checkValid([usernameRef, passwordRef])
    if (state.isError) {
      return false
    }
    const dataRequest = {
      username: username.value,
      password: password.value,
    }
    const { data } = await authStore.login(dataRequest)
    if (data.status) {
      if (data.data.last_name) {
        authStore.username = data.data.last_name
      } else if (data.data.first_name) {
        authStore.username = data.data.first_name
      } else authStore.username = 'Người dùng'
      localStorage.setItem('user_name', authStore.username)
      localStorage.setItem('isAuth', 'true')
      authStore.isAuth = true
      authStore.userInfoData = data.data
      authStore.closeAllModal()
    } else if (data.message) {
      if (data.errors?.type === 'ACCOUNT_NOT_AUTHENTICATED') {
        if (data.errors?.status === 0) {
          await resendOTP()
        } else {
          authStore.closeAllModal()
          authStore.userlogin = username.value
          authStore.isCreatedAccount = true
          authStore.isOpenAddInformation = true
        }
      }
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

const resendOTP = async () => {
  try {
    const { data } = await authStore.forgotPassword({
      username: username.value,
    })
    if (data.status) {
      authStore.closeAllModal()
      authStore.userlogin = username.value
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
  } catch (error) {}
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
  () => authStore.isOpenLogin,
  newVal => {
    if (!newVal) {
      username.value = ''
      password.value = ''
      state.error = ''
      state.isError = false
    }
  }
)
</script>
<style lang="scss" scoped>
.modal-login {
  .modal-login-card {
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
        font-weight: 600;
      }
      .title-login {
        font-weight: 400;
        font-size: 15px;
        margin-bottom: 37px;
      }
      .button-login {
        margin-top: 43px;
        :deep(button) {
          height: 40px;
          font-size: 16px;
          margin-bottom: 20px;
        }
      }
      .forgot-password {
        font-size: 13px;
        color: #0d5cb6;
        cursor: pointer;
      }
      .created-account-user {
        .no-account {
          font-size: 13px;
          color: #787878;
        }
        .created-account {
          cursor: pointer;
          font-size: 13px;
          color: #0d5cb6;
          padding-left: 8px;
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
