<script setup lang="ts">
import _, {  } from "lodash";
import { ref, reactive, computed, watch, onMounted, provide } from "vue";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import FileIcon from "../../../base-components/FileIcon";

import TomSelect from "../../../base-components/TomSelect";
import Button from "../../../base-components/Button";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers, } from "@vuelidate/validators";
import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";

// Stores
import { usePaymentStore } from "../../../stores/somnong/payment";
import { useMessageStore } from "../../../stores/pos/POS_Messages";

// For Payment
import { payment,PaymentFile } from "../../../models/somnong/collect_payment";

// For upload image
import { SelectedFile } from "../../../models/pos/SelectedFile";

import { Menu } from "../../../base-components/Headless";

const staticPayments = ref(false);
const basicStickyNotification = ref<NotificationElement>();
const staticBackdropModalFile = ref(false);
const deleteModalPreview = ref(false);
const deleteButtonRef = ref(null);

const setDeleteModalPreview = (value: boolean) => {
  deleteModalPreview.value = value;
};

const basicStickyNotificationToggle = () => {
  basicStickyNotification.value?.showToast();
};
provide("bind[basicStickyNotification]", (el: NotificationElement) => {
  basicStickyNotification.value = el;
});

const setPaymentPreview = (value: boolean) => {
  staticPayments.value = value;
};


const setPaymentCreate = (value: boolean) => {
  resetForm();
  staticPayments.value = value;
};


const setStaticBackdropModalFile = (value: boolean) => {
  staticBackdropModalFile.value = value;
};

const Payments = usePaymentStore();
const message = useMessageStore();
const dataForm = reactive<payment>({} as payment);
const FileForm = reactive<PaymentFile>({} as PaymentFile);


const message_alert = ref("");
const message_status = ref("");
const cboCurrency = ref("");
const cboType = ref("");
const cboProject = ref("");
const sendButtonRef = ref(null);
const isDisable = ref(true);
const isDisableProject = ref(true);

onMounted(async () => {
  resetForm();
  await Payments.somnong_currency();
  await Payments.somnong_type();
  await Payments.somnong_referent();
  await Payments.ItemsList();
});

const list_currency = computed(() => {
  return Payments.getCurrency;
});

const list_type = computed(() => {
  return Payments.getType;
});

const list_referent = computed(() => {
  return Payments.getProject;
});

const list_items = computed(() => {
  return Payments.getItemsDetail;
});
const items = computed(() => {
  return Payments.getItemsById;
});

const list_files = computed(() => {
  return Payments.getQuote_File;
});

async function load_payment(id: string) {
  resetForm();

  dataForm.referent_code = id;
  setPaymentPreview(true);
}

watch(cboCurrency, () => {
  dataForm.currency_code = cboCurrency.value;
});

watch(cboType, () => {
  dataForm.type_code = cboType.value;
});

watch(cboProject, () => {
  dataForm.referent_code = cboProject.value;
  if (dataForm.referent_code !='' && isDisableProject.value ==false){
    isDisable.value=false;
  }else{
    isDisable.value=true;
  }
});

function resetForm() {
  dataForm.branch_code = "";
  dataForm.amount = 0;
  dataForm.currency = "";
  dataForm.currency_code = "";
  dataForm.ref_exchange = "";
  dataForm.is_update = true;

  dataForm.status = "i";
  cboCurrency.value='';
  cboProject.value='';
  cboType.value='';

  $v.value.$reset;


  isDisable.value=true;
  isDisableProject.value=false;
}

