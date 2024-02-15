import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { Supply } from '../../models/pos/Supply';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
import { Is_existing } from "../../models/admin/Is_existing";
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface SupplyStore {
    ItemDetail: Supply[];
    ItemEdit: Supply[];
}

export const useSupplyStore = defineStore({
    id: 'SupplyStore',
    state: (): SupplyStore => ({
        ItemDetail: [],
        ItemEdit:[],
    }),
    getters:{
        getItemsDetail(state: SupplyStore): Supply[] {
            return state.ItemDetail;
        },
        getItemsById(state: SupplyStore): Supply[] {
            return state.ItemEdit;
        },
    },
    actions:{
        async ItemsById(id: string) {
            await api
                .get<DataResponse<Supply[]>>(`v1/pos/Supply_byId/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        return this.ItemEdit;
                    }
                });
        },
        async ItemsList() {
            await api.get<DataResponse<Supply[]>>('v1/pos/getSupply').then((response) => {
                if (response.data.success) {
                    this.ItemDetail = response.data.data as Supply[];
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async create_supply(dataForm: Supply) {
            return await api
                .post<DataResponse<Supply[]>>(baseUrl + 'v1/pos/create_supply', dataForm)
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
