<template>
  <div class="container-created-user">
    <div class="content-created-user">
      <div class="content-left">
        <div
          class="welcome-back text-center mt-20 text-3xl text-slate-50 font-bold"
        >
          Welcome Back!
        </div>
        <UDivider class="text-slate-50 px-4 my-4" />
        <div class="directional-login text-slate-50 text-sm text-center px-4">
          To keep connected with us please login with your personal info.
        </div>
        <div class="btn-sign-in w-full flex justify-center my-6 mb-16">
          <UButton
            label="Sign In"
            color="gray"
            class="w-32 h-10 text-center rounded-3xl"
          ></UButton>
        </div>
      </div>
      <div class="content-right">
        <div class="created-account text-center font-bold text-3xl">
          Created Account
        </div>
        <div class="infomation-user px-8 leading-7 mt-4">
          <UInput
            v-model="q"
            name="q"
            class="py-1"
            placeholder="Full Name"
            icon="i-basil-user-outline"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
          </UInput>
          <UInput
            v-model="q"
            name="q"
            class="py-1"
            placeholder="Email"
            icon="i-ic-outline-email"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
          </UInput>
          <UInput
            v-model="q"
            name="q"
            class="py-1"
            type="password"
            placeholder="Password"
            icon="i-mdi-password-outline"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
          </UInput>
          <UInput
            v-model="q"
            name="q"
            class="py-1"
            type="password"
            placeholder="Confirm Password"
            icon="i-mdi-password-outline"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
          </UInput>
        </div>
        <div class="btn-sign-za w-full flex justify-center my-6 mb-10 px-8">
          <UButton
            label="Sign Up"
            color="gray"
            class="h-10 text-center rounded-3xl text-slate-50 bg-orange-500 hover:bg-orange-600"
            block
          ></UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.container-created-user {
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
  .content-created-user {
    width: 55%;
    background-color: #ffffff;
    padding: 40px;
    display: flex;
    height: max-content;
    .content-left {
      width: 40%;
      background-image: linear-gradient(to right, #f83600, #f9760e);
      .btn-sign-in {
        :deep(button) {
          display: flex;
          justify-content: center;
          background-image: linear-gradient(to right, #f84f05, #f95d09);
          color: #ffffff;
        }
      }
    }
    .content-right {
      width: 60%;
      :deep(input) {
        height: 40px !important;
      }
    }
  }
}
</style>
