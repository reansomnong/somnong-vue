import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";
import { Combo } from "../../models/Combo";
import {
  payment,
  DocFile,
  PaymentFile,
} from "../../models/somnong/collect_payment";
import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "../pos/Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";

const baseUrl = `${import.meta.env.VITE_API_URL}`;
interface PaymentStore {
  ItemDetail: payment[];
  ItemEdit: payment[];
  Currency: Combo[];
  PaymentType: Combo[];
  Project: Combo[];
  docFile: DocFile[];
}

export const usePaymentStore = defineStore({
  id: "usePaymentStore",
  state: (): PaymentStore => ({
    ItemDetail: [],
    ItemEdit: [],
    Currency: [],
    PaymentType: [],
    Project: [],
    docFile: [],
  }),
  getters: {
    getItemsDetail(state: PaymentStore): payment[] {
      return state.ItemDetail;
    },
    getItemsById(state: PaymentStore): payment[] {
      return state.ItemEdit;
    },
    getCurrency(state: PaymentStore): Combo[] {
      return state.Currency;
    },
    getType(state: PaymentStore): Combo[] {
      return state.PaymentType;
    },
    getProject(state: PaymentStore): Combo[] {
      return state.Project;
    },
    getQuote_File(state: PaymentStore): DocFile[] {
      return state.docFile;
    },
  },

  actions: {
    async payment_file_view(quote_code: string) {
      await api
        .get<DataResponse<DocFile[]>>(`v1/somnong/payment_file/${quote_code}`)
        .then(async (response) => {
          this.docFile = response.data.data as DocFile[];
          return this.docFile;
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },

    async somnong_referent() {
      await api
        .get<DataResponse<Combo[]>>("v1/somnong/combo/somnong_referent")
        .then((response) => {
          this.Project = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },

    async somnong_currency() {
      await api
        .get<DataResponse<Combo[]>>("v1/somnong/combo/base_currency")
        .then((response) => {
          this.Currency = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },

    async somnong_type() {
      await api
        .get<DataResponse<Combo[]>>("v1/somnong/combo/somnong_type")
        .then((response) => {
          this.PaymentType = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async ItemsList() {
      await api
        .get<DataResponse<payment[]>>("v1/somnong/getPayment")
        .then((response) => {
          if (response.data.success) {
            this.ItemDetail = response.data.data as payment[];
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
    async ItemsById(id: string) {
      await api
        .get<DataResponse<payment[]>>(`v1/somnong/somnong_payment/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemEdit = response.data.data;
            return this.ItemEdit;
          }
        });
    },
    async create(dataForm: payment) {
      return await api
        .post<DataResponse<payment[]>>(
          baseUrl + "v1/somnong/somnong_payment",
          dataForm
        )
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

    async upload_image(file: File, referent_id: string) {
      let formData = new FormData();
      formData.append("referent_id", referent_id);
      formData.append("name", file.name);
      formData.append("image", file);
      formData.append("description", referent_id);

      return await api
        .post<DataResponse<File>>(baseUrl + "v1/somnong/payment_upload_file", formData)
        .then(async (response) => {
          if (response.data.success) {
            this.quote_file_view(referent_id);
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

    async quote_file_view(quote_code: string) {
      await api
        .get<DataResponse<DocFile[]>>(`v1/somnong/payment_file/${quote_code}`)
        .then(async (response) => {
          this.docFile = response.data.data as DocFile[];
          return this.docFile;
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },

    async del_quote_file(FileForm: PaymentFile) {
      return await api
        .post<DataResponse<PaymentFile[]>>(
          baseUrl + "v1/somnong/del_payment_file",
          FileForm
        )
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
