<template>
  <UModal
    :ui="{
      width: 'w-full sm:max-w-3xl',
    }"
    v-model="props.isOpen"
    prevent-close
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{
              props.check ? 'Cập nhật tài khoản Admin' : 'Tạo tài khoản Admin'
            }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="
              () => {
                cleanInput()
                emits('handleCloseModal')
              }
            "
          />
        </div>
      </template>
      <div class="flex gap-4 main-modal-create flex-col">
        <div>
          <label>Role</label>
          <USelectMenu size="lg" v-model="selectedRole" :options="role" />
        </div>
        <div>
          <label>Họ và tên</label>
          <UInputCustom
            size="lg"
            ref="nameUserRef"
            v-model="nameUser"
            placeholder="Họ và tên"
            :validate="{
              name: 'Họ và tên',
              maxLength: 255,
              required: true,
            }"
          />
        </div>
        <div>
          <label>Email</label>
          <UInputCustom
            ref="emailRef"
            size="lg"
            v-model="email"
            placeholder="Email"
            :validate="{
              name: 'Email',
              type: ['email'],
              maxLength: 255,
              required: true,
            }"
          />
        </div>
        <div>
          <label>Số điện thoại</label>
          <UInputCustom
            ref="phoneRef"
            v-model="phone"
            size="lg"
            placeholder="Số điện thoại"
            :validate="{
              name: 'Số điện thoại',
              type: ['phone'],
              maxLength: 255,
              required: true,
            }"
          />
        </div>
        <div>
          <label>Mật khẩu</label>
          <UInputCustom
            size="lg"
            ref="passwordRef"
            v-model="password"
            type="password"
            class="mt-3"
            placeholder="Nhập mật khẩu"
            :validate="{
              name: 'Mật khẩu',
              minLength: 6,
              maxLength: 255,
              required: true,
            }"
          />
        </div>
        <div>
          <label>Nhập lại mật khẩu</label>
          <UInputCustom
            size="lg"
            ref="passwordConfirmRef"
            v-model="passwordConfirm"
            type="password"
            class="mt-3"
            placeholder="Nhập lại mật khẩu"
            :validate="
              computed(() => ({
                name: 'Mật khẩu xác nhận',
                required: true,
                compare: password,
              }))
            "
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-x-2">
          <UButton @click="handleCreateAdmin" color="primary" variant="solid">{{
            props.check ? 'Cập nhật tài khoản' : 'Tạo tài khoản'
          }}</UButton>
          <UButton
            @click="
              () => {
                cleanInput()
                emits('handleCloseModal')
              }
            "
            color="cyan"
            variant="outline"
            >Trở về</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>
<script setup>
import useValidate from '@/core/composables/useValidate.js'
import { useAccountAdminStore } from '../store.js'
import { ROLE } from '@/core/constants/role/index.js'

const { state, checkValid } = useValidate()
const toast = useToast()
const useAccountAdmin = useAccountAdminStore()

const phoneRef = ref()
const emailRef = ref()
const passwordRef = ref()
const passwordConfirmRef = ref()
const nameUserRef = ref('')

const phone = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const nameUser = ref('')

const role = [ROLE.ADMIN, ROLE.SELLER]

const selectedRole = ref(role[0])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  detailUser: {
    type: Object,
    default: () => ({}),
  },
  check: {
    type: Boolean,
    default: false,
  },
})

watch(
  () => props.detailUser,
  newVal => {
    nameUser.value = [newVal?.first_name, newVal?.last_name]
      .filter(item => item)
      .join(' ')
    phone.value = newVal?.phone
    email.value = newVal?.email
    selectedRole.value = newVal?.role || ROLE.ADMIN
  }
)

const emits = defineEmits(['handleCloseModal'])

const cleanInput = () => {
  phone.value = ''
  email.value = ''
  password.value = ''
  passwordConfirm.value = ''
  nameUser.value = ''
  selectedRole.value = role[0]
}

const handleCreateAdmin = async () => {
  if (props.check) {
    checkValid([nameUserRef, emailRef, phoneRef])
    if (state.isError) {
      toast.add({
        title: 'Notification',
        description: state.error,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }
    if (password.value) {
      checkValid([passwordRef, passwordConfirmRef])
      if (state.isError) {
        toast.add({
          title: 'Notification',
          description: state.error,
          icon: 'i-heroicons-exclamation-circle-20-solid',
          color: 'red',
        })
        return false
      }
    }

    const firstLastName = nameUser.value.split(' ')
    const data = {
      id: props.detailUser.id,
      username: email.value,
      email: email.value,
      phone: phone.value,
      first_name: firstLastName.shift(),
      last_name: firstLastName.join(' '),
      password: password.value,
      role: selectedRole.value,
    }

    const res = await useAccountAdmin.updateAccount(data)
    if (res.status) {
      toast.add({
        title: 'Notification',
        description: 'Cập nhật tài khoản thành công',
        icon: 'i-heroicons-check-circle',
        color: 'primary',
      })
      useAccountAdmin.listAccountAdmin =
        useAccountAdmin.listAccountAdmin.filter(e => e.id !== res.data.id)
      useAccountAdmin.listAccountAdmin.unshift(res.data)
      cleanInput()
      emits('handleCloseModal')
    } else {
      toast.add({
        title: 'Notification',
        description: res.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  } else {
    checkValid([
      nameUserRef,
      emailRef,
      phoneRef,
      passwordRef,
      passwordConfirmRef,
    ])
    if (state.isError) {
      toast.add({
        title: 'Notification',
        description: state.error,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
      return false
    }
    const firstLastName = nameUser.value.split(' ')
    const data = {
      username: email.value,
      email: email.value,
      phone: phone.value,
      first_name: firstLastName.shift(),
      last_name: firstLastName.join(' '),
      password: password.value,
      role: selectedRole.value,
    }

    const res = await useAccountAdmin.createAccount(data)
    if (res.status) {
      toast.add({
        title: 'Notification',
        description: 'Tạo tài khoản thành công',
        icon: 'i-heroicons-check-circle',
        color: 'primary',
      })
      useAccountAdmin.listAccountAdmin.unshift(res.data)
      cleanInput()
      emits('handleCloseModal')
    } else {
      toast.add({
        title: 'Notification',
        description: res.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  }
}
</script>
<style scoped lang="scss">
.main-modal-create {
  .validate-error {
    border-bottom: none !important;
    :deep(input) {
      border: none !important;

      &:focus {
        border: none !important;
      }
    }
  }
}
</style>
