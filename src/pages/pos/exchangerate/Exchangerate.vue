<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, watch, onMounted, provide } from "vue";
import TomSelect from "../../../base-components/TomSelect";
import Button from "../../../base-components/Button";

import { FormInput, FormLabel } from "../../../base-components/Form";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";

import {
  vat,
  base_exchange,
  bookingform,
} from "../../../models/pos/Exchangerates";

import { useVuelidate } from "@vuelidate/core";
import { useExchangeStore } from "../../../stores/pos/Exchangerates";
import Toastify from "toastify-js";
import { Dialog, Menu } from "../../../base-components/Headless";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";
import { useMessageStore } from "../../../stores/pos/POS_Messages";

const Exchange = useExchangeStore();
const message = useMessageStore();

const dataForm = reactive<base_exchange>({} as base_exchange);
const dataFormCurrency = reactive<base_exchange>({} as base_exchange);
const dataVAT = reactive<vat>({} as vat);

const cboCurrency = ref("0");
const cboExisting = ref(false);
const sendButtonRef = ref(null);

const message_alert = ref("");
const message_status = ref("");

const arr_currency = reactive<bookingform[]>([]);

// Dialog
const staticBackdropModalPreview = ref(false);
const setStaticBackdropModalPreview = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};

// Dialog VAT

const staticBackdropModalVAT = ref(false);
const setStaticBackdropModalVAT = (value: boolean) => {
  staticBackdropModalVAT.value = value;
};

// Basic sticky notification
const basicStickyNotification = ref<NotificationElement>();
const basicStickyNotificationToggle = () => {
  // Show notification
  basicStickyNotification.value?.showToast();
};
provide("bind[basicStickyNotification]", (el: NotificationElement) => {
  basicStickyNotification.value = el;
});

onMounted(async () => {
  resetForm();
  resetVAT();
  await Exchange.Base_currency_exist();
  await Exchange.ComboCurrency();
  await Exchange.ItemsList();
  await Exchange.list_VAT();

  console.log(list_vat.value);

  if (list_base_curr_exist.value.length > 0) {
    cboExisting.value = true;
    dataForm.amount = list_base_curr_exist.value[0].amount;
    dataForm.sysdoc = list_base_curr_exist.value[0].sysdoc;
    cboCurrency.value = list_base_curr_exist.value[0].currency_code;
  }
  if (list_vat.value.length>0){
    dataVAT.amount = list_vat.value[0].amount;
    console.log(dataVAT.amount);
  }
});

const list_vat = computed(() => {
  return Exchange.getVAT;
});
const list_base_curr_exist = computed(() => {
  return Exchange.get_base_curr_exist;
});

const list_base_currency = computed(() => {
  return Exchange.getcombo_currency;
});

const sub_currency = computed(() => {
  return Exchange.get_sub_currency;
});

const list_currency = computed(() => {
  return Exchange.getItemsDetail;
});

watch(cboCurrency, async () => {
  dataForm.currency_code = cboCurrency.value;

  if (dataForm.currency_code != null) {
    await Exchange.subCurrency(dataForm.currency_code);
    arr_currency.splice(0);

    sub_currency.value.forEach((id) => {
      arr_currency.push({
        sysdoc: id.sysdoc,
        currency_code: id.currency_code,
        currency: id.currency,
        amount: id.amount,
      });
    });
  }
});

function resetForm() {
  $v.value.$reset();
  dataForm.status = "i";
}
function resetVAT() {
  $v_vat.value.$reset();
  dataVAT.status = "i";
  dataVAT.amount = 0;
}

const rules = computed(() => {
  return {
    currency_code: {
      required: helpers.withMessage("Base currency is required", required),
      minLength: minLength(1),
    },
  };
});

const rules_vat = computed(() => {
  return {
    amount: {
      required: helpers.withMessage("VAT amount is required", required),
      minLength: minLength(1),
    },
  };
});

