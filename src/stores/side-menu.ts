import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

import { api } from './../boot/axios';
import { useAlertStore } from './pos/Alert';
import { ErrorResponse } from '../models/Responses/ErrorResponse';
import { AxiosError } from 'axios';


export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [],
  }),
  actions: {
    async userMenu() {
      await api.get('v1/setting/getmenu').then((response) => {
        this.menu= response.data.data;
      }).catch((error: AxiosError) => {
        if (error.response && error.response.data) {
          const errorresponse = error.response.data as ErrorResponse;
          const alertStore = useAlertStore();
          alertStore.setErrors(errorresponse.errors);
        }
      });
    },
  },
});
