<script setup lang="ts">
import { Login } from '../../models/Login';
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import Toastify from "toastify-js";
import Notification from "../../base-components/Notification";

import {
  FormInput,
  FormCheck,
} from "../../base-components/Form";

import {
  required,
  minLength,
  maxLength,
  email,
} from "@vuelidate/validators";

import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";

import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";

import { useAuthStore } from '../../stores/auth/Auth';

const logincredentials = reactive<Login>({} as Login);
const authStore = useAuthStore();
const router = useRouter();

const formData = reactive({
  username: "",
  password: "",
  // username: "joincoder@gmail.com",
  // password: "123456789",
});

const rules = {
  username: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(6),
    maxLength: maxLength(20),
  },
};
const validate = useVuelidate(rules, toRefs(formData));

async function onSubmit() {
  validate.value.$touch();
  if (validate.value.$invalid) {
    const failedEl = document
      .querySelectorAll("#failed-notification-content")[0]
      .cloneNode(true) as HTMLElement;
    failedEl.classList.remove("hidden");
    Toastify({
      node: failedEl,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
  } else {

    logincredentials.username = formData.username;
    logincredentials.password = formData.password;
    
    var response = await authStore.login(logincredentials);

    if (response) {
      await router.push('/dashboard-overview-1');
    } else {
      const failedEl = document
        .querySelectorAll("#wronguser-notification-content")[0]
        .cloneNode(true) as HTMLElement;
      failedEl.classList.remove("hidden");
      Toastify({
        node: failedEl,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  }
}

</script>

<template>
  <div :class="[
    '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
    'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
    'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
  ]">
    <DarkModeSwitcher />
    <MainColorSwitcher />

    <form @submit.prevent="onSubmit">
      <div class="container relative z-10 sm:px-10">
        <div class="block grid-cols-2 gap-4 xl:grid">
          <!-- BEGIN: Login Info -->
          <div class="flex-col hidden min-h-screen xl:flex">
            <a href="" class="flex items-center pt-5 -intro-x">
              <img alt="Midone Tailwind HTML Admin Template" class="w-6" :src="logoUrl" />
              <span class="ml-3 text-lg text-white">iT-KH</span>
            </a>
            <div class="my-auto">
              <img alt="Midone Tailwind HTML Admin Template" class="w-1/2 -mt-16 -intro-x" :src="illustrationUrl" />
              <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                A few more clicks to <br />
                sign in to your account.
              </div>
              <div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                Manage all your e-commerce accounts in one place
              </div>
            </div>
          </div>
          <!-- END: Login Info -->
          <!-- BEGIN: Login Form -->
          <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
            <div
              class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
              <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                Sign In
              </h2>
              <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
                A few more clicks to sign in to your account. Manage all your
                e-commerce accounts in one place
              </div>
              <div class="mt-8 intro-x">

                <FormInput v-model.trim="validate.username.$model" id="validation-form-2" type="email" name="username"
                  class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="example@gmail.com" />

                <template v-if="validate.username.$error">
                  <div v-for="(error, index) in validate.username.$errors" :key="index" class="mt-2 text-danger">
                    {{ error.$message }}
                  </div>
                </template>

                <FormInput id="validation-form-3" v-model.trim="validate.password.$model" type="password" name="password"
                  class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                  placeholder="secret password" />
                <template v-if="validate.password.$error">
                  <div v-for="(error, index) in validate.password.$errors" :key="index" class="mt-2 text-danger">
                    {{ error.$message }}
                  </div>
                </template>

              </div>
              <div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                <div class="flex items-center mr-auto">
                  <FormCheck.Input id="remember-me" type="checkbox" class="mr-2 border" />
                  <label class="cursor-pointer select-none" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <a href="">Forgot Password?</a>
              </div>
              <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                <Button type="submit" variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                  Login
                </Button>
                <Button variant="outline-secondary" class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                  @click="$router.push('register')">
                  Register
                </Button>
              </div>
              <div class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                By signin up, you agree to our
                <a class="text-primary dark:text-slate-200" href="">
                  Terms and Conditions
                </a>
                &
                <a class="text-primary dark:text-slate-200" href="">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
          <!-- END: Login Form -->
        </div>
      </div>

      <!-- BEGIN: Success Notification Content -->
      <Notification id="success-notification-content" class="flex hidden">
        <Lucide icon="CheckCircle" class="text-success" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Registration success!</div>
          <div class="mt-1 text-slate-500">
            Please check your e-mail for further info!
          </div>
        </div>
      </Notification>
      <!-- END: Success Notification Content -->
      <!-- BEGIN: Failed Notification Content -->
      <Notification id="failed-notification-content" class="flex hidden">
        <Lucide icon="XCircle" class="text-danger" />
        <div class="ml-4 mr-4">
          <div class="font-medium">User login failed!</div>
          <div class="mt-1 text-slate-500">Please check your e-mail for further info.</div>
        </div>
      </Notification>
      <!-- END: Failed Notification Content -->

      <!-- BEGIN: Failed Notification Content -->
      <Notification id="wronguser-notification-content" class="flex hidden">
        <Lucide icon="XCircle" class="text-danger" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Wrong User or Password login failed!</div>
        </div>
      </Notification>
    </form>
  </div>
</template>
