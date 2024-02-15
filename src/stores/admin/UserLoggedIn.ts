import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Userinfo } from '../../models/admin/User';
import { profile_image } from "../../models/admin/SelectedFile";

import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface UserloginStore {
    userinfo: Userinfo[],
    images: profile_image[],
}

export const useUserloginStore = defineStore({
    id: 'UserloginStore',
    state: (): UserloginStore => ({
        userinfo: [],
        images: []
    }),
    getters: {
        getUserinfo(state: UserloginStore): Userinfo[] {
            return state.userinfo;
        },
        getUserimage(state: UserloginStore): profile_image[] {
            return state.images;
        },
    },
    actions: {
        async user_logged() {
            await api
                .get<DataResponse<Userinfo[]>>(`v1/users/Loggedin`)
                .then(async (response) => {
                    if (response.data.success) {
                        this.userinfo = response.data.data;
                        await  this.url_image(this.userinfo[0].image as string);
                        return this.userinfo;
                    }
                });
        },
        async url_image(file_name: string) {
            await api.get<DataResponse<profile_image[]>>(`v1/users/user_profile_image/${file_name}`).then(async (response) => {
                this.images = response.data.data;
                return this.images;
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
                .post<DataResponse<Userinfo>>(baseUrl + 'v1/users/create_user', dataForm)
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

        async upload_image(file: File) {
            let formData = new FormData();
            formData.append("name", file.name);
            formData.append("image", file);
            formData.append("description", 'description');
            return await api
                .post<DataResponse<File>>(baseUrl + 'v1/users/user_upload_image', formData)
                .then(async (response) => {
                    if (response.data.success) {
                        await this.user_logged();
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
        }
    }
})