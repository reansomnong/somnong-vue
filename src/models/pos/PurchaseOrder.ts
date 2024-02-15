export interface PurchaseOrder{
    status:string,
    pur_code:string,
    branch_code:string,
    sup_code:string,
    sup_name:string,
    invoice:string,
    remark:string,
    subtotal:number,
    disamount:number,
    total:number,
    input_date:Date,
    inputter:string,
}

export interface PurchaseOrderDetail{
    status:string,
    sysdoc:string,
    pur_code:string,
    branch_code:string,
    pro_code:string,
    barcode:string,
    pro_name:string,
    sto_code:string,
    stc_name:string,
    cost:number,
    unitprice:number,
    discount:number,
    disamount:number,
    qty:number,
    amount:number
    qty_alert:number,
    lin_code:string,
    remark:string,
    inputter:string,
}