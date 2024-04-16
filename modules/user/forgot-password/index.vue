<template>
  <div class="container-forgot-password">
    <div class="content-forgot-password">
      <div class="title-forgot-password text-center text-2xl font-bold">
        Forgot password?
      </div>
      <div class="remember-password text-center text-sm">
        Remember your password?<span class="text-blue-700">Login here</span>
      </div>
      <div class="infomation-user">
        <div class="user-name-user">
          <div class="user-name-lable">User name</div>
          <div class="user-name-input">
            <UInput
              v-model="userName"
              class="my-3"
              color="gray"
              variant="outline"
              placeholder="User Name"
            />
          </div>
        </div>
        <div class="email-user">
          <div class="email-lable">Email address</div>
          <div class="email-input">
            <UInput
              v-model="userName"
              class="my-3"
              color="gray"
              variant="outline"
              placeholder="abc@gmail.com"
            />
          </div>
        </div>
      </div>
      <div class="btn-forgot-password mt-6">
        <UButton
          type="submit"
          block
          class="bg-orange-500 hover:bg-orange-600 h-12"
          >Forgot Password</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.container-forgot-password {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100vh;
  display: flex;
  align-items: center;
  .content-forgot-password {
    width: 30%;
    background-color: #ffffff;
    padding: 40px;
    height: max-content;
    .infomation-user {
      width: 100%;
      margin-top: 30px;
      :deep(input) {
        height: 40px !important;
      }
    }
  }
}
</style>