const rules = computed(() => {
  return {
    currency_code: {
      required: helpers.withMessage("Quote status is required", required),
      minLength: minLength(1),
    },
    type_code: {
      required: helpers.withMessage("Client information is required", required),
      minLength: minLength(1),
    },
    referent_code: {
      required: helpers.withMessage("Quote status is required", required),
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
    var response = await Payments.create(dataForm);
    if (response) {
      message_status.value = "";
      if (dataForm.status == "i") {
        message_alert.value = message.getInsert;
      } else {
        message_alert.value = message.getUpdate;
      }
      basicStickyNotificationToggle();
      resetForm();
      Payments.ItemsList();
      setPaymentPreview(false);

    }
  }
}

async function load_file(payment_id: string) {
  dataForm.payment_id=payment_id;
  Payments.payment_file_view(payment_id);

  setStaticBackdropModalFile(true);
}


async function loaddata(id: string) {
  resetForm();
  await Payments.ItemsById(id);

  dataForm.status = "u";
  dataForm.payment_id = items.value[0]["payment_id"] as string;
  dataForm.remark = items.value[0]["remark"] as string;
  dataForm.amount = items.value[0]["amount"] as number;

  cboProject.value = items.value[0]["referent_code"] as string;
  cboCurrency.value = items.value[0]["currency_code"] as string;
  cboType.value = items.value[0]["type_code"] as string;
  dataForm.is_update = items.value[0]["is_update"] as boolean;

  if ( dataForm.is_update ==false ){
    isDisable.value=true;
    isDisableProject.value=true;
  }
  setPaymentPreview(true);
}



// Function File 
const selectedFiles = ref([] as SelectedFile[]);
const clearFiles = () => (selectedFiles.value = []);
const onSelectFiles = (event: Event) => {
const target = event.target as HTMLInputElement;

  if (target.files === null) {
    return;
  }
  clearFiles();
  Array.from(target.files).forEach((file: File) => {
    selectedFiles.value.push({
      referent_id: dataForm.payment_id,
      file: file,
      percentage: 0,
      status: "pending",
      size: file.size,
    } as SelectedFile);
  });

  if (selectedFiles.value[0].size > 500000) {
    message_alert.value = "File bigger than 2MB !!!";
    message_status.value = "error";
    basicStickyNotificationToggle();
  } else {
    selectedFiles.value.forEach((file: SelectedFile) => {
      file.status = "uploading";
      file.percentage = 0;
      Payments.upload_image(file.file, dataForm.payment_id);
    });
  }
};

async function setDelete_file_id(file_id: string) {
  FileForm.file_code=file_id;
}

async function download_file(file_name: string) {
}

async function del_quote_file(_id: string) {
  FileForm.status = "del_payment_file";
  FileForm.quote_code = dataForm.payment_id;
  var response = await Payments.del_quote_file(FileForm);

  if (response) {
    setStaticBackdropModalFile(false);
    setDeleteModalPreview(false);
    load_file(dataForm.payment_id);
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
            setPaymentCreate(true);
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
              Customer name
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Amount </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Remark </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              STATUS
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
      
        <Table.Tbody>
          <Table.Tr v-for="list in list_items" :key="list.payment_id" class="intro-x">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.title }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                id: {{ list.payment_id }}-{{ list.tran_type }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.currency }} {{ list.amount }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.remark }}
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
              <div class="flex items-center justify-center">
                <a class="flex items-center mr-3" href="" @click="(event) => {
                    event.preventDefault();
                    loaddata(list.payment_id);
                  }
                  ">
                  <Lucide icon="Edit" class="w-4 h-4 mr-1" /> Edit
                </a>

                <a class="flex items-center mr-3" href="" @click="(event) => {
                    event.preventDefault();
                    load_file(list.payment_id);
                  }
                  ">
                  <Lucide icon="Settings" color="red"  class="w-4 h-4 mr-1" /> File
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
      :open="staticPayments"
      @close="
        () => {
          setPaymentPreview(false);
        }
      "
    >
      <Dialog.Panel class="px-5 py-10">
        <div class="text-center">
          <Preview class="mt-5 intro-y box">
            <Preview.Panel>
              <!-- BEGIN: Modal Content -->
              <Dialog
                staticBackdrop
                :open="staticPayments"
                @close="
                  () => {
                    setPaymentPreview(false);
                  }
                "
              >
                <Dialog.Panel>
                  <Dialog.Title>
                    <h2 class="mr-auto text-base font-medium">
                      Income / Expense
                    </h2>
                  </Dialog.Title>
                  <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                    <div class="col-span-12 sm:col-span-12">
                      <FormLabel htmlFor="modal-form-1">Project Referent</FormLabel>
                      <TomSelect
                        name="cboClient"
                        v-model="cboProject"
                        :disabled="isDisableProject"
                        :error="$v.referent_code.$error"
                        :class="{ 'border-danger': $v.referent_code.$error }"
                      >
                        <option
                          v-for="items in list_referent"
                          :value="items.id"
                          :key="items.id"
                        >
                          {{ items.name }}
                        </option>
                      </TomSelect>
                    </div>

                    <div class="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-1">Currency</FormLabel>
                      <select
                        id="small"
                        v-model="cboCurrency"
                        class="block w-full p-2 mb-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        :disabled="isDisable"
                        :error="$v.currency_code.$error"
                        :class="{
                          'border-danger': $v.currency_code.$error,
                        }"
                      >
                        <option
                          v-for="items in list_currency"
                          :value="items.id"
                          :key="items.id"
                        >
                          {{ items.name }}
                        </option>
                      </select>
                    </div>


                    <div class="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-1">Type</FormLabel>
                      <select
                        id="small"
                        v-model="cboType"
                        class="block w-full p-2 mb-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        :disabled="isDisable"
                      >
                        <option
                          v-for="items in list_type"
                          :value="items.id"
                          :key="items.id"
                        >
                          {{ items.name }}
                        </option>
                      </select>
                    </div>

                    <div class="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-4">Amount </FormLabel>
                      <FormInput
                        type="number"
                        :value="dataForm.amount"
                        :disabled="isDisable"
                        placeholder="Amount"
                        v-model="dataForm.amount"
                      />
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
                          setPaymentPreview(false);
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
          </Preview>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Modal Content -->


    <!-- BEGIN: Modal File -->
    <Dialog staticBackdrop :open="staticBackdropModalFile" @close="() => {
        setStaticBackdropModalFile(false);
      }
      ">
      <Dialog.Panel class="px-5 py-10">
        <div class="text-center">
          <Preview class="mt-5 intro-y box">
            <div class="p-5">
              <Preview.Panel>
                <!-- BEGIN: Modal File -->
                <Dialog staticBackdrop :open="staticBackdropModalFile" @close="() => {
                    setStaticBackdropModalFile(false);
                  }
                  ">
                  <Dialog.Panel>
                    <Dialog.Title>
                      <h2 class="mr-auto text-base font-medium">
                        File Documents
                      </h2>
                    </Dialog.Title>

                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 intro-y lg:col-span-12" v-for="file in list_files">
                        <div class="flex items-center">
                          <FileIcon class="w-12 file" variant="directory" v-if="file.extension == '.png'" />
                          <FileIcon class="w-12 file" variant="file" v-else-if="file.extension == '.pdf'" />
                          <FileIcon class="w-12 file" variant="directory" v-else-if="file.extension == '.jpg'" />
                          <FileIcon class="w-12 file" variant="directory" v-else />

                          <div class="ml-4">
                            <a class="font-medium" href="">
                              {{ file.file_name }}
                            </a>
                            <div class="text-slate-500 text-xs mt-0.5">
                              {{ file.extension }}
                            </div>
                          </div>
                          <Menu class="ml-auto">
                            <Menu.Button tag="a" class="block w-5 h-5" href="#">
                              <Lucide icon="MoreHorizontal" class="w-5 h-5 text-slate-500" />
                            </Menu.Button>
                            <Menu.Items class="w-40">
                              <Menu.Item @click="download_file(file.file_name)">
                                <Lucide icon="Files" class="w-4 h-4 mr-2" />
                                View File
                              </Menu.Item>
                              <Menu.Item variant="primary" @click="(event: MouseEvent) => {
                                event.preventDefault();
                                setDeleteModalPreview(true);
                                setDelete_file_id(file.row);
                              }">
                                <Lucide icon="Trash" class="w-4 h-4 mr-2 red" color="red" />
                                Delete
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                        </div>
                      </div>
                    </Dialog.Description>

                    <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" @click="() => {
                          setStaticBackdropModalFile(false);
                        }
                        " class="mr-1">
                        <Lucide icon="Save" class="w-4 h-4 mr-4" /> Close
                      </Button>
                      <Button variant="primary" type="button" accept="image/png, image/jpeg">
                        <Lucide icon="File" class="w-4 h-4 mr-4" /> Upload

                        <FormInput type="file" class="absolute right-8 w-20 h-10 opacity-0" accept="image/png, image/jpeg"
                          @change="onSelectFiles" />
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
        <Dialog :open="deleteModalPreview" @close="() => {
        setDeleteModalPreview(false);
      }
      " :initialFocus="deleteButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure to delete ?</div>
          <div class="mt-2 text-slate-500">
            document : {{ FileForm.file_code }}
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button type="button" variant="outline-secondary" @click="() => {
              setDeleteModalPreview(false);
            }
            " class="w-24 mr-1">
            Cancel
          </Button>
          <Button type="button" variant="danger" class="w-24" ref="{deleteButtonRef}" @click="(event: MouseEvent) => {
            event.preventDefault();
            del_quote_file(list_files[0].tran_code);
          }">
            Delete
          </Button>
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
