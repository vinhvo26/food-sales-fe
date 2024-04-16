<template>
  <div class="relative">
    <UModal v-model="authStore.isOpenChangePassword" prevent-close>
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
          <div class="change-password">{{ $t('change_the_password') }}</div>
          <div class="title-change-password">
            {{ $t('please_enter_your_new_password') }}
          </div>
          <UForm class="space-y-4" :state="{}" @submit="handleChangePassword()">
            <InputAuth
              ref="passwordRef"
              name="password"
              v-model="password"
              type="password"
              class="mt-3"
              :placeholder="$t('new_password')"
              :validate="{
                name: $t('new_password'),
                minLength: 6,
                maxLength: 255,
                required: true,
              }"
              autofocus
            />
            <InputAuth
              ref="passwordConfirmRef"
              name="password"
              v-model="passwordConfirm"
              type="password"
              class="mt-3"
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
            <div class="button-change-password">
              <UButton block type="submit">{{
                $t('change_the_password')
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

const passwordRef = ref()
const passwordConfirmRef = ref()

const password = ref('')
const passwordConfirm = ref('')

const handleChangePassword = async () => {
  try {
    setLoading(true)
    checkValid([passwordRef, passwordConfirmRef])
    if (state.isError) {
      return false
    }
    const dataRequest = {
      password: password.value,
      token: authStore.token,
    }
    const { data } = await authStore.resetPassword(dataRequest)
    if (data.status) {
      toast.add({
        title: t('notification'),
        description: t('password_changed_successfully'),
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

watch(
  () => authStore.isOpenChangePassword,
  newVal => {
    if (!newVal) {
      password.value = ''
      passwordConfirm.value = ''
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
  .change-password {
    font-size: 24px;
    font-weight: 500;
  }
  .title-change-password {
    font-weight: 400;
    font-size: 15px;
    margin-bottom: 30px;
  }
  .hello-login {
    font-size: 24px;
    font-weight: 500;
  }
  .button-change-password {
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
</style>
