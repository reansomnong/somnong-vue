import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";

import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "../pos/Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";
// For Payment
import { payment,PaymentFile } from "../../models/somnong/collect_payment";

const baseUrl = `${import.meta.env.VITE_API_URL}`;
interface AuthPyamentStore {
  Items: payment[];
  ItemDetail: payment[];
  ItemView: payment[];

}

export const useAuthPyamentStore = defineStore({
  id: "useAuthPyamentStore",
  state: (): AuthPyamentStore => ({
    ItemDetail: [],
    Items: [],
    ItemView:[],
  }),
  getters: {
    getItems(state: AuthPyamentStore): payment[] {
        return state.Items;
    },
    getItemView(state: AuthPyamentStore): payment[] {
        return state.ItemView;
    },
    getItemsDetail(state: AuthPyamentStore): payment[] {
        return state.ItemDetail;
    },
},
  actions: {
    async una_somnong_payment() {
        await api
            .get<DataResponse<payment[]>>(`v1/somnong/una_somnong_payment`)
            .then((response) => {
                if (response.data.success) {
                    this.Items = response.data.data;
                    return this.Items;
                }
            });
    },
    async ItemsById(id: string) {
      await api
        .get<DataResponse<payment[]>>(`v1/somnong/auth_payment_view/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemView = response.data.data;
            return this.ItemView;
          }
        });
    },

    async auth_somnong_payments(dataForm: payment) {
        return await api
            .post<DataResponse<payment[]>>(baseUrl + 'v1/somnong/auth_somnong_payments', dataForm)
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

    async reject_somnong_payments(dataForm: payment) {
        console.log(dataForm);
        return await api
            .post<DataResponse<payment[]>>(baseUrl + 'v1/somnong/reject_somnong_payments', dataForm)
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
