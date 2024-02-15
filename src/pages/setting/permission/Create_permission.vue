<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, watch, onMounted } from "vue";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";

import { FormLabel, FormCheck } from "../../../base-components/Form";

import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Permission ,Add_Permission} from "../../../models/admin/Menu";
import TomSelect from "../../../base-components/TomSelect";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";

import { usePermissionStore } from "../../../stores/admin/Permission";
import { useMessageStore } from "../../../stores/pos/POS_Messages";

// Basic sticky notification
const basicStickyNotification = ref<NotificationElement>();
const basicStickyNotificationToggle = () => {
  // Show notification
  basicStickyNotification.value?.showToast();
};

const Menu = usePermissionStore();
const message = useMessageStore();
const dataForm = reactive<Add_Permission>({} as Add_Permission);

const message_alert = ref("");
const message_status = ref("");

const cbo_system = ref("0");
const cbo_profile = ref("0");
const cbo_menu = ref("0");

const successModalPreview = ref(false);
const setSuccessModalPreview = (value: boolean) => {
  successModalPreview.value = value;
};

const rules = computed(() => {
  return {
    menu_id: {
      required: helpers.withMessage("Icon is required", required),
      minLength: minLength(1),
    },
    system_id: {
      required: helpers.withMessage("Page name is required", required),
      minLength: minLength(1),
    },
    profile_id: {
      required: helpers.withMessage("Title is required", required),
      minLength: minLength(1),
    },
  };
});

function resetForm() {
  dataForm.status = "i";
  dataForm.profile_id = "";
  dataForm.menu_id = "";
  dataForm.system_id = "";

  cbo_system.value="";
  cbo_profile.value="";
  cbo_menu.value="";

   Menu.load_sub_menu(
      "000",
      "000",
      "000",
    );

  $v.value.$reset();
}

onMounted(async () => {
  dataForm.status = "i";
  await Menu.load_cbo_system();
});

const list_of_system = computed(() => {
  return Menu.getSystem;
});

const list_of_profile = computed(() => {
  return Menu.getProfile;
});

const list_of_menu = computed(() => {
  return Menu.getMenu;
});

const list_of_sub = computed(() => {
  return Menu.getsubMenu;
});

async function load_profile(id: string) {
  await Menu.load_cbo_profile(id);
}

async function load_menu(id: string) {
  await Menu.load_cbo_menu(id);
}

async function load_sub_menu() {
  if (dataForm.system_id != "" && dataForm.menu_id != "") {
    await Menu.load_sub_menu(
      dataForm.system_id,
      dataForm.profile_id,
      dataForm.menu_id
    );
  }
}

watch(cbo_system, () => {

  dataForm.system_id = cbo_system.value;
  dataForm.profile_id = "";
  cbo_profile.value = "";
  if (dataForm.system_id !=''){
    load_profile(dataForm.system_id);
  }
});

watch(cbo_profile, () => {
  dataForm.profile_id = cbo_profile.value;
  cbo_menu.value = "";
  if (dataForm.profile_id !=''){
    load_menu(dataForm.profile_id);
  }
});

watch(cbo_menu, () => {
  dataForm.menu_id = cbo_menu.value;
  if (dataForm.menu_id !=''){
    load_sub_menu();
  }
});

async function allow_sub_menu(checked: boolean,event : Event) {
  dataForm.sub_menu_id=(event.target as HTMLInputElement).value;
  dataForm.active=checked;
  await create();
}

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create() {
  $v.value.$touch();
  if ($v.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {

    var response = await Menu.create_menu(dataForm);

    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }

      basicStickyNotificationToggle();
    }
  }
}
</script>

