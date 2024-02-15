<script setup lang="ts">
import _, { transform } from "lodash";
import { ref, onMounted, watch, reactive, computed } from "vue";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import TomSelect from "../../../base-components/TomSelect";
import Lucide from "../../../base-components/Lucide";
import { Menu, Tab, Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { useCountStockStore } from "../../../stores/pos/CountStock";
import { CountStock, CountStockDetails } from "../../../models/pos/CountStock";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

const CountStore = useCountStockStore();
const dataForm = reactive<CountStock>({} as CountStock);
const dataDetail = reactive<CountStockDetails>({} as CountStockDetails);
const cboStock = ref("0");
const search = ref("");

const newOrderModal = ref(false);
const setNewOrderModal = (value: boolean) => {
  Clear();
  newOrderModal.value = value;
};
const addItemModal = ref(false);
const setAddItemModal = (value: boolean) => {
  if (dataDetail.tran_code == "" || dataDetail.tran_code == null) {
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

onMounted(async () => {
  await CountStore.search_items("all");
  await CountStore.combo_una_list();
  await CountStore.cboStockList();
  await ref_details("0000");

  resetForm();
  resetFormDetails();
});

watch(cboStock, () => {
  dataForm.stc_code = cboStock.value;
});

const stock = computed(() => {
  return CountStore.getStock;
});

const combo_list = computed(() => {
  return CountStore.getUNACombo;
});

const list_una_tran_by_id = computed(() => {
  return CountStore.getItemsById;
});

const Product_items = computed(() => {
  return CountStore.getProduct;
});

const itemsDetails = computed(() => {
  return CountStore.getItemsDetail;
});

const una_details_sysdoc = computed(() => {
  return CountStore.getSysdocDetails;
});

const rules = computed(() => {
  return {
    stc_code: {
      required: helpers.withMessage(
        "Transfer from stock is required",
        required
      ),
      minLength: minLength(1),
    },
  };
});
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

function resetForm() {
  dataForm.branch_code = "";
  dataForm.tran_code = "";
  dataForm.stc_code = "";
  dataForm.remark = "";
  dataForm.inputter = "";

  $v.value.$reset();
  dataForm.status = "i";
}

function resetFormDetails() {
  dataDetail.status = "i";
  dataDetail.pro_code = "";
  dataDetail.barcode = "";
  dataDetail.qty = 0;
  dataDetail.remark = "";

  $v_isok.value.$reset();
}

async function create_tran() {
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
    var response = await CountStore.create_trans(dataForm);
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
      await CountStore.combo_una_list();
      setNewOrderModal(false);

      resetForm();
      $v.value.$reset();
    }
  }
}

async function ref_stock_transfer(id: string) {
  await CountStore.una_tran_by_id(id);

  console.log(list_una_tran_by_id.value);
  dataForm.status = "cm";
  dataForm.tran_code = list_una_tran_by_id.value[0].tran_code;
  dataForm.stc_code = list_una_tran_by_id.value[0].stc_code;
  dataForm.stock_name = list_una_tran_by_id.value[0].stock_name;
  dataForm.remark = list_una_tran_by_id.value[0].remark;
  dataForm.input_date = list_una_tran_by_id.value[0].input_date;

  dataDetail.status = "i";
  dataDetail.tran_code = list_una_tran_by_id.value[0].tran_code;

  ref_details(dataDetail.tran_code as string);
}

async function search_items() {
  if (search.value == "" || search.value == null) {
    await CountStore.search_items("all");
  } else {
    await CountStore.search_items(search.value);
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
    qty: {
      required: helpers.withMessage("Qty is required", required),
      minLength: minLength(1),
    },
  };
});
const $v_isok = useVuelidate(isOk, dataDetail, { $autoDirty: true });

async function create_Detail() {
  $v_isok.value.$touch();

  if (dataDetail.tran_code == "" || dataDetail.tran_code == null) {
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
    var response = await CountStore.create_details(dataDetail);
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

      setNewOrderModal(false);
      setAddItemModal(false);

      resetForm();
      resetFormDetails();
      $v.value.$reset();
      $v_isok.value.$reset();

      await CountStore.combo_una_list();
      await ref_details(dataDetail.tran_code);
    }
  }
}

async function ref_details(id: string) {
  await CountStore.una_details_id(id);

  if (itemsDetails.value.length > 0) {
    dataDetail.status = "i";

    dataDetail.tran_code = itemsDetails.value[0].tran_code;
    dataDetail.pro_code = itemsDetails.value[0].pro_code;
    dataDetail.pro_name = itemsDetails.value[0].pro_name;
    dataDetail.barcode = itemsDetails.value[0].barcode;
    dataDetail.qty = itemsDetails.value[0].qty;
  }
}

