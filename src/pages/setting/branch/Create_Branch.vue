<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, onMounted } from "vue";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../../base-components/Form";
import TomSelect from "../../../base-components/TomSelect";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Branch } from "../../../models/admin/Branch";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { useVuelidate } from "@vuelidate/core";

import { useBranchStore } from "../../../stores/admin/Branch";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

const Branch = useBranchStore();
const dataBranch = reactive<Branch>({} as Branch);
const sendButtonRef = ref(null);
const staticBackdropModalPreview = ref(false);
const setStaticBackdropModalPreview = (value: boolean) => {
  resetForm();
  $v.value.$reset();
  staticBackdropModalPreview.value = value;
};

const setUpdateModalPreview = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};

function resetForm() {
  dataBranch.branch_code = "";
  dataBranch.branch_name = "";
  dataBranch.short_name = "";
  dataBranch.slogan = "";
  dataBranch.phone = "";
  dataBranch.address = "";
  dataBranch.comments = "";
  dataBranch.system_id = "";
  dataBranch.active = true;
  dataBranch.status = "i";
}

async function create_branch() {
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
    var response = await Branch.create_branch(dataBranch);
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
      await Branch.getAllBranch();
      resetForm();
    }
  }
}

const rules = computed(() => {
  return {
    branch_name: {
      required: helpers.withMessage("Branch name is required", required),
      minLength: minLength(2),
    },
    short_name: {
      required: helpers.withMessage("Short name is required", required),
      minLength: minLength(3),
    },
    slogan: {
      required: helpers.withMessage("Slogan is required", required),
      minLength: minLength(3),
    },
    phone: {
      required: helpers.withMessage("Phone is required", required),
      minLength: minLength(3),
    },
    address: {
      required: helpers.withMessage("address is required", required),
    },
  };
});

const $v = useVuelidate(rules, dataBranch, { $autoDirty: true });

async function loaddata(branch_code: string) {
  await Branch.getBranchById(branch_code);

  dataBranch.status = "u";

  dataBranch.branch_code = BranchById.value[0]["branch_code"] as string;
  dataBranch.branch_name = BranchById.value[0]["branch_name"];
  dataBranch.short_name = BranchById.value[0]["short_name"];
  dataBranch.slogan = BranchById.value[0]["slogan"];
  dataBranch.phone = BranchById.value[0]["phone"];
  dataBranch.address = BranchById.value[0]["address"];
  dataBranch.comments = BranchById.value[0]["comments"];

  dataBranch.active = dataBranch.active = BranchById.value[0].active
    ? true
    : false;

  setUpdateModalPreview(true);
}

onMounted(async () => {
  dataBranch.active = true;
  await Branch.getAllBranch();
  await Branch.getComboProvince();
});

const BranchById = computed(() => {
  return Branch.getBranchDetail;
});

const provinces = computed(() => {
  return Branch.getProvince;
});

const BranchDetail = computed(() => {
  return Branch.getBranch;
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
            <Table.Th class="border-b-0 whitespace-nowrap">
              Branch name
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap">
              Branch Short
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Phone </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              STATUS
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              ACTIONS
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr
            v-for="branch in BranchDetail"
            :key="branch.branch_code"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a href="" class="font-medium whitespace-nowrap">
                {{ branch.branch_name }}
              </a>

              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                Tags: {{ branch.branch_code }}-{{ branch.slogan }}
              </div>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ branch.short_name }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a class="flex items-center mr-3 text-slate-500" href="#">
                <Lucide icon="ExternalLink" class="w-4 h-4 mr-2" />
                /phone/{{ branch.phone }}
              </a>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div
                :class="[
                  'flex items-center justify-center',
                  { 'text-success': branch.active },
                  { 'text-danger': !branch.active },
                ]"
              >
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ branch.active ? "Active" : "Inactive" }}
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
                      loaddata(branch.branch_code);
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
                        Register Branch
                      </h2>

                      <FormSwitch class="mt-2">
                        <FormSwitch.Input
                          name="active"
                          id="checkbox-1"
                          v-model="dataBranch.active"
                          type="checkbox"
                        />
                      </FormSwitch>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1"
                          >Branch Name</FormLabel
                        >
                        <FormInput
                          id="name"
                          name="name"
                          type="text"
                          placeholder="branch name"
                          v-model="dataBranch.branch_name"
                          :error="$v.branch_name.$error"
                          :class="{
                            'border-danger': $v.branch_name.$error,
                          }"
                        />
                        <template v-if="$v.branch_name.$errors">
                          <div
                            v-for="(error, index) in $v.branch_name.$errors"
                            :key="index"
                            class="mt-2 text-danger"
                          >
                            {{ error.$message }}
                          </div>
                        </template>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Short Name</FormLabel>
                        <FormInput
                          id="short_name"
                          name="short_name"
                          type="text"
                          placeholder="short name"
                          v-model="dataBranch.short_name"
                          :error="$v.short_name.$error"
                          :class="{
                            'border-danger': $v.short_name.$error,
                          }"
                        />
                        <template v-if="$v.short_name.$errors">
                          <div
                            v-for="(error, index) in $v.short_name.$errors"
                            :key="index"
                            class="mt-2 text-danger"
                          >
                            {{ error.$message }}
                          </div>
                        </template>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3"> Slogan </FormLabel>
                        <FormInput
                          id="slogan"
                          name="slogan"
                          type="text"
                          placeholder="slogan"
                          v-model="dataBranch.slogan"
                          :error="$v.slogan.$error"
                          :class="{
                            'border-danger': $v.slogan.$error,
                          }"
                        />
                        <template v-if="$v.slogan.$errors">
                          <div
                            v-for="(error, index) in $v.slogan.$errors"
                            :key="index"
                            class="mt-2 text-danger"
                          >
                            {{ error.$message }}
                          </div>
                        </template>
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"> Phone </FormLabel>

                        <FormInput
                          id="phone"
                          name="phone"
                          type="text"
                          placeholder="phone"
                          v-model="dataBranch.phone"
                          :error="$v.phone.$error"
                          :class="{
                            'border-danger': $v.phone.$error,
                          }"
                        />
                        <template v-if="$v.phone.$errors">
                          <div
                            v-for="(error, index) in $v.phone.$errors"
                            :key="index"
                            class="mt-2 text-danger"
                          >
                            {{ error.$message }}
                          </div>
                        </template>
                      </div>
                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-6">Address</FormLabel>
                        <TomSelect
                          name="address"
                          v-model="dataBranch.address"
                          :error="$v.address.$error"
                          :class="{ 'border-danger': $v.address.$error }"
                        >
                          <option
                            v-for="items in provinces"
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
                          name="comments"
                          v-model="dataBranch.comments"
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
                        @click="create_branch()"
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