const $v_vat = useVuelidate(rules_vat, dataVAT, { $autoDirty: true });
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create() {
  $v.value.$touch();
  if ($v.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await Exchange.create_base_currency(dataForm);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }
      await Exchange.Base_currency_exist();
      if (list_base_curr_exist.value[0].sysdoc != "") {
        dataForm.sysdoc = list_base_curr_exist.value[0].sysdoc;
        for (let i = 0; i < arr_currency.length; i++) {
          dataFormCurrency.status = "i";
          dataFormCurrency.currency_code = arr_currency[i].currency_code;
          dataFormCurrency.amount = arr_currency[i].amount;
          dataFormCurrency.sysdoc = list_base_curr_exist.value[0].sysdoc;
          await Exchange.create_exchange_rates(dataFormCurrency);
        }
      }

      setStaticBackdropModalPreview(false);
      resetForm();
      await Exchange.Base_currency_exist();
      await Exchange.ItemsList();
    }
  }
}

async function create_vat() {
  $v_vat.value.$touch();

  if ($v_vat.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await Exchange.create_vat(dataVAT);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }
      basicStickyNotificationToggle();
      setStaticBackdropModalVAT(false);
      $v_vat.value.$reset();

    }
  }
}

async function isnumber(evt: KeyboardEvent) {
  const keysAllowed: string[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
  ];
  const keyPressed: string = evt.key;
  if (!keysAllowed.includes(keyPressed)) {
    evt.preventDefault();
  }
}
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
          <Menu.Item
            @click="
              () => {
                setStaticBackdropModalVAT(true);
              }
            "
          >
            <Lucide icon="FileText" class="w-4 h-4 mr-2" />Add VAT
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <Table class="border-spacing-y-[10px] border-separate -mt-2">
        <Table.Thead>
          <Table.Tr>
            <Table.Th class="border-b-0 whitespace-nowrap">
              Base Currency
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Currency </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap">
              Exchangerates
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Date
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr
            v-for="list in list_currency"
            :key="list.currency_code"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.base_currency }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                Id:{{ list.base_sysdoc }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.currency }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.amount }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.input_date }}
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
                        Exchange rate
                      </h2>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1"
                          >Base Currency</FormLabel
                        >
                        <TomSelect
                          name="cboCurrency"
                          v-model="cboCurrency"
                          :error="$v.currency_code.$error"
                          :disabled="cboExisting"
                          class="focus-within:text-green-600"
                        >
                          <option
                            v-for="items in list_base_currency"
                            :value="items.id"
                            :key="items.id"
                          >
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1"
                          >Value Exchange</FormLabel
                        >
                        <FormInput
                          name="exchange"
                          type="text"
                          :disabled="cboExisting"
                          v-model="dataForm.amount"
                          @keypress="isnumber($event)"
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <Table
                          class="border-spacing-y-[10px] border-separate -mt-2"
                        >
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th class="border-b-0 whitespace-nowrap">
                                Currency
                              </Table.Th>
                              <Table.Th class="border-b-0 whitespace-nowrap">
                                Value
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>

                          <Table.Tbody>
                            <Table.Tr
                              v-for="list in arr_currency"
                              :key="list.currency_code"
                              class="intro-x"
                            >
                              <Table.Td
                                name="currency_code[]"
                                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                              >
                                {{ list.currency }}
                              </Table.Td>

                              <Table.Td
                                class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                              >
                                <FormInput
                                  name="amount"
                                  type="number"
                                  :value="list.amount"
                                  v-model="list.amount"
                                  @keypress="isnumber($event)"
                                />
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
                        name="btnOk"
                        variant="primary"
                        type="button"
                        class="w-20"
                        ref="{sendButtonRef}"
                        :disable="$v.$invalid"
                        @click="create()"
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

    <!-- BEGIN: Modal Content -->
    <Dialog
      staticBackdrop
      :open="staticBackdropModalVAT"
      @close="
        () => {
          setStaticBackdropModalVAT(false);
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
                  :open="staticBackdropModalVAT"
                  @close="
                    () => {
                      setStaticBackdropModalVAT(false);
                    }
                  "
                >
                  <Dialog.Panel>
                    <Dialog.Title>
                      <h2 class="mr-auto text-base font-medium">
                        Register VAT
                      </h2>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">VAT %</FormLabel>
                        <FormInput
                          name="txtvat"
                          type="text"
                          v-model="dataVAT.amount"
                          @keypress="isnumber($event)"
                        />
                      </div>
                    </Dialog.Description>

                    <Dialog.Footer>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        @click="
                          () => {
                            setStaticBackdropModalVAT(false);
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
                        :disable="$v_vat.$invalid"
                        @click="create_vat"
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
</template>
