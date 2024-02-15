<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, watch, onMounted, provide } from "vue";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import TomSelect from "../../../base-components/TomSelect";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSwitch,
} from "../../../base-components/Form";
import Tippy from "../../../base-components/Tippy";

import Lucide from "../../../base-components/Lucide";
import { Menu, Dialog } from "../../../base-components/Headless";
import FileIcon from "../../../base-components/FileIcon";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

//Message
import { NotificationElement } from "../../../base-components/Notification";
import Notification from "../../../base-components/Notification";
import { useMessageStore } from "../../../stores/pos/POS_Messages";

// For upload image
import { SelectedFile } from "../../../models/pos/SelectedFile";

//Model
import { Product, product_image } from "../../../models/pos/Product";

//Stores
import { useProductStore } from "../../../stores/pos/Product";

// Basic sticky notification
const basicStickyNotification = ref<NotificationElement>();
const basicStickyNotificationToggle = () => {
  // Show notification
  basicStickyNotification.value?.showToast();
};

provide("bind[basicStickyNotification]", (el: NotificationElement) => {
  basicStickyNotification.value = el;
});

const staticBackdropModalPreview = ref(false);
const setStaticBackdropModalPreview = (value: boolean) => {
  staticBackdropModalPreview.value = value;
};

//
const selectedFiles = ref([] as SelectedFile[]);

const ImageModalPreview = ref(false);
const setImageModalPreview = (value: boolean) => {
  ImageModalPreview.value = value;
};

const sendButtonRef = ref(null);
const message = useMessageStore();
const Products = useProductStore();

const dataForm = reactive<Product>({} as Product);
const ImageForm = reactive<product_image>({} as product_image);

const CboCategories = ref("0");
const Cbo_pro_line = ref("0");
const Cbo_pro_color = ref("0");
const Cbo_pro_year = ref("0");

const message_alert = ref("");
const message_status = ref("");
const activeId = ref("0");

// load data  pro_line
const list_categories = computed(() => {
  return Products.getCategories;
});

const list_pro_line = computed(() => {
  return Products.getLine;
});
const list_pro_color = computed(() => {
  return Products.getColor;
});
const list_pro_year = computed(() => {
  return Products.getYear;
});
45;

const items = computed(() => {
  return Products.getItemsById;
});

const list_items = computed(() => {
  return Products.getItemsDetail;
});

const product_image = computed(() => {
  return Products.getProduct_image;
});

watch(CboCategories, () => {
  dataForm.category_code = CboCategories.value;
});

watch(Cbo_pro_line, () => {
  dataForm.line_code = Cbo_pro_line.value;
});

watch(Cbo_pro_color, () => {
  dataForm.color_code = Cbo_pro_color.value;
});

watch(Cbo_pro_year, () => {
  dataForm.year_code = Cbo_pro_year.value;
});
// End load data

onMounted(async () => {
  resetForm();
  await Products.ItemsList();
  await Products.ComboCatogories();
  await Products.ComboLine();
  await Products.ComboYear();
  await Products.ComboColor();
});

function resetForm() {
  dataForm.branch_code = "";
  dataForm.pro_code = "";
  dataForm.pro_name = "";
  dataForm.barcode = "";
  dataForm.category_code = "";
  dataForm.line_code = "";
  dataForm.color_code = "";
  dataForm.year_code = "";

  dataForm.cost = 0.0;
  dataForm.unitprice = 0.0;
  dataForm.discount = 0.0;
  dataForm.qty_alert = 0.0;
  dataForm.remark = "";

  dataForm.active = true;
  dataForm.tracking = true;

  dataForm.status = "i";
  CboCategories.value = "";
  Cbo_pro_color.value = "";
  Cbo_pro_line.value = "";
  Cbo_pro_year.value = "";
}

