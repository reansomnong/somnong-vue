import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Add_Permission, AddMenu,Permission_menu ,systems,sub_menu_arr } from '../../models/admin/Menu';
import { Combo } from '../../models/Combo';
 
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
import { list_sub_per,Permission } from "../../models/admin/Menu";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface PermissionStore {
  cbo_system: Combo[];
  cbo_profile: Combo[];
  cbo_menu: Combo[];
  Menu_list: AddMenu[];
  Sub_list:  list_sub_per[];
}

export const usePermissionStore = defineStore({
    id: 'PermissionStore',
    state: (): PermissionStore => ({
      cbo_system: [],
      cbo_profile: [],
      cbo_menu: [],
      Menu_list:[],
      Sub_list:[],
    }),
    
    getters: {
      getListMenu(state: PermissionStore): AddMenu[] {
        return state.Menu_list;
      },
      getsubMenu(state: PermissionStore): list_sub_per[] {
        return state.Sub_list;
      },
      getSystem(state: PermissionStore): Combo[] {
        return state.cbo_system;
      },
      getProfile(state: PermissionStore): Combo[] {
        return state.cbo_profile;
      },
      getMenu(state: PermissionStore): Combo[] {
        return state.cbo_menu;
      },
    },
    actions: {
      async load_cbo_system() {
        await 
        api.get<DataResponse<Combo[]>>(`v1/gb/combo_sys/system`)
        .then((response) => {
          this.cbo_system = response.data.data;
  
        }).catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
      },

      async load_cbo_profile(id: string) {
        await 
        api.get<DataResponse<Combo[]>>(`v1/setting/profile_system/${id}`)
        .then((response) => {
          this.cbo_profile = response.data.data;
  
        }).catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
      },

      async load_cbo_menu(id: string) {
        await 
        api.get<DataResponse<Combo[]>>(`v1/setting/main_menu`)
        .then((response) => {
          this.cbo_menu = response.data.data;
  
        }).catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
      },

      async load_sub_menu(system_id: string,profile_id: string,menu_id: string) {
        await 
        api.get<DataResponse<list_sub_per[]>>(`v1/setting/sub_menu_list/${system_id}/${profile_id}/${menu_id}`)
        .then((response) => {
          this.Sub_list = response.data.data;
  
        }).catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
      },
      async create_menu(data_menu: Add_Permission) {
        return await api
          .post<DataResponse<Add_Permission[]>>(baseUrl + 'v1/setting/permission', data_menu)
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
  
  
