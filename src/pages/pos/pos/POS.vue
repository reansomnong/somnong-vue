<script setup lang="ts">
import _ from "lodash";
import { ref, onMounted, computed, watch, reactive, provide } from "vue";
import Button from "../../../base-components/Button";
import TomSelect from "../../../base-components/TomSelect";

import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../../base-components/Headless";

// Store Base
import { usePosStore } from "../../../stores/pos/POS";
import { useExchangeStore } from "../../../stores/pos/Exchangerates";
import { Pos, PosDetails, Charges } from "../../../models/pos/POS";

import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers, and } from "@vuelidate/validators";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";
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

const deleteModalPreview = ref(false);
const setDeleteModalPreview = (value: boolean) => {
  deleteModalPreview.value = value;
};

const dataForm = reactive<Pos>({} as Pos);
const dataFormDetail = reactive<PosDetails>({} as PosDetails);
const dataDelete = reactive<PosDetails>({} as PosDetails);
const dataCharge = reactive<Charges>({} as Charges);

const message = useMessageStore();
const POS = usePosStore();
const Exchange = useExchangeStore();

const cboCustomer = ref("0");
const cboStock = ref("0");
const search = ref("");
const message_alert = ref("");
const message_status = ref("");

const newOrderModal = ref(false);
const addItemModal = ref(false);
const charges = ref(false);

const setChargesModal = (value: boolean) => {
  charges.value = value;
};

const setNewOrderModal = (value: boolean) => {
  newOrderModal.value = value;
};

const setAddItemModal = (value: boolean) => {
  if ((dataFormDetail.pos_code == "" || dataFormDetail.pos_code == null) && value == true) {
    setWarningModalPreview(true);
  } else {
    addItemModal.value = value;
  }
};

const warningModalPreview = ref(false);
const setWarningModalPreview = (value: boolean) => {
  warningModalPreview.value = value;
};
const createTicketRef = ref(null);
const addItemRef = ref(null);