<template>
  <!-- BEGIN: Transaction Details -->
  <div class="grid grid-cols-11 gap-5 mt-5 intro-y">
    <!-- BEGIN: Register Userinfo -->
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <div class="p-5 mt-5 rounded-md box">
        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-1">System</FormLabel>
          <TomSelect
            class="w-full"
            name="system_id"
            v-model="cbo_system"
            :options="{ placeholder: 'Select system' }"
            :error="$v.system_id.$error"
            :class="{ 'border-danger': $v.system_id.$error }"
          >
            <option
              v-for="items in list_of_system"
              :value="items.id"
              :key="items.id"
            >
              {{ items.name }}
            </option>
          </TomSelect>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-1">Profile</FormLabel>
          <TomSelect
            class="w-full"
            name="profile_id"
            v-model="cbo_profile"
            :options="{ placeholder: 'Select profile' }"
            :error="$v.profile_id.$error"
            :class="{ 'border-danger': $v.profile_id.$error }"
          >
            <option
              v-for="items in list_of_profile"
              :value="items.id"
              :key="items.id"
            >
              {{ items.name }}
            </option>
          </TomSelect>
        </div>
        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-1">Menu</FormLabel>
          <TomSelect
            class="w-full"
            name="menu_id"
            v-model="cbo_menu"
            :options="{ placeholder: 'Select parent menu' }"
            :error="$v.menu_id.$error"
            :class="{ 'border-danger': $v.menu_id.$error }"
          >
            <option
              v-for="items in list_of_menu"
              :value="items.id"
              :key="items.id"
            >
              {{ items.name }}
            </option>
          </TomSelect>
        </div>

        <div
          class="flex items-center pt-5 mt-5 font-medium border-t border-slate-200/60 dark:border-darkmode-400"
        >
          <div class="ml-auto">
            <Button
              type="button"
              variant="outline-secondary"
              class="w-24 mr-1"
              @click="resetForm()"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-5 2xl:col-span-10">
      <!-- BEGIN: Inbox Content -->
      <div class="mt-5 intro-y box">
        <div class="overflow-x-auto sm:overflow-x-visible">
          <div v-for="sub in list_of_sub" :key="sub.id" class="intro-y">
            <div
              :class="[
                'transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400',
                'hover:scale-[1.02] hover:relative hover:z-20 hover:shadow-md hover:border-0 hover:rounded',
                {
                  'bg-slate-100 text-slate-600 dark:text-slate-500 dark:bg-darkmode-400/70':
                    sub.allowed,
                },
                {
                  'bg-white text-slate-800 dark:text-slate-300 dark:bg-darkmode-600':
                    !sub.allowed,
                },
              ]"
            >
              <div class="flex px-5 py-3">
                <div class="flex items-center flex-none mr-5 w-72">
                  <FormCheck.Input
                    class="flex-none border-slate-400 checked:border-primary"
                    type="checkbox"
                    :key="sub.id"
                    :value="sub.id"
                    :checked="sub.allowed ? true : false"
                    @change="(event) => allow_sub_menu((event.target as HTMLInputElement).checked,event)"
                  />

                  <a
                    href="#"
                    class="flex items-center justify-center flex-none w-5 h-5 ml-4 text-slate-400"
                  >
                    <Lucide icon="Star" class="w-4 h-4" />
                  </a>

                  <div
                    :class="['ml-3 truncate', { 'font-medium': sub.allowed }]"
                  >
                    {{ sub.page_name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: Inbox Content -->
    </div>

    <!-- BEGIN: Success Notification Content -->
    <Notification id="success-notification-content" class="flex hidden">
      <Lucide icon="CheckCircle" class="text-success" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Registration success!</div>
      </div>
    </Notification>
    <!-- END: Success Notification Content -->

    <Notification id="failed-notification-content" class="flex hidden">
      <Lucide icon="XCircle" class="text-danger" />
      <div class="ml-4 mr-4">
        <div class="mt-1 text-slate-500">Please check the fileld form.</div>
      </div>
    </Notification>

    <Notification id="failed-notification-parent_menu" class="flex hidden">
      <Lucide icon="XCircle" class="text-danger" />
      <div class="ml-4 mr-4">
        <div class="mt-1 text-slate-500">Please select parent menu.</div>
      </div>
    </Notification>

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
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Plz verify email !</div>
          <div class="mt-2 text-slate-500">Email already existing !</div>
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

    <!-- BEGIN: Basic Non Sticky Notification Content -->
    <Notification
      refKey="basicStickyNotification"
      :options="{
        duration: 1500,
      }"
      class="flex hidden"
    >
      <Lucide
        icon="XCircle"
        class="text-danger"
        v-if="message_status == 'error'"
      />
      <Lucide icon="CheckCircle" class="text-success" v-else />
      <div class="ml-4 mr-4">
        <div class="font-medium">{{ message_alert }}</div>
      </div>
    </Notification>
    <!-- END: Basic Non Sticky Notification Content -->
  </div>
  <!-- END: Transaction Details -->
</template>
