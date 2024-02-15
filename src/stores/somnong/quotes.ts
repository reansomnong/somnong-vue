import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";
import { Combo } from "../../models/Combo";
import {
  quotes,
  Quote_file,
  files,
  quote_file,
} from "../../models/somnong/clients";
import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "../pos/Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";

const baseUrl = `${import.meta.env.VITE_API_URL}`;
interface QuoteStore {
  ItemDetail: quotes[];
  ItemEdit: quotes[];
  Client: Combo[];
  Status: Combo[];
  Leader: Combo[];
  Quote_File: Quote_file[];
  file: files[];
}

export const useQuoteStore = defineStore({
  id: "useQuoteStore",
  state: (): QuoteStore => ({
    ItemDetail: [],
    ItemEdit: [],
    Client: [],
    Status: [],
    Leader: [],
    Quote_File: [],
    file: [],
  }),
  getters: {
    getItemsDetail(state: QuoteStore): quotes[] {
      return state.ItemDetail;
    },
    getItemsById(state: QuoteStore): quotes[] {
      return state.ItemEdit;
    },
    getClients(state: QuoteStore): Combo[] {
      return state.Client;
    },
    getStatus(state: QuoteStore): Combo[] {
      return state.Status;
    },
    getLeader(state: QuoteStore): Combo[] {
      return state.Leader;
    },
    getQuote_File(state: QuoteStore): Quote_file[] {
      return state.Quote_File;
    },
    getFile(state: QuoteStore): files[] {
      return state.file;
    },
  },

  actions: {
    async quote_file_view(quote_code: string) {
      await api
        .get<DataResponse<Quote_file[]>>(`v1/somnong/quote_file/${quote_code}`)
        .then(async (response) => {
          this.Quote_File = response.data.data as Quote_file[];
          return this.Quote_File;
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
        .post<DataResponse<File>>(baseUrl + "v1/somnong/quote_file", formData)
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

    async somnong_client() {
      await api
        .get<DataResponse<Combo[]>>("v1/somnong/clients/somnong_client")
        .then((response) => {
          this.Client = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async somnong_leader() {
      await api
        .get<DataResponse<Combo[]>>("v1/somnong/clients/somnong_staff")
        .then((response) => {
          this.Leader = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async somnong_status() {
      await api
        .get<DataResponse<Combo[]>>("v1/somnong/clients/somnong_status")
        .then((response) => {
          this.Status = response.data.data as Combo[];
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
        .get<DataResponse<quotes[]>>(`v1/somnong/quotes_byId/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemEdit = response.data.data;
            return this.ItemEdit;
          }
        });
    },
    async ItemsList() {
      await api
        .get<DataResponse<quotes[]>>("v1/somnong/getQuotation")
        .then((response) => {
          if (response.data.success) {
            this.ItemDetail = response.data.data as quotes[];
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
    async create(dataForm: quotes) {
      return await api
        .post<DataResponse<quotes[]>>(
          baseUrl + "v1/somnong/create_quotation",
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

    async quote_download(file_name: String) {
      return await api
        .get<DataResponse<Blob[]>>(
          `v1/somnong/somnong_download_quote/${file_name}`
        )
        .then(async (response) => {
          console.log(response.data);
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },

    async del_quote_file(FileForm: quote_file) {
      return await api
        .post<DataResponse<quotes[]>>(
          baseUrl + "v1/somnong/del_quote_file",
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
