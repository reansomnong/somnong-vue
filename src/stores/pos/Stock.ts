import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Stock } from '../../models/pos/Stock';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface StockStore {
    stockDetail: Stock[];
    stockEdit: Stock[];
}

export const useUserStore = defineStore({
    id: 'StockStore',
    state: (): StockStore => ({
        stockDetail: [],
        stockEdit:[]
    }),
    getters:{
        getStockList(state: StockStore): Stock[] {
            return state.stockDetail;
        },
        getStockById(state: StockStore): Stock[] {
            return state.stockEdit;
        },
    },

    actions:{

        async StockById(id: string) {
            await api
                .get<DataResponse<Stock[]>>(`v1/pos/getStock_byId/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.stockEdit = response.data.data;
                        return this.stockEdit;
                    }
                });
        },
        async StockList() {
            await api.get<DataResponse<Stock[]>>('v1/pos/getStock').then((response) => {
                if (response.data.success) {
                    this.stockDetail = response.data.data as Stock[];
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async create_stock(dataForm: Stock) {
            return await api
                .post<DataResponse<Stock[]>>(baseUrl + 'v1/pos/create_stock', dataForm)
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
