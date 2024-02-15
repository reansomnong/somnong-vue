<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, watch, onMounted } from "vue";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";

import {
  FormInput,
  FormLabel,
  FormSwitch,
} from "../../../base-components/Form";

import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  helpers,
  email,
} from "@vuelidate/validators";
import { Userinfo } from "../../../models/admin/User";
import { Is_existing } from "../../../models/admin/Is_existing";
import TomSelect from "../../../base-components/TomSelect";
import { useUserStore } from "../../../stores/admin/Users";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

const Users = useUserStore();
const selectProfile = ref("0");
const selectBranch = ref("0");

const dataForm = reactive<Userinfo>({} as Userinfo);
const ch = reactive<Is_existing>({} as Is_existing);

const successModalPreview = ref(false);
const setSuccessModalPreview = (value: boolean) => {
  successModalPreview.value = value;
};

const rules = computed(() => {
  return {
    branch_code: {
      required: helpers.withMessage("Branch is required", required),
      minLength: minLength(1),
    },
    fullname: {
      required: helpers.withMessage("Full name is required", required),
      minLength: minLength(3),
    },
    phone: {
      minLength: minLength(3),
    },
    email: {
      required: helpers.withMessage("Email is required", required),
      email: helpers.withMessage("Email is required", email),
    },
    profile: {
      required: helpers.withMessage("Profile is required", required),
    },
  };
});

function clear() {
  dataForm.status = "i";
  dataForm.fullname = "";
  dataForm.phone = "";
  dataForm.email = "";
  dataForm.passWord = "";
  selectProfile.value = "0";
  selectBranch.value = "0";
  $v.value.$reset();
}

onMounted(async () => {
  dataForm.active = true;
  dataForm.status = "i";

  await Users.getComboBranch();
  await Users.getComboProfile();
  await Users.getUserlist();
});

const existing_email = computed(() => {
  return Users.getEmail;
});
const profiles = computed(() => {
  return Users.getProfiles;
});

const branches = computed(() => {
  return Users.getBranch;
});

const user_list = computed(() => {
  return Users.getUsers;
});

watch(selectProfile, () => {
  dataForm.profile = selectProfile.value;
});

watch(selectBranch, () => {
  dataForm.branch_code = selectBranch.value;
});

const userById = computed(() => {
  return Users.getUserShow;
});

async function loaddata(id: string) {
  await Users.getUserById(id);

  dataForm.status = "u";
  dataForm.id = id;
  dataForm.branch_code = userById.value[0]["branch_code"] as string;
  dataForm.fullname = userById.value[0]["fullname"] as string;
  dataForm.phone = userById.value[0]["phone"] as string;
  dataForm.email = userById.value[0]["email"] as string;
  dataForm.active = dataForm.active = userById.value[0].active ? true : false;

  selectProfile.value = userById.value[0]["profile_id"] as string;
  selectBranch.value = userById.value[0]["branch_code"] as string;
}

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
    if (dataForm.status === "u") {
      ch.id = dataForm.id;
    } else {
      ch.id = "%";
    }

    ch.cmd = "email";
    ch.email = dataForm.email;
    await Users.getExistEmail(ch);

    if (existing_email.value[0].is_existing == true) {
      setSuccessModalPreview(true);
    } else {
      var response = await Users.create_user(dataForm);
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
        await Users.getUserlist();
      }
    }
  }
}
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });
</script>

