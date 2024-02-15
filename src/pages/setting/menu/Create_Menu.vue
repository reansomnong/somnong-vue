<script setup lang="ts">
import _ from "lodash";
import { ref, reactive, computed, watch, onMounted } from "vue";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";

import {
	FormInput,
	FormLabel,
	FormSwitch,
} from "../../../base-components/Form";

import { Dialog } from "../../../base-components/Headless";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import { AddMenu } from "../../../models/admin/Menu";

import TomSelect from "../../../base-components/TomSelect";
import { useMenuStore } from "../../../stores/admin/Menus";
import Toastify from "toastify-js";
import Notification from "../../../base-components/Notification";

const Menu = useMenuStore();
const SelectParentID = ref("0");
const dataForm = reactive<AddMenu>({} as AddMenu);

const successModalPreview = ref(false);
const setSuccessModalPreview = (value: boolean) => {
	successModalPreview.value = value;
};

const rules = computed(() => {
	return {
		icon: {
			required: helpers.withMessage("Icon is required", required),
			minLength: minLength(3),
		},
		page_name: {
			required: helpers.withMessage("Page name is required", required),
			minLength: minLength(1),
		},
		title: {
			required: helpers.withMessage("Title is required", required),
			minLength: minLength(3),
		},
		parent_id: {
			minLength: minLength(1),
		},
	};
});

function clear() {
	dataForm.status = 'i';
	dataForm.icon = '';
	dataForm.title = '';
	dataForm.page_name = '';
	dataForm.parent_id = '';
	dataForm.active = true;
	$v.value.$reset();
}

onMounted(async () => {
	dataForm.active = true;
	dataForm.status = 'i';

	await Menu.getMainMenu();
	await Menu.getListMenus();
});
const menu_parent = computed(() => {
	return Menu.getMenus;
});

const menu_byId = computed(() => {
	return Menu.getDetailbyId;
});


const menuList = computed(() => {
	return Menu.getMenuDetail;
});

async function loaddata(id: string) {
	await Menu.getMenuById(id);
	dataForm.status = 'u';
	
	dataForm.id = menu_byId.value[0]['id'] as string;
	dataForm.active = menu_byId.value[0]['active'] as boolean;
	dataForm.icon = menu_byId.value[0]['icon'] as string;
	dataForm.page_name = menu_byId.value[0]['pagename'] as string;
	dataForm.title = menu_byId.value[0]['title'] as string;

	SelectParentID.value = menu_byId.value[0]['parent_id'] as string;

}
watch(SelectParentID, () => {
	dataForm.parent_id = SelectParentID.value;
});

const $v = useVuelidate(rules, dataForm, { $autoDirty: true });

async function create_menus() {
	$v.value.$touch();

	if (typeof dataForm.parent_id === "undefined") {
		console.log('undefined');
	}

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
		var response = await Menu.create_menu(dataForm);

		if (response) {
			$v.value.$reset();
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


			await Menu.getMainMenu();
			await Menu.getListMenus();

		}
	}
}
</script>