onMounted(async () => {
  resetForm();
  resetFormDetails();
  await Exchange.Base_currency_exist();
  if (list_base_curr_exist.value.length <= 0) {
    message_alert.value = "Please register exchange rate !!";
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {

    resetFormDetails();
    await POS.StockActive();
    await POS.combo_una_list();
    await POS.comboCatogories();
    await POS.cboCustomer();
    await POS.ItemsByCategory("All");
  }
});

const charge_amount = computed(() => {
  return POS.getCharges;
});

const stock = computed(() => {
  return POS.getStock;
});

const list_pos_una = computed(() => {
  return POS.getUNACombo;
});

const list_base_curr_exist = computed(() => {
  return Exchange.get_base_curr_exist;
});

const Categories = computed(() => {
  return POS.getCategories;
});

const Customer = computed(() => {
  return POS.getCustomer;
});

const Products = computed(() => {
  return POS.getProduct;
});

const ProductDefault = computed(() => {
  return POS.getProductDefault;
});

const pos_una = computed(() => {
  return POS.getItemsById;
});

const ItemDetails = computed(() => {
  return POS.ItemDetails;
});

const details_sysdoc = computed(() => {
  return POS.getSysdocDetails;
});

watch(cboStock, () => {
  dataFormDetail.sto_code = cboStock.value;
});

watch(cboCustomer, () => {
  dataForm.cus_code = cboCustomer.value;
});

async function load_product_by_category(category_code: string) {
  await POS.ItemsByCategory(category_code);
}

async function search_items() {
  if (search.value == "" || search.value == null) {
    await POS.search_items("all");
  } else {
    await POS.search_items(search.value);
  }
}

async function set_pro_code(id: string) {
  resetFormDetails();
  await POS.ProductById(id);

  if (ProductDefault.value.length > 0) {

    dataFormDetail.pro_code = ProductDefault.value[0].pro_code;
    dataFormDetail.barcode = ProductDefault.value[0].barcode;
    dataFormDetail.unitprice = ProductDefault.value[0].unitprice;
    dataFormDetail.discount = ProductDefault.value[0].discount;
    dataFormDetail.sto_code = ProductDefault.value[0].sto_code;
    cboStock.value = ProductDefault.value[0].sto_code;

    calculator();
  }
}

const rules = computed(() => {
  return {
    cus_code: {
      required: helpers.withMessage("Customer info is required", required),
      minLength: minLength(1),
    },
  };
});

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

const $v_isok = useVuelidate(isOk, dataFormDetail, { $autoDirty: true });
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

function isEmpty(value: number) {
  return (
    value == null ||
    (typeof value === "string" && String(value).trim().length === 0)
  );
}

function resetcharge() {
  dataCharge.ref_exchange = dataForm.ref_exchange;
  dataCharge.return_amount = 0;
  dataCharge.total_charge = dataForm.total_charge;
  dataCharge.charge = 0;
}

function resetForm() {
  dataForm.status = "i";
  dataForm.pos_code = "";
  dataForm.branch_code = "";
  dataForm.cus_code = "";
  dataForm.people_num = "";
  dataForm.table_num = "";
  dataForm.ref_exchange = "";
  dataForm.subtotal = 0;
  dataForm.disamount = 0;
  dataForm.total_amount = 0;
  dataForm.total_charge = 0;

  dataForm.vat = 0;
  dataForm.remark = "";
  dataForm.inputter = "";
  $v.value.$reset();
}

function resetFormDetails() {
  dataFormDetail.status = "i";
  dataFormDetail.sto_code = "";
  dataFormDetail.pro_code = "";
  dataFormDetail.unitprice = 0;
  dataFormDetail.discount = 0;
  dataFormDetail.qty = 1;
  dataFormDetail.amount = 0;
  dataFormDetail.remark = "";

  cboStock.value = "";
  $v_isok.value.$reset();
}

async function delete_sysdoc() {
  if (dataDelete.sysdoc != "") {
    var response = await POS.delete_sysdoc(dataDelete);
    if (response) {
      una_tran_by_id(dataForm.pos_code);
    }
    setDeleteModalPreview(false);
  }
}

async function create_tran() {
  $v.value.$touch();

  if (list_base_curr_exist.value.length <= 0) {
    message_alert.value = "Please register exchange rate !!";
    message_status.value = "error";
    basicStickyNotificationToggle();
    return;
  }
  if ($v.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await POS.create_trans(dataForm);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
        resetForm();

      } else {
        message_alert.value = message.getUpdate;
        await POS.una_tran_by_id(dataForm.pos_code);
      }

      basicStickyNotificationToggle();
      setNewOrderModal(false);
      await POS.combo_una_list();
      $v.value.$reset();
    }
  }
}
// load data
async function una_tran_by_id(invoice: string) {
  await POS.una_tran_by_id(invoice);
  resetFormDetails();

  if (pos_una.value.length > 0) {

    dataForm.status = "u";
    cboCustomer.value = pos_una.value[0].cus_code;
    dataForm.pos_code = pos_una.value[0].pos_code;
    dataForm.cus_code = pos_una.value[0].cus_code;
    dataForm.cus_name = pos_una.value[0].cus_name;
    dataForm.subtotal = pos_una.value[0].subtotal;
    dataForm.disamount = pos_una.value[0].disamount;
    dataForm.vat = pos_una.value[0].vat;
    dataForm.vat_amount = pos_una.value[0].vat_amount;
    dataForm.total_amount = pos_una.value[0].total_amount;
    dataForm.people_num = pos_una.value[0].people_num;
    dataForm.table_num = pos_una.value[0].table_num;
    dataForm.exchange_rate = pos_una.value[0].exchange_rate;
    dataForm.total_charge = pos_una.value[0].total_charge;
    dataForm.symbol = pos_una.value[0].symbol;
    dataForm.remark = pos_una.value[0].remark;
    dataForm.inputter = pos_una.value[0].inputter;
    dataForm.input_date = pos_una.value[0].input_date;
    dataForm.check_payment = pos_una.value[0].check_payment;

    ref_details(dataForm.pos_code);
  }
}

async function create_details() {
  $v_isok.value.$touch();

  if (dataFormDetail.pos_code == "" || dataFormDetail.pos_code == null) {
    setWarningModalPreview(true);
  } else if ($v_isok.value.$invalid) {
    message_alert.value = $v_isok.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await POS.create_details(dataFormDetail);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }

      setAddItemModal(false);
      basicStickyNotificationToggle();
      una_tran_by_id(dataForm.pos_code);

      $v.value.$reset();
      $v_isok.value.$reset();
    }
  }
}

async function ref_details(id: string) {
  await POS.una_details_id(id);
  dataFormDetail.pos_code = id;

  if (ItemDetails.value.length > 0) {

    dataFormDetail.pos_code = ItemDetails.value[0].pos_code;
    dataFormDetail.status = "i";
    dataFormDetail.qty = ItemDetails.value[0].qty;
    calculator();
  }
}