<template>
  <!-- BEGIN: Transaction Details -->
  <div class="grid grid-cols-11 gap-5 mt-5 intro-y">
    <!-- BEGIN: Register Userinfo -->
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <div class="p-5 mt-5 rounded-md box">
        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-1">Branch</FormLabel>
          <TomSelect class="w-full" name="cboBranch" v-model="selectBranch"
            :options="{ placeholder: 'Select your profile' }" :error="$v.branch_code.$error"
            :class="{ 'border-danger': $v.branch_code.$error }">
            <option :disabled="dataForm.status === 'u' ? true : false" v-for="items in branches" :value="items.id"
              :key="items.id">
              {{ items.name }}
            </option>
          </TomSelect>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-1">Profile</FormLabel>
          <TomSelect class="w-full" name="cboProfile" v-model="selectProfile"
            :options="{ placeholder: 'Select your profile' }" :error="$v.profile.$error"
            :class="{ 'border-danger': $v.profile.$error }">
            <optgroup label="Profile">
              <option v-for="items in profiles" :value="items.id" :key="items.id">
                {{ items.name }}
              </option>
            </optgroup>
          </TomSelect>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-1">Full Name</FormLabel>
          <FormInput name="fullname" id="fullname" type="text" placeholder="Full name" v-model="dataForm.fullname"
            :value="dataForm.fullname" :error="$v.fullname.$error" :class="{
              'border-danger': $v.fullname.$error,
            }" />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Phone </FormLabel>
          <FormInput name="phone" id="phone" type="text" placeholder="Phone" v-model="dataForm.phone"
            :value="dataForm.phone" :error="$v.phone.$error" :class="{
              'border-danger': $v.phone.$error,
            }" />
          <template v-if="$v.phone.$errors">
            <div v-for="(error, index) in $v.phone.$errors" :key="index" class="mt-2 text-danger">
              {{ error.$message }}
            </div>
          </template>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Email </FormLabel>
          <FormInput name="email" type="email" placeholder="Email" v-model="dataForm.email" :value="dataForm.email"
            :error="$v.email.$error" :disabled="dataForm.status === 'u' ? true : false" :class="{
              'border-danger': $v.email.$error,
            }" />
          <template v-if="$v.email.$errors">
            <div v-for="(error, index) in $v.email.$errors" :key="index" class="mt-2 text-danger">
              {{ error.$message }}
            </div>
          </template>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Password </FormLabel>
          <FormInput name="passWord" type="password" v-model="dataForm.passWord" :value="dataForm.passWord"
            placeholder="Password" :disabled="dataForm.status === 'u' ? true : false" />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3">
            {{ dataForm.active ? "Active" : "Inactive" }}
          </FormLabel>
          <FormSwitch class="mt-2">
            <FormSwitch.Input name="active" id="ch_active" :checked="dataForm.active" v-model="dataForm.active"
              type="checkbox" />
          </FormSwitch>
        </div>

        <div class="flex items-center pt-5 mt-5 font-medium border-t border-slate-200/60 dark:border-darkmode-400">
          <div class="ml-auto">
            <Button type="button" variant="outline-secondary" class="w-24 mr-1" @click="clear()">
              Clear
            </Button>

            <Button variant="outline-success" class="inline-block w-24 mb-2 mr-1" @click="create_user()">
              Commit
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- END: Register user Content -->

    <div class="col-span-12 lg:col-span-7 2xl:col-span-8">
      <!-- BEGIN: Data List -->
      <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
        <Table class="border-spacing-y-[10px] border-separate -mt-2">
          <Table.Thead>
            <Table.Tr>
              <Table.Th class="border-b-0 whitespace-nowrap">
                User name
              </Table.Th>
              <Table.Th class="border-b-0 whitespace-nowrap"> Login </Table.Th>
              <Table.Th class="border-b-0 whitespace-nowrap">
                Profile
              </Table.Th>
              <Table.Th class="text-center border-b-0 whitespace-nowrap">
                STATUS
              </Table.Th>
              <Table.Th class="text-center border-b-0 whitespace-nowrap">
                ACTIONS
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr v-for="user in user_list" :key="user.id" class="intro-x">
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <a href="#" class="font-medium whitespace-nowrap">
                  {{ user.username }}
                </a>
                <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                  Tags: {{ user.branch_code }}-{{ user.branch_name }}
                </div>
              </Table.Td>

              <Table.Td
                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                {{ user.email }}
              </Table.Td>

              <Table.Td
                class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <a class="flex items-center mr-3 text-slate-500" href="#">
                  <Lucide icon="ExternalLink" class="w-4 h-4 mr-2" />
                  {{ user.profile }}
                </a>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                <div :class="[
                  'flex items-center justify-center',
                  { 'text-success': user.active },
                  { 'text-danger': !user.active },
                ]">
                  <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                  {{ user.active ? "Active" : "Inactive" }}
                </div>
              </Table.Td>
              <Table.Td
                class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                <div class="flex items-center justify-center">
                  <a class="flex items-center mr-3" href="" @click="(event) => {
                      event.preventDefault();
                      loaddata(user.id);
                    }
                    ">
                    <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />
                    E
                  </a>
                  <a class="flex items-center text-danger" href="#" @click="(event) => {
                      event.preventDefault();
                    }
                    ">
                    <Lucide icon="Settings" class="w-4 h-4 mr-1" />R
                  </a>
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <!-- END: Data List -->
    </div>

    <!-- BEGIN: Success Notification Content -->
    <Notification id="success-notification-content" class="flex hidden">
      <Lucide icon="CheckCircle" class="text-success" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Registration success!</div>
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

    <!-- BEGIN: Modal Content -->
    <Dialog :open="successModalPreview" @close="() => {
        setSuccessModalPreview(false);
      }
      ">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Plz verify email !</div>
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
  </div>
  <!-- END: Transaction Details -->
</template>
