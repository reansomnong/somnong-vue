import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/SideMenu/SideMenu.vue";
import DashboardOverview1 from "../pages/DashboardOverview1.vue";
import DashboardOverview2 from "../pages/DashboardOverview2.vue";
import DashboardOverview3 from "../pages/DashboardOverview3.vue";
import DashboardOverview4 from "../pages/DashboardOverview4.vue";
import ErrorPage from "../pages/ErrorPage.vue";
import AccessDenied from "../pages/AccessDenied.vue";

import admin_menu from "./admin"
import setting_menu from "./setting"
import pos_menu from "./pos"
import useraccount from "./useraccount"
import somnong from "./somnong"

const routes = [
  {
    path: "/",
    component: SideMenu,
    children: [
      {
        path: "dashboard-overview-1",
        name: "side-menu-dashboard-overview-1",
        component: DashboardOverview1,
        meta: { requiresAuth: true },
      },
      {
        path: "/",
        name: "side-menu-dashboard-overview-2",
        component: DashboardOverview2,
        meta: { requiresAuth: true },
      },
      {
        path: "dashboard-overview-3",
        name: "side-menu-dashboard-overview-3",
        component: DashboardOverview3,
        meta: { requiresAuth: true },
      },
      {
        path: "dashboard-overview-4",
        name: "side-menu-dashboard-overview-4",
        component: DashboardOverview4,
        meta: { requiresAuth: true },
      },
      ...setting_menu,
      ...pos_menu,
      ...useraccount,
      ...somnong,
    ],
  },
  ...admin_menu,
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },

  {
    path: '/:catchAll(.*)*',
    component: ErrorPage,
  },
  {
    path: '/accessdenied',
    component: AccessDenied,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

export default router;

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken == null) {
      return{
        path:'/login'
      }
    }
  }
  if (to.meta.requiresLogin) {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken == null) {
      return {
        path: '/login',
      };
    }
  }
});
