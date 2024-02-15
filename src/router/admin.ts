import Login from "../pages/useraccount/Login.vue";
import Register from "../pages/useraccount/Register.vue";

const admin_menu = [
    {
        path: "/login",
        name: "login",
        component: Login,
      },
      {
        path: "/register",
        name: "register",
        component: Register,
      },
]
export default admin_menu