import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { Category } from '../../models/pos/Category';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface CategoriesStore {
    ItemDetail: Category[];
    ItemEdit: Category[];
    Line : Combo[];
}
export const useCategoriesStore = defineStore({
    id: 'CategoriesStore',
    state: (): CategoriesStore => ({
        ItemDetail: [],
        ItemEdit:[],
        Line:[],
    }),
    getters:{
        getItemsDetail(state: CategoriesStore): Category[] {
            return state.ItemDetail;
        },
        getItemsById(state: CategoriesStore): Category[] {
            return state.ItemEdit;
        },
        getLine(state: CategoriesStore): Combo[] {
            return state.Line;
        },
    },
    actions:{
        async ComboLine() {
            await api.get<DataResponse<Combo[]>>('v1/pos/combo/pos_line').then((response) => {
                this.Line = response.data.data as Combo[];
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async ItemsById(id: string) {
            await api
                .get<DataResponse<Category[]>>(`v1/pos/view_category/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        return this.ItemEdit;
                    }
                });
        },
        async ItemsList() {
            await api.get<DataResponse<Category[]>>('v1/pos/pos_category').then((response) => {
                if (response.data.success) {
                    this.ItemDetail = response.data.data as Category[];
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async Register(dataForm: Category) {
            
            return await api
                .post<DataResponse<Category[]>>(baseUrl + 'v1/pos/create_category', dataForm)
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
