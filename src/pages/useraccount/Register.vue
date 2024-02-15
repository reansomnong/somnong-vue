<script setup lang="ts">

import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import Button from "../../base-components/Button";
import TomSelect from "../../base-components/TomSelect";

import { ref, reactive, onMounted, computed, ComputedRef, watch, provide } from "vue";
import { useVuelidate } from "@vuelidate/core";

import { required, minLength, helpers } from "@vuelidate/validators";
import { Dialog } from "../../base-components/Headless";
import {
  FormInput,
  FormCheck,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Menu } from "../../base-components/Headless";

import { CreateBranch } from "../../models/admin/Branch";
import { useRegisterStore } from "../../stores/admin/Register";
import Toastify from "toastify-js";
import { SelectedFile } from "../../models/admin/SelectedFile";

//Message
import { NotificationElement } from "../../base-components/Notification";
import Notification from "../../base-components/Notification";
import { useMessageStore } from "../../stores/pos/POS_Messages";
import { Is_existing } from "../../models/admin/Is_existing";

import { useUserStore } from "../../stores/admin/Users";
const Users = useUserStore();

const successModalPreview = ref(false);
const setSuccessModalPreview = (value: boolean) => {
  successModalPreview.value = value;
};


// Basic sticky notification
const basicStickyNotification = ref<NotificationElement>();
const basicStickyNotificationToggle = () => {
  // Show notification
  basicStickyNotification.value?.showToast();
};

provide("bind[basicStickyNotification]", (el: NotificationElement) => {
  basicStickyNotification.value = el;
});

const RegisterInfo = useRegisterStore();
const dataForm = reactive<CreateBranch>({} as CreateBranch);
const cbo_system = ref("0");
const ch = reactive<Is_existing>({} as Is_existing);


const sendButtonRef = ref(null);
const message = useMessageStore();

const message_alert = ref("");
const message_status = ref("");

onMounted(async () => {
  await RegisterInfo.systems();
  resetForm();
});

const Systems = computed(() => {
  return RegisterInfo.getSystem;
});

watch(cbo_system, () => {
  dataForm.system_id = cbo_system.value;
});

const existing_email = computed(() => {
  return Users.getEmail;
});



function resetForm() {
  dataForm.status = 'i';
  dataForm.branch_code = "";
  dataForm.system_id = "";
  dataForm.branch_name = "";
  dataForm.email = "";
  dataForm.password = "";
  dataForm.accepted = false;
  cbo_system.value = '0';
}

const rules = computed(() => {
  return {
    branch_name: {
      required: helpers.withMessage("Store name is required", required),
      minLength: minLength(3),
    },
    system_id: {
      required: helpers.withMessage("System support is required", required),
      minLength: minLength(1)
    },
    email: {
      required: helpers.withMessage("Email is required", required),
      minLength: minLength(3)
    },
    password: {
      required: helpers.withMessage("Password is required", required),
      minLength: minLength(5),
    },
  };
});

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create() {
  $v.value.$touch();

  ch.cmd = "email";
  ch.email = dataForm.email;

  await Users.getExistEmail(ch);
  if (existing_email.value[0].is_existing == true) {
    setSuccessModalPreview(true);
    return;
  }
  else if ($v.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await RegisterInfo.registerStore(dataForm);
    if (response) {

      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }
      basicStickyNotificationToggle();
      resetForm();
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
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Register Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" :src="logoUrl" />
            <span class="ml-3 text-lg text-white">TC</span>
          </a>
          <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="w-1/2 -mt-16 -intro-x" :src="illustrationUrl" />
            <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              ស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រង<br />
              ស្វ័យប្រវត្តិ ២០២៤.
            </div>
            <div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
              គ្រប់គ្រង អាជីវកម្មរបស់អ្នកនៅមួយកន្លែង
            </div>
          </div>
        </div>
        <!-- END: Register Info -->
        <!-- BEGIN: Register Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
              Sign Up
            </h2>
            <div class="mt-8 intro-x">

              <FormInput type="text" class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Store Name" v-model="dataForm.branch_name" />

              <FormSelect v-model="cbo_system"
                class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Password Confirmation">
                <option v-for="items in Systems" :value="items.id" :key="items.id">
                  {{ items.name }}
                </option>
              </FormSelect>

              <br />


              <FormInput type="text" class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Email" v-model="dataForm.email" />

              <FormInput type="password" class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Password" v-model="dataForm.password" />
              <div class="grid w-full h-1 grid-cols-12 gap-4 mt-3 intro-x">
                <div class="h-full col-span-3 rounded bg-danger"></div>
                <div class="h-full col-span-3 rounded bg-yellow-400"></div>
                <div class="h-full col-span-3 rounded bg-success"></div>
                <div class="h-full col-span-3 rounded bg-success"></div>
              </div>
              <a href="" class="block mt-2 text-xs intro-x text-slate-500 sm:text-sm">
                What is a secure password?
              </a>

            </div>
            <div class="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
              <FormCheck.Input type="checkbox" v-model="dataForm.accepted" :checked="dataForm.accepted"
                class="mr-2 border" />
              <label class="cursor-pointer select-none" htmlFor="remember-me">
                I agree to REAN-iT team
              </label>
              <a class="ml-1 text-primary dark:text-slate-200" href="">
                Privacy Policy
              </a>
              .
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button variant="primary" :disabled="dataForm.accepted ? false : true" @click="create()"
                class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                Register
              </Button>
              <Button variant="outline-secondary" class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                @click="$router.push('login')">
                Sign in
              </Button>
            </div>
          </div>
        </div>
        <!-- END: Register Form -->
      </div>
    </div>
  </div>

  <!-- BEGIN: Modal Content -->
  <Dialog :open="successModalPreview" @close="() => {
    setSuccessModalPreview(false);
  }
    ">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Please verify your email again !</div>
        <div class="mt-2 text-slate-500">Email already existing !</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="() => {
          setSuccessModalPreview(false);
        }
          " class="w-24">Ok</Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->

  <!-- BEGIN: Basic Non Sticky Notification Content -->
  <Notification refKey="basicStickyNotification" :options="{
    duration: 1500,
  }" class="flex hidden">
    <Lucide icon="XCircle" class="text-danger" v-if="message_status == 'error'" />
    <Lucide icon="CheckCircle" class="text-success" v-else />
    <div class="ml-4 mr-4">
      <div class="font-medium">{{ message_alert }}</div>
    </div>
  </Notification>
  <!-- END: Basic Non Sticky Notification Content -->
</template>
