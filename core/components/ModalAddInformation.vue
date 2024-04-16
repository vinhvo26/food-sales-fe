<template>
  <div class="relative">
    <UModal v-model="authStore.isOpenAddInformation" prevent-close>
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
          <div class="title-modal">{{ $t('add_personal_information') }}</div>
          <div class="title-child-modal">
            {{ $t('please_enter_personal') }}
          </div>
          <UForm class="space-y-4" :state="{}" @submit="handleCreatedAccount()">
            <div class="information-user">
              <InputAuth
                ref="usernameRef"
                v-model="username"
                name="fullname"
                :placeholder="$t('first_and_last_name')"
                :validate="{
                  name: $t('first_and_last_name'),
                  maxLength: 255,
                  required: true,
                }"
                autofocus
              />
              <InputAuth
                ref="phoneDataRef"
                v-model="phoneData"
                name="phone"
                class="mt-3"
                :placeholder="$t('phone_number')"
                :validate="{
                  name: $t('phone_number'),
                  type: ['phone'],
                  maxLength: 255,
                  required: true,
                }"
              />
              <InputAuth
                ref="emailDataRef"
                v-model="emailData"
                class="mt-3"
                name="email"
                placeholder="Email"
                :validate="{
                  name: 'Email',
                  type: ['email'],
                  maxLength: 255,
                  required: true,
                }"
              />
            </div>
            <div
              v-if="state.isError"
              class="error-msg mt-5 text-center text-[13px]"
            >
              {{ state.error }}
            </div>
            <div class="button-change-password">
              <UButton block type="submit">{{ $t('complete') }}</UButton>
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
import { regexValidate } from '@/core/constants/variable/regex-validate'
import useValidate from '@/core/composables/useValidate'

const { t } = useI18n()
const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const toast = useToast()
const { state, checkValid } = useValidate()

const usernameRef = ref('')
const phoneDataRef = ref('')
const emailDataRef = ref('')

const username = ref('')
const phoneData = ref('')
const emailData = ref('')

const handleCreatedAccount = async () => {
  try {
    setLoading(true)
    checkValid([usernameRef, phoneDataRef, emailDataRef])
    if (state.isError) {
      return false
    }
    const firstLastName = username.value.split(' ')
    const dataRequest = {
      email: emailData.value,
      first_name: firstLastName.shift(),
      last_name: firstLastName.join(' '),
      phone: phoneData.value,
      token: authStore.token,
    }
    const { data } = await authStore.updateInfoUser(dataRequest)
    if (data.status) {
      toast.add({
        title: t('notification'),
        description: t('account_successfully_created'),
        icon: 'i-heroicons-check-circle',
        color: 'primary',
      })
      authStore.closeAllModal()
      authStore.isOpenLogin = true
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

onMounted(() => {
  if (authStore.isOpenAddInformation) {
    username.value = authStore.lastName
    phoneData.value = ''
    emailData.value = ''
    state.error = ''
    state.isError = false
    if (regexValidate.EMAIL.test(authStore.userlogin)) {
      emailData.value = authStore.userlogin
      nextTick(() => {
        emailDataRef.value.inputRef.input.disabled = true
      })
    } else {
      phoneData.value = authStore.userlogin
      nextTick(() => {
        phoneDataRef.value.inputRef.input.disabled = true
      })
    }
  }
})

watch(
  () => authStore.isOpenAddInformation,
  newVal => {
    if (newVal) {
      username.value = ''
      phoneData.value = ''
      emailData.value = ''
      state.error = ''
      state.isError = false
      if (regexValidate.EMAIL.test(authStore.userlogin)) {
        emailData.value = authStore.userlogin
        nextTick(() => {
          emailDataRef.value.inputRef.input.disabled = true
        })
      } else {
        phoneData.value = authStore.userlogin
        nextTick(() => {
          phoneDataRef.value.inputRef.input.disabled = true
        })
      }
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
.modal-login-card {
  .modal-content {
    .information-user {
      margin-top: 37px;
    }
    .list-input-otp {
      width: 70%;
      margin: 0 auto;
      margin-top: 37px;
      margin-bottom: 43px;
    }
    .title-login {
      font-weight: 400;
      font-size: 15px;
      margin-bottom: 37px;
    }
    .title-modal {
      font-size: 24px;
      font-weight: 500;
    }
    .title-child-modal {
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
    .terms-of-use {
      font-size: 12px;
      margin-top: 24px;
      margin-bottom: 20px;
      .text-gray {
        color: #787878;
      }
      .text-blue {
        cursor: pointer;
        color: #0d5cb6;
      }
    }
  }
}
</style>