<template>
	<!-- BEGIN: Transaction Details -->
	<div class="grid grid-cols-11 gap-5 mt-5 intro-y">
		<!-- BEGIN: Register Userinfo -->
		<div class="col-span-12 lg:col-span-4 2xl:col-span-3">
			<div class="p-5 mt-5 rounded-md box">
				<div class="col-span-12 sm:col-span-6">
					<FormLabel htmlFor="modal-form-1">Parent</FormLabel>
					<TomSelect class="w-full" name="parent_id" v-model="SelectParentID"
						:options="{ placeholder: 'Select parent menu', }" :error="$v.parent_id.$error"
						:class="{ 'border-danger': $v.parent_id.$error, }">
						<option v-for="items in menu_parent" :value="items.id" :key="items.id">
							{{ items.name }}
						</option>
					</TomSelect>
				</div>

				<div class="col-span-12 sm:col-span-6">
					<FormLabel htmlFor="modal-form-1">Icon</FormLabel>
					<FormInput name="icon" id="icon" type="text" placeholder="icon" v-model="dataForm.icon"
						:value="dataForm.icon" :error="$v.icon.$error" :class="{
							'border-danger': $v.icon.$error,
						}" />
					<template v-if="$v.icon.$errors">
						<div v-for="(error, index) in $v.icon.$errors" :key="index" class="mt-2 text-danger">
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div class="col-span-12 sm:col-span-6">
					<FormLabel htmlFor="modal-form-3"> Page Name </FormLabel>
					<FormInput name="pagename" id="pagename" type="text" placeholder="page name"
						v-model="dataForm.page_name" :value="dataForm.page_name" :error="$v.page_name.$error" :class="{
							'border-danger': $v.page_name.$error,
						}" />
					<template v-if="$v.page_name.$errors">
						<div v-for="(error, index) in $v.page_name.$errors" :key="index" class="mt-2 text-danger">
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div class="col-span-12 sm:col-span-6">
					<FormLabel htmlFor="modal-form-3"> Title </FormLabel>
					<FormInput name="email" type="email" placeholder="titile" v-model="dataForm.title"
						:value="dataForm.title" :error="$v.title.$error" :class="{
							'border-danger': $v.title.$error,
						}" />
					<template v-if="$v.title.$errors">
						<div v-for="(error, index) in $v.title.$errors" :key="index" class="mt-2 text-danger">
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div class="col-span-12 sm:col-span-6">
					<FormLabel htmlFor="modal-form-3"> Active </FormLabel>
					<FormSwitch class="mt-2">
						<FormSwitch.Input name="active" id="ch_active" :checked="dataForm.active" v-model="dataForm.active"
							type="checkbox" />
					</FormSwitch>
				</div>

				<div class="flex items-center pt-5 mt-5 font-medium border-t border-slate-200/60 dark:border-darkmode-400">
					<div class="ml-auto">
						<Button type="button" variant="outline-secondary" class="w-24 mr-1" @click="clear()">
						  Clear
						</Button>
			
						<Button variant="outline-success" class="inline-block w-24 mb-2 mr-1" @click="create_menus()">
						  Create
						</Button>
			
			
					  </div>
				</div>
			</div>
		</div>

		<!-- END: Register user Content -->

		<div class="col-span-12 lg:col-span-7 2xl:col-span-8">
			<!-- BEGIN: Data List -->
			<div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
				<Table class="border-spacing-y-[10px] border-separate -mt-2">
					<Table.Thead>
						<Table.Tr>
							<Table.Th class="border-b-0 whitespace-nowrap">
								Title
							</Table.Th>
							<Table.Th class="border-b-0 whitespace-nowrap"> Parent </Table.Th>
							<Table.Th class="border-b-0 whitespace-nowrap"> Icone </Table.Th>
							<Table.Th class="text-center border-b-0 whitespace-nowrap">
								STATUS
							</Table.Th>
							<Table.Th class="text-center border-b-0 whitespace-nowrap">
								ACTIONS
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						<Table.Tr v-for="list in menuList" :key="list.id" class="intro-x">
							<Table.Td
								class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
								<a href="" class="font-medium whitespace-nowrap">
									{{ list.title }}
								</a>
								<div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
									Tags: {{ list.id }}-{{ list.pagename }}
								</div>
							</Table.Td>
							<Table.Td
								class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
								{{ list.parent_name }}
							</Table.Td>

							<Table.Td
								class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
								{{ list.icon }}
							</Table.Td>

							<Table.Td
								class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
								<div :class="[
									'flex items-center justify-center',
									{ 'text-success': list.active },
									{ 'text-danger': !list.active },
								]">
									<Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
									{{ list.active ? "Active" : "Inactive" }}
								</div>
							</Table.Td>
							<Table.Td
								class="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
								<div class="flex items-center justify-center">
									<a class="flex items-center mr-3" href="" @click="
										(event) => {
											event.preventDefault();
											loaddata(list.id);
										}">

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
		</div>

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

		<!-- BEGIN: Failed Notification Content -->
		<Notification id="failed-notification-parent_menu" class="flex hidden">
			<Lucide icon="XCircle" class="text-danger" />
			<div class="ml-4 mr-4">
				<div class="mt-1 text-slate-500">Please select parent menu.</div>
			</div>
		</Notification>
		<!-- END: Failed Notification Content -->

		<!-- BEGIN: Modal Content -->
		<Dialog :open="successModalPreview" @close="
			() => {
				setSuccessModalPreview(false);
			}
		">
			<Dialog.Panel>
				<div class="p-5 text-center">
					<Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
					<div class="mt-5 text-3xl">Plz verify email !</div>
					<div class="mt-2 text-slate-500">
						Email already existing !
					</div>
				</div>
				<div class="px-5 pb-8 text-center">
					<Button type="button" variant="primary" @click="
						() => {
							setSuccessModalPreview(false);
						}" class="w-24">Ok</Button>
				</div>
			</Dialog.Panel>
		</Dialog>
		<!-- END: Modal Content -->

	</div>
	<!-- END: Transaction Details -->
</template>
