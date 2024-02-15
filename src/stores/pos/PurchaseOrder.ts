import { defineStore } from "pinia";
import { DataResponse } from '../../models/Responses/DataResponse';
import { Combo } from '../../models/Combo';
import { PurchaseOrder, PurchaseOrderDetail } from '../../models/pos/PurchaseOrder';
import { Product } from '../../models/pos/Product';
import { api } from '../../boot/axios';
import { AxiosError } from 'axios';
import { useAlertStore } from './Alert';
import { ErrorResponse } from '../../models/Responses/ErrorResponse';
const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface PurchaseOrderStore {
    ItemDetail: PurchaseOrderDetail[];
    ItemEdit: PurchaseOrder[];
    Suppliers: Combo[];
    UNA_PO: Combo[];
    Product: Product[];
    Stock: Combo[];
    SysdocDetails: PurchaseOrderDetail[];
}


export const usePurchaseOrderStore = defineStore({
    id: 'PurchaseOrderStore',
    state: (): PurchaseOrderStore => ({
        ItemDetail: [],
        ItemEdit: [],
        Suppliers: [],
        UNA_PO: [],
        Product: [],
        Stock: [],
        SysdocDetails: []
    }),
    getters: {
        getItemsById(state: PurchaseOrderStore): PurchaseOrder[] {
            return state.ItemEdit;
        },
        getSupply(state: PurchaseOrderStore): Combo[] {
            return state.Suppliers;
        },
        get_una_po(state: PurchaseOrderStore): Combo[] {
            return state.UNA_PO;
        },
        getProduct(state: PurchaseOrderStore): Product[] {
            return state.Product;
        },
        getStock(state: PurchaseOrderStore): Combo[] {
            return state.Stock;
        },
        getOrderDetail(state: PurchaseOrderStore): PurchaseOrderDetail[] {
            return state.ItemDetail;
        },
        getSysdocDetails(state: PurchaseOrderStore): PurchaseOrderDetail[] {
            return state.SysdocDetails;
        },
    },
    actions: {
        async StockActive() {
            await api
                .get<DataResponse<Combo[]>>(`v1/pos/combo/stock_active`)
                .then((response) => {
                    if (response.data.success) {
                        this.Stock = response.data.data as Combo[];
                    }
                });
        },
        async SupplyActive() {
            await api
                .get<DataResponse<Combo[]>>(`v1/pos/combo/supply_active`)
                .then((response) => {
                    if (response.data.success) {
                        this.Suppliers = response.data.data as Combo[];
                    }
                });
        },
        async search_items(id: string) {
            await api
                .get<DataResponse<Product[]>>(`v1/pos/search_items/${id}`)
                .then((response) => {
                    if (response.data.data.length>0){
                        this.Product = response.data.data as Product[];
                    }
                });
        },

        async una_po_by_id(id: string) {
            await api
                .get<DataResponse<PurchaseOrder[]>>(`v1/pos/una_po_by_id/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemEdit = response.data.data;
                        return this.ItemEdit;
                    }
                });
        },
        async una_po_details_id(id: string) {
            await api
                .get<DataResponse<PurchaseOrderDetail[]>>(`v1/pos/una_po_details_id/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.ItemDetail = response.data.data
                        return this.ItemDetail;
                    } else {
                        console.log('0000000');
                    }
                });
        },
        async una_po_details_sysdoc(id: string) {
            await api
                .get<DataResponse<PurchaseOrderDetail[]>>(`v1/pos/una_po_sysdoc/${id}`)
                .then((response) => {
                    if (response.data.success) {
                        this.SysdocDetails = response.data.data
                        return this.SysdocDetails;
                    }
                });
        },

        async Una_PO() {
            await api
                .get<DataResponse<Combo[]>>(`v1/pos/una_po_list`)
                .then((response) => {
                    if (response.data.success) {
                        this.UNA_PO = response.data.data;
                        return this.UNA_PO;
                    }
                });
        },

        async create_po(dataForm: PurchaseOrder) {
            return await api
                .post<DataResponse<PurchaseOrder[]>>(baseUrl + 'v1/pos/create_po', dataForm)
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

        async create_po_details(dataForm: PurchaseOrderDetail) {
            return await api
                .post<DataResponse<PurchaseOrderDetail[]>>(baseUrl + 'v1/pos/create_po_details', dataForm)
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
    }
})
