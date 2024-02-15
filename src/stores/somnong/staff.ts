import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { staffinfo } from '../../models/somnong/staffinfo';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface StaffStore {
    ItemDetail: staffinfo[];
    ItemEdit: staffinfo[];
    Gender : Combo[];
    Position : Combo[];
}

export const useStaffStore = defineStore({
    id: 'StaffStore',
    state: (): StaffStore => ({
        ItemDetail: [],
        ItemEdit:[],
        Gender:[],
        Position:[],
    }),
    getters:{
        getItemsDetail(state: StaffStore): staffinfo[] {
            return state.ItemDetail;
        },
        getItemsById(state: StaffStore): staffinfo[] {
            return state.ItemEdit;
        },
        getGender(state: StaffStore): Combo[] {
            return state.Gender;
        },
        getPosition(state: StaffStore): Combo[] {
            return state.Position;
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
        async ComboPosition() {
            await api.get<DataResponse<Combo[]>>('v1/somnong/somnongcombo/somnong_position').then((response) => {
                this.Position = response.data.data as Combo[];
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
                .get<DataResponse<staffinfo[]>>(`v1/somnong/staff_byId/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        return this.ItemEdit;
                    }
                });
        },
        async ItemsList() {
            await api.get<DataResponse<staffinfo[]>>('v1/somnong/getStaff').then((response) => {
                if (response.data.success) {
                    this.ItemDetail = response.data.data as staffinfo[];
                }
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async create(dataForm: staffinfo) {
            console.log(dataForm);
            return await api
                .post<DataResponse<staffinfo[]>>(baseUrl + 'v1/somnong/create_staff', dataForm)
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
