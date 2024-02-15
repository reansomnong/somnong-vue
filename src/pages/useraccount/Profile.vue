<script setup lang="ts">
import _ from "lodash";

import { ref, reactive, onMounted, computed, ComputedRef, watch } from "vue";
import Button from "../../base-components/Button";
import { useVuelidate } from "@vuelidate/core";

import { required, minLength, helpers } from "@vuelidate/validators";
import { Dialog } from "../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Menu } from "../../base-components/Headless";

import { Userinfo } from "../../models/admin/User";
import { useUserloginStore } from "../../stores/admin/UserLoggedIn";
import Toastify from "toastify-js";
import Notification from "../../base-components/Notification";
import { SelectedFile } from "../../models/admin/SelectedFile";


const selectedFiles = ref([] as SelectedFile[]);
const image_url = ref("");

const isUploading: ComputedRef<boolean> = computed(() =>
  selectedFiles.value.some((file) => file.status == "uploading")
);

const UserStore = useUserloginStore();
const dataForm = reactive<Userinfo>({} as Userinfo);
const images = reactive<SelectedFile>({} as SelectedFile);

const successModalPreview = ref(false);
const setSuccessModalPreview = (value: boolean) => {
  load_data();
  successModalPreview.value = value;
};

onMounted(async () => {
  await UserStore.user_logged();
  await load_data();
});

async function load_data() {
  dataForm.status = "verify";
  dataForm.id = User.value[0].id;
  dataForm.fullname = User.value[0].fullname;
  dataForm.username = User.value[0].username;
  dataForm.email = User.value[0].email;
  dataForm.phone = User.value[0].phone;
  dataForm.profile = User.value[0].profile;
  dataForm.address = User.value[0].address;
  dataForm.image = User.value[0].image;

  await UserStore.url_image(dataForm.image as string);
  image_url.value = user_image.value[0].url;
}

function clear() {
  dataForm.status = "i";
  dataForm.username = "";
  dataForm.fullname = "";
  dataForm.phone = "";
  dataForm.email = "";
  dataForm.address = "";
  $v.value.$reset();
}
const user_image = computed(() => {
  return UserStore.getUserimage;
});

const User = computed(() => {
  return UserStore.getUserinfo;
});

const rules = computed(() => {
  return {
    username: {
      required: helpers.withMessage("Set user name is required", required),
      minLength: minLength(3),
    },
    fullname: {
      required: helpers.withMessage("Full name is required", required),
      minLength: minLength(3),
    },
  };
});

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create_user() {
  $v.value.$touch();
  if ($v.value.$invalid) {
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

    var response = await UserStore.create_user(dataForm);
    if (response) {
      const failedEl = document
        .querySelectorAll("#success-notification-content")[0]
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
      $v.value.$reset();
      await UserStore.user_logged();
    }
  }
}
const clearFiles = () => (selectedFiles.value = []);

const onSelectFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files === null) {
    return;
  }

  clearFiles();
  Array.from(target.files).forEach((file: File) => {
    selectedFiles.value.push({
      file: file,
      percentage: 0,
      status: "pending",
    } as SelectedFile);

    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        images.path = reader.result as string;
      },
      false
    );
    reader.readAsDataURL(file);
  });
};

async function uploadSelectedFiles() {
  selectedFiles.value.forEach((file: SelectedFile) => {
    file.status = "uploading";
    file.percentage = 0;
    UserStore.upload_image(file.file);
  });

  setSuccessModalPreview(true);
}

