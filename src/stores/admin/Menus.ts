import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo_menu, AddMenu, MenuDetail } from '../../models/admin/Menu';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from '../pos/Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface MenuStore {
  menus: Combo_menu[];
  add_menu: AddMenu[];
  menuDetail: MenuDetail[];
  DetailbyId:MenuDetail[];
}

export const useMenuStore = defineStore({
  id: 'MenuStore',
  state: (): MenuStore => ({
    menus: [],
    add_menu: [],
    menuDetail: [],
    DetailbyId:[]
  }),
  getters: {
    getMenus(state: MenuStore): Combo_menu[] {
      return state.menus;
    },
    getMenuDetail(state: MenuStore): MenuDetail[] {
      return state.menuDetail;
    },
    getDetailbyId(state: MenuStore): MenuDetail[] {
      return state.DetailbyId;
    },
  },
  actions: {

    async getMenuById(id: string) {
      await 
      api.get<DataResponse<MenuDetail[]>>(`v1/setting/get_left_menu_byId/${id}`)
      .then((response) => {
        this.DetailbyId = response.data.data;

      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },
    async getListMenus() {
      await api.get<DataResponse<MenuDetail[]>>('v1/setting/get_left_menu').then((response) => {
        this.menuDetail = response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },

    async getMainMenu() {
      await api.get<DataResponse<Combo_menu[]>>('v1/gb/combo/main_menu').then((response) => {
        this.menus = response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },
    async create_menu(arr_addMenu: AddMenu) {
      return await api
        .post<DataResponse<AddMenu[]>>(baseUrl + 'v1/setting/create_left_menu', arr_addMenu)
        .then(async (response) => {
          console.log('after respone');
            console.log(arr_addMenu);
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

