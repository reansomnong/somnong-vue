import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { Branch } from '../../models/admin/Branch';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface BranchStore {
    province: Combo[];
    add_branch: Branch[];
    branchdetail: Branch;
    branch:Branch[]
  }
  
  export const useBranchStore = defineStore({
    id: 'BranchStore',
    state: (): BranchStore => ({
        province: [],
        add_branch:[],
        branchdetail:{} as Branch,
        branch:[]
    }),
    getters: {
        getProvince(state: BranchStore): Combo[] {
            return state.province;
        },
        getBranchDetail(state:BranchStore) : Branch[]{
          return state.branch
        },
         getBranch(state:BranchStore){
          return state.add_branch
        }
    },
    actions: {
      async getBranchById(id: string) {
        await api
          .get<DataResponse<Branch[]>>(`v1/setting/getbranch_byId/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.branch = response.data.data;
              return this.branch;
            }
          });
      },
        async getComboProvince() {
            await api.get<DataResponse<Combo[]>>('v1/gb/combo/province').then((response) => {
              this.province = response.data.data;
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data) {
                    const errorresponse = error.response.data as ErrorResponse;
                    const alertStore = useAlertStore();
                    alertStore.setErrors(errorresponse.errors);
                }
            });
        },
        async getAllBranch() {
          await api.get<DataResponse<Branch[]>>('v1/setting/getbranch').then((response) => {
            this.add_branch = response.data.data;
          }).catch((error: AxiosError) => {
              if (error.response && error.response.data) {
                  const errorresponse = error.response.data as ErrorResponse;
                  const alertStore = useAlertStore();
                  alertStore.setErrors(errorresponse.errors);
              }
          });
      },
        async create_branch(dataBranch:Branch) {
            return await api
              .post<DataResponse<Branch>>(baseUrl + 'v1/setting/create_branch', dataBranch)
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

