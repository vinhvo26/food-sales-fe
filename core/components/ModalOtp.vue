<template>
  <div class="relative">
    <UModal v-model="authStore.isOpenModalOtp" prevent-close>
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
                authStore.isCreatedAccount
                  ? (authStore.isOpenModalCreateAccount = true)
                  : (authStore.isOpenModalForgotPass = true)
              }
            "
          />
        </div>
        <div class="modal-content">
          <div class="forgot-password">{{ $t('enter_OTP') }}</div>
          <div class="user-information-text">
            {{ $t('please_verify') }}
          </div>
          <UForm class="space-y-4" :state="{}" @submit="handleCheckOtp()">
            <div class="flex justify-between list-input-otp">
              <InputAuth
                v-for="(item, index) in inputList"
                ref="inputRef"
                class="input-otp"
                v-model="inputList[index]"
                placeholder="0"
                maxLength="1"
                :name="'digit-' + (index + 1)"
                @paste="handlePasetOtp($event)"
                @keydown="handleChangeOtp(index, $event)"
                @focus="handleFocusOtp(index)"
                :validate="{
                  name: 'OTP',
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
              <UButton block type="submit">{{ $t('verification') }}</UButton>
            </div>
          </UForm>
          <div class="terms-of-use">
            <span class="text-gray">
              {{
                dataTime
                  ? $t('resend_the_code_later') + ': ' + dataTime
                  : $t('do_not_receive') + '?'
              }}
            </span>
            <a v-if="!dataTime" class="text-blue" @click="resendOTP()">
              {{ $t('resend_code') }}
            </a>
            <div class="text-gray mt-4">
              {{ $t('5_minutes') }}
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/core/store/auth'
import { useSystemStore } from '@/core/store/system'
import useValidate from '@/core/composables/useValidate'

const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const toast = useToast()
const { state, checkValid } = useValidate()

const inputRef = ref()
const countInterval = ref(null)

const inputList = reactive(['', '', '', '', '', ''])
const dataTime = ref(null)

const handlePasetOtp = event => {
  if (event.type === 'paste') {
    const dataPasetOtp = event.clipboardData.getData('text').trim()
    const copyPassOpt = dataPasetOtp.split('')
    for (let index = 0; index < dataPasetOtp.length; index++) {
      if (new RegExp('^([0-9])$').test(copyPassOpt[index]) && index <= 5) {
        inputList[index] = copyPassOpt[index]
        if (index != 5) {
          inputRef.value[index + 1].inputRef.input.focus()
        }
      }
    }
  }
}

const startTimer = duration => {
  var timer = duration,
    minutes,
    seconds
  minutes = parseInt(timer / 60, 10)
  seconds = parseInt(timer % 60, 10)
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  dataTime.value = minutes + ':' + seconds
  if (--timer < 0) return false
  countInterval.value = setInterval(function () {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10)
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    dataTime.value = minutes + ':' + seconds
    if (--timer < 0) {
      dataTime.value = null
      clearInterval(countInterval.value)
    }
  }, 1000)
}

const handleChangeOtp = function (index, event) {
  if (
    event.key !== 'Control' &&
    event.key !== 'v' &&
    event.key !== 'V' &&
    event.key !== 'Tab' &&
    event.key !== 'ArrowRight' &&
    event.key !== 'ArrowLeft'
  ) {
    event.preventDefault()
  }

  if (event.key === 'Backspace') {
    inputList[index] = null
    if (index != 0) {
      inputRef.value[index - 1].inputRef.input.focus()
      if (inputList[index - 1]) {
        inputRef.value[index - 1].inputRef.input.select()
      }
    }
    return
  }

  if (new RegExp('^([0-9])$').test(event.key)) {
    inputList[index] = event.key
    if (index < 5) {
      inputRef.value[index + 1].inputRef.input.focus()
    } else {
      nextTick(() => {
        inputRef.value[index].inputRef.input.select()
      })
    }
  }
}

const handleFocusOtp = index => {
  if (inputList[index]) {
    inputRef.value[index].inputRef.input.select()
  }
}

const handleCheckOtp = async () => {
  try {
    setLoading(true)
    checkValid(inputRef.value.map(item => ref(item)))
    if (state.isError) {
      return false
    }
    const dataRequest = {
      username: authStore.userlogin,
      otp: inputList.join(''),
      status: authStore.isCreatedAccount ? 1 : 2,
    }
    const { data } = await authStore.checkOtp(dataRequest)
    if (data.status) {
      authStore.token = data.data
      authStore.closeAllModal()
      authStore.isCreatedAccount
        ? (authStore.isOpenAddInformation = true)
        : (authStore.isOpenChangePassword = true)
    } else if (data.message) {
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

const resendOTP = async () => {
  try {
    setLoading(true)
    const { data } = await authStore.forgotPassword({
      username: authStore.userlogin,
    })
    if (data.status) {
      startTimer(90)
    } else if (data.message) {
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

watch(
  () => authStore.isOpenModalOtp,
  newVal => {
    if (newVal) {
      for (let index = 0; index < inputList.length; index++) {
        inputList[index] = ''
      }
      state.error = ''
      state.isError = false
      nextTick(() => {
        startTimer(90)
      })
    } else {
      clearInterval(countInterval.value)
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
  .list-input-otp {
    width: 70%;
    margin: 0 auto;
    margin-top: 37px;
    margin-bottom: 43px;
    .input-otp {
      width: 37px;
      text-align: center;
      :deep(input) {
        text-align: center;
      }
    }
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
</style>
