import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { CountStock, CountStockDetails } from '../../models/pos/CountStock';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface AuthCountStock {
    Items: CountStock[];
    ItemDetail: CountStockDetails[];
    ItemView: CountStock[];
}
export const useAuthCountStockStore = defineStore({
    id: 'AuthCountStock',
    state: (): AuthCountStock => ({
        Items: [],
        ItemDetail: [],
        ItemView:[]
    }),
    getters: {
        getItems(state: AuthCountStock): CountStock[] {
            return state.Items;
        },
        getItemView(state: AuthCountStock): CountStock[] {
            return state.ItemView;
        },
        getItemsDetail(state: AuthCountStock): CountStockDetails[] {
            return state.ItemDetail;
        },
    },
    actions: {
        async una_count_stock() {
            await api
                .get<DataResponse<CountStock[]>>(`v1/pos/una_count_stock`)
                .then((response) => {
                    if (response.data.success) {
                        this.Items = response.data.data;
                        return this.Items;
                    }
                });
        },
        async view_una_count_stock(id:string) {
            await api
                .get<DataResponse<CountStock[]>>(`v1/pos/una_count_stock/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemView = response.data.data;
                        return this.ItemView;
                    }
                });
        },
        async view_una_count_stock_details(id:string) {
            await api
                .get<DataResponse<CountStockDetails[]>>(`v1/pos/una_count_stock_details/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemDetail = response.data.data;
                        return this.ItemDetail;
                    }
                });
        },

        async auth_count_stock(dataForm: CountStock) {
            return await api
                .post<DataResponse<CountStock[]>>(baseUrl + 'v1/pos/auth_count_stock', dataForm)
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
        async reject_count_stock(dataForm: CountStock) {
            console.log(dataForm);
            return await api
                .post<DataResponse<CountStock[]>>(baseUrl + 'v1/pos/reject_count_stock', dataForm)
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


