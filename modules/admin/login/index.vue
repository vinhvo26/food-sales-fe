<template>
  <div>
    <NuxtLayout name="default">
      <Head>
        <Title>Đăng Nhập Trang Quản Lý</Title>
      </Head>
      <div class="main-login">
        <form @submit.prevent="handleLogin">
          <div class="logo">
            <img class="mb-4" src="@/core/assets/img/logo.png" alt="logo" />
          </div>
          <div class="flex flex-col">
            <label class="text-white" for="">Username</label>
            <UInput
              v-model="userName"
              class="mb-4"
              size="xl"
              placeholder="Username"
            />
            <label class="text-white" for="">Password</label>
            <UInput
              v-model="passWord"
              size="xl"
              type="password"
              placeholder="Password"
            />
          </div>
          <UButton type="submit" block class="bg-white text-ice-cold-400"
            >Đăng nhập</UButton
          >
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/core/store/auth'
import { useSystemStore } from '@/core/store/system'

const userName = ref('')
const passWord = ref('')

const router = useRouter()
const authStore = useAuthStore()
const { setLoading } = useSystemStore()
const toast = useToast()

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

<style scoped lang="scss">
.main-login {
  width: 100%;
  height: 100vh;
  background: radial-gradient(
      rgb(210, 241, 223),
      rgb(211, 215, 250),
      rgb(186, 216, 244)
    )
    0% 0%/400% 400%;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: #37cab8;
    padding: 30px;
    min-width: 400px;
    height: fit-content;
    border-radius: 8px;
    box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;

    .logo {
      height: 100px;
      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }

    button {
      padding: 5px;
      border-radius: 8px;
      height: 50px;
      margin-top: 20px;
      &:hover {
        background: white;
      }
    }
  }
}
</style>
