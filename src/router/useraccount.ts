import Profile from "../pages/useraccount/Profile.vue";
const useraccount = [
      {
        path: "user-profile",
        name: "side-menu-user-profile",
        component: Profile,
        meta: { requiresAuth: true },
      },
]
export default useraccount