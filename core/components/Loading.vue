<template>
  <div
    v-show="systemStore.isLoading"
    class="loading-backdrop bg-[#ffffff66] fixed top-0 left-0 right-0 bottom-0 z-[9998]"
  />
  <div
    v-show="systemStore.isLoading"
    class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-[9999]"
  >
    <UIcon
      name="i-material-symbols-clock-loader-10"
      class="animate-spin text-[60px] text-ice-cold-600"
    />
  </div>
</template>

<script setup>
import { useSystemStore } from '@/core/store/system'

const systemStore = useSystemStore()
</script>
