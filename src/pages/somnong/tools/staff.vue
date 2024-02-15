<script setup lang="ts">
import _, { now } from "lodash";
import { ref, reactive, computed, watch, onMounted, provide } from "vue";

import {
  FormInput,
  FormLabel,
  FormTextarea,
  FormSwitch,
} from "../../../base-components/Form";

import Litepicker from "../../../base-components/Litepicker";
import TomSelect from "../../../base-components/TomSelect";
import Button from "../../../base-components/Button";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";

// for change formate date
import moment from 'moment';


//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";

// Model
import { staffinfo } from "../../../models/somnong/staffinfo";
import { Branch } from "../../../models/admin/Branch";
// Stores
import { useStaffStore } from "../../../stores/somnong/staff";
import { useBranchStore } from "../../../stores/admin/Branch";
import { useMessageStore } from "../../../stores/pos/POS_Messages";
import { formatDate } from "@fullcalendar/vue3";

// For upload image

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

const Branch = useBranchStore();
const StafInfo = useStaffStore();
const message = useMessageStore();

// Form booking
const dataForm = reactive<staffinfo>({} as staffinfo);

const cboPosition = ref("0");
const cboGender = ref("0");
const cboAddress = ref("0");
const message_alert = ref("");
const message_status = ref("");
const DOB = ref("");

const date_of_brith = ref<string>("");

const sendButtonRef = ref(null);
const staticBackdropModalPreview = ref(false);
const staticBackdropModalFile = ref(false);

const setStaticBackdropModalPreview = (value: boolean) => {
  resetForm();
  staticBackdropModalPreview.value = value;
};

const setStaticBackdropModalEdit = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};


function set_date(params:string) {
  let timeNow = moment(new Date(params)).format('YYYY-MM-DD');
  return timeNow;
};

onMounted(async () => {
  resetForm();
  await StafInfo.ItemsList();
  await StafInfo.ComboGender();
  await StafInfo.ComboPosition();
  await Branch.getComboProvince();
});


const provinces = computed(() => {
  return Branch.getProvince;
});

const list_gender = computed(() => {
  return StafInfo.getGender;
});

const list_position = computed(() => {
  return StafInfo.getPosition;
});

const items = computed(() => {
  return StafInfo.getItemsById;
});

const list_items = computed(() => {
  return StafInfo.getItemsDetail;
});

watch(cboGender, () => {
  dataForm.gender = cboGender.value;
});


watch(cboPosition, () => {
  dataForm.position_id = cboPosition.value;
});

watch(cboAddress, () => {
  dataForm.address_code = cboAddress.value;
});


async function view_edit(id: string) {
  resetForm();
  await StafInfo.ItemsById(id);

  dataForm.status = "u";
  dataForm.staff_id = items.value[0]["staff_id"] as string;
  dataForm.full_name = items.value[0]["full_name"] as string;
  dataForm.position_id = items.value[0]["position_id"] as string;
  dataForm.position = items.value[0]["position"] as string;
  dataForm.phone = items.value[0]["phone"] as string;
  dataForm.remark = items.value[0]["remark"] as string;
  dataForm.inputter = items.value[0]["inputter"] as string;

  dataForm.gender = items.value[0]["gender"] as string;
  dataForm.address = items.value[0]["address"] as string;
  dataForm.position = items.value[0]["position_id"] as string;
  dataForm.active = dataForm.active = items.value[0].active ? true : false;

  cboAddress.value = items.value[0]["address"] as string;
  cboGender.value = items.value[0]["gender"] as string;
  cboPosition.value = items.value[0]["position_id"] as string;

  date_of_brith.value=set_date(items.value[0]["DOB"]);
  dataForm.DOB = set_date(items.value[0]["DOB"]);

  setStaticBackdropModalEdit(true);
}

function resetForm() {
  dataForm.status = "i";
  dataForm.branch_code = "";
  dataForm.staff_id = "";
  dataForm.full_name = "";
  dataForm.position = "";
  dataForm.position_id = "";
  dataForm.gender = "";
  dataForm.phone = "";
  dataForm.address = "";
  dataForm.remark = "";
  dataForm.active = true;
  cboPosition.value = "";
  cboAddress.value = "";

  $v.value.$reset();
  dataForm.is_update = true;

  let timeNow = moment(new Date(Date.now())).format('YYYY-MM-DD');
  date_of_brith.value=timeNow;
  dataForm.DOB = timeNow;

}