</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- BEGIN: Profile Menu -->
    <div
      class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block"
    >
      <div class="mt-5 intro-y box">
        <div class="relative flex items-center p-5">
          <div class="w-12 h-12 image-fit">
            <img alt="Your profile" class="rounded-full" :src="image_url" />
          </div>
          <div class="ml-4 mr-auto">
            <div class="text-base font-medium">
              {{ dataForm.fullname }}
            </div>
            <div class="text-slate-500">{{ dataForm.profile }}</div>
          </div>
          <Menu>
            <Menu.Button tag="a" class="block w-5 h-5" href="#">
              <Lucide icon="MoreHorizontal" class="w-5 h-5 text-slate-500" />
            </Menu.Button>
            <Menu.Items class="w-56">
              <Menu.Header> Export Options</Menu.Header>
              <Menu.Divider />
              <Menu.Item>
                <Lucide icon="Activity" class="w-4 h-4 mr-2" />
                English
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="Box" class="w-4 h-4 mr-2" />
                Indonesia
                <div
                  class="px-1 ml-auto text-xs text-white rounded-full bg-danger"
                >
                  10
                </div>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Footer>
                <Button variant="primary" type="button" class="px-2 py-1">
                  Settings
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  class="px-2 py-1 ml-auto"
                >
                  View Profile
                </Button>
              </Menu.Footer>
            </Menu.Items>
          </Menu>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <a class="flex items-center font-medium text-primary" href="">
            <Lucide icon="Activity" class="w-4 h-4 mr-2" /> Personal Information
          </a>
          <a class="flex items-center mt-5" href="">
            <Lucide icon="Lock" class="w-4 h-4 mr-2" /> Change Password
          </a>
          <a class="flex items-center mt-5" href="">
            <Lucide icon="Settings" class="w-4 h-4 mr-2" /> User Settings
          </a>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <a class="flex items-center" href="">
            <Lucide icon="Activity" class="w-4 h-4 mr-2" /> Email Settings
          </a>
          <a class="flex items-center mt-5" href="">
            <Lucide icon="Lock" class="w-4 h-4 mr-2" /> Social Networks
          </a>
        </div>
        <div
          class="flex p-5 border-t border-slate-200/60 dark:border-darkmode-400"
        >
        </div>
      </div>
    </div>
    <!-- END: Profile Menu -->
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Display Information -->
      <div class="intro-y box lg:mt-5">
        <div
          class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="mr-auto text-base font-medium">User Information</h2>
        </div>
        <div class="p-5">
          <div class="flex flex-col xl:flex-row">
            <div class="flex-1 mt-6 xl:mt-0">
              <div class="grid grid-cols-12 gap-x-5">
                <div class="col-span-12 2xl:col-span-6">
                  <div>
                    <FormLabel htmlFor="update-profile-form-1">
                      User Name (@)
                    </FormLabel>
                    <FormInput
                      id="update-profile-form-1"
                      type="text"
                      placeholder="Input text"
                      :value="dataForm.username"
                      v-model="dataForm.username"
                      @keydown.space="(event) => event.preventDefault()"
                    />

                    <template v-if="$v.username.$errors">
                      <div
                        v-for="(error, index) in $v.username.$errors"
                        :key="index"
                        class="mt-2 text-danger"
                      >
                        {{ error.$message }}
                      </div>
                    </template>
                  </div>
                  <div class="mt-3">
                    <FormLabel htmlFor="update-profile-form-1">
                      Email
                    </FormLabel>
                    <FormInput
                      id="update-profile-form-1"
                      type="text"
                      placeholder="Input text"
                      :value="dataForm.email"
                      disabled
                    />
                  </div>
                  <div class="mt-3">
                    <FormLabel htmlFor="update-profile-form-1">
                      Profile Role
                    </FormLabel>
                    <FormInput
                      id="update-profile-form-1"
                      type="text"
                      placeholder="Input text"
                      :value="dataForm.profile"
                      disabled
                    />
                  </div>
                </div>
                <div class="col-span-12 2xl:col-span-6">
                  <div class="mt-3">
                    <FormLabel htmlFor="update-profile-form-4">
                      Full Name
                    </FormLabel>
                    <FormInput
                      id="update-profile-form-4"
                      type="text"
                      placeholder="Input text"
                      :value="dataForm.fullname"
                      v-model="dataForm.fullname"
                      :error="$v.fullname.$error"
                      :class="{
                        'border-danger': $v.fullname.$error,
                      }"
                    />
                  </div>
                  <div class="mt-3">
                    <FormLabel htmlFor="update-profile-form-4">
                      Phone Number
                    </FormLabel>
                    <FormInput
                      id="update-profile-form-4"
                      type="text"
                      placeholder="Input text"
                      :value="dataForm.phone"
                      v-model="dataForm.phone"
                    />
                  </div>
                </div>
                <div class="col-span-12">
                  <div class="mt-3">
                    <FormLabel htmlFor="update-profile-form-5">
                      Address
                    </FormLabel>
                    <FormTextarea
                      id="update-profile-form-5"
                      placeholder="Adress"
                      :value="dataForm.address"
                      v-model="dataForm.address"
                    ></FormTextarea>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                type="button"
                class="w-20 mt-3"
                @click="create_user()"
              >
                Save
              </Button>
            </div>
            
            <div class="mx-auto w-40 xl:mr-0 xl:ml-6">
              <div
                class="p-2 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400"
              >
                <div
                  class="relative h-40 mx-auto cursor-pointer image-fit zoom-in"
                >
                  <img
                    v-if="selectedFiles.length <= 0"
                    class="rounded-md"
                    alt="Your profile"
                    :src="image_url"
                  />

                  <img
                    v-else
                    class="rounded-md"
                    alt="Midone Tailwind HTML Admin Template"
                    :src="images.path"
                  />

                  <Tippy
                    as="div"
                    content="Remove this profile photo?"
                    class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                  >
                    <Lucide icon="X" class="w-4 h-4" />
                  </Tippy>

                  <FormInput
                    type="file"
                    class="absolute top-0 left-0 w-full h-full opacity-0"
                    accept="image/png, image/jpeg"
                    @change="onSelectFiles"
                  />
                </div>
                <div class="relative mx-auto mt-5 cursor-pointer">
                  <Button
                    variant="primary"
                    type="button"
                    class="w-full"
                    :class="{ disabled: isUploading }"
                    href="#"
                    @click.prevent="uploadSelectedFiles"
                    v-if="selectedFiles.length"
                  >
                    Update Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Display Information -->
    </div>

    <!-- BEGIN: Modal Content -->
    <Dialog
      :open="successModalPreview"
      @close="
        () => {
          setSuccessModalPreview(false);
        }
      "
    >
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
          <div class="mt-5 text-3xl">User profile updated </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            type="button"
            variant="primary"
            @click="
              () => {
                setSuccessModalPreview(false);
              }
            "
            class="w-24"
            >Ok</Button
          >
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->

    <!-- BEGIN: Success Notification Content -->
    <Notification id="success-notification-content" class="flex hidden">
      <Lucide icon="CheckCircle" class="text-success" />
      <div class="ml-4 mr-4">
        <div class="font-medium">User profile updated success!</div>
      </div>
    </Notification>
    <!-- END: Success Notification Content -->
    <!-- BEGIN: Failed Notification Content -->
    <Notification id="failed-notification-content" class="flex hidden">
      <Lucide icon="XCircle" class="text-danger" />
      <div class="ml-4 mr-4">
        <div class="mt-1 text-slate-500">Please check the fileld form.</div>
      </div>
    </Notification>
    <!-- END: Failed Notification Content -->
  </div>
</template>
