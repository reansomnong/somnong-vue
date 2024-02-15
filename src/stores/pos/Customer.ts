import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { Customer } from '../../models/pos/Customer';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface CustomerStore {
    ItemDetail: Customer[];
    ItemEdit: Customer[];
    Gender : Combo[];
}

export const useCustomerStore = defineStore({
    id: 'CustomerStore',
    state: (): CustomerStore => ({
        ItemDetail: [],
        ItemEdit:[],
        Gender:[]
    }),
    getters:{
        getItemsDetail(state: CustomerStore): Customer[] {
            return state.ItemDetail;
        },
        getItemsById(state: CustomerStore): Customer[] {
            return state.ItemEdit;
        },
        getGender(state: CustomerStore): Combo[] {
            return state.Gender;
        },
    },

    actions:{

        async ComboGender() {
            await api.get<DataResponse<Combo[]>>('v1/gb/combo/gender').then((response) => {
                this.Gender = response.data.data as Combo[];
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    console.log("🚀 ~ file: Customer.ts:44 ~ awaitapi.get<DataResponse<Combo[]>> ~ errorresponse:", errorresponse)
                    const alertStore = useAlertStore();
                    console.log("🚀 ~ file: Customer.ts:46 ~ awaitapi.get<DataResponse<Combo[]>> ~ alertStore:", alertStore)
                    
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async ItemsById(id: string) {
            await api
                .get<DataResponse<Customer[]>>(`v1/pos/Customer_byId/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        console.log("🚀 ~ file: Customer.ts:58 ~ .then ~ this.ItemEdit:", this.ItemEdit)
                        return this.ItemEdit;
                    }
                });
        },
        async ItemsList() {
            await api.get<DataResponse<Customer[]>>('v1/pos/getCustomer').then((response) => {
                if (response.data.success) {
                    this.ItemDetail = response.data.data as Customer[];
                    console.log("🚀 ~ file: Customer.ts:67 ~ awaitapi.get<DataResponse<Customer[]>> ~ response.data.data as Customer[]:", response.data.data as Customer[])
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    console.log("🚀 ~ file: Customer.ts:72 ~ awaitapi.get<DataResponse<Customer[]>> ~ errorresponse:", errorresponse)
                    const alertStore = useAlertStore();
                    console.log("🚀 ~ file: Customer.ts:74 ~ awaitapi.get<DataResponse<Customer[]>> ~ alertStore:", alertStore)
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async create_customer(dataForm: Customer) {
            
            return await api
                .post<DataResponse<Customer[]>>(baseUrl + 'v1/pos/create_customer', dataForm)
                .then(async (response) => {
                    if (response.data.success) {
                        return response.data.success;
                    }
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.data) {
                        const errorresponse = error.response.data as ErrorResponse;
                        const alertStore = useAlertStore();
                        alertStore.setErrors(errorresponse.errors);
                    }
                });
        },
    }

})
