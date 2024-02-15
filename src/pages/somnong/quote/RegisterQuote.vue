<script setup lang="ts">
import _, { now } from "lodash";
import { ref, reactive, computed, watch, onMounted, provide } from "vue";

import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";

import { Menu } from "../../../base-components/Headless";
import FileIcon from "../../../base-components/FileIcon";

import Litepicker from "../../../base-components/Litepicker";
import TomSelect from "../../../base-components/TomSelect";
import Button from "../../../base-components/Button";
import Preview from "../../../base-components/Preview";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import { required, minLength, helpers } from "@vuelidate/validators";
import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";

// Model
import { quotes, quote_file } from "../../../models/somnong/clients";
import { Branch } from "../../../models/admin/Branch";
// Stores
import { useQuoteStore } from "../../../stores/somnong/quotes";
import { useBranchStore } from "../../../stores/admin/Branch";
import { useMessageStore } from "../../../stores/pos/POS_Messages";

// For upload image
import { SelectedFile } from "../../../models/pos/SelectedFile";

// for change formate date
import moment from 'moment';

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
const deleteButtonRef = ref(null);

const Branch = useBranchStore();
const Quotes = useQuoteStore();
const message = useMessageStore();

// Form booking 
const dataForm = reactive<quotes>({} as quotes);
const FileForm = reactive<quote_file>({} as quote_file);

const cboClient = ref("0");
const cboStatus = ref("0");
const cboLeader = ref("0");
const cboAddress = ref("0");
const message_alert = ref("");
const message_status = ref("");
const date = ref<string>("");

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

const setStaticBackdropModalFile = (value: boolean) => {
  staticBackdropModalFile.value = value;
};


onMounted(async () => {
  resetForm();
  await Quotes.ItemsList();
  await Quotes.somnong_client();
  await Quotes.somnong_status();
  await Quotes.somnong_leader();
  await Branch.getComboProvince();
});

const provinces = computed(() => {
  return Branch.getProvince;
});

const list_clients = computed(() => {
  return Quotes.getClients;
});

const list_status = computed(() => {
  return Quotes.getStatus;
});

const list_leader = computed(() => {
  return Quotes.getLeader;
});

const items = computed(() => {
  return Quotes.getItemsById;
});

const list_items = computed(() => {
  return Quotes.getItemsDetail;
});

const list_files = computed(() => {
  return Quotes.getQuote_File;
});


function set_date(params: string) {
  let timeNow = moment(new Date(params)).format('YYYY-MM-DD');
  return timeNow;
};

watch(cboLeader, () => {
  dataForm.quote_leader = cboLeader.value;
});

watch(cboStatus, () => {
  dataForm.quote_status = cboStatus.value;
});

watch(cboClient, () => {
  dataForm.client_id = cboClient.value;
});

watch(cboAddress, () => {
  dataForm.address_code = cboAddress.value;
});

async function load_file(quote_code: string) {
  dataForm.quote_code = quote_code;
  Quotes.quote_file_view(quote_code);
  setStaticBackdropModalFile(true);
}


async function loaddata(id: string) {
  resetForm();
  await Quotes.ItemsById(id);

  dataForm.status = "u";
  dataForm.client_id = items.value[0]["client_id"] as string;
  dataForm.quote_code = items.value[0]["quote_code"] as string;
  dataForm.client_name = items.value[0]["client_name"] as string;
  dataForm.quote_title = items.value[0]["quote_title"] as string;
  dataForm.house_number = items.value[0]["house_number"] as string;
  dataForm.phone = items.value[0]["phone"] as string;
  dataForm.quote_status = items.value[0]["quote_status"] as string;
  dataForm.google_map = items.value[0]["google_map"] as string;
  dataForm.remark = items.value[0]["remark"] as string;

  cboAddress.value = items.value[0]["address_code"] as string;
  cboClient.value = items.value[0]["client_id"] as string;
  cboStatus.value = items.value[0]["status_code"] as string;
  cboLeader.value = items.value[0]["leader_code"] as string;

  dataForm.tranDate = set_date(items.value[0]["tranDate"]);
  date.value = set_date(items.value[0]["tranDate"]);
  dataForm.is_update = items.value[0]["is_update"] as boolean;

  setStaticBackdropModalEdit(true);
}



function resetForm() {
  dataForm.branch_code = "";
  dataForm.quote_title = "";
  dataForm.client_id = "";
  dataForm.client_name = "";
  dataForm.quote_leader = "";
  dataForm.quote_status = "";
  dataForm.house_number = "";
  dataForm.cost = 0;
  dataForm.address = "";
  dataForm.google_map = "";
  dataForm.remark = "";

  dataForm.active = true;
  dataForm.status = "i";
  cboLeader.value = "";
  cboStatus.value = "";
  cboClient.value = "";
  cboAddress.value = "";

  $v.value.$reset();
  dataForm.is_update = true;

  let timeNow = moment(new Date(Date.now())).format('YYYY-MM-DD');
  date.value = timeNow;
  dataForm.tranDate = timeNow;

}

