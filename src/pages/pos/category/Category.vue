<script setup lang="ts">
import _, { fromPairs } from "lodash";
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import TomSelect from "../../../base-components/TomSelect";

import {
  FormInput,
  FormSelect,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../../base-components/Form";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Category } from "../../../models/pos/Category";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { useVuelidate } from "@vuelidate/core";

import { useCategoriesStore } from "../../../stores/pos/Category";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

const Category = useCategoriesStore();
const dataFrom = reactive<Category>({} as Category);
const sendButtonRef = ref(null);
const staticBackdropModalPreview = ref(false);
const cboLine = ref("0");

const setStaticBackdropModalPreview = (value: boolean) => {
  resetForm();
  $v.value.$reset();
  staticBackdropModalPreview.value = value;
};

const setUpdateModalPreview = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};

watch(cboLine, () => {
  dataFrom.parent_id = cboLine.value;
});

function resetForm() {
  dataFrom.active = true;
  dataFrom.branch_code = "";
  dataFrom.lin_code = "";
  dataFrom.lin_name = "";
  dataFrom.remark = "";
  dataFrom.status = "i";
}

async function create_category() {
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
    var response = await Category.Register(dataFrom);
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
      await Category.ItemsList();
      resetForm();
    }
  }
}

const rules = computed(() => {
  return {
    lin_name: {
      required: helpers.withMessage("Item name is required", required),
      minLength: minLength(2),
    },
    parent_id: {
      required: helpers.withMessage("Line is required", required),
      minLength: minLength(2),
    },
  };
});

const $v = useVuelidate(rules, dataFrom, { $autoDirty: true });

async function view_edit(branch_code: string) {
  await Category.ItemsById(branch_code);
  dataFrom.status = "u";
  dataFrom.branch_code = ItemsById.value[0]["branch_code"] as string;
  dataFrom.lin_code = ItemsById.value[0]["lin_code"];
  dataFrom.lin_name = ItemsById.value[0]["lin_name"];
  dataFrom.parent_id = ItemsById.value[0]["parent_id"];
  dataFrom.remark = ItemsById.value[0]["remark"];
  dataFrom.active = dataFrom.active = ItemsById.value[0].active ? true : false;

  cboLine.value = ItemsById.value[0]["parent_id"];

  setUpdateModalPreview(true);
}

onMounted(async () => {
  await Category.ItemsList();
  await Category.ComboLine();
});

const product_line = computed(() => {
  return Category.getLine;
});

const ItemsList = computed(() => {
  return Category.getItemsDetail;
});

const ItemsById = computed(() => {
  return Category.getItemsById;
});
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap"
    >
      <Button
        variant="primary"
        class="mr-2 shadow-md"
        @click="
          () => {
            setStaticBackdropModalPreview(true);
          }
        "
      >
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
          <FormInput
            type="text"
            class="w-56 pr-10 !box"
            placeholder="Search..."
          />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
          />
        </div>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap"> Code </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Name </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Type </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Comments </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Status
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr
            v-for="items in ItemsList"
            :key="items.lin_code"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a href="" class="font-medium whitespace-nowrap">
                {{ items.lin_code }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                Tags: {{ items.lin_name }}
              </div>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ items.lin_name }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ items.parent }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ items.remark }}
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div
                :class="[
                  'flex items-center justify-center',
                  { 'text-success': items.active },
                  { 'text-danger': !items.active },
                ]"
              >
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ items.active ? "Active" : "Inactive" }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
            >
              <div class="flex items-center justify-center">
                <a
                  class="flex items-center mr-3"
                  href=""
                  @click="
                    (event) => {
                      event.preventDefault();
                      view_edit(items.lin_code);
                    }
                  "
                >
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
    <Dialog
      staticBackdrop
      :open="staticBackdropModalPreview"
      @close="
        () => {
          setStaticBackdropModalPreview(false);
        }
      "
    >
      <Dialog.Panel class="px-5 py-10">
        <div class="text-center">
          <Preview class="mt-5 intro-y box">
            <div class="p-5">
              <Preview.Panel>
                <!-- BEGIN: Modal Content -->
                <Dialog
                  staticBackdrop
                  :open="staticBackdropModalPreview"
                  @close="
                    () => {
                      setStaticBackdropModalPreview(false);
                    }
                  "
                >
                  <Dialog.Panel>
                    <Dialog.Title>
                      <h2 class="mr-auto text-base font-medium">
                        Register Items
                      </h2>

                      <FormSwitch class="mt-2">
                        <FormSwitch.Input
                          name="active"
                          id="checkbox-1"
                          v-model="dataFrom.active"
                          type="checkbox"
                        />
                      </FormSwitch>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Name</FormLabel>
                        <FormInput
                          id="name"
                          name="name"
                          type="text"
                          placeholder="category name"
                          v-model="dataFrom.lin_name"
                          :error="$v.lin_name.$error"
                          :class="{
                            'border-danger': $v.lin_name.$error,
                          }"
                        />
                        <template v-if="$v.lin_name.$errors">
                          <div
                            v-for="(error, index) in $v.lin_name.$errors"
                            :key="index"
                            class="mt-2 text-danger"
                          >
                            {{ error.$message }}
                          </div>
                        </template>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Type</FormLabel>
                        <TomSelect
                          name="cboLine"
                          v-model="cboLine"
                          :value="cboLine"
                          :error="$v.parent_id.$error"
                          :class="{ 'border-danger': $v.parent_id.$error }"
                        >
                          <option
                            v-for="items in product_line"
                            :value="items.id"
                            :key="items.id"
                          >
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-5"> Comment </FormLabel>
                        <FormTextarea
                          id="validation-form-6"
                          name="remark"
                          v-model="dataFrom.remark"
                          placeholder="Type your comments"
                        >
                        </FormTextarea>
                      </div>
                    </Dialog.Description>
                    <Dialog.Footer>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        @click="
                          () => {
                            setStaticBackdropModalPreview(false);
                          }
                        "
                        class="w-20 mr-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        name="btnOk"
                        variant="primary"
                        type="button"
                        class="w-20"
                        ref="{sendButtonRef}"
                        :disable="$v.$invalid"
                        @click="create_category()"
                      >
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
