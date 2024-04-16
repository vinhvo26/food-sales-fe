import { regexValidate } from '@/core/constants/variable/regex-validate'
import { JS_putMessage } from '@/core/utils/common'

export default function useValidate() {
  const state = reactive({
    isError: false,
    error: '',
  })

  const checkValid = (refsList = [], typeInput) => {
    clearErr(refsList, typeInput)
    state.isError = false
    state.error = ''
    for (let index = 0; index < refsList.length; index++) {
      const { name, type, required, minLength, maxLength, compare } =
        refsList[index]?.value?.validate
      const inputEl = refsList[index]?.value
      const dataValid = inputEl?.inputRef?.modelValue || ''
      // check required
      if (required && !dataValid) {
        state.isError = true
        state.error = JS_putMessage('{0} không được bỏ trống', [name])
        inputEl.setClass(
          typeInput === 'input-custom'
            ? 'validate-error-custome'
            : 'validate-error'
        )
        return false
      }
      // check matching type
      if (type && type.length) {
        let checkList = []
        for (let index = 0; index < type.length; index++) {
          const element = type[index]
          switch (element) {
            case 'email':
              checkList.push(regexValidate.EMAIL.test(dataValid))
              break
            case 'phone':
              checkList.push(regexValidate.PHONE.test(dataValid))
              break
            case 'number':
              checkList.push(
                regexValidate.NUMBER.test(dataValid.replaceAll(',', '') * 1)
              )
              break
            default:
              break
          }
        }
        const isValid = checkList.some(el => el)
        if (!isValid) {
          state.isError = true
          state.error = JS_putMessage('Vui lòng nhập đúng định dạng của {0}', [
            name,
          ])
          inputEl?.setClass(
            typeInput === 'input-custom'
              ? 'validate-error-custome'
              : 'validate-error'
          )
          return false
        }
      }
      // check min length
      if (minLength && dataValid.length < minLength) {
        state.isError = true
        state.error = JS_putMessage('{0} phải nhập tối thiếu {1} ký tự', [
          name,
          minLength,
        ])
        inputEl?.setClass(
          typeInput === 'input-custom'
            ? 'validate-error-custome'
            : 'validate-error'
        )
        return false
      }
      // check max length
      if (maxLength && dataValid.length > maxLength) {
        state.isError = true
        state.error = JS_putMessage('{0} chỉ nhập tối đa {1} ký tự', [
          name,
          maxLength,
        ])
        inputEl?.setClass(
          typeInput === 'input-custom'
            ? 'validate-error-custome'
            : 'validate-error'
        )
        return false
      }
      // compare password
      if (compare && dataValid !== compare) {
        state.isError = true
        state.error = 'Nhập lại mật khẩu mới đã nhập không khớp'
        inputEl?.setClass(
          typeInput === 'input-custom'
            ? 'validate-error-custome'
            : 'validate-error'
        )
        return false
      }
    }
  }

  const clearErr = (refsList = [], typeInput) => {
    for (let index = 0; index < refsList.length; index++) {
      const inputEl = refsList[index]?.value
      inputEl?.removeClass(
        typeInput === 'input-custom'
          ? 'validate-error-custome'
          : 'validate-error'
      )
    }
  }

  return {
    state,
    clearErr,
    checkValid,
  }
}
