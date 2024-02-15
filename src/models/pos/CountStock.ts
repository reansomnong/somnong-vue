export interface CountStock{
    status:string,
    tran_code:string,
    branch_code:string,
    stc_code:string,
    stock_name:string,
    remark:string,
    inputter:string,
    input_date:Date,
}

export interface CountStockDetails{
    status:string,
    sysdoc:string,
    tran_code:string,
    stock_name:string,
    pro_name:string,
    pro_code:string,
    barcode:string,
    qty:number,
    remark:string,
}