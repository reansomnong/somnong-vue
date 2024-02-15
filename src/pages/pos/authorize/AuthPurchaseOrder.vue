<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, toRefs, computed, watch, onMounted } from "vue";
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
import { useVuelidate } from "@vuelidate/core";
import { PurchaseOrder } from "../../../models/pos/PurchaseOrder";
import { useAuthPurchaseOrderStore } from "../../../stores/pos/AuthorizePO";

import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";
import { Dialog, Menu } from "../../../base-components/Headless";
import FileIcon from "../../../base-components/FileIcon";

const dataForm = reactive<PurchaseOrder>({} as PurchaseOrder);
const PurchaseOrder = useAuthPurchaseOrderStore();
const sendButtonRef = ref(null);
const msg_status = ref(null);
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
  await PurchaseOrder.una_PurchaseOrder();
});

const una_purchase_order = computed(() => {
  return PurchaseOrder.getItems;
});

const una_purchase_view = computed(() => {
  return PurchaseOrder.getItemView;
});

const una_po_details = computed(() => {
  return PurchaseOrder.getItemsDetail;
});

async function una_po_view(id: string) {
  await PurchaseOrder.view_una_pos(id);
  await PurchaseOrder.view_una_po_details(id);

  dataForm.status = "auth_po";
  dataForm.pur_code = una_purchase_view.value[0].pur_code;
  dataForm.invoice = una_purchase_view.value[0].invoice;
  dataForm.sup_name = una_purchase_view.value[0].sup_name;
  dataForm.subtotal = una_purchase_view.value[0].subtotal;
  dataForm.disamount = una_purchase_view.value[0].disamount;
  dataForm.total = una_purchase_view.value[0].total;

  setStaticBackdropModalPreview(true);
}

function resetForm() {
  dataForm.pur_code = "";
  dataForm.sup_code = "";
  dataForm.sup_name = "";
  dataForm.subtotal = 0;
  dataForm.disamount = 0;
  dataForm.invoice = "";
  dataForm.inputter = "";
  dataForm.remark = "";
  $v.value.$reset();
  dataForm.status = "auth_po";
}

const rules = computed(() => {
  return {
    pur_code: {
      required: helpers.withMessage(
        "Please verify purchase order code",
        required
      ),
      minLength: minLength(1),
    },
  };
});
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function confirm_auth_po() {
  setAuthModalPreview(true);
}
async function confirm_reject_po() {
  setDeleteModalPreview(true);
}
async function auth_purchaseorder() {
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
    var response = await PurchaseOrder.auth_purchaseorder(dataForm);
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
      await PurchaseOrder.una_PurchaseOrder();
      setStaticBackdropModalPreview(false);
      setAuthModalPreview(false);

      resetForm();
      $v.value.$reset();
    }
  }
}

