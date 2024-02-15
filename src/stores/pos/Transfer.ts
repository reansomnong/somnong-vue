import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";
import { Combo } from "../../models/Combo";
import { Transfer, TransferDetails } from "../../models/pos/Transfer";
import { Product } from "../../models/pos/Product";
import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "./Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface TransferStore {
  ItemDetail: TransferDetails[];
  ItemEdit: Transfer[];
  Details: TransferDetails[];
  SysdocDetails: TransferDetails[];

  StockFrom: Combo[];
  StockTo: Combo[];
  Product: Product[];
  UNA_Combo: Combo[];
}

export const useTransferStore = defineStore({
  id: "TransferStore",
  state: (): TransferStore => ({
    ItemDetail: [],
    ItemEdit: [],
    Details: [],
    SysdocDetails: [],
    StockFrom: [],
    StockTo: [],
    Product: [],
    UNA_Combo: [],
  }),
  getters: {
    getItemsDetail(state: TransferStore): TransferDetails[] {
      return state.ItemDetail;
    },
    getItemsById(state: TransferStore): Transfer[] {
      return state.ItemEdit;
    },
    getStockFrom(state: TransferStore): Combo[] {
      return state.StockFrom;
    },
    getStockTo(state: TransferStore): Combo[] {
      return state.StockTo;
    },
    getProduct(state: TransferStore): Product[] {
      return state.Product;
    },
    getSysdocDetails(state: TransferStore): TransferDetails[] {
      return state.SysdocDetails;
    },
    getUNACombo(state: TransferStore): Combo[] {
      return state.UNA_Combo;
    },
  },
  actions: {
    async cboStockFrom() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/pos_stock")
        .then((response) => {
          this.StockFrom = response.data.data as Combo[];
          this.StockTo = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async combo_una_list() {
      await api
        .get<DataResponse<Combo[]>>(`v1/pos/una_transfer_list`)
        .then((response) => {
          if (response.data.success) {
            this.UNA_Combo = response.data.data;
            return this.UNA_Combo;
          }
        });
    },
    async search_items(id: string) {
      await api
        .get<DataResponse<Product[]>>(`v1/pos/search_items/${id}`)
        .then((response) => {
          if (response.data.data.length > 0) {
            this.Product = response.data.data as Product[];
          }
        });
    },
    async una_details_sysdoc(id: string) {
      await api
        .get<DataResponse<TransferDetails[]>>(
          `v1/pos/una_transfer_sysdoc/${id}`
        )
        .then((response) => {
          if (response.data.success) {
            this.SysdocDetails = response.data.data;
            return this.SysdocDetails;
          }
        });
    },
    async create_details(dataForm: TransferDetails) {
      return await api
        .post<DataResponse<TransferDetails[]>>(
          baseUrl + "v1/pos/create_transfer_details",
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

    async create_trans(dataForm: Transfer) {
      return await api
        .post<DataResponse<Transfer[]>>(
          baseUrl + "v1/pos/create_stock_transfer",
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

    async una_tran_by_id(id: string) {
      await api
        .get<DataResponse<Transfer[]>>(`v1/pos/una_transfer_list/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemEdit = response.data.data;
            return this.ItemEdit;
          }
        });
    },
    async una_details_id(id: string) {
      await api
        .get<DataResponse<TransferDetails[]>>(`v1/pos/una_transfer_id/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemDetail = response.data.data;
            return this.ItemDetail;
          }
        });
    },
  },
});
