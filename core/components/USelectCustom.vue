<template>
  <USelectMenu :class="className" ref="inputRef" v-bind="$attrs">
    <template #label>
      <p class="truncate">{{ truncate ? truncate : $t('please_choose') }}</p>
    </template>
    <template #option="{ option }">
      <slot :option="option" name="option" />
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps(['validate', 'class', 'truncate'])

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

watch(
  () => props.class,
  (newVal, oldVal) => {
    className.value.filter(item => item !== oldVal).push(newVal)
  }
)

defineExpose({
  validate: props.validate,
  inputRef,
  setClass,
  removeClass,
})
</script>
