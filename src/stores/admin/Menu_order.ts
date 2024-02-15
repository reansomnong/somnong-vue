import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo_menu, AddMenu,Permission_menu ,systems,sub_menu_arr } from '../../models/admin/Menu';
 
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
import { menu_arr,Permission } from "../../models/admin/Menu";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface MenuStore {
  Cbo_menus: Combo_menu[];
  Menu_list: AddMenu[];
  Sub_list:  AddMenu[];
  Sub_menu_arr:  sub_menu_arr[];
  Permission: Permission_menu[];
  System:  systems[];
  Profile:  menu_arr[];
}

export const useMenuStore = defineStore({
  id: 'MenuStore',
  state: (): MenuStore => ({
    Cbo_menus: [],
    Menu_list: [],
    Sub_list:  [],
    Sub_menu_arr:[],
    Permission: [],
    System: [],
    Profile:[]
  }),

  getters: {
    getMenus(state: MenuStore): AddMenu[] {
      return state.Menu_list;
    },
    getSubMenu(state: MenuStore): AddMenu[] {
      return state.Sub_list;
    },
    getSystem(state: MenuStore): systems[] {
      return state.System;
    }, 
    getProfile(state: MenuStore): menu_arr[] {
      return state.Profile;
    },
    get_show_sub(state: MenuStore): sub_menu_arr[] {
      return state.Sub_menu_arr;
    },
  },
  actions: {
    async profile(id:string){
      await api.get<DataResponse<menu_arr[]>>(`v1/setting/profile_system/${id}`)
      .then((response) => {
        this.Profile = response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },

    async add_permission(arr:Permission) {
      
      return await api
        .post<DataResponse<Permission[]>>(baseUrl + 'v1/setting/add_permission_menu', arr)
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

    async sub_permission_menu(arr:Permission) {
      console.log(arr);
      
      return await api
        .post<DataResponse<Permission[]>>(baseUrl + 'v1/setting/add_permission_menu', arr)
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

    async delete_permission(arr:Permission) {
      return await api
        .post<DataResponse<Permission[]>>(baseUrl + 'v1/setting/delete_permission', arr)
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

    async update_menu(arr:menu_arr) {
      return await api
        .post<DataResponse<menu_arr[]>>(baseUrl + 'v1/setting/permission_refresh', arr)
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
    async get_sub_menu_list(id:string) {
      await api.get<DataResponse<sub_menu_arr[]>>(`v1/setting/get_sub_menu_list/${id}`)
      .then((response) => {
        this.Sub_menu_arr = response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },
    async sub_menu_list(id:string) {
      await api.get<DataResponse<AddMenu[]>>(`v1/setting/permission_sub/${id}`)
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

    async menu_list(id:string) {
      await 
      api.get<DataResponse<AddMenu[]>>(`v1/setting/permission_menu/${id}`)
      .then((response) => {
        this.Menu_list = response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },

    async menu_by_system(id:string) {
      await 
      api.get<DataResponse<AddMenu[]>>(`v1/setting/menu_by_system/${id}`)
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

    async system_list(id:string) {
      await 
      api.get<DataResponse<systems[]>>(`v1/setting/system_list`)
      .then((response) => {
        this.System = response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },

  }
})

