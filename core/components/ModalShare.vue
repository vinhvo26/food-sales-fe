<template>
  <div class="relative">
    <UModal v-model="authStore.isOpenModalShare" prevent-close>
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
          // base: 'relative text-left rtl:text-right  flex flex-col',
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <div class="modal-content">
          <div class="forgot-password">{{ $t('share') }}</div>
          <hr />
          <div class="flex py-3">
            <div
              class="fb-share-button"
              data-href="https://ketnoidautu.com"
              data-layout=""
              data-size=""
            >
              <a
                target="_blank"
                :href="
                  'https://www.facebook.com/sharer/sharer.php?u=' +
                  getValue() +
                  '&amp;src=sdkpreparse'
                "
                class="fb-xfbml-parse-ignore"
                ><div
                  class="w-[50px] h-[50px] rounded-full mr-3 cursor-pointer"
                >
                  <img
                    class="w-full h-full"
                    src="@/core/assets/img/facebook-icon.png"
                    alt=""
                  /></div
              ></a>
            </div>
            <div
              class="w-[50px] h-[50px] rounded-full mr-3 cursor-pointer"
              @click="shareZalo"
            >
              <img
                class="w-full h-full"
                src="@/core/assets/img/zalo-icon.png"
                alt=""
              />
              <div
                class="zalo-share-button"
                :data-href="getValue()"
                data-oaid="1867616936602989534"
                data-layout="1"
                data-color="blue"
                data-customize="true"
              ></div>
            </div>
          </div>
          <hr />
          <div class="mt-3">
            <UInput
              :value="getValue()"
              readonly
              size="xl"
              autocomplete="off"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            >
              <template #trailing>
                <UButton
                  color="gray"
                  variant="link"
                  icon="i-material-symbols-content-copy-outline"
                  :padded="false"
                  @click="copyToClipboard"
                />
              </template>
            </UInput>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/core/store/auth'

const authStore = useAuthStore()
const toast = useToast()

const copyToClipboard = () => {
  authStore.closeAllModal()
  var dummy = document.createElement('input'),
    text = window.location.href

  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
  toast.add({
    title: 'Notification',
    description: 'Copy đường dẫn thành công',
    icon: 'i-heroicons-check-circle',
    color: 'primary',
  })
}

const getValue = () => {
  return window.location.href
}

const shareZalo = () => {
  document.querySelector('div.zalo-share-button').click()
}

watch(
  () => authStore.isOpenModalShare,
  async newVal => {
    if (newVal) {
      console.log(ZaloSocialSDK)
      await ZaloSocialSDK.reload()
      ZaloSocialSDK.init()
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
