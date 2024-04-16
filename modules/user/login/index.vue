<template>
  <div class="container-login">
    <form @submit.prevent="handleLogin" class="form-login mx-auto">
      <div class="content-login">
        <div class="icon-login flex justify-center">
          <div class="icon">
            <UIcon class="text-white" name="i-basil-user-outline" />
          </div>
        </div>
        <div class="text-icon text-orange-500 text-center">Have account?</div>
        <div class="information-user">
          <UInput
            v-model="userName"
            class="my-3"
            color="gray"
            variant="outline"
            placeholder="Username"
          />
          <UInput
            v-model="passWord"
            type="password"
            class="my-3"
            color="gray"
            variant="outline"
            placeholder="Password"
          />
        </div>
        <div class="action-form flex justify-between">
          <div class="remember-me">
            <UCheckbox
              v-model="selected"
              name="notifications"
              label="Remember Me"
            />
          </div>
          <div
            class="forgot-password text-sm text-orange-500"
            @click="$router.push(PATH.FORGOT_PASSWORD_PAGE)"
          >
            Forgot Password
          </div>
        </div>
        <div class="btn-form-login mt-6">
          <UButton
            type="submit"
            block
            class="bg-orange-500 hover:bg-orange-600 h-12"
            >Login</UButton
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useLoginStore } from './store'
import { useSystemStore } from '@/core/store/system'
import { PATH } from '@/core/constants'

const router = useRouter()
const userName = ref('')
const passWord = ref('')
const authStore = useLoginStore()
const { setLoading } = useSystemStore()

const handleLogin = async () => {
  try {
    setLoading(true)
    const dataRequest = {
      username: userName.value,
      password: passWord.value,
    }
    const { data } = await authStore.login(dataRequest)
    if (data.status) {
      localStorage.setItem('isAuth', 'true')
      authStore.isAuth = true
      authStore.userInfoData = data.data
      router.push({ path: '/admin/user' })
    } else if (data.message) {
      toast.add({
        title: 'Notification',
        description: data.message,
        icon: 'i-heroicons-exclamation-circle-20-solid',
        color: 'red',
      })
    }
  } catch (error) {
  } finally {
    setLoading(false)
  }
}
</script>

<style lang="scss" scoped>
.container-login {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  .form-login {
    width: 30%;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    padding: 30px;
    height: max-content;
    .content-login {
      width: 100%;
      padding: 0px 40px;
      .icon-login {
        .icon {
          width: 50px;
          height: 50px;
          background-color: coral;
          border-radius: 50%;
          span {
            width: 50%;
            height: 50%;
            display: flex;
            margin: 0 auto;
            padding-top: 50px;
          }
        }
      }
      .information-user {
        width: 100%;
        margin-top: 30px;
        :deep(input) {
          height: 40px !important;
        }
      }
      .action-form {
        .remember-me {
          :deep(label) {
            color: #fa8331;
            font-weight: unset !important;
          }
        }
      }
    }
  }
}
</style>
