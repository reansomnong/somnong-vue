import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Pos, PosDetails } from '../../models/pos/POS';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;
interface AuthPOS {
    Items: Pos[];
    ItemDetail: PosDetails[];
    ItemView: Pos[];
}

export const useAuthPOSStore = defineStore({
    id: 'AuthPOS',
    state: (): AuthPOS => ({
        Items: [],
        ItemDetail: [],
        ItemView:[]
    }),
    getters: {
        getItems(state: AuthPOS): Pos[] {
            return state.Items;
        },
        getItemView(state: AuthPOS): Pos[] {
            return state.ItemView;
        },
        getItemsDetail(state: AuthPOS): PosDetails[] {
            return state.ItemDetail;
        },
    },
    actions: {
        async una_point_of_sale() {
            await api
                .get<DataResponse<Pos[]>>(`v1/pos/una_point_of_sale`)
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
                .get<DataResponse<Pos[]>>(`v1/pos/una_pos/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemView = response.data.data;
                        return this.ItemView;
                    }
                });
        },
        async view_una_po_details(id:string) {
            await api
                .get<DataResponse<PosDetails[]>>(`v1/pos/una_pos_details/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemDetail = response.data.data;
                        return this.ItemDetail;
                    }
                });
        },

        async auth_point_of_sale(dataForm: Pos) {
            return await api
                .post<DataResponse<Pos[]>>(baseUrl + 'v1/pos/auth_point_of_sale', dataForm)
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
        async reject_point_of_sale(dataForm: Pos) {
            console.log(dataForm);
            return await api
                .post<DataResponse<Pos[]>>(baseUrl + 'v1/pos/reject_point_of_sale', dataForm)
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

