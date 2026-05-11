/* =========================================================
   IMPORTS
========================================================= */
import { loadData } from "./storage.js";

import { navigate, setupNavigation } from "./navigation.js";

import {
    renderProducts,
    renderProductsList,
    setupCategoryFilters,
} from "./products.js";

import { renderCartModal, updateCartBar } from "./cart.js";

import {
    updateDashboard,
    setCurrentDate,
    updateGreeting,
} from "./dashboard.js";

import { updateReports } from "./reports.js";

import { renderExpensesList } from "./expenses.js";

import { setupSearch } from "./search.js";

import { setupModals } from "./modals.js";

import { setupPaymentOptions } from "./payment.js";

import { registerServiceWorker } from "./serviceWorker.js";

/* =========================================================
   INIT
========================================================= */
function init() {
    /* Storage */
    loadData();

    /* Navegação */
    setupNavigation();

    /* Categorias */
    setupCategoryFilters();

    /* Modal */
    setupModals();

    /* Pagamento */
    setupPaymentOptions();

    /* Dashboard */
    setCurrentDate();
    updateGreeting();
    updateDashboard();

    /* Relatórios */
    updateReports();

    /* Produtos */
    renderProducts();
    renderProductsList();

    /* Carrinho */
    renderCartModal();
    updateCartBar();

    /* Despesas */
    renderExpensesList();

    /* Busca */
    setupSearch();

    /* Tela inicial */
    navigate("home");

    /* Service Worker */
    registerServiceWorker();
}

/* =========================================================
   START
========================================================= */
document.addEventListener("DOMContentLoaded", init);
