export interface User {
    id:string,
    userName:string,
    fullName:string,
    image?:string,
    email:string
}
export interface UserExisting {
    status:string,
    id:string,
    is_existing?:boolean,
}

export interface Userinfo {
    status:string,
    id:string,
    branch_code:string,
    branch_name:string,
    username:string,
    fullname:string,
    email:string,
    passWord:string,
    ConfirmPassword:string,
    phone:string,
    profile:string,
    profile_id:string,
    address:string,
    inputter:string,
    image?:string,
    active:boolean,
    is_existing?:boolean,
}
