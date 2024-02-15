<script setup lang="ts">
import _ from "lodash";
import { ref, onMounted, watch, reactive, computed } from "vue";
import Button from "../../../base-components/Button";

import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import TomSelect from "../../../base-components/TomSelect";
import Lucide from "../../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../../base-components/Headless";

import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { usePurchaseOrderStore } from "../../../stores/pos/PurchaseOrder";
import {
  PurchaseOrder,
  PurchaseOrderDetail,
} from "../../../models/pos/PurchaseOrder";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

const purchaseStore = usePurchaseOrderStore();
const dataForm = reactive<PurchaseOrder>({} as PurchaseOrder);
const dataDetail = reactive<PurchaseOrderDetail>({} as PurchaseOrderDetail);
const cboSupply = ref("0");
const cboStock = ref("0");
const search = ref("");

const newOrderModal = ref(false);
const setNewOrderModal = (value: boolean) => {
  Clear();
  newOrderModal.value = value;
};
const addItemModal = ref(false);
const setAddItemModal = (value: boolean) => {
  if (dataDetail.pur_code == "" || dataDetail.pur_code == null) {
    setWarningModalPreview(true);
  } else {
    addItemModal.value = value;
  }
};

const buttonModalPreview = ref(false);
const setButtonModalPreview = (value: boolean) => {
  buttonModalPreview.value = value;
};

const warningModalPreview = ref(false);
const setWarningModalPreview = (value: boolean) => {
  warningModalPreview.value = value;
};

const createTicketRef = ref(null);
const addItemRef = ref(null);

const rules = computed(() => {
  return {
    sup_code: {
      required: helpers.withMessage("Supply name is required", required),
      minLength: minLength(1),
    },
    invoice: {
      required: helpers.withMessage("Invoice is required", required),
      minLength: minLength(3),
    },
  };
});
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

onMounted(async () => {
  await purchaseStore.search_items("all");
  await purchaseStore.SupplyActive();
  await purchaseStore.StockActive();
  await purchaseStore.Una_PO();

  await ref_details("0000");
  resetForm();
  resetFormDetails();
});

watch(cboSupply, () => {
  dataForm.sup_code = cboSupply.value;
});
watch(cboStock, () => {
  dataDetail.sto_code = cboStock.value;
});

const list_supply = computed(() => {
  return purchaseStore.getSupply;
});

const stock = computed(() => {
  return purchaseStore.getStock;
});

const list_una_po = computed(() => {
  return purchaseStore.get_una_po;
});

const list_una_po_by_id = computed(() => {
  return purchaseStore.getItemsById;
});

const items = computed(() => {
  return purchaseStore.getProduct;
});

const itemsDetails = computed(() => {
  return purchaseStore.getOrderDetail;
});

const una_details_sysdoc = computed(() => {
  return purchaseStore.getSysdocDetails;
});

function isEmpty(value: number) {
  return (
    value == null || (typeof value === "string" && String(value).trim().length === 0)
  );
}

function calculator() {
  var vAmount = 0;
  var vDiscount = 0;
  var vDis_amount = 0;
  var vUnitprice = 0;
  var vQty = 0;

  if (!isEmpty(dataDetail.unitprice)) {
    vUnitprice = dataDetail.unitprice;
  } else {
    vUnitprice = 0;
  }

  if (!isEmpty(dataDetail.discount)) {
    vDiscount = dataDetail.discount;
  } else {
    vDiscount = 0;
  }

  if (!isEmpty(dataDetail.qty)) {
    vQty = dataDetail.qty;
  } else {
    vQty = 0;
  }

  vDis_amount = (vUnitprice * vQty * vDiscount) / 100;
  vAmount = vUnitprice * vQty - vDis_amount;
  dataDetail.amount = Number(vAmount.toFixed(3));

}

