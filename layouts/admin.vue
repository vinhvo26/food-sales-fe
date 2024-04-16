<script setup>
const openModal = ref(false)

onMounted(() => {
  document.getElementsByTagName('html')[0].style.overflow = 'hidden'
})

</script>
<template>
  <div class="flex admin-main">
    <SiderbarAdmin />
    <div class="body-main flex flex-col w-full h-full px-7 pb-7">
      <HeaderAdmin
        @handleOpenModal="
          () => {
            openModal = true
          }
        "
      />
      <div class="w-full h-full bg-white view-main">
        <slot />
        <ModalChangePasswordAdmin
          :isOpen="openModal"
          @handleCloseModal="
            () => {
              openModal = false
            }
          "
        />
      </div>
    </div>
    <UNotifications />
  </div>
</template>

<style scoped lang="scss">
.admin-main {
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .body-main {
    width: calc(100% - 270px);

    .view-main {
      overflow-x: auto;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      border-radius: 10px;
    }
  }
}
</style>
