export interface Pos{
    status:string,
    pos_code:string,
    branch_code:string,
    cus_code:string,
    cus_name:string,
    people_num:string,
    table_num:string,
    referent:string,
    ref_exchange:string,
    exchange_rate:number,
    subtotal:number,
    discount:number,
    disamount:number,
    vat:number,
    vat_amount:number,
    total_amount:number,
    total_charge:number,
    sys_token:string,
    remark:string,
    symbol:string,
    inputter:string,
    input_date:Date,
    authorizer:string,
    auth_date:Date,
    check_payment:string
}

export interface PosDetails{
    status:string,
    sysdoc:string,
    pos_code:string,
    sto_code:string,
    stc_name:string,
    pro_name:string,
    pro_code:string,
    barcode:string,
    cost:number,
    unitprice:number,
    discount:number,
    disamount:number,
    qty:number,
    amount:number,
    total:number,
    remark:string,
    symbol:string,
}

export interface Product {
    row: string;
    pro_code: string;
    barcode:string,
    pro_name: string;
    cost:number,
    unitprice:number,
    discount:number,
    url: string;
    sto_code: string;
  }
  export interface Charges {
    sysdoc: string;
    branch_code:string,
    pos_code:string,
    ref_exchange:string,
    charge:number,
    exchange_rate:number,
    exchange_amount:number, 
    return_amount:number,
    total_charge:number,
    inputter: string;
  }