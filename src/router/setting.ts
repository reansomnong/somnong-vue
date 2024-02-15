import Addbranch from "../pages/setting/branch/Create_Branch.vue";
import Adduser from "../pages/setting/user/Create_User.vue";
import Menu from "../pages/setting/menu/Create_Menu.vue";

import Profile from "../pages/useraccount/Profile.vue";
import Order_Menu from "../pages/setting/permission/Menu_order.vue";
import Permission_menu from "../pages/setting/permission/Create_permission.vue";

const setting = [
    {
        path: "add-branch",
        name: "side-menu-add-branch",
        component: Addbranch,
        meta: { requiresAuth: true },
      },
      {
        path: "add-user",
        name: "side-menu-add-user",
        component: Adduser,
        meta: { requiresAuth: true },
      },

      {
        path: "add-menu",
        name: "side-menu-add-menu",
        component: Menu,
        meta: { requiresAuth: true },
      },

      {
        path: "profile",
        name: "side-menu-add-profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
      {
        path: "ordering-menu",
        name: "side-menu-main-order",
        component: Order_Menu,
        meta: { requiresAuth: true },
      },
      {
        path: "permission-menu",
        name: "side-menu-permission",
        component: Permission_menu,
        meta: { requiresAuth: true },
      },

]

export default setting