function resetForm() {
  dataForm.branch_code = "";
  dataForm.pur_code = "";
  dataForm.sup_code = "";
  dataForm.sup_name = "";
  dataForm.subtotal = 0;
  dataForm.disamount = 0;
  dataForm.invoice = "";
  dataForm.inputter = "";
  dataForm.remark = "";

  $v.value.$reset();
  dataForm.status = "i";
}

function resetFormDetails() {
  dataDetail.status = "i";
  dataDetail.sto_code = "";
  dataDetail.pro_code = "";
  dataDetail.unitprice = 0;
  dataDetail.discount = 0;
  dataDetail.qty = 1;
  dataDetail.amount = 0;
  dataDetail.remark = "";

  cboStock.value = "";
  $v_isok.value.$reset();
}

async function createPurchaseOrder() {
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
    var response = await purchaseStore.create_po(dataForm);

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
      await purchaseStore.Una_PO();
      setNewOrderModal(false);
      resetForm();
      $v.value.$reset();
    }
  }
}

async function ref_invoice(id: string) {
  await purchaseStore.una_po_by_id(id);
  dataForm.status = "cm";
  if (list_una_po_by_id.value.length > 0) {
    dataForm.pur_code = list_una_po_by_id.value[0].pur_code;
    dataForm.sup_code = list_una_po_by_id.value[0].sup_code;
    dataForm.sup_name = list_una_po_by_id.value[0].sup_name;
    dataForm.invoice = list_una_po_by_id.value[0].invoice;
    dataForm.subtotal = list_una_po_by_id.value[0].subtotal;
    dataForm.disamount = list_una_po_by_id.value[0].disamount;

    dataForm.input_date = list_una_po_by_id.value[0].input_date;

    dataDetail.status = "i";
    dataDetail.pur_code = list_una_po_by_id.value[0].pur_code;
    
    ref_details(dataDetail.pur_code as string);
  }
}

async function search_items() {
  if (search.value == "" || search.value == null) {
    await purchaseStore.search_items("all");
  } else {
    await purchaseStore.search_items(search.value);
  }
}

// form Details

async function set_pro_code(id: string) {
  resetFormDetails();
  dataDetail.pro_code = id;
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

const isOk = computed(() => {
  return {
    sto_code: {
      required: helpers.withMessage("Stock name is required", required),
      minLength: minLength(1),
    },
    unitprice: {
      required: helpers.withMessage("Price is required", required),
      minLength: minLength(1),
    },
    discount: {
      required: helpers.withMessage("Discount is required", required),
      minLength: minLength(1),
    },
    qty: {
      required: helpers.withMessage("Qty is required", required),
      minLength: minLength(1),
    },
  };
});

const $v_isok = useVuelidate(isOk, dataDetail, { $autoDirty: true });

async function createPO_Detail() {
  $v_isok.value.$touch();
  calculator();

  if (dataDetail.pur_code == "" || dataDetail.pur_code == null) {
    setWarningModalPreview(true);
  } else if ($v_isok.value.$invalid) {
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
    var response = await purchaseStore.create_po_details(dataDetail);
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

      await purchaseStore.Una_PO();
      await ref_details(dataDetail.pur_code);

      setNewOrderModal(false);
      setAddItemModal(false);

      resetForm();
      resetFormDetails();
      $v.value.$reset();
      $v_isok.value.$reset();
      ref_invoice(dataDetail.pur_code as string);
    }
  }
}

async function ref_details(id: string) {
  await purchaseStore.una_po_details_id(id);

  if (itemsDetails.value.length > 0) {
    dataDetail.status = "i";
    dataDetail.pur_code = list_una_po_by_id.value[0].pur_code;
    cboStock.value = itemsDetails.value[0]["sto_code"] as string;
    dataDetail.qty = itemsDetails.value[0].qty;
  }
}

