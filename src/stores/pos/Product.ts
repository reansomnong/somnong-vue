import { defineStore } from "pinia";
import { DataResponse } from "../../models/Responses/DataResponse";
import { Combo } from "../../models/Combo";
import { Product, product_image } from "../../models/pos/Product";
import { api } from "../../boot/axios";
import { AxiosError } from "axios";
import { useAlertStore } from "./Alert";
import { ErrorResponse } from "../../models/Responses/ErrorResponse";
import { SelectedFile } from "../../models/pos/SelectedFile";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface ProductStore {
  ItemDetail: Product[];
  ItemEdit: Product[];
  Categories: Combo[];
  Pro_line: Combo[];
  Pro_Color: Combo[];
  Pro_Year: Combo[];
  File: SelectedFile[];
  ProductImage: product_image[];
}

export const useProductStore = defineStore({
  id: "ProductStore",
  state: (): ProductStore => ({
    ItemDetail: [],
    ItemEdit: [],
    Categories: [],
    Pro_line: [],
    Pro_Color: [],
    Pro_Year: [],
    File: [],
    ProductImage: [],
  }),
  getters: {
    getItemsDetail(state: ProductStore): Product[] {
      return state.ItemDetail;
    },
    getItemsById(state: ProductStore): Product[] {
      return state.ItemEdit;
    },
    getCategories(state: ProductStore): Combo[] {
      return state.Categories;
    },
    getLine(state: ProductStore): Combo[] {
      return state.Pro_line;
    },
    getColor(state: ProductStore): Combo[] {
      return state.Pro_Color;
    },
    getYear(state: ProductStore): Combo[] {
      return state.Pro_Year;
    },
    getProduct_image(state: ProductStore): product_image[] {
      return state.ProductImage;
    },
  },

  actions: {
    async product_image(pro_id: string) {
      await api
        .get<DataResponse<product_image[]>>(`v1/pos/product_image/${pro_id}`)
        .then(async (response) => {
          this.ProductImage = response.data.data as product_image[];
          return this.ProductImage;
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async ComboCatogories() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/pos_cateogries")
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
    async ComboColor() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/pos_pro_color")
        .then((response) => {
          this.Pro_Color = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async ComboYear() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/pos_pro_year")
        .then((response) => {
          this.Pro_Year = response.data.data as Combo[];
        })
        .catch((error: AxiosError) => {
          if (error.response && error.response.data) {
            const errorresponse = error.response.data as ErrorResponse;
            const alertStore = useAlertStore();
            alertStore.setErrors(errorresponse.errors);
          }
        });
    },
    async ComboLine() {
      await api
        .get<DataResponse<Combo[]>>("v1/pos/combo/pos_pro_line")
        .then((response) => {
          this.Pro_line = response.data.data as Combo[];
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
        .get<DataResponse<Product[]>>(`v1/pos/Product_byId/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemEdit = response.data.data;
            return this.ItemEdit;
          }
        });
    },
    async ItemsByCategory(id: string) {
      await api
        .get<DataResponse<Product[]>>(`v1/pos/pro_by_category/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.ItemDetail = response.data.data;
            return this.ItemDetail;
          }
        });
    },
    async ItemsList() {
      await api
        .get<DataResponse<Product[]>>("v1/pos/getProduct")
        .then((response) => {
          if (response.data.success) {
            this.ItemDetail = response.data.data as Product[];
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
    async create_product(dataForm: Product) {
      return await api
        .post<DataResponse<Product[]>>(
          baseUrl + "v1/pos/create_product",
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

    async delete_image(dataForm: product_image) {
      return await api
        .post<DataResponse<Product[]>>(
          baseUrl + "v1/pos/del_product_image",
          dataForm
        )
        .then(async (response) => {
          if (response.data.success) {
            this.product_image(dataForm.pro_code);
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
        .post<DataResponse<File>>(
          baseUrl + "v1/pos/product_upload_image",
          formData
        )
        .then(async (response) => {
          if (response.data.success) {
            this.product_image(referent_id);
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
