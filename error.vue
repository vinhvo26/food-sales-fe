<template>
  <div class="error-page">
    <h1 class="text-[2em] font-bold">
      {{ error.statusCode }} {{ error.statusMessage }}
    </h1>
    <h3 class="text-[1.7em] font-bold text-center">
      {{ error.message }}
    </h3>
    <section class="error-container">
      <span>{{ arrSplit?.[0] }}</span>
      <span
        ><span class="screen-reader-text">{{ arrSplit?.[1] }}</span></span
      >
      <span>{{ arrSplit?.[2] }}</span>
    </section>
    <div class="link-container">
      <a class="more-link cursor-pointer" @click="handleError">Home Page</a>
    </div>
  </div>
</template>

<script setup>
useHead({
  style: [{ 'data-nuxt-ui-colors': '' }],
})
const props = defineProps({
  error: Object,
})

const arrSplit = props.error?.statusCode?.toString()?.split('')
const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.error-container {
  text-align: center;
  font-size: 180px;
  font-family: 'Catamaran', sans-serif;
  font-weight: 800;
  margin: 20px 15px;
}
.error-container > span {
  display: inline-block;
  line-height: 0.7;
  position: relative;
  color: #b6f4e8;
}
.error-container > span {
  display: inline-block;
  position: relative;
  vertical-align: middle;
}
.error-container > span:nth-of-type(1) {
  color: #37cab8;
  animation: colordancing 4s infinite;
}
.error-container > span:nth-of-type(3) {
  color: #158c81;
  animation: colordancing2 4s infinite;
}
.error-container > span:nth-of-type(2) {
  width: 120px;
  height: 120px;
  border-radius: 999px;
}
.error-container > span:nth-of-type(2):before,
.error-container > span:nth-of-type(2):after {
  border-radius: 0%;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: inherit;
  height: inherit;
  border-radius: 999px;
  box-shadow: inset 30px 0 0 #b6f4e866, inset 0 30px 0 #37cab866,
    inset -30px 0 0 #158c8166, inset 0 -30px 0 #16595566;
  animation: shadowsdancing 4s infinite;
}
.error-container > span:nth-of-type(2):before {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  transform: rotate(45deg);
}

.screen-reader-text {
  position: absolute;
  top: -9999em;
  left: -9999em;
}
@keyframes shadowsdancing {
  0% {
    box-shadow: inset 30px 0 0 #b6f4e866, inset 0 30px 0 #37cab866,
      inset -30px 0 0 #158c8166, inset 0 -30px 0 #16595566;
  }
  25% {
    box-shadow: inset 30px 0 0 #16595566, inset 0 30px 0 #b6f4e866,
      inset -30px 0 0 #37cab866, inset 0 -30px 0 #158c8166;
  }
  50% {
    box-shadow: inset 30px 0 0 #158c8166, inset 0 30px 0 #16595566,
      inset -30px 0 0 #b6f4e866, inset 0 -30px 0 #37cab866;
  }
  75% {
    box-shadow: inset 30px 0 0 #37cab866, inset 0 30px 0 #158c8166,
      inset -30px 0 0 #16595566, inset 0 -30px 0 #b6f4e866;
  }
  100% {
    box-shadow: inset 30px 0 0 #b6f4e866, inset 0 30px 0 #37cab866,
      inset -30px 0 0 #158c8166, inset 0 -30px 0 #16595566;
  }
}
@keyframes colordancing {
  0% {
    color: #b6f4e8;
  }
  25% {
    color: #165955;
  }
  50% {
    color: #158c81;
  }
  75% {
    color: #37cab8;
  }
  100% {
    color: #b6f4e8;
  }
}
@keyframes colordancing2 {
  0% {
    color: #158c81;
  }
  25% {
    color: #37cab8;
  }
  50% {
    color: #b6f4e8;
  }
  75% {
    color: #165955;
  }
  100% {
    color: #158c81;
  }
}

/* demo stuff */
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.error-page {
  background-color: #fdfaf5;
  width: 100%;
  height: 100vh;
}
.error-page,
button {
  font-family: 'Montserrat', Helvetica, sans-serif;
  color: #bbb;
}
h1 {
  text-align: center;
  padding: 30px 15px;
}
.zoom-area {
  max-width: 490px;
  margin: 30px auto 30px;
  font-size: 19px;
  text-align: center;
}
.link-container {
  text-align: center;
}
a.more-link {
  text-transform: uppercase;
  font-size: 13px;
  background-color: #37cab8;
  padding: 10px 15px;
  border-radius: 0;
  color: #fff;
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
  line-height: 1.5;
  text-decoration: none;
  margin-top: 50px;
  letter-spacing: 1px;
}
</style>
