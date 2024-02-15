<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";
import Button from "../../../base-components/Button";
import { FormInput, FormLabel } from "../../../base-components/Form";

import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { CountStock, CountStockDetails } from "../../../models/pos/CountStock";
import { useAuthCountStockStore } from "../../../stores/pos/AuthCountStock";

import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";
import { Dialog, Menu } from "../../../base-components/Headless";

const chatBox = ref(false);
const setChatBox = (value: boolean) => {
  chatBox.value = value;
};
const showChatBox = () => {
  setChatBox(!chatBox.value);
};

const dataForm = reactive<CountStock>({} as CountStock);
const Stock = useAuthCountStockStore();
const sendButtonRef = ref(null);
const deleteButtonRef = ref(null);
const AuthButtonRef = ref(null);

const staticBackdropModalPreview = ref(false);
const setStaticBackdropModalPreview = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};

const deleteModalPreview = ref(false);
const setDeleteModalPreview = (value: boolean) => {
  deleteModalPreview.value = value;
};

const authModalPreview = ref(false);
const setAuthModalPreview = (value: boolean) => {
  authModalPreview.value = value;
};

onMounted(async () => {
  await Stock.una_count_stock();
});

const una_transfer = computed(() => {
  return Stock.getItems;
});

const una_count_stock = computed(() => {
  return Stock.getItemView;
});

const una_count_stock_details = computed(() => {
  return Stock.getItemsDetail;
});

async function una_po_view(id: string) {
  await Stock.view_una_count_stock(id);
  await Stock.view_una_count_stock_details(id);

  dataForm.status = "auth_count_stock";
  dataForm.tran_code = una_count_stock.value[0].tran_code;
  dataForm.stock_name = una_count_stock.value[0].stock_name;
  dataForm.stc_code = una_count_stock.value[0].stc_code;
  dataForm.inputter = una_count_stock.value[0].inputter;

  console.log(una_count_stock.value);
  console.log(una_count_stock_details.value);

  setStaticBackdropModalPreview(true);
}

function resetForm() {
  dataForm.tran_code = "";
  dataForm.stc_code = "";
  dataForm.remark = "";
  $v.value.$reset();
  dataForm.status = "auth_count_stock";
}

const rules = computed(() => {
  return {
    tran_code: {
      required: helpers.withMessage(
        "Please verify transfer transaction ",
        required
      ),
      minLength: minLength(1),
    },
  };
});
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function confirm_auth() {
  setAuthModalPreview(true);
}
async function confirm_reject_transfer() {
  setDeleteModalPreview(true);
}
async function auth_transactions() {
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
    var response = await Stock.auth_count_stock(dataForm);
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
      await Stock.una_count_stock();
      setStaticBackdropModalPreview(false);
      setAuthModalPreview(false);

      resetForm();
      $v.value.$reset();
    }
  }
}

async function reject_transfer() {
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
    dataForm.status = "reject_count_stock";
    var response = await Stock.reject_count_stock(dataForm);
    if (response) {
      const failedEl = document
        .querySelectorAll("#reject-notification-content")[0]
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
      await Stock.una_count_stock();
      setStaticBackdropModalPreview(false);
      setAuthModalPreview(false);
      setDeleteModalPreview(false);

      resetForm();
      $v.value.$reset();
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Data List -->
    <div
      class="col-span-12 overflow-auto intro-y lg:overflow-visible"
      v-if="una_transfer.length > 0"
    >
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap">
              Count Stock
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Inputter </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap">
              InputDate
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr
            v-for="list in una_transfer"
            :key="list.tran_code"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.stock_name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                ID: {{ list.tran_code }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.inputter }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.input_date }}
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
                      una_po_view(list.tran_code);
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

    <div
      v-else
      class="col-span-12 overflow-auto intro-y lg:overflow-visible"
      role="alert"
    >
      <div class="flex">
        <div class="py-1">
          <svg
            class="fill-current h-6 w-6 text-teal-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
            />
          </svg>
        </div>
        <div>
          <p class="font-bold">No record display</p>
          <p class="text-sm">Make sure you already booking.</p>
        </div>
      </div>
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
                        Authorize Count Stock
                      </h2>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Code</FormLabel>
                        <FormInput
                          :value="dataForm.tran_code"
                          v-model="dataForm.tran_code"
                          type="text"
                          :disabled="true"
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Stock</FormLabel>
                        <FormInput
                          :value="dataForm.stock_name"
                          v-model="dataForm.stock_name"
                          type="text"
                          :disabled="true"
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <Table
                          class="border-spacing-y-[10px] border-separate -mt-2"
                        >
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th class="border-b-0 whitespace-nowrap">
                                Items
                              </Table.Th>
                              <Table.Th class="border-b-0 whitespace-nowrap">
                                Qty
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>

                          <Table.Tbody>
                            <Table.Tr
                              v-for="list in una_count_stock_details"
                              :key="list.tran_code"
                              class="intro-x"
                            >
                              <Table.Td
                                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                              >
                                {{ list.pro_name }}
                              </Table.Td>

                              <Table.Td
                                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                              >
                                {{ list.qty }}
                              </Table.Td>
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
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
                        class="w-20 mr-1"
                        variant="outline-danger"
                        type="button"
                        ref="{sendButtonRef}"
                        @click="confirm_reject_transfer()"
                      >
                        Reject
                      </Button>

                      <Button
                        variant="primary"
                        type="button"
                        class="w-20"
                        ref="{sendButtonRef}"
                        @click="confirm_auth()"
                      >
                        Authorize
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

    <!-- BEGIN: Modal Contxent -->
    <Dialog
      :open="authModalPreview"
      @close="
        () => {
          setAuthModalPreview(false);
        }
      "
      :initialFocus="AuthButtonRef"
    >
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide
            icon="CheckCircle"
            class="w-16 h-16 mx-auto mt-3 text-success"
          />
          <div class="mt-5 text-3xl">Are you sure ?</div>
          <div class="mt-2 text-slate-500">
            Authorize Count Stock {{ dataForm.tran_code }}
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            type="button"
            variant="outline-secondary"
            @click="
              () => {
                setAuthModalPreview(false);
              }
            "
            class="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            class="w-24"
            ref="{deleteButtonRef}"
            @click="
              () => {
                auth_transactions();
              }
            "
          >
            Ok
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->

    <!-- BEGIN: Reject Modal Contxent -->
    <Dialog
      :open="deleteModalPreview"
      @close="
        () => {
          setDeleteModalPreview(false);
        }
      "
      :initialFocus="deleteButtonRef"
    >
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Reject Count stock {{ dataForm.tran_code }}
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            type="button"
            variant="outline-secondary"
            @click="
              () => {
                setDeleteModalPreview(false);
              }
            "
            class="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            class="w-24"
            ref="{deleteButtonRef}"
            @click="
              () => {
                reject_transfer();
              }
            "
          >
            Ok
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->

    <!-- BEGIN: Success Notification Content -->
    <Notification id="success-notification-content" class="flex hidden">
      <Lucide icon="CheckCircle" class="text-success" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Trasaction has been authorized!</div>
      </div>
    </Notification>
    <!-- END: Success Notification Content -->

    <!-- BEGIN: Success Notification Content -->
    <Notification id="reject-notification-content" class="flex hidden">
      <Lucide icon="CheckCircle" class="text-success" />
      <div class="ml-4 mr-4">
        <div class="font-medium">Trasaction has been rejected!</div>
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

