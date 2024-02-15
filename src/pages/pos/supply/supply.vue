<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";
import { ClassicEditor } from "../../../base-components/Ckeditor";
import TomSelect from "../../../base-components/TomSelect";
import Button from "../../../base-components/Button";
import {
  FormCheck,
  FormSelect,
  FormInput,
  FormLabel,
  FormSwitch,
  InputGroup,
  FormTextarea,
} from "../../../base-components/Form";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Supply } from "../../../models/pos/Supply";

import { useVuelidate } from "@vuelidate/core";
import { useSupplyStore } from "../../../stores/pos/Supply";
import { useBranchStore } from "../../../stores/admin/Branch";

import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

import { Dialog, Menu } from "../../../base-components/Headless";

const branch = useBranchStore();
const supplyStore = useSupplyStore();
const dataForm = reactive<Supply>({} as Supply);
const cboAddress = ref("0");

const sendButtonRef = ref(null);
const staticBackdropModalPreview = ref(false);

const setStaticBackdropModalPreview = (value: boolean) => {
  $v.value.$reset();
  staticBackdropModalPreview.value = value;
};

onMounted(async () => {
  resetForm();

  await supplyStore.ItemsList();
  await branch.getComboProvince();

});

const provinces = computed(() => {
  return branch.getProvince;
});


const items = computed(() => {
  return supplyStore.getItemsById;
});

const list_items = computed(() => {
  return supplyStore.getItemsDetail;
});

watch(cboAddress, () => {
  dataForm.address_code = cboAddress.value;
});

async function loaddata(id: string) {
  resetForm();
  await supplyStore.ItemsById(id);

  dataForm.status = 'u';
  dataForm.sup_code = items.value[0]['sup_code'] as string;
  
  dataForm.sup_name = items.value[0]['sup_name'] as string;
  dataForm.phone = items.value[0]['phone'] as string;
  dataForm.email = items.value[0]['email'] as string;
  dataForm.website = items.value[0]['website'] as string;
  dataForm.active = dataForm.active = items.value[0].active ? true : false;
  dataForm.remark = items.value[0]['remark'] as string;
  cboAddress.value = items.value[0]['address_code'] as string;

  setStaticBackdropModalPreview(true);
}

function resetForm() {
  dataForm.branch_code = '';
  dataForm.sup_code = '';
  dataForm.sup_name = '';
  dataForm.website = '';
  dataForm.phone = '';
  dataForm.email = '';
  dataForm.address = '';
  dataForm.remark = '';
  $v.value.$reset();

  dataForm.active = true;
  dataForm.status = 'i';
}

const rules = computed(() => {
  return {
    sup_name: {
      required: helpers.withMessage("Customer name is required", required),
      minLength: minLength(3),
    },
    phone: {
      required: helpers.withMessage("Phone is required", required),
      minLength: minLength(1),
    },
    address_code: {
      required: helpers.withMessage("Address is required", required),
      minLength: minLength(1),
    },
  };
});

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create() {
  $v.value.$touch();

  if ($v.value.$invalid) {
    const failedEl = document.querySelectorAll("#failed-notification-content")[0].cloneNode(true) as HTMLElement;
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

    var response = await supplyStore.create_supply(dataForm);
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

      setStaticBackdropModalPreview(false);
      await supplyStore.ItemsList();
      resetForm();
    }
  }
}

</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="() => { setStaticBackdropModalPreview(true); }">
        Create New
      </Button>
      <Menu>
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="Printer" class="w-4 h-4 mr-2" /> Print
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to Excel
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to PDF
          </Menu.Item>
        </Menu.Items>
      </Menu>
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
              Name
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
          <Table.Tr v-for="list in list_items" :key="list.sup_code" class="intro-x">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.sup_name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                Tags: {{ list.sup_code }}-{{ list.email }}
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
                <a class="flex items-center mr-3" href="" @click="
                  (event) => {
                    event.preventDefault();
                    loaddata(list.sup_code);
                  }">

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
    <Dialog staticBackdrop :open="staticBackdropModalPreview" @close="
      () => {
        setStaticBackdropModalPreview(false);
      }
    ">
      <Dialog.Panel class="px-5 py-10">
        <div class="text-center">
          <Preview class="mt-5 intro-y box">
            <div class="p-5">
              <Preview.Panel>
                <!-- BEGIN: Modal Content -->
                <Dialog staticBackdrop :open="staticBackdropModalPreview" @close="
                  () => {
                    setStaticBackdropModalPreview(false);
                  }
                ">
                  <Dialog.Panel>
                    <Dialog.Title>
                      <h2 class="mr-auto text-base font-medium">
                        Supply info
                      </h2>
                      <FormSwitch class="mt-2">
                        <FormSwitch.Input name="active" id="active" :checked="dataForm.active" v-model="dataForm.active"
                          type="checkbox" />
                      </FormSwitch>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Name</FormLabel>
                        <FormInput id="sup_name" name="sup_name" :value="dataForm.sup_name" type="text"
                          placeholder="supply name" v-model="dataForm.sup_name" :error="$v.sup_name.$error" :class="{
                            'border-danger': $v.sup_name.$error,
                          }" />
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Website</FormLabel>
                        <FormInput id="website" name="website" :value="dataForm.website" type="text"
                          placeholder="website" v-model="dataForm.website"/>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3"> Email </FormLabel>
                        <FormInput id="email" name="email" type="email" :value="dataForm.email" placeholder="email"
                          v-model="dataForm.email" />
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"> Phone </FormLabel>
                        <FormInput id="phone" name="phone" type="text" :value="dataForm.phone" placeholder="phone"
                          v-model="dataForm.phone" :error="$v.phone.$error" :class="{
                            'border-danger': $v.phone.$error,
                          }" />

                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-6">Address</FormLabel>
                        <TomSelect name="cboAddress" v-model="cboAddress" :value="cboAddress" :error="$v.address_code.$error"
                          :class="{ 'border-danger': $v.address_code.$error }">
                          <option v-for="items in provinces" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="remark"> Remark </FormLabel>
                        <FormTextarea id="remark" name="remark" v-model="dataForm.remark" :value="dataForm.remark"
                          placeholder="Type your comments">
                        </FormTextarea>
                      </div>
                    </Dialog.Description>
                    <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" @click="
                        () => {
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
            </div>
          </Preview>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->

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
  </div>
</template>

