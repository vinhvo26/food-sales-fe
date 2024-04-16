<template>
  <UInput
    ref="inputRef"
    v-bind="$attrs"
    :maxLength="maxLength"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :class="className"
    base="border-0"
  >
  </UInput>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  maxLength: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  validate: {
    type: Object,
    default: null,
  },
  class: {
    default: '',
  },
})

const inputRef = ref(null)
const className = ref([props.class || '', 'input-custom border-0'])

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

<style scoped>
.input-custom {
  :deep(input) {
    font-size: 24px;
    --tw-ring-offset-shadow: unset;
    --tw-ring-shadow: unset;
    box-shadow: unset;
    border-bottom: 1px solid #24242499;
    border-radius: 0;
    padding: 10px 0px;
    font-weight: 500;
  }
}
@media only screen and (max-width: 640px) {
  .input-custom {
    :deep(input) {
      font-size: 18px;
    }
  }
}
</style>