const rules = computed(() => {
  return {
    pro_name: {
      required: helpers.withMessage("Product name is required", required),
      minLength: minLength(3),
    },
    barcode: {
      required: helpers.withMessage("Barcode is required", required),
      minLength: minLength(3),
    },
    category_code: {
      required: helpers.withMessage("Cateogry is required", required),
      minLength: minLength(2),
    },
    line_code: {
      required: helpers.withMessage("Product line is required", required),
      minLength: minLength(2),
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
    var response = await Products.create_product(dataForm);
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

      await Products.ItemsList();
    }
  }
}

async function load_product(id: string) {
  resetForm();
  await Products.ItemsById(id);

  dataForm.status = "u";
  dataForm.pro_code = items.value[0]["pro_code"] as string;
  dataForm.pro_name = items.value[0]["pro_name"] as string;
  dataForm.barcode = items.value[0]["barcode"] as string;
  dataForm.cost = items.value[0]["cost"];
  dataForm.unitprice = items.value[0]["unitprice"];
  dataForm.discount = items.value[0]["discount"];

  dataForm.discount = items.value[0]["discount"];
  dataForm.qty_alert = items.value[0]["qty_alert"];

  CboCategories.value = items.value[0]["category_code"] as string;
  Cbo_pro_line.value = items.value[0]["line_code"] as string;
  Cbo_pro_color.value = items.value[0]["color_code"] as string;
  Cbo_pro_year.value = items.value[0]["year_code"] as string;

  dataForm.active = dataForm.active = items.value[0].active ? true : false;
  dataForm.tracking = dataForm.tracking = items.value[0].tracking
    ? true
    : false;

  setStaticBackdropModalPreview(true);
}

async function load_product_by_category(category_code: string) {
  activeId.value = category_code;

  if (category_code == "0") {
    await Products.ItemsList();
  } else {
    await Products.ItemsByCategory(category_code);
  }
}

async function load_image(id: string) {
  dataForm.pro_code = id;
  await Products.product_image(id);
}

const clearFiles = () => (selectedFiles.value = []);
const onSelectFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files === null) {
    return;
  }
  clearFiles();
  Array.from(target.files).forEach((file: File) => {
    selectedFiles.value.push({
      referent_id: dataForm.pro_code,
      file: file,
      percentage: 0,
      status: "pending",
    } as SelectedFile);
  });

  selectedFiles.value.forEach((file: SelectedFile) => {
    file.status = "uploading";
    file.percentage = 0;

    Products.upload_image(file.file, dataForm.pro_code);
  });
};

