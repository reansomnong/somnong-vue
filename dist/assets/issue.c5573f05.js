import{b as _,r as t,p as w,R as b,c as q,e as M,o as y,f as i,H as u,g as B,h as P,i as S,j as o,E as a,G as n,O as r}from"./index.62cb36ac.js";import{u as x}from"./staff.9793ebb0.js";const L={class:"grid grid-cols-12 gap-6 mt-5"},k=o("div",{class:"col-span-12 overflow-auto intro-y lg:overflow-visible",role:"alert"},[o("div",{class:"flex"},[o("div",{class:"py-1"},[o("svg",{class:"fill-current h-6 w-6 text-teal-500 mr-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},[o("path",{d:"M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"})])]),o("div",null,[o("p",{class:"font-bold"},"Function comming soon ")])])],-1),G=[k],A=_({__name:"issue",setup(I){const g=t();w("bind[basicStickyNotification]",f=>{g.value=f}),t(!1);const l=b(),s=x();q();const e=M({}),c=t("0"),m=t("0"),d=t("0");t(""),t(""),t(""),t(null),t(!1),t(!1),y(async()=>{v(),await s.ItemsList(),await s.ComboGender(),await s.ComboPosition(),await l.getComboProvince()}),i(()=>l.getProvince),i(()=>s.getGender),i(()=>s.getPosition),i(()=>s.getItemsById),i(()=>s.getItemsDetail),u(m,()=>{e.gender=m.value}),u(c,()=>{e.position_id=c.value}),u(d,()=>{e.address_code=d.value});function v(){e.status="i",e.branch_code="",e.staff_id="",e.full_name="",e.position="",e.position_id="",e.gender="",e.phone="",e.address="",e.remark="",e.active=!0,c.value="",d.value="",p.value.$reset(),e.is_update=!0}const h=i(()=>({full_name:{required:a.withMessage("staff name information is required",n),minLength:r(3)},gender:{required:a.withMessage("Gender information is required",n),minLength:r(1)},position_id:{required:a.withMessage("Position information is required",n),minLength:r(1)},phone:{required:a.withMessage("Phone information is required",n),minLength:r(1)}})),p=B(h,e,{$autoDirty:!0});return(f,z)=>(P(),S("div",L,G))}});export{A as default};
