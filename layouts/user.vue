<template>
  <div class="user-layout">
    <div id="fb-root"></div>
    <component
      :is="'script'"
      async
      defer
      crossorigin="anonymous"
      src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v18.0&appId=1395095367777620"
      nonce="c4HpvLP9"
    />
    <component
      :is="'script'"
      async
      defer
      src="https://sp.zalo.me/plugins/sdk.js"
    />
    <Header />
    <!-- <ClientOnly fallback-tag="span" fallback="Loading"> -->
    <slot />
    <!-- </ClientOnly> -->
    <Footer />
    <UNotifications />

    <ModalLogin />
    <ModalOtp />
    <ModalAddInformation />
    <ModalChangePassword />
    <ModalCreateAccount />
    <ModalForgotPassword />
    <ModalProfileUser />
    <ModalShare />
    <UButton
      v-if="showScrollTop"
      class="fixed bottom-[50px] right-[50px] rounded-full z-[9999] shadow-3xl ring-0"
      icon="i-heroicons-arrow-long-up-20-solid"
      color="white"
      variant="solid"
      size="xl"
      @click="scrollTop"
    />
    <div
      @click="moveToFacebook"
      class="fixed bottom-[110px] right-[50px] rounded-full z-[9999] w-[44px] h-[44px] p-2 bg-white shadow-3xl cursor-pointer"
    >
      <img src="@/core/assets/img/messenger-logo.svg" alt="" />
    </div>
  </div>
</template>

<script setup>
const showScrollTop = ref(false)

const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const handlerHeightFooter = () => {
  if (document.querySelectorAll('.user-footer').length) {
    const getHeightFooter =
      document.querySelectorAll('.user-footer')[0].offsetHeight
    if (document.querySelectorAll('.user-layout').length)
      document.querySelectorAll('.user-layout')[0].style.paddingBottom =
        getHeightFooter + 'px'
  }
}

const onScroll = () => {
  if (window.scrollY > 800) {
    showScrollTop.value = true
  } else {
    showScrollTop.value = false
  }
}

const moveToFacebook = () => {
  window.open('https://www.facebook.com/profile.php?id=61556068042331')
}

onMounted(() => {
  document.getElementsByTagName('html')[0].style.overflow = 'auto'
  if (process.client) {
    window.history.scrollRestoration = 'auto'
    nextTick(() => {
      handlerHeightFooter()
    })
    window.addEventListener('resize', handlerHeightFooter)
    document.addEventListener('scroll', onScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handlerHeightFooter)
  document.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  position: relative;
  padding-bottom: 489px;
}
</style>
