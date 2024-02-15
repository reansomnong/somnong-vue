const pos = [
    {
        path: "pos-stock",
        name: "side-menu-pos-stock",
        component: () => import('../pages/pos/stock/Stock.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-product",
        name: "side-menu-pos-product",
        component: () => import('../pages/pos/product/Registe_Product.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-customer",
        name: "side-menu-pos-customer",
        component: () => import('../pages/pos/customer/Customer.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-supply",
        name: "side-menu-pos-supply",
        component: () => import('../pages/pos/supply/supply.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-purchaseorder",
        name: "side-menu-pos-purchaseorder",
        component: () => import('../pages/pos/purchaseorder/PurchaseOrder.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-authrize-po",
        name: "side-menu-pos-auth_po",
        component: () => import('../pages/pos/authorize/AuthPurchaseOrder.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-authrize-pos",
        name: "side-menu-pos-auth_pos",
        component: () => import('../pages/pos/authorize/AuthPointOfSale.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-point-sale",
        name: "side-menu-point-sale",
        component: () => import('../pages/pos/pos/POS.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-category",
        name: "side-menu-pos-category",
        component: () => import('../pages/pos/category/Category.vue'),
        meta: { requiresAuth: true },
    },

    {
        path: "pos-exchange",
        name: "side-menu-pos-exchange",
        component: () => import('../pages/pos/exchangerate/Exchangerate.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-transfer",
        name: "side-menu-pos-transfer",
        component: () => import('../pages/pos/transfer/Transfer.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-auth-transfer",
        name: "side-menu-pos-auth_transfer",
        component: () => import('../pages/pos/authorize/AuthStockTransfer.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-countstock",
        name: "side-menu-pos-countstock",
        component: () => import('../pages/pos/countstock/CountStock.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: "pos-auth-count-stock",
        name: "side-menu-pos-auth-count",
        component: () => import('../pages/pos/authorize/AuthCountStock.vue'),
        meta: { requiresAuth: true },
    },
]

export default pos