import{d as n,a,u as r}from"./index.62cb36ac.js";const c="http://garage_api.test/api/",u=n({id:"ExchangeStore",state:()=>({itemDetail:[],combo_currency:[],base_curr_exist:[],sub_currency:[],VAT:[]}),getters:{getItemsDetail(e){return e.itemDetail},get_base_curr_exist(e){return e.base_curr_exist},get_sub_currency(e){return e.sub_currency},getcombo_currency(e){return e.combo_currency},getVAT(e){return e.VAT}},actions:{async list_VAT(){await a.get("v1/pos/pos_vat").then(e=>{this.VAT=e.data.data}).catch(e=>{if(e.response&&e.response.data){const t=e.response.data;r().setErrors(t.errors)}})},async Base_currency_exist(){await a.get("v1/pos/combo/base_curr_exist").then(e=>{this.base_curr_exist=e.data.data}).catch(e=>{if(e.response&&e.response.data){const t=e.response.data;r().setErrors(t.errors)}})},async ComboCurrency(){await a.get("v1/pos/combo/base_currency").then(e=>{this.combo_currency=e.data.data}).catch(e=>{if(e.response&&e.response.data){const t=e.response.data;r().setErrors(t.errors)}})},async subCurrency(e){await a.get(`v1/pos/currency/${e}`).then(t=>{if(t.data.success)return this.sub_currency=t.data.data,this.sub_currency})},async ItemsList(){await a.get("v1/pos/list_currency").then(e=>{e.data.success&&(this.itemDetail=e.data.data)}).catch(e=>{if(e.response&&e.response.data){const t=e.response.data;r().setErrors(t.errors)}})},async create_vat(e){return await a.post(c+"v1/pos/create_vat",e).then(async t=>{if(t.data.success)return t.data.data}).catch(t=>{if(t.response&&t.response.data){const s=t.response.data;r().setErrors(s.errors)}})},async create_base_currency(e){return await a.post(c+"v1/pos/create_base_exchange",e).then(async t=>{if(t.data.success)return t.data.data}).catch(t=>{if(t.response&&t.response.data){const s=t.response.data;r().setErrors(s.errors)}})},async create_exchange_rates(e){return await a.post(c+"v1/pos/create_exchange_rates",e).then(async t=>{if(t.data.success)return t.data.data}).catch(t=>{if(t.response&&t.response.data){const s=t.response.data;r().setErrors(s.errors)}})}}});export{u};
