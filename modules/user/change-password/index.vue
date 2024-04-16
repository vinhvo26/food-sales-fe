<template>
  <div class="container-change-password">
    <div class="content-change-password">
      <div class="title-change-password text-center text-2xl font-bold">
        Change password?
      </div>
      <div class="remember-password text-center text-sm">
        Enter a new password below to change your password
      </div>
      <div class="infomation-user">
        <div class="user-name-user">
          <div class="user-name-lable">New password</div>
          <div class="user-name-input">
            <UInput
              v-model="newPassword"
              class="my-3"
              type="password"
              color="gray"
              variant="outline"
            />
          </div>
        </div>
        <div class="email-user">
          <div class="email-lable">Confirm password</div>
          <div class="email-input">
            <UInput
              v-model="confirmPassword"
              class="my-3"
              type="password"
              color="gray"
              variant="outline"
            />
          </div>
        </div>
      </div>
      <div class="btn-change-password mt-6">
        <UButton
          type="submit"
          block
          class="bg-orange-500 hover:bg-orange-600 h-12"
          >Change Password</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.container-change-password {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
  .content-change-password {
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
