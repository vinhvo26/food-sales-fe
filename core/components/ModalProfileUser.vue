<template>
  <div class="relative">
    <UModal
      class="modal-user-infor"
      v-model="authStore.isOpenUserInformation"
      prevent-close
    >
      <UButton
        class="absolute top-3 right-3 rounded-full shadow-gray-50"
        color="gray"
        variant="soft"
        icon="i-heroicons-x-mark-20-solid"
        @click="closeModal"
      />
      <UCard
        class="modal-user-infor-card px-4 pt-5"
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <div class="flex flex-wrap" :class="{ 'justify-center': isSm }">
          <div>
            <UIcon
              class="text-xl w-24 h-24 text-ice-cold-400 mr-1 leading-3"
              name="i-ic-baseline-account-box"
            />
          </div>
          <div class="pt-3" :class="{ 'w-full': isSm }">
            <div class="text-xl">
              {{
                [
                  authStore.userInfoData?.first_name,
                  authStore.userInfoData?.last_name,
                ]
                  .filter(item => item)
                  .join(' ')
              }}
            </div>
            <div class="w-full">
              <div class="text-sm">
                <span class="text-sky-500">{{ email }}</span
                ><span class="text-gray-500">
                  -
                  {{
                    authStore.userInfoData?.role === 'USER'
                      ? 'User'
                      : authStore.userInfoData?.role === 'SELLER'
                      ? 'Seller'
                      : 'Administrator'
                  }}</span
                >
              </div>
              <div class="text-sm pt-1 text-gray-500">
                {{ authStore.userInfoData.phone }}
              </div>
            </div>
          </div>
        </div>
        <h1 class="account-information text-lg">
          {{ $t('personal_information') }}
        </h1>
        <hr class="mb-1" />
        <div class="modal-content" :class="{ 'mx-0': isSm, 'mx-4': !isSm }">
          <div>
            <div
              class="w-full mt-2 text-gray-500"
              :class="{ block: isSm, flex: !isSm }"
            >
              <div
                class="title-user-inormation"
                :class="{ 'w-full': isSm, 'w-2/5': !isSm }"
              >
                {{ $t('first_and_last_name') }}
              </div>
              <div :class="{ 'w-full': isSm, 'w-3/5': !isSm }">
                <UInput v-model="fullName" placeholder="Họ và tên" size="sm" />
              </div>
            </div>
            <div
              class="w-full mt-2 text-gray-500"
              :class="{ block: isSm, flex: !isSm }"
            >
              <div
                class="title-user-inormation"
                :class="{ 'w-full': isSm, 'w-2/5': !isSm }"
              >
                {{ $t('current_password') }}
              </div>
              <div :class="{ 'w-full': isSm, 'w-3/5': !isSm }">
                <UInputCustom
                  name="current-password"
                  size="sm"
                  ref="passwordOldRef"
                  v-model="password"
                  type="password"
                  :placeholder="$t('current_password')"
                  :validate="{
                    name: $t('current_password'),
                    minLength: 6,
                    maxLength: 255,
                    required: true,
                  }"
                />
              </div>
            </div>
            <div
              class="w-full mt-2 text-gray-500"
              :class="{ block: isSm, flex: !isSm }"
            >
              <div
                class="title-user-inormation"
                :class="{ 'w-full': isSm, 'w-2/5': !isSm }"
              >
                {{ $t('new_password') }}
              </div>
              <div :class="{ 'w-full': isSm, 'w-3/5': !isSm }">
                <UInputCustom
                  name="new-password"
                  size="sm"
                  ref="passwordRef"
                  v-model="passwordNew"
                  type="password"
                  :placeholder="$t('new_password')"
                  :validate="{
                    name: $t('new_password'),
                    minLength: 6,
                    maxLength: 255,
                    required: true,
                  }"
                />
              </div>
            </div>
            <div
              class="w-full mt-2 text-gray-500"
              :class="{ block: isSm, flex: !isSm }"
            >
              <div
                class="title-user-inormation"
                :class="{ 'w-full': isSm, 'w-2/5': !isSm }"
              >
                {{ $t('enter_a_new_password') }}
              </div>
              <div class="w-3/5" :class="{ 'w-full': isSm, 'w-3/5': !isSm }">
                <UInputCustom
                  size="sm"
                  ref="passwordConfirmRef"
                  v-model="passwordNewComfirm"
                  type="password"
                  :placeholder="$t('enter_a_new_password')"
                  :validate="
                    computed(() => ({
                      name: $t('enter_a_new_password'),
                      required: true,
                      compare: passwordNew,
                    }))
                  "
                />
              </div>
            </div>
            <div class="flex justify-end">
              <UButton
                @click="handleUpdateProfile()"
                class="w-max h-9 text-sm px-6 ml-1.5 mt-2"
              >
                {{ $t('save_changes') }}
              </UButton>
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
import { useMediaQuery } from '@vueuse/core'

const { t } = useI18n()
const isSm = useMediaQuery('(max-width: 530px)')
const authStore = useAuthStore()
const userName = ref(
  authStore.userInfoData?.last_name || authStore.userInfoData?.first_name
)
const fullName = ref(
  [authStore.userInfoData?.first_name, authStore.userInfoData?.last_name]
    .filter(item => item)
    .join(' ')
)
const email = ref(authStore.userInfoData?.email)
const password = ref()
const passwordNew = ref()
const passwordNewComfirm = ref()
const passwordOldRef = ref()
const passwordRef = ref()
const passwordConfirmRef = ref()
const { setLoading } = useSystemStore()
const { state, checkValid } = useValidate()
const toast = useToast()

const closeModal = async () => {
  password.value = ''
  passwordNew.value = ''
  passwordNewComfirm.value = ''
  authStore.closeAllModal()
}

const handleUpdateProfile = async () => {
  try {
    setLoading(true)
    checkValid(
      [passwordOldRef, passwordRef, passwordConfirmRef],
      'input-custom'
    )
    if (state.isError) {
      toast.add({
        title: t('notification'),
        description: state.error,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }
    const dataRequest = {
      first_name: authStore.userInfoData?.first_name,
      last_name: authStore.userInfoData?.last_name,
    }
    const editInfoUser = await authStore.editInfoUser(dataRequest)
    if (editInfoUser.data.status) {
      const body = {
        password: password.value,
        newpassword: passwordNewComfirm.value,
      }
      const { data } = await authStore.changepassword(body)
      if (data.status) {
        toast.add({
          title: t('notification'),
          description: t('profile_updated_successfully'),
          icon: 'i-heroicons-check-circle',
          color: 'primary',
        })
        authStore.closeAllModal()
      } else if (data.message) {
        let messageErr = ''
        if (data.errors === 'INCORRECT_PASSWORD') {
          messageErr = t('incorrect_password')
        }
        toast.add({
          title: t('notification'),
          description: messageErr,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
      }
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
  () => authStore.isOpenUserInformation,
  newVal => {
    if (newVal) {
      fullName.value = [
        authStore.userInfoData?.first_name,
        authStore.userInfoData?.last_name,
      ]
        .filter(item => item)
        .join(' ')
      email.value = authStore.userInfoData?.email
      password.value = ''
      passwordNew.value = ''
      passwordNewComfirm.value = ''
    }
  }
)
</script>

<style lang="scss" scoped>
.change-password {
  width: inherit;
  color: #158c81;
  padding-top: 8px;
  cursor: pointer;
}
.title-user-inormation {
  font-size: 14px;
  padding-top: 5px;
}
</style>
