export interface Transfer{
    status:string,
    tran_code:string,
    branch_code:string,
    sto_code_from:string,
    sto_code_to:string,
    stock_name:string,
    remark:string,
    inputter:string,
    input_date:Date,
}

export interface TransferDetails{
    status:string,
    sysdoc:string,
    tran_code:string,
    stock_name:string,
    pro_name:string,
    pro_code:string,
    barcode:string,
    stock_to:string,
    qty:number,
    remark:string,
}