async function una_po_sysdoc_details(id: string) {
  await CountStore.una_details_sysdoc(id);

  dataDetail.status = "i";

  if (una_details_sysdoc.value.length > 0) {
    dataDetail.tran_code = una_details_sysdoc.value[0].tran_code;
    dataDetail.pro_code = una_details_sysdoc.value[0].pro_code;
    dataDetail.barcode = una_details_sysdoc.value[0].barcode;
    dataDetail.qty = una_details_sysdoc.value[0].qty;
    dataDetail.remark = una_details_sysdoc.value[0].remark;
  }
}

function Clear() {
  resetForm();
  resetFormDetails();
  CountStore.$reset();

  CountStore.combo_una_list();
  CountStore.cboStockList();
  CountStore.search_items("all");
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Count Stock</h2>
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

        <Menu class="ml-auto sm:ml-0">
          <Menu.Button :as="Button" class="px-2 !box">
            <span class="flex items-center justify-center w-5 h-5">
              <Lucide icon="ChevronDown" class="w-4 h-4" />
            </span>
          </Menu.Button>

          <Menu.Items v-if="combo_list.length > 0">
            <Menu.Item
              v-for="list in combo_list"
              :key="list.id"
              @click="
                () => {
                  ref_stock_transfer(list.id);
                }
              "
            >
              <Lucide icon="Printer" class="w-4 h-4 mr-2" />
              <span class="truncate"> {{ list.name }}- {{ list.id }} </span>
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
            v-for="item in Product_items"
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
              <Tab>
                <Tab.Button as="button" class="w-full py-2">
                  Details
                </Tab.Button>
              </Tab>
            </Tab.List>
          </div>
        </div>
          <Tab.Panel>
            <div class="p-2 mt-5 box" v-if="itemsDetails.length > 0">
              <a
                v-for="(details, index) in itemsDetails"
                href="#"
                :key="details.sysdoc"
                @click="(event: MouseEvent) => {
                  event.preventDefault();
                  setAddItemModal(true);
                  una_po_sysdoc_details(details.sysdoc)
                }"
                class="flex items-center p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400"
              >
                <div class="max-w-[50%] truncate mr-1">{{ index + 1 }}.</div>
                <div class="text-slate-500">
                  {{ details.pro_name }} = {{ details.qty }} to
                  {{ details.stock_name }}
                </div>
                <Lucide icon="Edit" class="w-4 h-4 ml-2 text-slate-500" />
              </a>
            </div>
            <!-- When don't have item to show -->

            <div class="p-5 mt-5 box" v-if="itemsDetails.length <= 0">
              <div class="flex">
                <div class="mr-auto">Waitting transaction order</div>
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
            <div class="p-5 mt-5 box" v-if="itemsDetails.length <= 0">
              <div class="mr-auto">No infomation details</div>
            </div>
            <div class="p-5 mt-5 box" v-else>
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
                  <div class="text-slate-500">Stock</div>
                  <div class="mt-1">{{ dataForm.stock_name }}</div>
                </div>
                <Lucide icon="User" class="w-4 h-4 ml-auto text-slate-500" />
              </div>
              <div
                class="flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400"
              >
                <div>
                  <div class="text-slate-500">Remark</div>
                  <div class="mt-1">{{ dataForm.remark }}</div>
                </div>
                <Lucide icon="Users" class="w-4 h-4 ml-auto text-slate-500" />
              </div>
            </div>
          </Tab.Panel>
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
          <h2 class="mr-auto text-base font-medium">Count Stock info</h2>
        </Dialog.Title>
        <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12">
            <FormLabel htmlFor="pos-form-1">Stock </FormLabel>
            <TomSelect
              name="cboAddress"
              v-model="cboStock"
              :value="cboStock"
              :error="$v.stc_code.$error"
              :class="{ 'border-danger': $v.stc_code.$error }"
            >
              <option v-for="items in stock" :value="items.id" :key="items.id">
                {{ items.name }}
              </option>
            </TomSelect>
          </div>

          <div class="col-span-12">
            <FormLabel htmlFor="pos-form-3">Remark</FormLabel>
            <FormTextarea
              id="remark"
              placeholder="Item notes"
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
            @click="create_tran()"
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
            Ticket : {{ dataDetail.tran_code }}
          </h2>
        </Dialog.Title>
        <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3"> Qty </FormLabel>
            <FormInput
              id="qty"
              name="qty"
              type="number"
              placeholder="quality"
              v-model="dataDetail.qty"
              :value="dataDetail.qty"
              @keypress="isnumber($event)"
              :error="$v_isok.qty.$error"
              :class="{
                'border-danger': $v_isok.qty.$error,
              }"
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
              create_Detail();
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
            Please create your ticket first !
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
