export interface payment {
    status:string,
    payment_id: string,
    branch_code: string,
    title: string,
    referent_code: string,
    ref_exchange: string,
    currency_code: string,
    type_code: string,
    tran_type: string,
    currency: string,
    amount: number,
    remark:string,
    tranDate:Date,
    inputter: string,
    is_update:boolean,
  }

  export interface DocFile {
    row: string;
    tran_code: string;
    title: string;
    extension: string;
    file_name: string,
    url: string;
  }
  export interface PaymentFile {
    status:string,
    quote_code: string;
    file_code: string;
    url: string;
  }


  