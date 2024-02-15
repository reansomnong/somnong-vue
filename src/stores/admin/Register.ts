import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { Branch , CreateBranch } from '../../models/admin/Branch';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface RegisterStore {
    System: Combo[];
    BranchDetail: CreateBranch;
    Branch:CreateBranch[]
  }
  
  export const useRegisterStore = defineStore({
    id: 'RegisterStore',
    state: (): RegisterStore => ({
        System: [],
        BranchDetail:{} as CreateBranch,
        Branch:[]
    }),
    getters: {
        getSystem(state: RegisterStore): Combo[] {
            return state.System;
        },
         getBranch(state:RegisterStore){
          return state.Branch
        }
    },
    actions: {

        async systems() {
            await api.get<DataResponse<Combo[]>>('v1/gb/systems').then((response) => {
              this.System = response.data.data;
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async registerStore(dataBranch:CreateBranch) {
            return await api
              .post<DataResponse<CreateBranch>>(baseUrl + 'v1/gb/registerStore', dataBranch)
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

