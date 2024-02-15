const pos = [
    {
        path: "somnong-customer",
        name: "side-menu-somnong-customer",
        component: () => import('../pages/somnong/clients/clients.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "somnong-quotes",
        name: "side-menu-somnong-quote",
        component: () => import('../pages/somnong/quote/RegisterQuote.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "somnong-payment",
        name: "side-menu-somnong-payment",
        component: () => import('../pages/somnong/payment/collect_payment.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "somnong-auth-quote",
        name: "side-menu-so-auth-quotes",
        component: () => import('../pages/somnong/authorize/AuthorizeQuote.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "somnong-auth-payment",
        name: "side-menu-so-auth-payment",
        component: () => import('../pages/somnong/authorize/AuthorizePayment.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "somnong-staff",
        name: "side-menu-somnong-staffinfo",
        component: () => import('../pages/somnong/tools/staff.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "somnong-staff",
        name: "side-menu-somnong-issue",
        component: () => import('../pages/somnong/tools/issue.vue'),
        meta: { requiresAuth: true },
    },
]

export default pos