async function delete_image(id: string) {
  ImageForm.pro_code = dataForm.pro_code;
  ImageForm.row = id;
  await Products.delete_image(ImageForm);
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-8">
    <div class="col-span-12 lg:col-span-3 2xl:col-span-2">
      <h2 class="mt-2 mr-auto text-lg font-medium intro-y">Product list</h2>
      <!-- BEGIN: File Manager Menu -->
      <div class="p-5 mt-6 intro-y box">
        <div class="mt-1">
          <a
            href="#"
            @click="load_product_by_category(cat.id)"
            :class="[
              'flex items-center px-3 py-2 mt-2 rounded-md ',
              { 'text-white bg-primary': activeId == cat.id },
            ]"
            v-for="cat in list_categories"
            :key="cat.id"
          >
            <Lucide icon="Image" class="w-4 h-4 mr-2" />
            <p v-if="cat.id == '0'">All</p>
            <p v-else-if="cat.id != '0'">{{ cat.name }}</p>
          </a>
        </div>
        <div
          class="pt-4 mt-4 border-t border-slate-200 dark:border-darkmode-400"
        >
          <a href="" class="flex items-center px-3 py-2 rounded-md">
            <div class="w-2 h-2 mr-3 rounded-full bg-pending"></div>
            Custom Work
          </a>
          <a href="" class="flex items-center px-3 py-2 mt-2 rounded-md">
            <div class="w-2 h-2 mr-3 rounded-full bg-success"></div>
            Important Meetings
          </a>
        </div>
      </div>
      <!-- END: File Manager Menu -->
    </div>
    <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
      <!-- BEGIN: File Manager Filter -->
      <div class="flex flex-col-reverse items-center intro-y sm:flex-row">
        <div class="relative w-full mt-3 mr-auto sm:w-auto sm:mt-0">
          <Lucide
            icon="Search"
            class="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3 text-slate-500"
          />
          <FormInput
            type="text"
            class="w-full px-10 sm:w-64 !box"
            placeholder="Search files"
          />
          <Menu class="absolute inset-y-0 right-0 flex items-center mr-3">
            <Menu.Button as="a" role="button" class="block w-4 h-4" href="#">
              <Lucide
                icon="ChevronDown"
                class="w-4 h-4 cursor-pointer text-slate-500"
              />
            </Menu.Button>
          </Menu>
        </div>
        <div class="flex w-full sm:w-auto">
          <Button
            variant="primary"
            class="mr-2 shadow-md"
            @click="
              () => {
                setStaticBackdropModalPreview(true);
              }
            "
          >
            New Product
          </Button>
          <Menu>
            <Menu.Button :as="Button" class="px-2 !box">
              <span class="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" class="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items class="w-40">
              <Menu.Item>
                <Lucide icon="File" class="w-4 h-4 mr-2" /> Share Files
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="Settings" class="w-4 h-4 mr-2" /> Settings
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <!-- END: File Manager Filter -->
      <!-- BEGIN: Directory & Files -->
      <div class="grid grid-cols-12 gap-3 mt-5 intro-y sm:gap-6">
        <div
          v-for="item in list_items"
          :key="item.pro_code"
          class="col-span-6 intro-y sm:col-span-4 md:col-span-3 2xl:col-span-2"
        >
          <div
            class="relative px-3 pt-8 pb-5 rounded-md file box sm:px-5 zoom-in"
          >
            <div class="absolute top-0 left-0 mt-3 ml-3">
              <FormCheck.Input
                class="border"
                type="checkbox"
                :checked="item.active"
              />
            </div>
            <FileIcon
              v-if="item.url"
              class="w-3/5 mx-auto"
              variant="image"
              :src="item.url"
              @click="
                (event) => {
                  event.preventDefault();
                  load_product(item.pro_code);
                }
              "
            />

            <FileIcon
              v-else
              class="w-3/5 mx-auto"
              variant="directory"
              :src="item.url"
              @click="
                (event) => {
                  event.preventDefault();
                  load_product(item.pro_code);
                }
              "
            />
            <a href="#" class="block mt-4 font-medium text-center truncate">
              {{ item.pro_name }}
            </a>
            <div class="text-slate-500 text-xs text-center mt-0.5">
              {{ item.unitprice }}
            </div>

            <Menu class="absolute top-0 right-0 mt-3 ml-auto mr-2">
              <Menu.Button as="a" class="block w-5 h-5" href="#">
                <Lucide icon="MoreVertical" class="w-5 h-5 text-slate-500" />
              </Menu.Button>
              <Menu.Items class="w-40">
                <Menu.Item>
                  <Lucide icon="Users" class="w-4 h-4 mr-2" /> Share File
                </Menu.Item>
                <Menu.Item
                  @click="(event: MouseEvent) => {
                  event.preventDefault();
                  load_image(item.pro_code);
                  setImageModalPreview(true);
                }"
                >
                  <Lucide icon="Trash" class="w-4 h-4 mr-2" /> Upload image
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
      <!-- END: Directory & Files -->
      <!-- BEGIN: Pagination -->
      <div
        class="flex flex-wrap items-center mt-6 intro-y sm:flex-row sm:flex-nowrap"
      >
        <Pagination class="w-full sm:w-auto sm:mr-auto">
          <Pagination.Link>
            <Lucide icon="ChevronsLeft" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronLeft" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>...</Pagination.Link>
          <Pagination.Link>1</Pagination.Link>
          <Pagination.Link active>2</Pagination.Link>
          <Pagination.Link>3</Pagination.Link>
          <Pagination.Link>...</Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronRight" class="w-4 h-4" />
          </Pagination.Link>
          <Pagination.Link>
            <Lucide icon="ChevronsRight" class="w-4 h-4" />
          </Pagination.Link>
        </Pagination>
      </div>
      <!-- END: Pagination -->
    </div>

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
          <h2 class="mr-auto text-base font-medium">Product Information</h2>
          <FormSwitch class="mt-2">
            <FormSwitch.Input
              :checked="dataForm.active"
              v-model="dataForm.active"
              type="checkbox"
            />
          </FormSwitch>
        </Dialog.Title>
        <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-1">Name</FormLabel>
            <FormInput
              v-model="dataForm.pro_name"
              type="text"
              placeholder="Product name"
            />
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-2">Barcode</FormLabel>
            <FormInput
              v-model="dataForm.barcode"
              type="text"
              placeholder="Barcode"
            />
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3">Cost </FormLabel>
            <FormInput v-model="dataForm.cost" type="text" placeholder="Cost" />
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-4"> Unit Price </FormLabel>
            <FormInput
              v-model="dataForm.unitprice"
              type="text"
              placeholder="Unit price"
            />
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5"> Discount </FormLabel>
            <FormInput
              v-model="dataForm.discount"
              type="text"
              placeholder="Discount"
            />
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">Alert</FormLabel>
            <FormInput
              v-model="dataForm.qty_alert"
              type="text"
              placeholder="Stock alert"
            />
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">Category</FormLabel>
            <TomSelect id="crud-form-2" v-model="CboCategories" class="w-full">
              <option
                v-for="items in list_categories"
                :value="items.id"
                :key="items.id"
              >
                {{ items.name }}
              </option>
            </TomSelect>
          </div>
          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">Line</FormLabel>
            <TomSelect v-model="Cbo_pro_line" class="w-full">
              <option
                v-for="items in list_pro_line"
                :value="items.id"
                :key="items.id"
              >
                {{ items.name }}
              </option>
            </TomSelect>
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-7">Color</FormLabel>
            <TomSelect v-model="Cbo_pro_color" class="w-full">
              <option
                v-for="items in list_pro_color"
                :value="items.id"
                :key="items.id"
              >
                {{ items.name }}
              </option>
            </TomSelect>
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">Years</FormLabel>
            <TomSelect id="crud-form-2" v-model="Cbo_pro_year" class="w-full">
              <option
                v-for="items in list_pro_year"
                :value="items.id"
                :key="items.id"
              >
                {{ items.name }}
              </option>
            </TomSelect>
          </div>

          <div class="col-span-12 sm:col-span-6">
            <FormSwitch class="flex flex-col items-start mt-3">
              <FormSwitch.Label htmlFor="post-form-5" class="mb-2 ml-0">
                Stock tracking
              </FormSwitch.Label>
              <FormSwitch.Input
                :checked="dataForm.tracking"
                v-model="dataForm.tracking"
                id="post-form-5"
                type="checkbox"
              />
            </FormSwitch>
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

    <!-- BEGIN: Modal Content -->
    <Dialog
      :open="ImageModalPreview"
      @close="
        () => {
          setImageModalPreview(false);
        }
      "
      :initialFocus="sendButtonRef"
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 class="mr-auto text-base font-medium">Refresh image</h2>
          <Button variant="outline-secondary" class="hidden sm:flex">
            <Lucide icon="File" class="w-4 h-4 mr-2" /> Upload Images

            <FormInput
              type="file"
              class="absolute top-0 left-0 w-full h-full opacity-0"
              accept="image/png, image/jpeg"
              @change="onSelectFiles"
            />
          </Button>
          <Menu class="sm:hidden">
            <Menu.Button class="block w-5 h-5" href="#">
              <Lucide icon="MoreHorizontal" class="w-5 h-5 text-slate-500" />
            </Menu.Button>
            <Menu.Items class="w-40">
              <Menu.Item>
                <Lucide icon="File" class="w-4 h-4 mr-2" />
                Download Image
                <FormInput
                  type="file"
                  class="absolute top-0 left-0 w-full h-full opacity-0"
                  accept="image/png, image/jpeg"
                  @change="onSelectFiles"
                />
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </Dialog.Title>
        
        <Dialog.Description class="grid grid-cols-5 gap-5 gap-y-3">
          <div class="col-span-12 intro-y lg:col-span-10">
            <div class="grid grid-cols-12 gap-1 pt-5 mt-5">
              <a
                v-for="image in product_image"
                :key="image.row"
                href="#"
                class="block col-span-12 intro-y sm:col-span-4 2xl:col-span-3"
              >
                <div class="relative p-3 rounded-md box zoom-in">
                  <div
                    class="flex-none relative block before:block before:w-full before:pt-[100%]"
                  >
                    <div class="absolute top-0 left-0 w-full h-full image-fit">
                      <img
                        alt="Midone Tailwind HTML Admin Template"
                        class="rounded-md"
                        :src="image.url"
                      />
                      <Tippy
                        as="div"
                        content="Remove this image ?"
                        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                        @click="delete_image(image.row)"
                      >
                        <Lucide icon="X" class="w-4 h-4" />
                      </Tippy>
                    </div>
                  </div>
                  <div class="block mt-3 font-medium text-center truncate">
                    {{ image.pro_name }}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </Dialog.Description>
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
