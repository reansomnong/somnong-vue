export interface Product{
    status:string,
    pro_code:string,
    branch_code:string,
    pro_name:string,
    barcode:string,
    cost:number,
    unitprice:number,
    discount:number,
    qty_alert:number,
    category_code:string,
    line_code:string,
    color_code:string,
    year_code:string,
    url:string,
    remark:string,
    inputter:string,
    active:boolean,
    tracking:boolean,
}

export interface product_image {
    row: string;
    pro_code: string;
    pro_name: string;
    url: string;
  }
  