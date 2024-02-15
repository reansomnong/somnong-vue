<script setup lang="ts">
import _ from "lodash";
import { ref, onMounted, computed, watch, reactive } from "vue";
import Lucide from "../../../base-components/Lucide";
import { Tab } from "../../../base-components/Headless";
import { useMenuStore } from "../../../stores/admin/Menu_order";
import draggable from "vuedraggable";
import {
  menu_arr,
  Permission,
} from "../../../models/admin/Menu";
import { Dialog } from "../../../base-components/Headless";
import Preview from "../../../base-components/Preview";
import Button from "../../../base-components/Button";
import { required, minLength, helpers } from "@vuelidate/validators";
import TomSelect from "../../../base-components/TomSelect";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

import {
  FormLabel,
} from "../../../base-components/Form";
import { useVuelidate } from "@vuelidate/core";

const deleteButtonRef = ref(null);
const dataForm = reactive<menu_arr>({} as menu_arr);
const Permission = useMenuStore();
const p_menu_id = ref("");
const p_status_Menu = ref("");
const main_status = ref("");

const SelectMenuID = ref("0");
const SubMenuID = ref(["0"]);
const ProfileID = ref("0");

const staticBackdropModalPreview = ref(false);
const setStaticBackdropModalPreview = (value: boolean) => {
  Permission.profile(dataMenu.system_id);
  staticBackdropModalPreview.value = value;
};

const deleteModalPreview = ref(false);
const setDeleteModalPreview = (value: boolean) => {
  deleteModalPreview.value = value;
};

const sendButtonRef = ref(null);
const dataMenu = reactive<Permission>({} as Permission);
const Sub_Menu = reactive<Permission>({} as Permission);
const deleteMenu = reactive<Permission>({} as Permission);
const list_menu = reactive([
  {
    id: "",
    name: "None",
  },
]);

const sub_list_menu = reactive([
  {
    id: "",
    name: "None",
    active: true,
  },
]);

watch(SelectMenuID, () => {
  dataMenu.menu_id = SelectMenuID.value;
  dataMenu.status = "i";
  if (SelectMenuID.value !== null) {
    Permission.get_sub_menu_list(SelectMenuID.value);
  }
});

watch(ProfileID, () => {
  dataMenu.profile_id = ProfileID.value;
});

const rules = computed(() => {
  return {
    profile_id: {
      required: helpers.withMessage(
        "Please select profile is required",
        required
      ),
      minLength: minLength(1),
    },
    menu_id: {
      required: helpers.withMessage("Please select menu is required", required),
      minLength: minLength(1),
    },
    system_id: {
      required: helpers.withMessage(
        "Please choose system is required",
        required
      ),
      minLength: minLength(1),
    },
  };
});

const isok = computed(() => {
  return {
    menu_id: {
      required: helpers.withMessage("Please choose menu is required", required),
      minLength: minLength(1),
    },
  };
});

const $v = useVuelidate(rules, dataMenu, { $autoDirty: true });
const $v1 = useVuelidate(isok, deleteMenu, { $autoDirty: true });

function resetForm() {
  p_status_Menu.value = "";
  sub_list_menu.splice(0);
}

onMounted(async () => {
  await Permission.menu_list("permission_main");
  main_menu.value.forEach((id) => {
    list_menu.push({ id: id.id, name: id.title });
  });
});

const show_sub_menu = computed(() => {
  return Permission.get_show_sub;
});

const main_menu = computed(() => {
  return Permission.getMenus;
});

const profile = computed(() => {
  return Permission.getProfile;
});

const sub_menu = computed(() => {
  return Permission.getSubMenu;
});

const systems = computed(() => {
  return Permission.getSystem;
});

watch(list_menu, async () => {
  if (sub_menu.value.length > 0) {
    for (let i = 0; i < list_menu.length; i++) {
      dataForm.id = list_menu[i].id;
      dataForm.name = list_menu[i].name;
      dataForm.index = i;
      await Permission.update_menu(dataForm);
    }
  }
});

watch(sub_menu, async () => {
  // clear array before add
  sub_list_menu.splice(0);
  sub_menu.value.forEach((id) => {
    sub_list_menu.push({ id: id.id, name: id.title, active: id.active });
  });
});

watch(sub_list_menu, async () => {
  if (sub_menu.value.length > 0) {
    for (let i = 0; i < sub_list_menu.length; i++) {
      dataForm.id = sub_list_menu[i].id;
      dataForm.name = sub_list_menu[i].name;
      dataForm.index = i;
      if (main_status.value == "sub") {
        // await Permission.update_menu(dataForm);
      }
    }
  }
});

async function load_data(status: string) {
  resetForm();
  await Permission.menu_list(status);
}

async function load_sub_menu(id: string) {
  p_menu_id.value = id;
  await Permission.sub_menu_list(id);
}

async function main_check(params: string) {
  if (params !== "") {
    main_status.value = "main";
  }
}

async function del_permission(id: string) {
  deleteMenu.id = id;
  deleteMenu.menu_id = id;
  deleteMenu.system_id = dataMenu.system_id;
  deleteMenu.status = "delete";
  setDeleteModalPreview(true);
}

async function system_check(id: string) {
  p_status_Menu.value = "P";
  dataMenu.system_id = id;
  await Permission.menu_by_system(id);
}

async function sub_check(params: string) {
  if (params !== "") {
    main_status.value = "sub";
  }
}

