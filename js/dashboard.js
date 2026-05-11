import { state } from "./state.js";

import { $, formatCurrency } from "./utils.js";

import { updateReports } from "./reports.js";

export function updateDashboard() {
    const revenue = state.sales.reduce((acc, sale) => acc + sale.total, 0);

    const expenses = state.expenses.reduce((acc, item) => acc + item.value, 0);

    const balance = revenue - expenses;

    const salesCount = state.sales.length;

    const ticketAverage = salesCount > 0 ? revenue / salesCount : 0;

    const pixTotal = state.sales
        .filter((sale) => sale.payment === "pix")
        .reduce((acc, sale) => acc + sale.total, 0);

    const dinheiroTotal = state.sales
        .filter((sale) => sale.payment === "dinheiro")
        .reduce((acc, sale) => acc + sale.total, 0);

    const cartaoTotal = state.sales
        .filter((sale) => sale.payment === "cartao")
        .reduce((acc, sale) => acc + sale.total, 0);

    const balanceEl = $("#balanceValue");

    const salesEl = $("#salesCount");

    const revenueEl = $("#revenueValue");

    if (balanceEl) {
        balanceEl.textContent = formatCurrency(balance);
    }

    if (salesEl) {
        salesEl.textContent = salesCount;
    }

    if (revenueEl) {
        revenueEl.textContent = formatCurrency(revenue);
    }

    const ticketAverageEl = $("#ticketAverage");

    const paymentPixEl = $("#paymentPix");

    const paymentDinheiroEl = $("#paymentDinheiro");

    const paymentCartaoEl = $("#paymentCartao");

    if (ticketAverageEl) {
        ticketAverageEl.textContent = formatCurrency(ticketAverage);
    }

    if (paymentPixEl) {
        paymentPixEl.textContent = formatCurrency(pixTotal);
    }

    if (paymentDinheiroEl) {
        paymentDinheiroEl.textContent = formatCurrency(dinheiroTotal);
    }

    if (paymentCartaoEl) {
        paymentCartaoEl.textContent = formatCurrency(cartaoTotal);
    }

    updateReports();
}
