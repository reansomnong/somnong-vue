<script setup lang="ts">
import _, { fromPairs } from "lodash";
import { ref, reactive, provide, computed, watch, onMounted } from "vue";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormSelect,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../../base-components/Form";

import { Dialog } from "../../../base-components/Headless";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";

//Model
import { Stock } from "../../../models/pos/Stock";

// Stores
import { useUserStore } from "../../../stores/pos/Stock";
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

const Stock = useUserStore();
const message = useMessageStore();

const dataForm = reactive<Stock>({} as Stock);
const sendButtonRef = ref(null);
const staticBackdropModalPreview = ref(false);

const message_alert = ref("");
const message_status = ref("");

const setStaticBackdropModalPreview = (value: boolean) => {
  resetForm();
  staticBackdropModalPreview.value = value;
};

const setUpdateModalPreview = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};

function resetForm() {
  dataForm.branch_code = "";
  dataForm.stc_code = "";
  dataForm.stc_name = "";
  dataForm.comments = "";
  dataForm.active = true;
  dataForm.status = "i";
  $v.value.$reset();
}

async function loaddata(id: string) {
  await Stock.StockById(id);

  dataForm.status = "u";
  dataForm.stc_code = StockById.value[0]["stc_code"] as string;
  dataForm.branch_code = StockById.value[0]["branch_code"] as string;
  dataForm.stc_name = StockById.value[0]["stc_name"];
  dataForm.comments = StockById.value[0]["comments"];
  dataForm.stc_default = StockById.value[0]["stc_default"];
  dataForm.active = dataForm.active = StockById.value[0].active ? true : false;

  setUpdateModalPreview(true);
}

onMounted(async () => {
  dataForm.active = true;
  await Stock.StockList();

  console.log(StockDetail.value);
});

const StockById = computed(() => {
  return Stock.getStockById;
});

const StockDetail = computed(() => {
  return Stock.getStockList;
});

const rules = computed(() => {
  return {
    stc_name: {
      required: helpers.withMessage("Stock name is required", required),
    },
  };
});
const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create_stock() {
  $v.value.$touch();
  if ($v.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    var response = await Stock.create_stock(dataForm);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }

      basicStickyNotificationToggle();
      setStaticBackdropModalPreview(false);
      await Stock.StockList();
      
      resetForm();
    }
  }
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button variant="primary" class="mr-2 shadow-md" @click="() => {
          setStaticBackdropModalPreview(true);
        }
        ">
        Stock Control
      </Button>

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
              Stock Name
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Comment </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              POS Default 
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              STATUS
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              ACTIONS
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr v-for="st in StockDetail" :key="st.stc_code" class="intro-x">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ st.stc_name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                Tags: {{ st.branch_code }}-{{ st.comments }}
              </div>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ st.comments }}
              </a>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <div :class="[
                'flex items-center justify-center',
                { 'text-success': st.stc_default },
                { 'text-danger': !st.stc_default },
              ]">
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ st.stc_default ? "Yes" : "No" }}
              </div>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <div :class="[
                'flex items-center justify-center',
                { 'text-success': st.active },
                { 'text-danger': !st.active },
              ]">
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ st.active ? "Active" : "Inactive" }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
              <div class="flex items-center justify-center">
                <a class="flex items-center mr-3" href="" @click="(event) => {
                    event.preventDefault();
                    loaddata(st.stc_code);
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
                        Register Stock
                      </h2>

                      <FormSwitch class="mt-2">
                        <FormSwitch.Input name="active" id="checkbox-1" v-model="dataForm.active" type="checkbox" />
                      </FormSwitch>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-1">Stock Name</FormLabel>
                        <FormInput id="stc_name" name="stc_name" type="text" placeholder="stock name"
                          v-model="dataForm.stc_name" :error="$v.stc_name.$error" :class="{
                            'border-danger': $v.stc_name.$error,
                          }" />
                        <template v-if="$v.stc_name.$errors">
                          <div v-for="(error, index) in $v.stc_name.$errors" :key="index" class="mt-2 text-danger">
                            {{ error.$message }}
                          </div>
                        </template>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormSwitch class="flex flex-col items-start mt-3">
                          <FormSwitch.Label htmlFor="post-form-5" class="mb-2 ml-0">
                            POS Default
                          </FormSwitch.Label>
                          <FormSwitch.Input :checked="dataForm.stc_default" v-model="dataForm.stc_default" type="checkbox" />
                        </FormSwitch>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-5"> Comment </FormLabel>
                        <FormTextarea id="validation-form-6" name="comments" v-model="dataForm.comments"
                          placeholder="Type your comments">
                        </FormTextarea>
                      </div>
                    </Dialog.Description>

                    <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" @click="() => {
                          setStaticBackdropModalPreview(false);
                        }
                        " class="w-20 mr-1">
                        Cancel
                      </Button>
                      <Button name="btnOk" variant="primary" type="button" class="w-20" ref="{sendButtonRef}"
                        :disable="$v.$invalid" @click="create_stock()">
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

  </div>
</template>
