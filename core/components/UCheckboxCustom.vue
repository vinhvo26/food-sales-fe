<template>
  <UCheckbox :class="className" ref="inputRef" v-bind="$attrs" />
</template>

<script setup>
const props = defineProps(['validate', 'class'])

const inputRef = ref(null)
const className = ref([props.class || ''])

const setClass = data => {
  className.value.push(data)
}

const removeClass = data => {
  className.value = JSON.parse(
    JSON.stringify(className.value).replace(data, '')
  )
}

defineExpose({
  validate: props.validate,
  inputRef,
  setClass,
  removeClass,
})
</script>
