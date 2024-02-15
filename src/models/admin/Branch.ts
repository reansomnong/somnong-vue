export interface Branch{
    status:string,
    branch_code:string,
    subofbranch:string,
    main_branch:string,
    branch_name:string,
    short_name:string,
    slogan:string,
    logo:string,
    phone:string,
    address:string,
    system_id:string,
    comments:string,
    active?:boolean,
}
export interface CreateBranch{
    status:string,
    branch_code:string,
    branch_name:string,
    password:string,
    email:string,
    phone:string,
    system_id:string,
    active?:boolean,
    accepted?:boolean,
}


