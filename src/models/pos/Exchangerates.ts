export interface gb_exchange{
    status:string,
    sysdoc:string,
    base_sysdoc:string,
    base_currency_code:string,
    base_currency:string,
    base_symbol:string,
    currency_code:string,
    currency:string,
    active:boolean,
    amount:number,
    input_date:Date,
}

export interface base_exchange{
    status:string,
    branch_code:string,
    sysdoc:string,
    currency_code:string,
    currency:string,
    amount:number,
    symbol:string,
    existing:boolean,
}

export interface bookingform{
    sysdoc:string,
    currency_code:string,
    currency:string,
    amount:number,
}
export interface vat{
    status:string,
    branch_code:string,
    sysdoc:string,
    amount:number,
}