const rules = computed(() => {
  return {
    full_name: {
      required: helpers.withMessage(
        "staff name information is required",
        required
      ),
      minLength: minLength(3),
    },
    gender: {
      required: helpers.withMessage("Gender information is required", required),
      minLength: minLength(1),
    },
    position_id: {
      required: helpers.withMessage(
        "Position information is required",
        required
      ),
      minLength: minLength(1),
    },
    phone: {
      required: helpers.withMessage("Phone information is required", required),
      minLength: minLength(1),
    },
  };
});

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create() {
  $v.value.$touch();

  if ($v.value.$invalid) {
    message_alert.value = $v.value.$errors[0].$message as string;
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {

    dataForm.DOB = set_date(date_of_brith.value);

    var response = await StafInfo.create(dataForm);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }

      basicStickyNotificationToggle();
      setStaticBackdropModalPreview(false);
      resetForm();

      await StafInfo.ItemsList();
    }
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
              Staff Name
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Position </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Phone </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Gender </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Status
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Inputter </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr
            v-for="list in list_items"
            :key="list.staff_id"
            class="intro-x"
          >
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.full_name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                id: {{ list.staff_id }} - {{ list.DOB }}
              </div>
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.position }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.phone }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              {{ list.gender }}
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
            >
              <div
                :class="[
                  'flex items-center justify-center',
                  { 'text-success': list.active },
                  { 'text-danger': !list.active },
                ]"
              >
                <Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
                {{ list.active ? "Active" : "Inactive" }}
              </div>
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
                      view_edit(list.staff_id);
                    }
                  "
                >
                  <Lucide icon="Edit" class="w-4 h-4 mr-1" /> Edit
                </a>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

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
                        Staff Information
                        {{ dataForm.staff_id ? " : " + dataForm.staff_id : "" }}
                      </h2>

                      <FormSwitch class="mt-2">
                        <FormSwitch.Input
                          :checked="dataForm.active"
                          v-model="dataForm.active"
                          type="checkbox"
                        />
                      </FormSwitch>
                    </Dialog.Title>

                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-1">Staff name</FormLabel>
                        <FormInput
                          :value="dataForm.full_name"
                          type="text"
                          placeholder="staff name"
                          v-model="dataForm.full_name"
                          :error="$v.full_name.$error"
                          :class="{
                            'border-danger': $v.full_name.$error,
                          }"
                          :disabled="dataForm.is_update ? false : true"
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Gender</FormLabel>
                        <TomSelect
                          name="cboGender"
                          v-model="cboGender"
                          :error="$v.gender.$error"
                          :disabled="dataForm.is_update ? false : true"
                          :class="{ 'border-danger': $v.gender.$error }"
                        >
                          <option
                            v-for="items in list_gender"
                            :value="items.id"
                            :key="items.id"
                          >
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4">DOB</FormLabel>

                        <Litepicker
                          v-model="date_of_brith"
                          formattedDate="YYYY-MM-DD"
                          :options="{
                            autoApply: false,
                            showWeekNumbers: false,
                            dropdowns: {
                              minYear: 1990,
                              maxYear: null,
                              months: true,
                              years: true,
                              
                            },
                          }"
                        />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4"
                          >Phone number
                        </FormLabel>
                        <FormInput
                          type="text"
                          :value="dataForm.phone"
                          placeholder="Phone number"
                          :disabled="dataForm.is_update ? false : true"
                          v-model="dataForm.phone"
                        />
                      </div>
                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Position</FormLabel>
                        <TomSelect
                          name="cboStatus"
                          v-model="cboPosition"
                          :error="$v.position_id.$error"
                          :class="{ 'border-danger': $v.position_id.$error }"
                        >
                          <option
                            v-for="items in list_position"
                            :value="items.id"
                            :key="items.id"
                          >
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-6">Address</FormLabel>
                        <TomSelect
                          name="cboAddress"
                          v-model="cboAddress"
                          :value="cboAddress"
                          :disabled="dataForm.is_update ? false : true"
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
                        <FormLabel htmlFor="remark"> Remark </FormLabel>
                        <FormTextarea
                          v-model="dataForm.remark"
                          :value="dataForm.remark"
                          placeholder="type your comment"
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
    <!-- END: Modal Booking Content -->

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
