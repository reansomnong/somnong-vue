import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { PurchaseOrder, PurchaseOrderDetail } from '../../models/pos/PurchaseOrder';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;
interface AuthPurchaseOrder {
    Items: PurchaseOrder[];
    ItemDetail: PurchaseOrderDetail[];
    ItemView: PurchaseOrder[];
}

export const useAuthPurchaseOrderStore = defineStore({
    id: 'AuthPurchaseOrder',
    state: (): AuthPurchaseOrder => ({
        Items: [],
        ItemDetail: [],
        ItemView:[]
    }),
    getters: {
        getItems(state: AuthPurchaseOrder): PurchaseOrder[] {
            return state.Items;
        },
        getItemView(state: AuthPurchaseOrder): PurchaseOrder[] {
            return state.ItemView;
        },
        getItemsDetail(state: AuthPurchaseOrder): PurchaseOrderDetail[] {
            return state.ItemDetail;
        },
    },
    actions: {
        async una_PurchaseOrder() {
            await api
                .get<DataResponse<PurchaseOrder[]>>(`v1/pos/una_purchase_order`)
                .then((response) => {
                    if (response.data.success) {
                        this.Items = response.data.data;
                        console.log(this.Items);
                        return this.Items;
                    }
                });
        },
        async view_una_pos(id:string) {
            await api
                .get<DataResponse<PurchaseOrder[]>>(`v1/pos/una_po_view/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemView = response.data.data;
                        console.log(this.ItemView);
                        return this.ItemView;
                    }
                });
        },
        async view_una_po_details(id:string) {
            await api
                .get<DataResponse<PurchaseOrderDetail[]>>(`v1/pos/una_po_details/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemDetail = response.data.data;
                        return this.ItemDetail;
                    }
                });
        },

        async auth_purchaseorder(dataForm: PurchaseOrder) {
            console.log(dataForm);
            return await api
                .post<DataResponse<PurchaseOrder[]>>(baseUrl + 'v1/pos/auth_purchaseorder', dataForm)
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
        async reject_purchaseorder(dataForm: PurchaseOrder) {
            console.log(dataForm);
            return await api
                .post<DataResponse<PurchaseOrder[]>>(baseUrl + 'v1/pos/reject_purchaseorder', dataForm)
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


