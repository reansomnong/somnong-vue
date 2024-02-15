import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { clients } from '../../models/somnong/clients';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface ClientStore {
    ItemDetail: clients[];
    ItemEdit: clients[];
    Gender : Combo[];
}

export const useClientStore = defineStore({
    id: 'ClientStore',
    state: (): ClientStore => ({
        ItemDetail: [],
        ItemEdit:[],
        Gender:[]
    }),
    getters:{
        getItemsDetail(state: ClientStore): clients[] {
            return state.ItemDetail;
        },
        getItemsById(state: ClientStore): clients[] {
            return state.ItemEdit;
        },
        getGender(state: ClientStore): Combo[] {
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
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async ItemsById(id: string) {
            await api
                .get<DataResponse<clients[]>>(`v1/somnong/clients_byId/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        return this.ItemEdit;
                    }
                });
        },
        async ItemsList() {
            await api.get<DataResponse<clients[]>>('v1/somnong/getClients').then((response) => {
                if (response.data.success) {
                    this.ItemDetail = response.data.data as clients[];
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async create(dataForm: clients) {
            
            return await api
                .post<DataResponse<clients[]>>(baseUrl + 'v1/somnong/create_clients', dataForm)
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
