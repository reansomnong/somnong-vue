import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { gb_exchange, base_exchange ,vat} from '../../models/pos/Exchangerates';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface ExchangeStore {
    itemDetail: gb_exchange[];
    combo_currency: Combo[];
    base_curr_exist: base_exchange[];
    sub_currency: base_exchange[];
    VAT:vat[];
}

export const useExchangeStore = defineStore({
    id: 'ExchangeStore',
    state: (): ExchangeStore => ({
        itemDetail: [],
        combo_currency: [],
        base_curr_exist: [],
        sub_currency: [],
        VAT:[],
    }),
    getters: {
        getItemsDetail(state: ExchangeStore): gb_exchange[] {
            return state.itemDetail;
        },
        get_base_curr_exist(state: ExchangeStore): base_exchange[] {
            return state.base_curr_exist;
        },
        get_sub_currency(state: ExchangeStore): base_exchange[] {
            return state.sub_currency;
        },
        getcombo_currency(state: ExchangeStore): Combo[] {
            return state.combo_currency;
        },
        getVAT(state: ExchangeStore): vat[] {
            return state.VAT;
        },
    },
    actions: {
        async list_VAT() {
            await api.get<DataResponse<vat[]>>('v1/pos/pos_vat').
                then((response) => {
                    this.VAT = response.data.data as vat[];
                }).catch((error: AxiosError) => {
                    if (error.response && error.response.data) {
                        const errorresponse = error.response.data as ErrorResponse;
                        const alertStore = useAlertStore();
                        alertStore.setErrors(errorresponse.errors);
                    }
                });
        },

        async Base_currency_exist() {
            await api.get<DataResponse<base_exchange[]>>('v1/pos/combo/base_curr_exist').
                then((response) => {
                    this.base_curr_exist = response.data.data as base_exchange[];
                }).catch((error: AxiosError) => {
                    if (error.response && error.response.data) {
                        const errorresponse = error.response.data as ErrorResponse;
                        const alertStore = useAlertStore();
                        alertStore.setErrors(errorresponse.errors);
                    }
                });
        },

        async ComboCurrency() {
            await api.get<DataResponse<Combo[]>>('v1/pos/combo/base_currency').
                then((response) => {
                    this.combo_currency = response.data.data as Combo[];
                }).catch((error: AxiosError) => {
                    if (error.response && error.response.data) {
                        const errorresponse = error.response.data as ErrorResponse;
                        const alertStore = useAlertStore();
                        alertStore.setErrors(errorresponse.errors);
                    }
                });
        },

        async subCurrency(id: string) {
            await api
                .get<DataResponse<base_exchange[]>>(`v1/pos/currency/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.sub_currency = response.data.data;
                        return this.sub_currency;
                    }
                });
        },
        async ItemsList() {
            await api.get<DataResponse<gb_exchange[]>>('v1/pos/list_currency').then((response) => {
                if (response.data.success) {
                    this.itemDetail = response.data.data as gb_exchange[];
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },

        async create_vat(dataForm: vat) {
            return await api
                .post<DataResponse<vat[]>>(baseUrl + 'v1/pos/create_vat', dataForm)
                .then(async (response) => {
                    if (response.data.success) {
                        return response.data.data;
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

        async create_base_currency(dataForm: base_exchange) {
            return await api
                .post<DataResponse<base_exchange[]>>(baseUrl + 'v1/pos/create_base_exchange', dataForm)
                .then(async (response) => {
                    if (response.data.success) {
                        return response.data.data;
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

        async create_exchange_rates(dataForm: base_exchange) {
            return await api
                .post<DataResponse<base_exchange[]>>(baseUrl + 'v1/pos/create_exchange_rates', dataForm)
                .then(async (response) => {
                    if (response.data.success) {
                        return response.data.data;
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
