import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";
import {
    quotes
} from "../../models/somnong/clients";
import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "../pos/Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";

const baseUrl = `${import.meta.env.VITE_API_URL}`;
interface AuthQuoteStore {
  Items: quotes[];
  ItemDetail: quotes[];
  ItemView: quotes[];

}

export const useAuthQuoteStore = defineStore({
  id: "useAuthQuoteStore",
  state: (): AuthQuoteStore => ({
    ItemDetail: [],
    Items: [],
    ItemView:[],
  }),
  getters: {
    getItems(state: AuthQuoteStore): quotes[] {
        return state.Items;
    },
    getItemView(state: AuthQuoteStore): quotes[] {
        return state.ItemView;
    },
    getItemsDetail(state: AuthQuoteStore): quotes[] {
        return state.ItemDetail;
    },
},
  actions: {
    async una_somnong_quotes() {
        await api
            .get<DataResponse<quotes[]>>(`v1/somnong/una_somnong_quotes`)
            .then((response) => {
                if (response.data.success) {
                    this.Items = response.data.data;
                    return this.Items;
                }
            });
    },
    async ItemsById(id: string) {
      await api
        .get<DataResponse<quotes[]>>(`v1/somnong/auth_quote_view/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemView = response.data.data;
            return this.ItemView;
          }
        });
    },

    async auth_somnong_quotes(dataForm: quotes) {
        return await api
            .post<DataResponse<quotes[]>>(baseUrl + 'v1/somnong/auth_somnong_quotes', dataForm)
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

    async reject_somnong_quotes(dataForm: quotes) {
        console.log(dataForm);
        return await api
            .post<DataResponse<quotes[]>>(baseUrl + 'v1/somnong/reject_somnong_quotes', dataForm)
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

  },
});