async function una_po_sysdoc_details(id: string) {
  await purchaseStore.una_po_details_sysdoc(id);
  dataDetail.status = "i";

  dataDetail.pur_code = una_details_sysdoc.value[0].pur_code;
  dataDetail.pro_code = una_details_sysdoc.value[0].pro_code;
  dataDetail.barcode = una_details_sysdoc.value[0].barcode;
  dataDetail.unitprice = una_details_sysdoc.value[0].unitprice;
  dataDetail.qty = una_details_sysdoc.value[0].qty;
  dataDetail.discount = una_details_sysdoc.value[0].discount;
  dataDetail.disamount = una_details_sysdoc.value[0].disamount;
  dataDetail.amount = una_details_sysdoc.value[0].amount;
  dataDetail.remark = una_details_sysdoc.value[0].remark;
  cboStock.value = una_details_sysdoc.value[0].sto_code;

  calculator();
}

function Clear() {
  resetForm();
  resetFormDetails();

  purchaseStore.$reset();
  purchaseStore.search_items("all");
  purchaseStore.SupplyActive();
  purchaseStore.StockActive();
  purchaseStore.Una_PO();
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Purchase Order</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <Button
          id="btnCreate"
          as="a"
          href="#"
          variant="primary"
          @click="(event: MouseEvent) => {
          event.preventDefault();
          setNewOrderModal(true);
        }"
          class="mr-2 shadow-md"
        >
          New Order
        </Button>
        <Menu class="ml-auto sm:ml-0" v-if="list_una_po.length > 0">
          <Menu.Button :as="Button" class="px-2 !box">
            <span class="flex items-center justify-center w-5 h-5">
              <Lucide icon="ChevronDown" class="w-4 h-4" />
            </span>
          </Menu.Button>

          <Menu.Items>
            <Menu.Item
              v-for="invoice in list_una_po"
              :key="invoice.id"
              @click="
                () => {
                  ref_invoice(invoice.id);
                }
              "
            >
              <Lucide icon="Printer" class="w-4 h-4 mr-2" />
              <span class="truncate">
                {{ invoice.name }}- {{ invoice.id }}
              </span>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
      <!-- BEGIN: Item List -->
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="lg:flex intro-y">
          <div class="relative">
            <FormInput
              type="text"
              v-model="search"
              :value="search"
              @keyup.enter="search_items()"
              class="w-full px-4 py-3 pr-10 lg:w-64 !box"
              placeholder="Search item..."
            />
            <Lucide
              icon="Search"
              class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-slate-500"
            />
          </div>
        </div>
        <div class="grid grid-cols-12 gap-5 mt-5">
          <div
            class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-3 box zoom-in"
            @click="
              (event) => {
                event.preventDefault();
                setAddItemModal(true);
                set_pro_code(item.pro_code);
              }
            "
            v-for="item in items"
            :key="item.pro_code"
          >
            <div class="text-base font-medium">{{ item.pro_name }}</div>
            <div class="text-slate-500">{{ item.barcode }}</div>
          </div>
        </div>
      </div>
      <!-- END: Item List -->

      <!-- BEGIN: Ticket -->
      <Tab.Group class="col-span-12 lg:col-span-4">
        <div class="pr-1 intro-y">
          <div class="p-2 box">
            <Tab.List variant="pills">
              <Tab>
                <Tab.Button as="button" class="w-full py-2">
                  Ticket
                </Tab.Button>
              </Tab>
              <Tab v-if="dataForm.status == 'cm'">
                <Tab.Button as="button" class="w-full py-2">
                  Details
                </Tab.Button>
              </Tab>
            </Tab.List>
          </div>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <div class="p-2 mt-5 box" v-if="itemsDetails.length > 0">
              <a
                v-for="(details, index) in itemsDetails"
                href="#"
                :key="details.sysdoc"
                @click="(event: MouseEvent) => {
                  event.preventDefault();
                  setAddItemModal(true);
                  una_po_sysdoc_details(details.sysdoc);
                }"
                class="flex items-center p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400"
              >
                <div class="max-w-[50%] truncate mr-1">{{ index + 1 }}.</div>
                <div class="text-slate-500">
                  {{ details.pro_name }} - {{ details.stc_name }} =
                  {{ details.qty }}
                </div>
                <div class="ml-auto font-medium">${{ details.amount }}</div>
                <Lucide icon="Edit" class="w-4 h-4 ml-2 text-slate-500" />
              </a>
            </div>
            <!-- When don't have item to show -->

            <div class="p-5 mt-5 box" v-if="itemsDetails.length <= 0">
              <div class="flex">
                <div class="mr-auto">Waitting purchase order</div>
              </div>
            </div>

            <div class="p-5 mt-5 box">
              <div class="flex">
                <div class="mr-auto">Subtotal</div>
                <div class="font-medium">$ {{ dataForm.subtotal }}</div>
              </div>
              <div class="flex mt-4">
                <div class="mr-auto">Discount</div>
                <div class="font-medium text-danger">
                  -$ {{ dataForm.disamount }}
                </div>
              </div>
              <div
                class="flex pt-4 mt-4 border-t border-slate-200/60 dark:border-darkmode-400"
              >
                <div class="mr-auto text-base font-medium">Total Charge</div>
                <div class="text-base font-medium">
                  $ {{ dataForm.subtotal - dataForm.disamount }}
                </div>
              </div>
            </div>
            <div class="flex mt-5">
              <Button
                class="w-32 border-slate-300 dark:border-darkmode-400 text-slate-500"
                @click="(event: MouseEvent) => {
                  event.preventDefault();
                  Clear();
                }"
              >
                Clear Items
              </Button>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div class="p-5 mt-5 box">
              <div
                class="flex items-center pb-5 border-b border-slate-200 dark:border-darkmode-400"
              >
                <div>
                  <div class="text-slate-500">Time</div>
                  <div class="mt-1">{{ dataForm.input_date }}</div>
                </div>
                <Lucide icon="Clock" class="w-4 h-4 ml-auto text-slate-500" />
              </div>
              <div
                class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400"
              >
                <div>
                  <div class="text-slate-500">Supply</div>
                  <div class="mt-1">{{ dataForm.sup_name }}</div>
                </div>
                <Lucide icon="User" class="w-4 h-4 ml-auto text-slate-500" />
              </div>
              <div
                class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400"
              >
                <div>
                  <div class="text-slate-500">Invoice</div>
                  <div class="mt-1">{{ dataForm.invoice }}</div>
                </div>
                <Lucide icon="Users" class="w-4 h-4 ml-auto text-slate-500" />
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <!-- END: Ticket -->
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


    <!-- BEGIN: New Order Modal -->
    <Dialog
      :open="newOrderModal"
      @clsoe="
        () => {
          setNewOrderModal(false);
        }
      "
      :initialFocus="createTicketRef"
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 class="mr-auto text-base font-medium">New Order</h2>
        </Dialog.Title>
        <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <FormLabel htmlFor="pos-form-1">Supply name</FormLabel>
            <TomSelect
              name="cboAddress"
              v-model="cboSupply"
              :value="cboSupply"
              :error="$v.sup_code.$error"
              :class="{ 'border-danger': $v.sup_code.$error }"
            >
              <option
                v-for="items in list_supply"
                :value="items.id"
                :key="items.id"
              >
                {{ items.name }}
              </option>
            </TomSelect>
          </div>
          <div class="col-span-12">
            <FormLabel htmlFor="pos-form-2">Invoice</FormLabel>
            <FormInput
              id="pos-form-2"
              type="text"
              class="flex-1"
              placeholder="Invoice"
              v-model="dataForm.invoice"
              :value="dataForm.invoice"
              :error="$v.invoice.$error"
              :class="{
                'border-danger': $v.invoice.$error,
              }"
            />
          </div>
          <div class="col-span-12">
            <FormLabel htmlFor="pos-form-3"><Ri:art></Ri:art>Remark</FormLabel>
            <FormTextarea
              id="remark"
              placeholder="item remark"
              v-model="dataForm.remark"
              :value="dataForm.remark"
            >
            </FormTextarea>
          </div>
        </Dialog.Description>
        <Dialog.Footer class="text-right">
          <Button
            variant="outline-secondary"
            type="button"
            @click="
              () => {
                setNewOrderModal(false);
              }
            "
            class="w-32 mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            class="w-32"
            ref="createTicketRef"
            :disable="$v.$invalid"
            @click="createPurchaseOrder()"
          >
            Create Ticket
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
    <!-- END: New Order Modal -->
    
    <!-- BEGIN: Add Item Modal -->
    <Dialog
      :open="addItemModal"
      @clsoe="
        () => {
          setAddItemModal(false);
        }
      "
      :initialFocus="addItemRef"
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 class="mr-auto text-base font-medium">
            Ticket : {{ dataDetail.pur_code }}
          </h2>
        </Dialog.Title>
        <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="pos-form-1">Stock </FormLabel>
            <TomSelect
              name="cboStock"
              v-model="cboStock"
              :value="cboStock"
              :error="$v_isok.sto_code.$error"
              :class="{ 'border-danger': $v_isok.sto_code.$error }"
            >
              <option v-for="items in stock" :value="items.id" :key="items.id">
                {{ items.name }}
              </option>
            </TomSelect>
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3"> Price </FormLabel>
            <FormInput
              id="price"
              name="price"
              type="number"
              placeholder="Price"
              v-model="dataDetail.unitprice"
              :value="dataDetail.unitprice"
              @keyup.enter="calculator()"
              @keypress="isnumber($event)"
              :error="$v_isok.unitprice.$error"
              :class="{
                'border-danger': $v_isok.unitprice.$error,
              }"
            />
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3"> Discount </FormLabel>
            <FormInput
              id="discount"
              name="discount"
              type="number"
              placeholder="Discount"
              v-model="dataDetail.discount"
              :value="dataDetail.discount"
              @keyup.enter="calculator()"
              @keypress="isnumber($event)"
              :error="$v_isok.discount.$error"
              :class="{
                'border-danger': $v_isok.discount.$error,
              }"
            />
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3"> Qty </FormLabel>
            <FormInput
              id="qty"
              name="qty"
              type="number"
              placeholder="Discount"
              v-model="dataDetail.qty"
              :value="dataDetail.qty"
              @keyup.enter="calculator()"
              @keypress="isnumber($event)"
              :error="$v_isok.qty.$error"
              :class="{
                'border-danger': $v_isok.qty.$error,
              }"
            />
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3"> Amount </FormLabel>
            <FormInput
              id="qty"
              name="qty"
              type="number"
              :disabled="true"
              placeholder="0.00"
              v-model="dataDetail.amount"
              :value="dataDetail.amount"
            />
          </div>

          <div class="col-span-12">
            <FormLabel htmlFor="pos-form-5">Notes</FormLabel>
            <FormTextarea
              id="pos-form-5"
              placeholder="Item notes"
              v-model="dataDetail.remark"
              :value="dataDetail.remark"
            >
            </FormTextarea>
          </div>
        </Dialog.Description>
        <Dialog.Footer class="text-right">
          <Button
            variant="outline-secondary"
            type="button"
            @click="
              () => {
                setAddItemModal(false);
              }
            "
            class="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            class="w-24"
            ref="addItemRef"
            :disable="$v.$invalid"
            @click="(event: MouseEvent) => {
              event.preventDefault();
              createPO_Detail();
            }"
          >
            Add Item
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Add Item Modal -->

    <!-- BEGIN: Modal Content -->
    <Dialog
      :open="warningModalPreview"
      @close="
        () => {
          setWarningModalPreview(false);
        }
      "
    >
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Invalid Ticket</div>
          <div class="mt-2 text-slate-500">
            Please create your ticket Order first !
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            type="button"
            variant="primary"
            @click="
              () => {
                setWarningModalPreview(false);
              }
            "
            class="w-24"
          >
            Ok
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->
  </div>
</template>
