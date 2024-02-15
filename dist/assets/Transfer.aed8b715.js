import{d as we,a as b,u as R,b as xe,e as ae,r as k,o as Se,H as oe,f as w,g as re,h as u,i as f,j as r,k as t,w as l,l as _,m as e,_ as x,t as z,q as h,I as O,F as V,s as P,v as m,A as B,V as Ce,n as le,W as g,C as ne,D as v,z as N,L as ie,x as K,B as de,S as M,E as j,G,O as Q}from"./index.62cb36ac.js";const ce="http://garage_api.test/api/",$e=we({id:"TransferStore",state:()=>({ItemDetail:[],ItemEdit:[],Details:[],SysdocDetails:[],StockFrom:[],StockTo:[],Product:[],UNA_Combo:[]}),getters:{getItemsDetail(i){return i.ItemDetail},getItemsById(i){return i.ItemEdit},getStockFrom(i){return i.StockFrom},getStockTo(i){return i.StockTo},getProduct(i){return i.Product},getSysdocDetails(i){return i.SysdocDetails},getUNACombo(i){return i.UNA_Combo}},actions:{async cboStockFrom(){await b.get("v1/pos/combo/pos_stock").then(i=>{this.StockFrom=i.data.data,this.StockTo=i.data.data}).catch(i=>{if(i.response&&i.response.data){const s=i.response.data;R().setErrors(s.errors)}})},async combo_una_list(){await b.get("v1/pos/una_transfer_list").then(i=>{if(i.data.success)return this.UNA_Combo=i.data.data,this.UNA_Combo})},async search_items(i){await b.get(`v1/pos/search_items/${i}`).then(s=>{s.data.data.length>0&&(this.Product=s.data.data)})},async una_details_sysdoc(i){await b.get(`v1/pos/una_transfer_sysdoc/${i}`).then(s=>{if(s.data.success)return this.SysdocDetails=s.data.data,this.SysdocDetails})},async create_details(i){return await b.post(ce+"v1/pos/create_transfer_details",i).then(async s=>{if(s.data.success)return s.data.success}).catch(s=>{if(s.response&&s.response.data){const d=s.response.data;R().setErrors(d.errors)}})},async create_trans(i){return await b.post(ce+"v1/pos/create_stock_transfer",i).then(async s=>{if(s.data.success)return s.data.success}).catch(s=>{if(s.response&&s.response.data){const d=s.response.data;R().setErrors(d.errors)}})},async una_tran_by_id(i){await b.get(`v1/pos/una_transfer_list/${i}`).then(s=>{if(s.data.success)return this.ItemEdit=s.data.data,this.ItemEdit})},async una_details_id(i){await b.get(`v1/pos/una_transfer_id/${i}`).then(s=>{if(s.data.success)return this.ItemDetail=s.data.data,this.ItemDetail})}}}),De={class:"flex flex-col items-center mt-8 intro-y sm:flex-row"},Te=r("h2",{class:"mr-auto text-lg font-medium"},"Stock transfer",-1),Fe={class:"flex w-full mt-4 sm:w-auto sm:mt-0"},qe={class:"flex items-center justify-center w-5 h-5"},Ie={class:"truncate"},Ve={class:"grid grid-cols-12 gap-5 mt-5 intro-y"},Pe={class:"col-span-12 intro-y lg:col-span-8"},Ne={class:"lg:flex intro-y"},Ae={class:"relative"},Ue={class:"grid grid-cols-12 gap-5 mt-5"},Ee=["onClick"],Le={class:"text-base font-medium"},Oe={class:"text-slate-500"},Be={class:"pr-1 intro-y"},Me={class:"p-2 box"},We={key:0,class:"p-2 mt-5 box"},Re=["onClick"],ze={class:"max-w-[50%] truncate mr-1"},Ke={class:"text-slate-500"},je={key:1,class:"p-5 mt-5 box"},Ge=r("div",{class:"flex"},[r("div",{class:"mr-auto"},"Waitting transaction order")],-1),Qe=[Ge],Xe={class:"flex mt-5"},He={class:"p-5 mt-5 box"},Je={class:"flex items-center pb-5 border-b border-slate-200 dark:border-darkmode-400"},Ye=r("div",{class:"text-slate-500"},"Time",-1),Ze={class:"mt-1"},et={class:"flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400"},tt=r("div",{class:"text-slate-500"},"Stock",-1),st={class:"mt-1"},at={class:"flex items-center py-5 border-b border-slate-200 dark:border-darkmode-400"},ot=r("div",{class:"text-slate-500"},"Remark",-1),rt={class:"mt-1"},lt=r("div",{class:"ml-4 mr-4"},[r("div",{class:"font-medium"},"Registration success!")],-1),nt=r("div",{class:"ml-4 mr-4"},[r("div",{class:"mt-1 text-slate-500"},"Please check the fileld form.")],-1),it=r("h2",{class:"mr-auto text-base font-medium"},"Stock Transfer info",-1),dt={class:"col-span-12"},ct=["value"],ut={class:"col-span-12"},_t=["value"],mt={class:"col-span-12"},ft={class:"mr-auto text-base font-medium"},vt={class:"col-span-12 sm:col-span-6"},pt={class:"col-span-12"},ht={class:"p-5 text-center"},yt=r("div",{class:"mt-5 text-3xl"},"Invalid Ticket",-1),kt=r("div",{class:"mt-2 text-slate-500"}," Please create your ticket Order first ! ",-1),gt={class:"px-5 pb-8 text-center"},wt=xe({__name:"Transfer",setup(i){const s=$e(),d=ae({}),n=ae({}),C=k("0"),$=k("0"),D=k(""),X=k(!1),q=c=>{se(),X.value=c},H=k(!1),I=c=>{n.tran_code==""||n.tran_code==null?A(!0):H.value=c};k(!1);const J=k(!1),A=c=>{J.value=c},Y=k(null),Z=k(null);Se(async()=>{await s.search_items("all"),await s.combo_una_list(),await L("0000"),U(),E()}),oe(C,()=>{d.sto_code_from=C.value,d.sto_code_from==d.sto_code_to&&(d.sto_code_to="",$.value="")}),oe($,()=>{d.sto_code_to=$.value,d.sto_code_from==d.sto_code_to&&(d.sto_code_from="",C.value="")});const ee=w(()=>(console.log(s.getStockFrom),s.getStockFrom)),te=w(()=>s.getUNACombo),S=w(()=>s.getItemsById),ue=w(()=>s.getProduct),y=w(()=>s.getItemsDetail),T=w(()=>s.getSysdocDetails),_e=w(()=>({sto_code_from:{required:j.withMessage("Transfer from stock is required",G),minLength:Q(1)},sto_code_to:{required:j.withMessage("Transfer to stock is required",G),minLength:Q(1)}})),p=re(_e,d,{$autoDirty:!0});function U(){d.branch_code="",d.tran_code="",d.sto_code_from="",d.sto_code_to="",d.remark="",d.inputter="",p.value.$reset(),d.status="i"}function E(){n.status="i",n.pro_code="",n.barcode="",n.qty=0,n.remark="",F.value.$reset()}async function me(){if(p.value.$touch(),p.value.$invalid){const a=document.querySelectorAll("#failed-notification-content")[0].cloneNode(!0);a.classList.remove("hidden"),M({node:a,duration:3e3,newWindow:!0,close:!0,gravity:"top",position:"right",stopOnFocus:!0}).showToast()}else{var c=await s.create_trans(d);if(c){const a=document.querySelectorAll("#success-notification-content")[0].cloneNode(!0);a.classList.remove("hidden"),M({node:a,duration:3e3,newWindow:!0,close:!0,gravity:"top",position:"right",stopOnFocus:!0}).showToast(),await s.combo_una_list(),q(!1),U(),p.value.$reset()}}}async function fe(c){await s.una_tran_by_id(c),d.status="cm",d.tran_code=S.value[0].tran_code,d.sto_code_from=S.value[0].sto_code_from,d.sto_code_to=S.value[0].sto_code_to,d.stock_name=S.value[0].stock_name,d.remark=S.value[0].remark,d.input_date=S.value[0].input_date,n.status="i",n.tran_code=S.value[0].tran_code,L(n.tran_code)}async function ve(){D.value==""||D.value==null?await s.search_items("all"):await s.search_items(D.value)}async function pe(c){E(),n.pro_code=c}async function he(c){const a=["0","1","2","3","4","5","6","7","8","9","."],o=c.key;a.includes(o)||c.preventDefault()}const ye=w(()=>({qty:{required:j.withMessage("Qty is required",G),minLength:Q(1)}})),F=re(ye,n,{$autoDirty:!0});async function ke(){if(F.value.$touch(),n.tran_code==""||n.tran_code==null)A(!0);else if(F.value.$invalid){const a=document.querySelectorAll("#failed-notification-content")[0].cloneNode(!0);a.classList.remove("hidden"),M({node:a,duration:3e3,newWindow:!0,close:!0,gravity:"top",position:"right",stopOnFocus:!0}).showToast()}else{var c=await s.create_details(n);if(c){const a=document.querySelectorAll("#success-notification-content")[0].cloneNode(!0);a.classList.remove("hidden"),M({node:a,duration:3e3,newWindow:!0,close:!0,gravity:"top",position:"right",stopOnFocus:!0}).showToast(),await s.combo_una_list(),await L(n.tran_code),q(!1),I(!1),U(),E(),p.value.$reset(),F.value.$reset(),L(n.tran_code)}}}async function L(c){await s.una_details_id(c),y.value.length>0&&(n.status="i",n.tran_code=y.value[0].tran_code,n.pro_code=y.value[0].pro_code,n.pro_name=y.value[0].pro_name,n.barcode=y.value[0].barcode,n.qty=y.value[0].qty)}async function ge(c){await s.una_details_sysdoc(c),n.status="i",T.value.length>0&&(n.tran_code=T.value[0].tran_code,n.pro_code=T.value[0].pro_code,n.barcode=T.value[0].barcode,n.qty=T.value[0].qty,n.remark=T.value[0].remark)}function se(){U(),E(),s.$reset(),s.search_items("all"),s.combo_una_list(),s.cboStockFrom()}return(c,a)=>(u(),f("div",null,[r("div",De,[Te,r("div",Fe,[t(e(x),{id:"btnCreate",as:"a",href:"#",variant:"primary",onClick:a[0]||(a[0]=o=>{o.preventDefault(),q(!0)}),class:"mr-2 shadow-md"},{default:l(()=>[_(" New Order ")]),_:1}),te.value.length>0?(u(),z(e(O),{key:0,class:"ml-auto sm:ml-0"},{default:l(()=>[t(e(O).Button,{as:e(x),class:"px-2 !box"},{default:l(()=>[r("span",qe,[t(e(h),{icon:"ChevronDown",class:"w-4 h-4"})])]),_:1},8,["as"]),t(e(O).Items,null,{default:l(()=>[(u(!0),f(V,null,P(te.value,o=>(u(),z(e(O).Item,{key:o.id,onClick:()=>{fe(o.id)}},{default:l(()=>[t(e(h),{icon:"Printer",class:"w-4 h-4 mr-2"}),r("span",Ie,m(o.name)+"- "+m(o.id),1)]),_:2},1032,["onClick"]))),128))]),_:1})]),_:1})):B("",!0)])]),r("div",Ve,[r("div",Pe,[r("div",Ne,[r("div",Ae,[t(e(le),{type:"text",modelValue:D.value,"onUpdate:modelValue":a[1]||(a[1]=o=>D.value=o),value:D.value,onKeyup:a[2]||(a[2]=Ce(o=>ve(),["enter"])),class:"w-full px-4 py-3 pr-10 lg:w-64 !box",placeholder:"Search item..."},null,8,["modelValue","value"]),t(e(h),{icon:"Search",class:"absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-slate-500"})])]),r("div",Ue,[(u(!0),f(V,null,P(ue.value,o=>(u(),f("div",{class:"col-span-12 p-5 cursor-pointer sm:col-span-4 2xl:col-span-3 box zoom-in",onClick:W=>{W.preventDefault(),I(!0),pe(o.pro_code)},key:o.pro_code},[r("div",Le,m(o.pro_name),1),r("div",Oe,m(o.barcode),1)],8,Ee))),128))])]),t(e(g).Group,{class:"col-span-12 lg:col-span-4"},{default:l(()=>[r("div",Be,[r("div",Me,[t(e(g).List,{variant:"pills"},{default:l(()=>[t(e(g),null,{default:l(()=>[t(e(g).Button,{as:"button",class:"w-full py-2"},{default:l(()=>[_(" Ticket ")]),_:1})]),_:1}),d.status=="cm"?(u(),z(e(g),{key:0},{default:l(()=>[t(e(g).Button,{as:"button",class:"w-full py-2"},{default:l(()=>[_(" Details ")]),_:1})]),_:1})):B("",!0)]),_:1})])]),t(e(g).Panels,null,{default:l(()=>[t(e(g).Panel,null,{default:l(()=>[y.value.length>0?(u(),f("div",We,[(u(!0),f(V,null,P(y.value,(o,W)=>(u(),f("a",{href:"#",key:o.sysdoc,onClick:be=>{be.preventDefault(),I(!0),ge(o.sysdoc)},class:"flex items-center p-3 transition duration-300 ease-in-out bg-white rounded-md cursor-pointer dark:bg-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-400"},[r("div",ze,m(W+1)+".",1),r("div",Ke,m(o.pro_name)+" = "+m(o.qty)+" to "+m(o.stock_to),1),t(e(h),{icon:"Edit",class:"w-4 h-4 ml-2 text-slate-500"})],8,Re))),128))])):B("",!0),y.value.length<=0?(u(),f("div",je,Qe)):B("",!0),r("div",Xe,[t(e(x),{class:"w-32 border-slate-300 dark:border-darkmode-400 text-slate-500",onClick:a[3]||(a[3]=o=>{o.preventDefault(),se()})},{default:l(()=>[_(" Clear Items ")]),_:1})])]),_:1}),t(e(g).Panel,null,{default:l(()=>[r("div",He,[r("div",Je,[r("div",null,[Ye,r("div",Ze,m(d.input_date),1)]),t(e(h),{icon:"Clock",class:"w-4 h-4 ml-auto text-slate-500"})]),r("div",et,[r("div",null,[tt,r("div",st,m(d.stock_name),1)]),t(e(h),{icon:"User",class:"w-4 h-4 ml-auto text-slate-500"})]),r("div",at,[r("div",null,[ot,r("div",rt,m(d.remark),1)]),t(e(h),{icon:"Users",class:"w-4 h-4 ml-auto text-slate-500"})])])]),_:1})]),_:1})]),_:1}),t(e(ne),{id:"success-notification-content",class:"flex hidden"},{default:l(()=>[t(e(h),{icon:"CheckCircle",class:"text-success"}),lt]),_:1}),t(e(ne),{id:"failed-notification-content",class:"flex hidden"},{default:l(()=>[t(e(h),{icon:"XCircle",class:"text-danger"}),nt]),_:1})]),t(e(v),{open:X.value,onClsoe:a[9]||(a[9]=()=>{q(!1)}),initialFocus:Y.value},{default:l(()=>[t(e(v).Panel,null,{default:l(()=>[t(e(v).Title,null,{default:l(()=>[it]),_:1}),t(e(v).Description,{class:"grid grid-cols-12 gap-4 gap-y-3"},{default:l(()=>[r("div",dt,[t(e(N),{htmlFor:"pos-form-1"},{default:l(()=>[_("Stock from ")]),_:1}),t(e(ie),{name:"cboAddress",modelValue:C.value,"onUpdate:modelValue":a[4]||(a[4]=o=>C.value=o),value:C.value,error:e(p).sto_code_from.$error,class:K({"border-danger":e(p).sto_code_from.$error})},{default:l(()=>[(u(!0),f(V,null,P(ee.value,o=>(u(),f("option",{value:o.id,key:o.id},m(o.name),9,ct))),128))]),_:1},8,["modelValue","value","error","class"])]),r("div",ut,[t(e(N),{htmlFor:"pos-form-1"},{default:l(()=>[_("Stock To ")]),_:1}),t(e(ie),{name:"cboStockTo",id:"cboStockTo",modelValue:$.value,"onUpdate:modelValue":a[5]||(a[5]=o=>$.value=o),value:$.value,error:e(p).sto_code_to.$error,class:K({"border-danger":e(p).sto_code_to.$error})},{default:l(()=>[(u(!0),f(V,null,P(ee.value,o=>(u(),f("option",{value:o.id,key:o.id},m(o.name),9,_t))),128))]),_:1},8,["modelValue","value","error","class"])]),r("div",mt,[t(e(N),{htmlFor:"pos-form-3"},{default:l(()=>[_("remark")]),_:1}),t(e(de),{id:"remark",placeholder:"Item notes",modelValue:d.remark,"onUpdate:modelValue":a[6]||(a[6]=o=>d.remark=o),value:d.remark},null,8,["modelValue","value"])])]),_:1}),t(e(v).Footer,{class:"text-right"},{default:l(()=>[t(e(x),{variant:"outline-secondary",type:"button",onClick:a[7]||(a[7]=()=>{q(!1)}),class:"w-32 mr-1"},{default:l(()=>[_(" Cancel ")]),_:1}),t(e(x),{variant:"primary",type:"button",class:"w-32",ref_key:"createTicketRef",ref:Y,disable:e(p).$invalid,onClick:a[8]||(a[8]=o=>me())},{default:l(()=>[_(" Create Ticket ")]),_:1},8,["disable"])]),_:1})]),_:1})]),_:1},8,["open","initialFocus"]),t(e(v),{open:H.value,onClsoe:a[15]||(a[15]=()=>{I(!1)}),initialFocus:Z.value},{default:l(()=>[t(e(v).Panel,null,{default:l(()=>[t(e(v).Title,null,{default:l(()=>[r("h2",ft," Ticket : "+m(n.tran_code),1)]),_:1}),t(e(v).Description,{class:"grid grid-cols-12 gap-4 gap-y-3"},{default:l(()=>[r("div",vt,[t(e(N),{htmlFor:"modal-form-3"},{default:l(()=>[_(" Qty ")]),_:1}),t(e(le),{id:"qty",name:"qty",type:"number",placeholder:"quality",modelValue:n.qty,"onUpdate:modelValue":a[10]||(a[10]=o=>n.qty=o),value:n.qty,onKeypress:a[11]||(a[11]=o=>he(o)),error:e(F).qty.$error,class:K({"border-danger":e(F).qty.$error})},null,8,["modelValue","value","error","class"])]),r("div",pt,[t(e(N),{htmlFor:"pos-form-5"},{default:l(()=>[_("Notes")]),_:1}),t(e(de),{id:"pos-form-5",placeholder:"Item notes",modelValue:n.remark,"onUpdate:modelValue":a[12]||(a[12]=o=>n.remark=o),value:n.remark},null,8,["modelValue","value"])])]),_:1}),t(e(v).Footer,{class:"text-right"},{default:l(()=>[t(e(x),{variant:"outline-secondary",type:"button",onClick:a[13]||(a[13]=()=>{I(!1)}),class:"w-24 mr-1"},{default:l(()=>[_(" Cancel ")]),_:1}),t(e(x),{variant:"primary",type:"button",class:"w-24",ref_key:"addItemRef",ref:Z,disable:e(p).$invalid,onClick:a[14]||(a[14]=o=>{o.preventDefault(),ke()})},{default:l(()=>[_(" Add Item ")]),_:1},8,["disable"])]),_:1})]),_:1})]),_:1},8,["open","initialFocus"]),t(e(v),{open:J.value,onClose:a[17]||(a[17]=()=>{A(!1)})},{default:l(()=>[t(e(v).Panel,null,{default:l(()=>[r("div",ht,[t(e(h),{icon:"XCircle",class:"w-16 h-16 mx-auto mt-3 text-danger"}),yt,kt]),r("div",gt,[t(e(x),{type:"button",variant:"primary",onClick:a[16]||(a[16]=()=>{A(!1)}),class:"w-24"},{default:l(()=>[_(" Ok ")]),_:1})])]),_:1})]),_:1},8,["open"])]))}});export{wt as default};