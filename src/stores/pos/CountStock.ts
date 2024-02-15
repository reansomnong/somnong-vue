import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { CountStock, CountStockDetails } from '../../models/pos/CountStock';
import { Product } from '../../models/pos/Product';

import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface CountStockStore {
    ItemDetail: CountStockDetails[];
    ItemEdit: CountStock[];
    Details: CountStockDetails[];
    SysdocDetails: CountStockDetails[];
    Stock: Combo[];
    Product: Product[];
    UNA_Combo: Combo[];
}

export const useCountStockStore = defineStore({
    id: 'CountStockStore',
    state: (): CountStockStore => ({
        ItemDetail: [],
        ItemEdit: [],
        Details: [],
        SysdocDetails: [],
        Stock: [],
        Product: [],
        UNA_Combo: [],
    }),
    getters: {
        getItemsDetail(state: CountStockStore): CountStockDetails[] {
            return state.ItemDetail;
        },
        getItemsById(state: CountStockStore): CountStock[] {
            return state.ItemEdit;
        },
        getStock(state: CountStockStore): Combo[] {
            return state.Stock;
        },
        getProduct(state: CountStockStore): Product[] {
            return state.Product;
        },
        getSysdocDetails(state: CountStockStore): CountStockDetails[] {
            return state.SysdocDetails;
        },
        getUNACombo(state: CountStockStore): Combo[] {
            return state.UNA_Combo;
        },
    },
    actions: {
        async cboStockList() {
            await api.get<DataResponse<Combo[]>>('v1/pos/combo/pos_stock').then((response) => {
                this.Stock = response.data.data as Combo[];
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async combo_una_list() {
            await api
                .get<DataResponse<Combo[]>>(`v1/pos/una_count_list`)
                .then((response) => {
                    if (response.data.success) {
                        this.UNA_Combo = response.data.data;
                        return this.UNA_Combo;
                    }
                });
        },
        async search_items(id: string) {
            await api
                .get<DataResponse<Product[]>>(`v1/pos/search_items/${id}`)
                .then((response) => {
                    this.Product = response.data.data as Product[];
                });
        },
        async una_details_sysdoc(id: string) {
            await api
                .get<DataResponse<CountStockDetails[]>>(`v1/pos/una_count_stock_sysdoc/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.SysdocDetails = response.data.data
                        return this.SysdocDetails;
                    }
                });
        },
        async create_details(dataForm: CountStockDetails) {
            return await api
                .post<DataResponse<CountStockDetails[]>>(baseUrl + 'v1/pos/create_count_stock_details', dataForm)
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

        async create_trans(dataForm: CountStock) {
            return await api
                .post<DataResponse<CountStock[]>>(baseUrl + 'v1/pos/create_count_stock', dataForm)
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

        async una_tran_by_id(id: string) {
            await api
                .get<DataResponse<CountStock[]>>(`v1/pos/una_count_list/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        return this.ItemEdit;
                    }
                });
        },
        async una_details_id(id: string) {
            await api
                .get<DataResponse<CountStockDetails[]>>(`v1/pos/una_count_stock_id/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemDetail = response.data.data
                        return this.ItemDetail;
                    }
                });
        },

    }

})


