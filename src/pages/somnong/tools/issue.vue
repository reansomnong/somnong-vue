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
      class="col-span-12 overflow-auto intro-y lg:overflow-visible"
      role="alert"
    >
      <div class="flex">
        <div class="py-1">
          <svg
            class="fill-current h-6 w-6 text-teal-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"
            />
          </svg>
        </div>
        <div>
          <p class="font-bold">Function comming soon </p>
        </div>
      </div>
    </div>

    <!-- END: Data List -->

  </div>
</template>

