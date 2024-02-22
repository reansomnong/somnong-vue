import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { ComboBranch } from '../../models/ComboBranch';
import { Userinfo } from '../../models/admin/User';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
import { Is_existing } from "../../models/admin/Is_existing";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface UserStore {
    branch: ComboBranch[];
    profiles: Combo[];
    userinfo: Userinfo[];
    userDetail: Userinfo[];
    userShow: Userinfo[];
}

export const useUserStore = defineStore({
    id: 'UserStore',
    state: (): UserStore => ({
        branch: [],
        profiles: [],
        userinfo: [],
        userDetail: [],
        userShow: []
    }),
    getters: {
        getProfiles(state: UserStore): Combo[] {
            return state.profiles;
        },
        getBranch(state: UserStore): ComboBranch[] {
            return state.branch;
        },
        getEmail(state: UserStore): Userinfo[] {
            return state.userinfo;
        },
        getUsers(state: UserStore): Userinfo[] {
            return state.userDetail;
        },
        getUserShow(state: UserStore): Userinfo[] {
            return state.userShow;
        },
    },
    actions: {

        async getUserById(id: string) {
            await api
                .get<DataResponse<Userinfo[]>>(`v1/setting/get_user_byId/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.userShow = response.data.data;
                        return this.userShow;
                    }
                });
        },

        async getUserlist() {
            await api.get<DataResponse<Userinfo[]>>('v1/setting/getuser').then((response) => {
                this.userDetail = response.data.data as Userinfo[];
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },

        async getComboBranch() {
            await api.get<DataResponse<ComboBranch[]>>('v1/gb/combo_branch/branch').then((response) => {
                this.branch = response.data.data as ComboBranch[];
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async getComboProfile() {
            await api.get<DataResponse<Combo[]>>('v1/gb/combo_sys/profile').then((response) => {
                this.profiles = response.data.data as Combo[];
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async getExistEmail(Checking: Is_existing) {
            await api.post<DataResponse<Userinfo[]>>('v1/public/ch_user_email', Checking)
                .then(async (response) => {
                    if (response.data.success) {
                        this.userinfo = response.data.data;
                    }
                }).catch((error: AxiosError) => {
                    if (error.response && error.response.data) {
                        const errorresponse = error.response.data as ErrorResponse;
                        const alertStore = useAlertStore();
                        alertStore.setErrors(errorresponse.errors);
                    }
                });
        },

        async create_user(dataForm: Userinfo) {
            return await api
                .post<DataResponse<Userinfo>>(baseUrl + 'v1/setting/create_user', dataForm)
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