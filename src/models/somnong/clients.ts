export interface clients{
    status:string,
    branch_code:string,
    client_id:string,
    name:string,
    phone:string,
    gender:string,
    address:string,
    system_id:string,
    google_map:string,
    address_code:string,
    remark:string,
    active?:boolean,
}

export interface quotes{
    status:string,
    branch_code:string,
    quote_code:string,
    client_id:string,
    quote_title:string,
    client_name:string,
    phone:string,
    cost:number,
    quote_status:string,
    status_code:string,
    quote_leader:string,
    leader_code:string,
    address:string,
    house_number:string,
    google_map:string,
    address_code:string,
    tranDate:string,
    remark:string,
    inputter:string,
    active?:boolean,
    is_update?:boolean,
}
export interface Quote_file {
    row: string;
    tran_code: string;
    title: string;
    extension: string;
    file_name: string,
    url: string;
  }

  export interface files {
    data_file: File;
  }

  export interface quote_file {
    status:string,
    quote_code: string;
    file_code: string;
    url: string;
  }

  




  