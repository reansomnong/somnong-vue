import{d as r,a as s,u as o}from"./index.62cb36ac.js";const n="http://garage_api.test/api/",d=r({id:"StaffStore",state:()=>({ItemDetail:[],ItemEdit:[],Gender:[],Position:[]}),getters:{getItemsDetail(t){return t.ItemDetail},getItemsById(t){return t.ItemEdit},getGender(t){return t.Gender},getPosition(t){return t.Position}},actions:{async ComboGender(){await s.get("v1/gb/combo/gender").then(t=>{this.Gender=t.data.data}).catch(t=>{if(t.response&&t.response.data){const e=t.response.data;o().setErrors(e.errors)}})},async ComboPosition(){await s.get("v1/somnong/somnongcombo/somnong_position").then(t=>{this.Position=t.data.data}).catch(t=>{if(t.response&&t.response.data){const e=t.response.data;o().setErrors(e.errors)}})},async ItemsById(t){await s.get(`v1/somnong/staff_byId/${t}`).then(e=>{if(e.data.success)return this.ItemEdit=e.data.data,this.ItemEdit})},async ItemsList(){await s.get("v1/somnong/getStaff").then(t=>{t.data.success&&(this.ItemDetail=t.data.data)}).catch(t=>{if(t.response&&t.response.data){const e=t.response.data;o().setErrors(e.errors)}})},async create(t){return console.log(t),await s.post(n+"v1/somnong/create_staff",t).then(async e=>{if(e.data.success)return e.data.success}).catch(e=>{if(e.response&&e.response.data){const a=e.response.data;o().setErrors(a.errors)}})}}});export{d as u};
