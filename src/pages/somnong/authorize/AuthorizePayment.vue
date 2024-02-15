<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, onMounted } from "vue";
import Button from "../../../base-components/Button";
import { FormInput, 
  FormLabel, 
  FormTextarea,
} from "../../../base-components/Form";

import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { payment,PaymentFile } from "../../../models/somnong/collect_payment";

import { useAuthPyamentStore} from "../../../stores/somnong/auth_payment";

import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";
import { Dialog } from "../../../base-components/Headless";

const dataForm = reactive<payment>({} as payment);
const Auth = useAuthPyamentStore();
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
  await Auth.una_somnong_payment();
});

const una_somnong_payment = computed(() => {
  return Auth.getItems;
});

const una_somnong_view = computed(() => {
  return Auth.getItemView;
});

async function una_somnong_payment_view(id: string) {
  await Auth.ItemsById(id);

  if (una_somnong_view.value.length > 0) {
    dataForm.status = "auth_so_payments";
    dataForm.payment_id = una_somnong_view.value[0]["payment_id"] as string;
    dataForm.title = una_somnong_view.value[0]["title"] as string;
    dataForm.currency = una_somnong_view.value[0]["currency"] as string;
    dataForm.tran_type = una_somnong_view.value[0]["tran_type"] as string;
    dataForm.remark = una_somnong_view.value[0]["remark"] as string;
    dataForm.amount = una_somnong_view.value[0]["amount"] as number;

    
    setStaticBackdropModalPreview(true);
  }
}

function resetForm() {
  dataForm.branch_code = "";
  dataForm.amount = 0;
  dataForm.currency = "";
  dataForm.currency_code = "";
  dataForm.ref_exchange = "";
  dataForm.is_update = true;
  dataForm.status = "i";

  $v.value.$reset;
  dataForm.status = "auth_so_payment";

}



const rules = computed(() => {
  return {
    payment_id: {
      required: helpers.withMessage(
        "Please verify point of sale code",
        required
      ),
      minLength: minLength(1),
    },
  };
});
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function confirm_auth_pos() {
  setAuthModalPreview(true);
}
async function confirm_reject_pos() {
  setDeleteModalPreview(true);
}
async function auth_quote() {
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
    console.log(dataForm);
    var response = await Auth.auth_somnong_payments(dataForm);
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

      await Auth.una_somnong_payment();
      setStaticBackdropModalPreview(false);
      setAuthModalPreview(false);
      resetForm();
    }
  }
}
async function reject_quote() {
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
    dataForm.status = "reject_so_payment";
    var response = await Auth.reject_somnong_payments(dataForm);
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

      await Auth.una_somnong_payment();
      setStaticBackdropModalPreview(false);
      setAuthModalPreview(false);
      setDeleteModalPreview(false);
      resetForm();
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Data List -->
    <div
      class="col-span-12 overflow-auto intro-y lg:overflow-visible"
      v-if="una_somnong_payment.length > 0"
    >
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap"> Payment ID </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Tittle </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Amount </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Remark </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Inputter </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr
            v-for="list in una_somnong_payment"
            :key="list.payment_id"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.title }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                id: {{ list.payment_id }}
              </div>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.title }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.amount }}
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.remark }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.inputter }}
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
                      una_somnong_payment_view(list.payment_id);
                    }
                  "
                >
                  <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" />
                  Review
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
            Authorize quotation {{ dataForm.payment_id }}
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
                auth_quote();
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
            Reject payment trasaction {{ dataForm.payment_id }}
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
                reject_quote();
              }
            "
          >
            Ok
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->

    <!-- BEGIN: Modal Booking Content -->
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
                        Payment info
                        {{
                          dataForm.payment_id ? " : " + dataForm.payment_id : ""
                        }}
                      </h2>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-1">Title</FormLabel>
                        <FormInput
                          :value="dataForm.title"
                          type="text"
                          :disabled=true
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Amount</FormLabel>
                          <FormInput
                          :value="dataForm.currency +' '+ dataForm.amount"
                          type="text"
                          :disabled=true
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4">Type</FormLabel>

                        <FormInput
                          :value="dataForm.tran_type"
                          type="text"
                          :disabled=true
                        />
                      </div>


                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="remark"> Remark </FormLabel>
                        <FormTextarea
                          :value="dataForm.remark"
                          :disabled=true
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
                        class="w-20 mr-1"
                        variant="outline-danger"
                        type="button"
                        ref="{sendButtonRef}"
                        @click="confirm_reject_pos()"
                      >
                        Reject
                      </Button>

                      <Button
                        variant="primary"
                        type="button"
                        class="w-20"
                        ref="{sendButtonRef}"
                        @click="confirm_auth_pos()"
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
    <!-- END: Modal Booking Content -->

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
