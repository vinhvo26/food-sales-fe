<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const { locales } = useI18n()

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

function setCookie(params) {
  document.cookie = params
}

onBeforeMount(() => {
  const oldI18n = getCookie('i18n_redirected')
  const userLang = (navigator.language || navigator.userLanguage).split('-')[0]
  const userLangSupported = locales.value.some(item => item.code === userLang)
  if (!oldI18n && userLangSupported) {
    setCookie('i18n_redirected=' + userLang)
  } else if (!oldI18n) {
    setCookie('i18n_redirected=en')
  }
})
</script>