async function charge_trans() {

  cal_charges();
  message_alert.value = message.getCharge;
  basicStickyNotificationToggle();
  setChargesModal(false);
  resetcharge();
  una_tran_by_id(dataForm.pos_code);

}

async function cal_charges() {
  var vCharge = 0;
  var vTotalCharge = 0;
  var vReturn = 0;
  var vExchangeRate = 0;
  var vExchange = 0;

  dataCharge.pos_code = dataForm.pos_code;
  dataCharge.ref_exchange = dataForm.ref_exchange;

  const isValid = Number.isInteger(dataCharge.charge);
  console.log(isValid); // true
  console.log(dataCharge.charge); // true

  var response = await POS.pos_charges(dataCharge);

  if (response) {
    dataCharge.return_amount = charge_amount.value[0].return_amount;
    dataCharge.exchange_amount = charge_amount.value[0].exchange_amount;
  }

}


function calculator() {
  var vAmount = 0;
  var vDiscount = 0;
  var vDis_amount = 0;
  var vUnitprice = 0;
  var vQty = 0;

  if (!isEmpty(dataFormDetail.unitprice)) {
    vUnitprice = dataFormDetail.unitprice;
  } else {
    vUnitprice = 0;
  }

  if (!isEmpty(dataFormDetail.discount)) {
    vDiscount = dataFormDetail.discount;
  } else {
    vDiscount = 0;
  }

  if (!isEmpty(dataFormDetail.qty)) {
    vQty = dataFormDetail.qty;
  } else {
    vQty = 0;
  }
  vDis_amount = (vUnitprice * vQty * vDiscount) / 100;
  vAmount = vUnitprice * vQty - vDis_amount;
  dataFormDetail.amount = Number(vAmount.toFixed(3));
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

// Edit
async function una_pos_sysdoc(id: string) {
  await POS.una_pos_sysdoc(id);

  dataFormDetail.status = "i";
  dataFormDetail.pos_code = details_sysdoc.value[0].pos_code;
  dataFormDetail.pro_code = details_sysdoc.value[0].pro_code;
  dataFormDetail.barcode = details_sysdoc.value[0].barcode;
  dataFormDetail.unitprice = details_sysdoc.value[0].unitprice;
  dataFormDetail.qty = details_sysdoc.value[0].qty;
  dataFormDetail.discount = details_sysdoc.value[0].discount;
  dataFormDetail.disamount = details_sysdoc.value[0].disamount;
  dataFormDetail.amount = details_sysdoc.value[0].amount;
  dataFormDetail.total = details_sysdoc.value[0].total;
  dataFormDetail.remark = details_sysdoc.value[0].remark;
  cboStock.value = details_sysdoc.value[0].sto_code;

  calculator();
}
async function _delete(id: string) {
  dataDelete.status = "d";
  dataDelete.sysdoc = id;
  setDeleteModalPreview(true);
}

async function _clear() {
  resetForm();
  resetFormDetails();
  POS._clear_record();

  cboCustomer.value = '';
  dataForm.status = 'i';
  dataForm.pos_code = "";
}
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Point of Sale 
      <span v-if="dataForm.pos_code">: {{ dataForm.pos_code}} </span>
      <span v-if="dataForm.check_payment" class="font-medium text-danger" > -{{ dataForm.check_payment}} </span>
    </h2>
    <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button as="a" href="#" variant="primary" @click="(event: MouseEvent) => {
          event.preventDefault();
          setNewOrderModal(true);
        }" class="mr-2 shadow-md">
        <span v-if="dataForm.pos_code == ''">
          New Order {{ dataForm.pos_code }}
        </span>
        <span v-else> Updating </span>
      </Button>
      <Menu class="ml-auto sm:ml-0">
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="ChevronDown" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items v-if="list_pos_una.length>0" >
          <Menu.Item v-for="item in list_pos_una" :key="item.id">
            <Lucide icon="Activity" class="w-4 h-4 mr-2" @click="una_tran_by_id(item.id)" />
            <span class="truncate" @click="una_tran_by_id(item.id)">
              {{ item.name }}
            </span>
          </Menu.Item>
        </Menu.Items>
        <Menu.Items v-else>
          <span class="truncate">
              don't have invoice
            </span>
        </Menu.Items>
      </Menu>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
    <!-- BEGIN: Item List -->
    <div class="col-span-12 intro-y lg:col-span-8">
      <div class="lg:flex intro-y">
        <div class="relative">
          <FormInput type="text" v-model="search" value="search" @keyup.enter="search_items()"
            class="w-full px-4 py-3 pr-10 lg:w-64 !box" placeholder="Search item..." />
          <Lucide icon="Search" class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-slate-500" />
        </div>
        <FormSelect class="w-full px-4 py-3 mt-3 ml-auto !box lg:w-auto lg:mt-0">
          <option>Sort By</option>
          <option>A to Z</option>
          <option>Z to A</option>
          <option>Lowest Price</option>
          <option>Highest Price</option>
        </FormSelect>
      </div>
      <div class="grid grid-cols-12 gap-5 mt-5">
        <div class="col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-3 box zoom-in" v-for="cat in Categories"
          :key="cat.id" @click="(event) => {
            event.preventDefault();
            load_product_by_category(cat.id);
          }
            ">
          <div class="text-base font-medium">{{ cat.name }}</div>
          <div class="text-slate-500">{{ cat.id }}</div>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-5 pt-5 mt-5 border-t">
        <a v-for="product in Products" :key="product.pro_code" href="#" @click="(event) => {
          event.preventDefault();
          setAddItemModal(true);
          set_pro_code(product.pro_code);
        }
          " class="block col-span-12 intro-y sm:col-span-4 2xl:col-span-3">
          <div class="relative p-3 rounded-md box zoom-in">
            <div class="flex-none relative block before:block before:w-full before:pt-[100%]">
              <div class="absolute top-0 left-0 w-full h-full image-fit">
                <img alt="None product image" class="rounded-md" :src="product.url" />
              </div>
            </div>
            <div class="block mt-3 font-medium text-center truncate">
              {{ product.pro_name }}
            </div>
          </div>
        </a>
      </div>
    </div>
    <!-- END: Item List -->
    <!-- BEGIN: Ticket -->
    <Tab.Group class="col-span-12 lg:col-span-4">
      <div class="pr-1 intro-y">
        <div class="p-2 box">
          <Tab.List variant="pills">
            <Tab>
              <Tab.Button as="button" class="w-full py-2"> Ticket </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button as="button" class="w-full py-2"> Details </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <div class="p-2 mt-5 box" v-if="ItemDetails.length > 0">
            <a v-for="(item, index) in ItemDetails" href="#" :key="item.sysdoc"
              class="flex items-center p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400">
              <div class="max-w-[60%] truncate mr-1" @click="(event: MouseEvent) => {
                event.preventDefault();
                setAddItemModal(true);
                una_pos_sysdoc(item.sysdoc);
              }">
                {{ item.pro_name }} - {{ item.stc_name }}
              </div>
              <div class="text-slate-400" @click="(event: MouseEvent) => {
                event.preventDefault();
                setAddItemModal(true);
                una_pos_sysdoc(item.sysdoc);
              }">x {{ item.qty }}</div>
              <div class="ml-auto font-medium" @click="(event: MouseEvent) => {
                event.preventDefault();
                setAddItemModal(true);
                una_pos_sysdoc(item.sysdoc);
              }">
                {{ item.symbol }}{{ item.total }}
              </div>

              <Lucide icon="Trash" @click="_delete(item.sysdoc)" class="w-4 h-4 ml-2 text-slate-500" />
            </a>
          </div>

          <div class="p-5 mt-5 box">
            <div class="flex">
              <div class="mr-auto">Subtotal</div>
              <div class="font-medium">
                {{ dataForm.symbol }} {{ dataForm.subtotal }}
              </div>
            </div>
            <div class="flex mt-4">
              <div class="mr-auto">Discount</div>
              <div class="font-medium text-danger">
                {{ dataForm.symbol }} {{ dataForm.disamount }}
              </div>
            </div>
            <div class="flex mt-4" v-if="dataForm.vat > 0">
              <div class="mr-auto">Tax {{ dataForm.vat }}% </div>
              <div class="font-medium"> {{ dataForm.symbol }} {{ dataForm.vat_amount }}</div>
            </div>
            <div class="flex pt-4 mt-4 border-t border-slate-200/60 dark:border-darkmode-400">
              <div class="mr-auto text-base font-medium">Total Charge</div>
              <div class="text-base font-medium">{{ dataForm.symbol }} {{ dataForm.total_charge }} </div>
            </div>
          </div>
          <div class="flex mt-5">
            <Button class="w-32 border-slate-300 dark:border-darkmode-400 text-slate-500" @click="(event: MouseEvent) => {
              event.preventDefault();
              _clear();
            }">
              Clear Items
            </Button>
            <Button variant="primary" :disabled="!dataForm.pos_code ? true : false" class="w-32 ml-auto shadow-md" @click="() => {
              setChargesModal(true);
              resetcharge();
            }">
              Charge
            </Button>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div class="p-5 mt-5 box">
            <div class="flex items-center pb-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">Time</div>
                <div class="mt-1">
                  {{ dataForm.input_date ? dataForm.input_date : "None" }}
                </div>
              </div>
              <Lucide icon="Clock" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">Customer</div>
                <div class="mt-1">
                  {{ dataForm.cus_name ? dataForm.cus_name : "None" }}
                </div>
              </div>
              <Lucide icon="User" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400">
              <div>
                <div class="text-slate-500">People</div>
                <div class="mt-1">{{ dataForm.people_num }}</div>
              </div>
              <Lucide icon="Users" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
            <div class="flex items-center pt-5">
              <div>
                <div class="text-slate-500">Table</div>
                <div class="mt-1">{{ dataForm.table_num }}</div>
              </div>
              <Lucide icon="Mic" class="w-4 h-4 ml-auto text-slate-500" />
            </div>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    <!-- END: Ticket -->
  </div>





  <!-- BEGIN: Modal Content -->
  <Dialog :open="deleteModalPreview" @close="() => {
    setDeleteModalPreview(false);
  }
    ">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Are you sure?</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="outline-secondary" @click="() => {
          setDeleteModalPreview(false);
        }
          " class="w-24 mr-1">
          Cancel
        </Button>
        <Button type="button" variant="danger" class="w-24" @click="() => {
          delete_sysdoc();
        }
          ">
          Delete
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->

  <!-- BEGIN: New Order Modal -->
  <Dialog :open="newOrderModal" @clsoe="() => {
    setNewOrderModal(false);
  }
    " :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          <span v-if="dataForm.status == 'i'">
            New Order
          </span>
          <span v-else>
            Verify Ref: {{ dataForm.pos_code }}
          </span>

        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-1">Name</FormLabel>
          <TomSelect name="cboCustomer" v-model="cboCustomer" :value="cboCustomer" :error="$v.cus_code.$error"
            :class="{ 'border-danger': $v.cus_code.$error }">
            <option v-for="items in Customer" :value="items.id" :key="items.id">
              {{ items.name }}
            </option>
          </TomSelect>
        </div>
        <div class="col-span-12">
          <FormLabel htmlFor="table_num">Table</FormLabel>
          <FormInput id="table_num" type="text" class="flex-1" v-model="dataForm.table_num" :value="dataForm.table_num"
            placeholder="customer table" />
        </div>
        <div class="col-span-12">
          <FormLabel htmlFor="people_num">Number of People</FormLabel>
          <FormInput id="people_num" type="text" class="flex-1" v-model="dataForm.people_num" :value="dataForm.people_num"
            placeholder="people" />
        </div>
        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-3"> Remark </FormLabel>
          <FormTextarea id="remark" v-model="dataForm.remark" :value="dataForm.remark" placeholder="item remark">
          </FormTextarea>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button variant="outline-secondary" type="button" @click="() => {
          setNewOrderModal(false);
        }
          " class="w-32 mr-1">
          Cancel
        </Button>
        <Button variant="primary" type="button" class="w-32" ref="createTicketRef" :disable="$v.$invalid"
          @click="create_tran()">
          <span v-if="dataForm.status == 'i'">
            Create Ticket
          </span>
          <span v-else>
            Update Ticket
          </span>
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: New Order Modal -->

  <!-- BEGIN: Add Item Modal -->
  <Dialog :open="addItemModal" @clsoe="() => {
    setAddItemModal(false);
  }
    " :initialFocus="addItemRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          Ticket : {{ dataFormDetail.pos_code }}
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="pos-form-1">Stock </FormLabel>
          <TomSelect name="cboStock" v-model="cboStock" :value="cboStock" :error="$v_isok.sto_code.$error"
            :class="{ 'border-danger': $v_isok.sto_code.$error }">
            <option v-for="items in stock" :value="items.id" :key="items.id">
              {{ items.name }}
            </option>
          </TomSelect>
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Price </FormLabel>
          <FormInput id="price" name="price" type="number" placeholder="Price" v-model="dataFormDetail.unitprice"
            :value="dataFormDetail.unitprice" @keyup.enter="calculator()" @keypress="isnumber($event)"
            :error="$v_isok.unitprice.$error" :class="{
              'border-danger': $v_isok.unitprice.$error,
            }" />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Discount </FormLabel>
          <FormInput id="discount" name="discount" type="number" placeholder="Discount" v-model="dataFormDetail.discount"
            :value="dataFormDetail.discount" @keyup.enter="calculator()" @keypress="isnumber($event)"
            :error="$v_isok.discount.$error" :class="{
              'border-danger': $v_isok.discount.$error,
            }" />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Qty </FormLabel>
          <FormInput id="qty" name="qty" type="number" placeholder="Discount" v-model="dataFormDetail.qty"
            :value="dataFormDetail.qty" @keyup.enter="calculator()" @keypress="isnumber($event)"
            :error="$v_isok.qty.$error" :class="{
              'border-danger': $v_isok.qty.$error,
            }" />
        </div>

        <div class="col-span-12 sm:col-span-6">
          <FormLabel htmlFor="modal-form-3"> Amount </FormLabel>
          <FormInput id="qty" name="qty" type="number" :disabled="true" placeholder="0.00" v-model="dataFormDetail.amount"
            :value="dataFormDetail.amount" />
        </div>

        <div class="col-span-12">
          <FormLabel htmlFor="pos-form-5">Notes</FormLabel>
          <FormTextarea id="pos-form-5" placeholder="Item notes" v-model="dataFormDetail.remark"
            :value="dataFormDetail.remark">
          </FormTextarea>
        </div>
      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button variant="outline-secondary" type="button" @click="() => {
          setAddItemModal(false);
        }
          " class="w-24 mr-1">
          Cancel
        </Button>
        <Button variant="primary" type="button" class="w-24" ref="addItemRef" :disable="$v.$invalid" @click="(event: MouseEvent) => {
          event.preventDefault();
          create_details();
        }">
          Add Item
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Add Item Modal -->


  <!-- BEGIN: Modal Content -->
  <Dialog :open="warningModalPreview" @close="() => {
    setWarningModalPreview(false);
  }
    ">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Invalid Ticket</div>
        <div class="mt-2 text-slate-500">Please create your ticket POS !</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="() => {
          setWarningModalPreview(false);
        }
          " class="w-24">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->



  <!-- BEGIN: Charge  -->
  <Dialog :open="charges" @clsoe="() => {
    setChargesModal(false);
  }
    " :initialFocus="createTicketRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          <span v-if="dataForm.status == 'i'">
            Payment
          </span>
          <span v-else>
            Invoice : {{ dataForm.pos_code }}
          </span>
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <div class="col-span-6">
          <FormLabel htmlFor="table_num">Table</FormLabel>
          <FormInput id="table" type="text" :disabled="true" class="flex-1" :value="dataForm.table_num" />
        </div>
        <div class="col-span-6">
          <FormLabel htmlFor="people_num">Grand total</FormLabel>
          <FormInput type="text" class="flex-1" :disabled="true" :value="dataForm.total_charge" placeholder="people" />
        </div>

        <div class="col-span-12">
          <FormLabel htmlFor="people_num">Amount</FormLabel>
          <FormInput id="txtcharge" type="text" class="flex-1" v-model="dataCharge.charge" :value="dataCharge.charge"
            @keyup.enter="cal_charges()" placeholder="amount" />
        </div>

        <div class="col-span-6">
          <FormLabel htmlFor="people_num">Return</FormLabel>
          <FormInput type="text" class="flex-1" :disabled="true" v-model="dataCharge.return_amount"
            :value="dataCharge.return_amount" placeholder="Return" />
        </div>

        <div class="col-span-6">
          <FormLabel htmlFor="people_num">Exchange</FormLabel>
          <FormInput type="text" class="flex-1" :disabled="true" v-model="dataCharge.exchange_amount"
            :value="dataCharge.exchange_amount" :class="{
              'border-danger': dataCharge.return_amount <= 0,
              'text-danger': dataCharge.return_amount <= 0,
            }" placeholder="Exchange" />
        </div>


      </Dialog.Description>
      <Dialog.Footer class="text-right">
        <Button variant="outline-secondary" type="button" @click="() => {
          setChargesModal(false);
        }
          " class="w-32 mr-1">
          Cancel
        </Button>
        <Button variant="primary" type="button" class="w-32" ref="createTicketRef" :disable="$v.$invalid"
          @click="charge_trans()">
          <span>
            Commit
          </span>
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
  <!-- END: New Order Modal -->

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
</template>
