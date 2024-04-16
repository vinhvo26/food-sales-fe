<script setup>
import { PATH } from '@/core/constants'
</script>
<template>
  <div class="user-footer justify-center flex bg-ice-cold-950">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div class="flex flex-col md:col-span-1 col-span-2">
          <div class="flex items-start mb-4">
            <span class="text-title uppercase">{{
              $t('mechanism_of_action')
            }}</span>
          </div>
          <div class="flex flex-col justify-start items-start gap-y-2">
            <NuxtLink :to="PATH.MechanismAction">{{
              $t('mechanism_of_action')
            }}</NuxtLink>
            <NuxtLink :to="PATH.NewsReviewPolicy">{{
              $t('approval_policy')
            }}</NuxtLink>
            <NuxtLink :to="PATH.PrivacyPolicy">{{
              $t('security_policy')
            }}</NuxtLink>
            <NuxtLink :to="PATH.ServiceImplementationProcess">{{
              $t('service_process')
            }}</NuxtLink>
          </div>
        </div>
        <div class="flex flex-col md:col-span-1 col-span-2">
          <div class="flex items-start mb-4">
            <span class="text-title uppercase">{{ $t('for_posters') }}</span>
          </div>
          <div class="flex flex-col gap-y-2">
            <NuxtLink :to="PATH.AccountCreationGuide">{{
              $t('create_account_guide')
            }}</NuxtLink>
            <NuxtLink :to="PATH.InstructionsNews">{{
              $t('post_guide')
            }}</NuxtLink>
          </div>
        </div>
        <div class="flex flex-col md:col-span-1 col-span-2">
          <div class="flex items-start mb-4">
            <span class="text-title uppercase">{{
              $t('connect_with_us')
            }}</span>
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="flex items-center gap-x-6">
              <div class="h-5">
                <UIcon class="text-base" name="i-ri-facebook-fill" />
              </div>
              <div>
                <NuxtLink
                  target="_blank"
                  to="https://www.facebook.com/profile.php?id=61556068042331"
                  >Facebook</NuxtLink
                >
                <!-- <span class="text-base cursor-pointer">Facebook</span> -->
              </div>
            </div>
            <div class="flex items-center gap-x-6">
              <div class="h-5">
                <UIcon class="text-base" name="i-ri-twitter-fill" />
              </div>
              <div>
                <NuxtLink target="_blank" to="https://twitter.com/ketnoidautu"
                  >Twitter</NuxtLink
                >
              </div>
            </div>
            <div class="flex items-center gap-x-6">
              <div class="h-5">
                <UIcon class="text-base" name="i-ri-instagram-fill" />
              </div>
              <div>
                <NuxtLink
                  target="_blank"
                  to="https://www.instagram.com/ketnoidautu"
                  >Instagram</NuxtLink
                >
              </div>
            </div>
            <div class="flex items-center gap-x-6">
              <div class="h-5">
                <UIcon class="text-base" name="i-ri-youtube-fill" />
              </div>
              <div>
                <NuxtLink
                  target="_blank"
                  to="https://www.youtube.com/channel/UCDsSah9kXZrJa0qZBwPpXKQ"
                  >Youtube</NuxtLink
                >
                <!-- <span class="text-base cursor-pointer">Youtube</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col col-span-2">
          <div class="flex items-start mb-4">
            <span class="text-title">{{ $t('contact_company') }} </span>
          </div>
          <div class="flex flex-col gap-y-2">
            <span class="text-base cursor-pointer"
              >{{ $t('address') }} 11 Nguyễn Trường Tộ, Tam Kỳ, Quảng Nam</span
            >
            <span class="text-base cursor-pointer"
              >Email: ctyvanphuc.vn@gmail.com</span
            >
            <span class="text-base cursor-pointer"
              >{{ $t('contact') }}: 0906.446.288 - 0949.663.201</span
            >
          </div>
        </div>
      </div>
      <div class="flex mt-9 flex-col items-center justify-center">
        <UDivider class="w-3/4" />
        <span class="mt-4">Copyright © 2024 ketnoidautu.vn</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: fit-content;
  padding: 50px 0 50px 0;
  color: white;
  padding: 50px 35px;
  img {
    width: 180px;
    height: 130px;
    object-fit: contain;
  }

  .text-title {
    color: var(--ice-cold-50, #f1fcfa);
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 900;
    line-height: 28px;
  }
}
@media only screen and (max-width: 640px) {
  .user-footer {
    img {
      width: 112px;
      height: 112px;
    }
  }
}
</style>