async function reject_purchaseorder() {
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
    dataForm.status = "reject_auth_po";
    var response = await PurchaseOrder.reject_purchaseorder(dataForm);
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
      await PurchaseOrder.una_PurchaseOrder();
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
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible" v-if="una_purchase_order.length > 0">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap"> Supply </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Invoice </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Subtotal </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Discount </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Amount </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap">
              Input Date
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr v-for="list in una_purchase_order" :key="list.pur_code" class="intro-x">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.sup_name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                ID: {{ list.pur_code }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.invoice }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.subtotal }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.disamount }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.total }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.input_date }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
              <div class="flex items-center justify-center">
                <a class="flex items-center mr-3" href="" @click="(event) => {
                    event.preventDefault();
                    una_po_view(list.pur_code);
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

    <div v-else class="col-span-12 overflow-auto intro-y lg:overflow-visible" role="alert">
      <div class="flex">
        <div class="py-1">
          <svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
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
    <Dialog staticBackdrop :open="staticBackdropModalPreview" @close="() => {
        setStaticBackdropModalPreview(false);
      }
      ">
      <Dialog.Panel class="px-5 py-10">
        <div class="text-center">
          <Preview class="mt-5 intro-y box">
            <div class="p-5">
              <Preview.Panel>
                <!-- BEGIN: Modal Content -->
                <Dialog staticBackdrop :open="staticBackdropModalPreview" @close="() => {
                    setStaticBackdropModalPreview(false);
                  }
                  ">
                  <Dialog.Panel>
                    <Dialog.Title>
                      <h2 class="mr-auto text-base font-medium">
                        Authorize Purchase Order
                      </h2>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Invoice</FormLabel>
                        <FormInput :value="dataForm.invoice" type="text" placeholder="invoice" v-model="dataForm.invoice"
                          :disabled="true" />
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-3"> Supply </FormLabel>
                        <FormInput type="text" :value="dataForm.sup_name" placeholder="Supply name"
                          v-model="dataForm.sup_name" :disabled="true" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"> SubTotal </FormLabel>
                        <FormInput type="text" :value="dataForm.subtotal" v-model="dataForm.subtotal" :disabled="true" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"> Discount </FormLabel>
                        <FormInput type="text" :value="dataForm.disamount" v-model="dataForm.disamount"
                          :disabled="true" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"> Total </FormLabel>
                        <FormInput type="text" :value="dataForm.total" v-model="dataForm.total" :disabled="true" />
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <div class="col-span-12 sm:col-span-12">
                          <div class="-mt-3 overflow-auto lg:overflow-visible">
                            <Table striped>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th class="border-b-0 whitespace-nowrap">
                                    Items
                                  </Table.Th>
                                  <Table.Th class="border-b-0 whitespace-nowrap">
                                    Stock
                                  </Table.Th>
                                  <Table.Th class="border-b-0 whitespace-nowrap">
                                    Price
                                  </Table.Th>
                                  <Table.Th class="border-b-0 whitespace-nowrap">
                                    Qty
                                  </Table.Th>
                                  <Table.Th class="border-b-0 whitespace-nowrap">
                                    Amount
                                  </Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                <Table.Tr v-for="list in una_po_details" :key="list.pur_code" class="intro-x">
                                  <Table.Td class="text-left">
                                    {{ list.pro_name }}
                                  </Table.Td>
                                  <Table.Td class="text-left">
                                    {{ list.stc_name }}
                                  </Table.Td>
                                  <Table.Td class="text-left">
                                    ${{ list.unitprice }}
                                  </Table.Td>
                                  <Table.Td class="text-right">
                                    {{ list.qty }}
                                  </Table.Td>
                                  <Table.Td class="text-right">
                                    ${{ list.disamount }}
                                  </Table.Td>
                                </Table.Tr>
                              </Table.Tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Dialog.Description>
                    <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" @click="() => {
                          setStaticBackdropModalPreview(false);
                        }
                        " class="w-20 mr-1">
                        Cancel
                      </Button>

                      <Button class="w-20 mr-1" variant="outline-danger" type="button" ref="{sendButtonRef}"
                        @click="confirm_reject_po()">
                        Reject
                      </Button>

                      <Button variant="primary" type="button" class="w-20" ref="{sendButtonRef}"
                        @click="confirm_auth_po()">
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
    <Dialog :open="authModalPreview" @close="() => {
        setAuthModalPreview(false);
      }
      " :initialFocus="AuthButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
          <div class="mt-5 text-3xl">Are you sure ?</div>
          <div class="mt-2 text-slate-500">
            Authorize purchase order {{ dataForm.pur_code }}
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button type="button" variant="outline-secondary" @click="() => {
              setAuthModalPreview(false);
            }
            " class="w-24 mr-1">
            Cancel
          </Button>
          <Button type="button" variant="primary" class="w-24" ref="{deleteButtonRef}" @click="() => {
              auth_purchaseorder();
            }
            ">
            Ok
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->

    <!-- BEGIN: Reject Modal Contxent -->
    <Dialog :open="deleteModalPreview" @close="() => {
        setDeleteModalPreview(false);
      }
      " :initialFocus="deleteButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Reject purchase order {{ dataForm.pur_code }}
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button type="button" variant="outline-secondary" @click="() => {
              setDeleteModalPreview(false);
            }
            " class="w-24 mr-1">
            Cancel
          </Button>
          <Button type="button" variant="danger" class="w-24" ref="{deleteButtonRef}" @click="() => {
              reject_purchaseorder();
            }
            ">
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

