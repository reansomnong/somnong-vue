export interface AddMenu  {
    status: string,
    id: string,
    parent_id: string,
    icon: string,
    page_name: string,
    title: string,
    active: boolean,
  }

  export interface list_sub_per  {
    id: string,
    parent_id: string,
    page_name: string,
    allowed: boolean,
  }

export interface Combo_menu  {
    id: string,
    name: string,
    active: boolean,
  }

export interface MenuDetail  {
    id: string,
    icon: string,
    pagename: string,
    title: string,
    parent_name: string,
    parent_id: string,
    active: boolean,
    status: string,
  }

  export interface Permission_menu  {
    menu_id: string,
    profile_id: string,
    pagename: string,
    title: string,
    parent_name: string,
    parent_id: string,
    active: boolean,
    status: string,
  }

  export interface Add_Permission  {
    id: string,
    status: string,
    menu_id: string,
    system_id: string,
    profile_id: string,
    sub_menu_id: string,
    inputter: string,
    active: boolean,
  }

  export interface Permission  {
    id: string,
    status: string,
    menu_id: string,
    system_id: string,
    profile_id: string,
    sub_menu_id: string,
    menu_name: string,
    menu_arr: menu_save[]
  }
  export interface menu_save  {
    id: string
  }

  export interface menu_arr  {
    id: string,
    name: string,
    index:number
  }
  export interface sub_menu_arr  {
    id: string,
    system_id: string,
    profile_id: string,
    parent_id: string,
    title: string,
  }

  export interface systems  {
    id: string,
    name: string,
    index:number
  }