async function delete_permission() {
  $v1.value.$touch();
  if ($v1.value.$invalid) {
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
    deleteMenu.status = "delete";

    var response = await Permission.delete_permission(deleteMenu);
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

      setDeleteModalPreview(false);
      resetForm();
      $v1.value.$reset();
      system_check(deleteMenu.system_id);
    }
  }
}
</script>
<template>
  <div class="grid grid-cols-12 gap-5 mt-5 intro-y">
    <!-- BEGIN: Chat Side Menu -->
    <Tab.Group class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <div class="pr-1 intro-y">
        <div class="p-2 box">
          <Tab.List variant="pills">
            <Tab>
              <Tab.Button class="w-full py-2" @click="load_data('permission_main')" as="button">
                List Order Menu
              </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
      </div>
      <Tab.Panels>
        <Tab.Panel>
          <div class="pt-1 pr-1 mt-4 overflow-y-auto h-[525px] scrollbar-hidden">
            <draggable :list="list_menu" group="ul" item-key="id">
              <template #item="{ element: menu }">
                <div v-if="menu.id !== ''" class="intro-x cursor-pointer box relative flex items-center p-5 mt-1"
                  @click="load_sub_menu(menu.id)">
                  <div class="flex items-center" @click="main_check(menu.id)">
                    <a href="#" class="font-medium">
                      {{ menu.name }}
                    </a>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </Tab.Panel>
        <Tab.Panel>
          <div class="pt-1 pr-1 mt-4 overflow-y-auto h-[525px] scrollbar-hidden">
            <draggable :list="systems" group="ul" item-key="id">
              <template #item="{ element: systems }">
                <div v-if="systems.id !== ''" class="intro-x cursor-pointer box relative flex items-center p-5 mt-1"
                  @dblclick="setStaticBackdropModalPreview(true)" @click="system_check(systems.id)">
                  <div class="flex items-center">
                    <a href="#" class="font-medium">
                      {{ systems.id }} / {{ systems.name }}
                    </a>
                  </div>
                </div>
              </template>
            </draggable>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    <!-- END: Chat Side Menu -->

    <!-- BEGIN: Chat Content -->
    <div class="col-span-12 intro-y lg:col-span-8 2xl:col-span-9">
      <div class="h-[782px] box">
        <!-- BEGIN: Chat Default -->
        <div class="flex flex-col-reverse border-b sm:flex-row border-slate-200/60">
          <draggable :list="sub_list_menu" group="ul" item-key="id">
            <template #item="{ element: menu }">
              <div v-if="menu.id !== ''">
                <div class="overflow-x-auto sm:overflow-x-visible">
                  <div :class="[
                    'transition duration-200 ease-in-out transform cursor-pointer inline-block sm:block border-b border-slate-200/60 dark:border-darkmode-400',
                    'hover:scale-[1.02] hover:relative hover:z-20 hover:shadow-md hover:border-0 hover:rounded',
                  ]">
                    <div class="flex px-5 py-3" @click="sub_check(menu.id)">
                      <div class="flex items-center flex-none mr-5 w-72">
                        <a href="#" class="flex items-center justify-center flex-none w-5 h-5 ml-4 text-slate-400">
                          <Lucide icon="Star" class="w-4 h-4" />
                        </a>

                        <div :class="['ml-3 truncate']">
                          {{ menu.name }}
                        </div>
                      </div>

                      <div class="flex items-center justify-center" v-if="p_status_Menu != ''">
                        <a class="flex items-center mr-3 text-danger" href="" @click="(event) => {
                            event.preventDefault();
                            del_permission(menu.id);
                          }
                          ">
                          <Lucide icon="Trash" class="w-4 h-4 mr-1" />
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
        </div>
        <!-- END: Chat Default -->
      </div>
    </div>
    <!-- END: Chat Content -->
  </div>

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
                      Add permission into list
                    </h2>
                  </Dialog.Title>
                  <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
                    <div class="col-span-12">
                      <FormLabel htmlFor="pos-form-1">Profile </FormLabel>
                      <select
                        id="small"
                        v-model="ProfileID"
                        class="block w-full p-2 mb-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        :error="$v.profile_id.$error"
                        :class="{ 'border-danger': $v.profile_id.$error }">
                        <option
                          v-for="items in profile"
                          :value="items.id"
                          :key="items.id"
                        >
                          {{ items.name }}
                        </option>
                      </select>


                    </div>

                    <div class="col-span-12">
                      <FormLabel htmlFor="pos-form-1">Menu</FormLabel>
                      <TomSelect name="profile_id" v-model="SelectMenuID" :value="SelectMenuID" :error="$v.menu_id.$error"
                        :class="{ 'border-danger': $v.menu_id.$error }">
                        <option v-for="items in list_menu" :value="items.id" :key="items.id">
                          {{ items.name }}
                        </option>
                      </TomSelect>
                    </div>

                    <div class="col-span-12">
                      <FormLabel htmlFor="post-form-3">Sub menu</FormLabel>
                      <TomSelect id="post-form-3" v-model="SubMenuID" :value="SubMenuID" class="w-full" multiple>
                        <option v-for="items in show_sub_menu" :value="items.id" :key="items.id">
                          {{ items.title }}
                        </option>
                      </TomSelect>
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
                      :disable="$v.$invalid" >
                      Add
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

  <!-- BEGIN: Reject Modal Contxent -->
  <Dialog :open="deleteModalPreview" @close="() => {
      setDeleteModalPreview(false);
    }
    " :initialFocus="deleteButtonRef">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Are you sure to remove ?</div>
        <div class="mt-2 text-slate-500">Menu ID : {{ deleteMenu.id }}</div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="outline-secondary" @click="() => {
            setDeleteModalPreview(false);
          }
          " class="w-24 mr-1">
          Cancel
        </Button>
        <Button type="button" variant="danger" class="w-24" ref="{deleteButtonRef}" @click="() => {
            delete_permission();
          }
          ">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->

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
</template>

<style scoped>
.drop-zone {
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
</style>
../../../stores/admin/Menu_order