const rules = computed(() => {
  return {
    quote_title: {
      required: helpers.withMessage("Quote status is required", required),
      minLength: minLength(1),
    },
    client_id: {
      required: helpers.withMessage("Client information is required", required),
      minLength: minLength(3),
    },
    quote_status: {
      required: helpers.withMessage("Quote status is required", required),
      minLength: minLength(1),
    },
    quote_leader: {
      required: helpers.withMessage("Phone is required", required),
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
    
    dataForm.tranDate = set_date(date.value);

    var response = await Quotes.create(dataForm);
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

      await Quotes.ItemsList();
    }
  }
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
      referent_id: dataForm.quote_code,
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
      Quotes.upload_image(file.file, dataForm.quote_code);
    });
  }
};

async function setDelete_file_id(file_id: string) {
  FileForm.file_code = file_id;
}

async function download_file(file_name: string) {
}

async function del_quote_file(_id: string) {
  FileForm.status = "del_quote_file";
  FileForm.quote_code = dataForm.quote_code;
  var response = await Quotes.del_quote_file(FileForm);
  if (response) {
    setStaticBackdropModalFile(false);
    setDeleteModalPreview(false);
    load_file(dataForm.quote_code);
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
        Create New
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
              Client Name
            </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Quote </Table.Th>
            <Table.Th class="border-b-0 whitespace-nowrap"> Phone </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Status
            </Table.Th>
            <Table.Th class="text-center border-b-0 whitespace-nowrap">
              Action
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr v-for="list in list_items" :key="list.quote_code" class="intro-x">
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              <a href="" class="font-medium whitespace-nowrap">
                {{ list.client_name }}
              </a>
              <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                id: {{ list.quote_code }}
              </div>
            </Table.Td>
            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.quote_title }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.phone }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
              {{ list.quote_status }}
            </Table.Td>

            <Table.Td
              class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
              <div class="flex items-center justify-center">
                <a class="flex items-center mr-3" href="" @click="(event) => {
                  event.preventDefault();
                  loaddata(list.quote_code);
                }
                  ">
                  <Lucide icon="Edit" class="w-4 h-4 mr-1" /> Edit
                </a>

                <a class="flex items-center mr-3" href="" @click="(event) => {
                  event.preventDefault();
                  load_file(list.quote_code);
                }
                  ">
                  <Lucide icon="Settings" color="red" class="w-4 h-4 mr-1" /> File
                </a>
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
    <!-- END: Data List -->

    <!-- BEGIN: Modal Booking Content -->
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
                        Project Information
                        {{
                          dataForm.quote_code ? " : " + dataForm.quote_code : ""
                        }}
                      </h2>
                    </Dialog.Title>
                    <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-1">Title</FormLabel>
                        <FormInput :value="dataForm.quote_title" type="text" placeholder="project title"
                          v-model="dataForm.quote_title" :error="$v.quote_title.$error" :class="{
                            'border-danger': $v.quote_title.$error,
                          }" :disabled="dataForm.is_update ? false : true" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Client</FormLabel>
                        <TomSelect name="cboClient" v-model="cboClient" :error="$v.client_id.$error"
                          :disabled="dataForm.is_update ? false : true" :class="{ 'border-danger': $v.client_id.$error }">
                          <option v-for="items in list_clients" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4">Date</FormLabel>

                        <div class="relative w-30 mx-auto">
                          <div
                            class="absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                            <Lucide icon="Calendar" class="w-4 h-4" />
                          </div>
                          <Litepicker v-model="date" formattedDate="YYYY-MM-DD" :options="{
                            autoApply: false,
                            showWeekNumbers: false,
                            dropdowns: {
                              minYear: 2020,
                              maxYear: null,
                              months: true,
                              years: true,
                            },
                          }" class="pl-12" :disabled="dataForm.is_update ? false : true" />
                        </div>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-4">House number
                        </FormLabel>
                        <FormInput type="text" :value="dataForm.house_number" placeholder="House number"
                          :disabled="dataForm.is_update ? false : true" v-model="dataForm.house_number" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-6">Address</FormLabel>
                        <TomSelect name="cboAddress" v-model="cboAddress" :value="cboAddress"
                          :disabled="dataForm.is_update ? false : true">
                          <option v-for="items in provinces" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="modal-form-4">
                          Link Google Map
                        </FormLabel>
                        <FormInput type="text" :value="dataForm.google_map" placeholder="Google Map"
                          v-model="dataForm.google_map" />
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Status</FormLabel>
                        <TomSelect name="cboStatus" v-model="cboStatus" :error="$v.quote_status.$error"
                          :class="{ 'border-danger': $v.quote_status.$error }">
                          <option v-for="items in list_status" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="modal-form-1">Lead by</FormLabel>
                        <TomSelect name="cboLeader" v-model="cboLeader" :error="$v.quote_leader.$error"
                          :class="{ 'border-danger': $v.quote_leader.$error }">
                          <option v-for="items in list_leader" :value="items.id" :key="items.id">
                            {{ items.name }}
                          </option>
                        </TomSelect>
                      </div>

                      <div class="col-span-12 sm:col-span-12">
                        <FormLabel htmlFor="remark"> Remark </FormLabel>
                        <FormTextarea v-model="dataForm.remark" :value="dataForm.remark" placeholder="type your comment">
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
                        :disable="$v.$invalid" @click="create()">
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
