<script setup lang="ts">

import _ from "lodash";
import { ref, reactive, computed, watch, onMounted, provide } from "vue";
import {
  FormInput,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../../base-components/Form";

import TomSelect from "../../../base-components/TomSelect";
import Button from "../../../base-components/Button";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";

// Model
import { clients } from "../../../models/somnong/clients";
import { Branch } from "../../../models/admin/Branch";
// Stores
import { useClientStore } from "../../../stores/somnong/clients";
import { useBranchStore } from "../../../stores/admin/Branch";
import { useMessageStore } from "../../../stores/pos/POS_Messages";

// Basic sticky notification
const basicStickyNotification = ref<NotificationElement>();
const basicStickyNotificationToggle = () => {
  // Show notification
  basicStickyNotification.value?.showToast();
};
provide("bind[basicStickyNotification]", (el: NotificationElement) => {
  basicStickyNotification.value = el;
});

const Branch = useBranchStore();
const Client = useClientStore();
const message = useMessageStore();

const dataForm = reactive<clients>({} as clients);
const cboGender = ref("0");
const cboAddress = ref("0");

const message_alert = ref("");
const message_status = ref("");

const sendButtonRef = ref(null);
const staticBackdropModalPreview = ref(false);

const setStaticBackdropModalPreview = (value: boolean) => {
  $v.value.$reset();
  staticBackdropModalPreview.value = value;
};

onMounted(async () => {
  resetForm();
  await Client.ItemsList();
  await Client.ComboGender();
  await Branch.getComboProvince();
});

const provinces = computed(() => {
  return Branch.getProvince;
});

const list_gender = computed(() => {
  return Client.getGender;
});

const items = computed(() => {
  return Client.getItemsById;
});

const list_items = computed(() => {
  return Client.getItemsDetail;
});

watch(cboGender, () => {
  dataForm.gender = cboGender.value;
});

watch(cboAddress, () => {
  dataForm.address_code = cboAddress.value;
});

async function loaddata(id: string) {
  resetForm();
  await Client.ItemsById(id);

  dataForm.status = "u";
  dataForm.client_id = items.value[0]["client_id"] as string;
  dataForm.name = items.value[0]["name"] as string;
  cboGender.value = items.value[0]["gender"] as string;
  dataForm.phone = items.value[0]["phone"] as string;
  dataForm.remark = items.value[0]["remark"] as string;
  dataForm.active = dataForm.active = items.value[0].active ? true : false;
  dataForm.google_map = items.value[0]["google_map"] as string;
  cboAddress.value = items.value[0]["address_code"] as string;

  setStaticBackdropModalPreview(true);

}

function resetForm() {
  dataForm.branch_code = "";
  dataForm.client_id = "";
  dataForm.name = "";
  dataForm.phone = "";
  dataForm.address = "";
  dataForm.google_map = "";
  dataForm.remark = "";
  $v.value.$reset();

  dataForm.active = true;
  dataForm.status = "i"; 
  cboGender.value = "";
}

const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage("Client name is required", required),
      minLength: minLength(3),
    },
    gender: {
      required: helpers.withMessage("Gender is required", required),
      minLength: minLength(1),
    },
    phone: {
      required: helpers.withMessage("Phone is required", required),
      minLength: minLength(1),
    },
    address_code: {
      required: helpers.withMessage("location is required", required),
      minLength: minLength(1),
    },
  };
});

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });


async function create() {
  $v.value.$touch();

  if ($v.value.$invalid) {

    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await Client.create(dataForm);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }

      basicStickyNotificationToggle();
      setStaticBackdropModalPreview(false);

      await Client.ItemsList();
      resetForm();
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="() => {
        setStaticBackdropModalPreview(true);
      }
        ">
        Create New
      </Button>
      <div class="hidden mx-auto md:block text-slate-500">
        Showing 1 to 10 of 150 entries
      </div>
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <FormInput type="text" class="w-56 pr-10 !box" placeholder="Search..." />
          <Lucide icon="Search" class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap">
              Customer name
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Phone </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Address </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              STATUS
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              ACTIONS
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr v-for="list in list_items" :key="list.client_id" class="intro-x">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                id: {{ list.client_id }}-{{ list.phone }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.phone }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.address }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <div :class="[
                'flex items-center justify-center',
                { 'text-success': list.active },
                { 'text-danger': !list.active },
              ]">
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ list.active ? "Active" : "Inactive" }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
              <div class="flex items-center justify-center">
                <a class="flex items-center mr-3" href="" @click="(event) => {
                  event.preventDefault();
                  loaddata(list.client_id);
                }
                  ">
                  <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />
                  Edit
                </a>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <!-- BEGIN: Modal Content -->
    <Dialog staticBackdrop :open="staticBackdropModalPreview" @close="() => {
      setStaticBackdropModalPreview(false);
    }
      ">
      <Dialog.Panel class="px-5 py-10">
        <div class="text-center">
          <Preview class="mt-5 intro-y box">
              <Preview.Panel>
                <!-- BEGIN: Modal Content -->
                <Dialog staticBackdrop :open="staticBackdropModalPreview" @close="() => {
                  setStaticBackdropModalPreview(false);
                }
                  ">
                  <Dialog.Panel>
                    <Dialog.Title>
                      <h2 class="mr-auto text-base font-medium">
                        Client info
                      </h2>
                      <FormSwitch class="mt-2">
                        <FormSwitch.Input :checked="dataForm.active" v-model="dataForm.active" type="checkbox" />
                      </FormSwitch>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Full Name</FormLabel>
                        <FormInput :value="dataForm.name" type="text" placeholder="client name"
                          v-model="dataForm.name" :error="$v.name.$error" :class="{
                            'border-danger': $v.name.$error,
                          }" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"> Phone </FormLabel>
                        <FormInput type="text" :value="dataForm.phone" placeholder="phone" v-model="dataForm.phone"
                          :error="$v.phone.$error" :class="{
                            'border-danger': $v.phone.$error,
                          }" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Gender</FormLabel>
                        <TomSelect name="cboGender" v-model="cboGender" :error="$v.gender.$error"
                          :class="{ 'border-danger': $v.gender.$error }">
                          <option v-for="items in list_gender" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>
                     
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-6">Address</FormLabel>
                        <TomSelect name="cboAddress" v-model="cboAddress" :value="cboAddress"
                          :error="$v.address_code.$error" :class="{ 'border-danger': $v.address_code.$error }">
                          <option v-for="items in provinces" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-4"> Link Google Map </FormLabel>
                        <FormInput type="text" :value="dataForm.google_map" placeholder="Google Map" v-model="dataForm.google_map"/>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="remark"> Remark </FormLabel>
                        <FormTextarea v-model="dataForm.remark" :value="dataForm.remark" placeholder="type your comment">
                        </FormTextarea>
                      </div>
                    </Dialog.Description>
                    <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" @click="() => {
                        setStaticBackdropModalPreview(false);
                      }
                        " class="w-20 mr-1">
                        Cancel
                      </Button>
                      <Button name="btnOk" variant="primary" type="button" class="w-20" ref="{sendButtonRef}"
                        :disable="$v.$invalid" @click="create()">
                        Commit
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Panel>
                </Dialog>
                <!-- END: Modal Content -->
              </Preview.Panel>
          </Preview>
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
  </div>
</template>
