import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";
import { Combo } from "../../models/Combo";
import { Pos, PosDetails, Product,Charges } from "../../models/pos/POS";
import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "./Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface PosStore {
  ItemDetails: PosDetails[];
  ItemEdit: Pos[];
  Details: PosDetails[];
  SysdocDetails: PosDetails[];
  ProductDefault: Product[];

  Categories: Combo[];
  Customer: Combo[];
  Stock: Combo[];
  Product: Product[];
  UNA_Combo: Combo[];
  Charges: Charges[];
}


export const usePosStore = defineStore({
  id: "PosStore",
  state: (): PosStore => ({
    ItemDetails: [],
    ItemEdit: [],
    Details: [],
    SysdocDetails: [],
    ProductDefault: [],

    Categories: [],
    Customer: [],
    Stock: [],
    Product: [],
    UNA_Combo: [],
    Charges:[]
  }),
  getters: {
    getItemsDetail(state: PosStore): PosDetails[] {
      return state.ItemDetails;
    },
    getItemsById(state: PosStore): Pos[] {
      return state.ItemEdit;
    },
    getCustomer(state: PosStore): Combo[] {
      return state.Customer;
    },
    getStock(state: PosStore): Combo[] {
      return state.Stock;
      //return state.Stock.filter((st=> st.id !='0000'));
    },
    getProduct(state: PosStore): Product[] {
      return state.Product;
    },
    getSysdocDetails(state: PosStore): PosDetails[] {
      return state.SysdocDetails;
    },
    getUNACombo(state: PosStore): Combo[] {
      return state.UNA_Combo;
    },
    getCategories(state: PosStore): Combo[] {
      return state.Categories.filter((todo) => todo.id != "0");
    },
    getProductDefault(state: PosStore): Product[] {
      return state.ProductDefault;
    },
    getCharges(state: PosStore): Charges[] {
      return state.Charges;
    },
  },
  actions: {
    async _clear_record() {
      this.Details = [] as PosDetails[];
      this.SysdocDetails = [] as PosDetails[];
      this.ItemDetails = [] as PosDetails[];
    },

    async ProductById(id: string) {
      await api
        .get<DataResponse<Product[]>>(`v1/pos/productById/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ProductDefault = response.data.data;
            return this.ItemDetails;
          }
        });
    },

    async StockActive() {
      await api
        .get<DataResponse<Combo[]>>(`v1/pos/combo/stock_active`)
        .then((response) => {
          if (response.data.success) {
            this.Stock = response.data.data as Combo[];
          }
        });
    },
    async comboCatogories() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/top_pos_cateogries")
        .then((response) => {
          this.Categories = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },

    async ItemsByCategory(id: string) {
      await api
        .get<DataResponse<Product[]>>(`v1/pos/pos_by_category/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.Product = response.data.data;
            return this.ItemDetails;
          }
        });
    },

    async cboCustomer() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/active_customer")
        .then((response) => {
          this.Customer = response.data.data as Combo[];
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
        .get<DataResponse<Combo[]>>(`v1/pos/combo/una_pos_list`)
        .then((response) => {
          if (response.data.success) {
            this.UNA_Combo = response.data.data;
            return this.UNA_Combo;
          }
        });
    },

    async search_items(id: string) {
      await api
        .get<DataResponse<Product[]>>(`v1/pos/search_pos/${id}`)
        .then((response) => {
          if (response.data.data.length > 0) {
            this.Product = response.data.data as Product[];
          }
        });
    },

    async una_details_sysdoc(id: string) {
      await api
        .get<DataResponse<PosDetails[]>>(`v1/pos/una_transfer_sysdoc/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.SysdocDetails = response.data.data;
            return this.SysdocDetails;
          }
        });
    },
    async delete_sysdoc(dataForm: PosDetails) {
      return await api
        .post<DataResponse<PosDetails[]>>(
          baseUrl + "v1/pos/pos_delete_sysdoc",
          dataForm
        )
        .then(async (response) => {
          if (response.data.success) {
            return response.data.success;
          }
        })
        .catch();
    },
    async pos_charges(dataForm: Charges) {
      return await api
        .post<DataResponse<Charges[]>>(
          baseUrl + "v1/pos/pos_charges",
          dataForm
        )
        .then(async (response) => {
          if (response.data.success) {
            this.Charges=response.data.data;
            return response.data.success;
          }
        })
        .catch((error: AxiosError) => {
          console.log(error.response);

          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);

            
          }
        });
    },
    async create_details(dataForm: PosDetails) {
      return await api
        .post<DataResponse<PosDetails[]>>(
          baseUrl + "v1/pos/create_pos_details",
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
    async create_trans(dataForm: Pos) {
      return await api
        .post<DataResponse<Pos[]>>(
          baseUrl + "v1/pos/create_pos_invoice",
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
        .get<DataResponse<Pos[]>>(`v1/pos/una_pos/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemEdit = response.data.data;

            return this.ItemEdit;
          }
        });
    },
    async una_details_id(id: string) {
      await api
        .get<DataResponse<PosDetails[]>>(`v1/pos/una_pos_details/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemDetails = response.data.data;
            return this.ItemDetails;
          }
        });
    },
    async una_pos_sysdoc(id: string) {
      await api
        .get<DataResponse<PosDetails[]>>(`v1/pos/una_pos_sysdoc/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.SysdocDetails = response.data.data;
            return this.SysdocDetails;
          }
        });
    },
  },
});
