import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Transfer, TransferDetails } from '../../models/pos/Transfer';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface AuthTransfer {
    Items: Transfer[];
    ItemDetail: TransferDetails[];
    ItemView: Transfer[];
}
export const useAuthTransferStore = defineStore({
    id: 'AuthTransferStore',
    state: (): AuthTransfer => ({
        Items: [],
        ItemDetail: [],
        ItemView:[]
    }),
    getters: {
        getItems(state: AuthTransfer): Transfer[] {
            return state.Items;
        },
        getItemView(state: AuthTransfer): Transfer[] {
            return state.ItemView;
        },
        getItemsDetail(state: AuthTransfer): TransferDetails[] {
            return state.ItemDetail;
        },
    },
    actions: {
        async una_transfer() {
            await api
                .get<DataResponse<Transfer[]>>(`v1/pos/una_stock_transfer`)
                .then((response) => {
                    if (response.data.success) {
                        this.Items = response.data.data;
                        return this.Items;
                    }
                });
        },
        async view_una_transfer(id:string) {
            await api
                .get<DataResponse<Transfer[]>>(`v1/pos/una_stock_transfer/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemView = response.data.data;
                        return this.ItemView;
                    }
                });
        },
        async view_una_transfer_details(id:string) {
            await api
                .get<DataResponse<TransferDetails[]>>(`v1/pos/una_transfer_details/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemDetail = response.data.data;
                        return this.ItemDetail;
                    }
                });
        },

        async auth_transfer(dataForm: Transfer) {
            return await api
                .post<DataResponse<Transfer[]>>(baseUrl + 'v1/pos/auth_transfer', dataForm)
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
        async reject_transfer(dataForm: Transfer) {
            console.log(dataForm);
            return await api
                .post<DataResponse<Transfer[]>>(baseUrl + 'v1/pos/reject_transfer', dataForm)
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


