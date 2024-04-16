import { toast } from 'vue3-toastify'

export const toastSuccess = message => {
  toast.success(message)
}

export const toastError = message => {
  toast.error(message)
}

export const toastWarning = message => {
  toast.warning(message)
}
