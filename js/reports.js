import { state } from "./state.js";

import { $, formatCurrency } from "./utils.js";

export function updateReports() {
    const revenue = state.sales.reduce((acc, sale) => acc + sale.total, 0);

    const expenses = state.expenses.reduce((acc, item) => acc + item.value, 0);

    const profit = revenue - expenses;

    const salesCount = state.sales.length;

    const ticketAverage = salesCount > 0 ? revenue / salesCount : 0;

    const payments = {
        pix: 0,
        dinheiro: 0,
        cartao: 0,
    };

    state.sales.forEach((sale) => {
        payments[sale.payment] += sale.total;
    });

    $("#reportRevenue").textContent = formatCurrency(revenue);

    $("#reportExpenses").textContent = formatCurrency(expenses);

    $("#reportProfit").textContent = formatCurrency(profit);

    $("#reportSalesCount").textContent = salesCount;

    $("#reportTicket").textContent = formatCurrency(ticketAverage);

    $("#paymentReports").innerHTML = `
    <div class="pay-list__row">
      <div class="pay-list__name">
        Pix
      </div>

      <div class="pay-list__value">
        ${formatCurrency(payments.pix)}
      </div>
    </div>

    <div class="pay-list__row">
      <div class="pay-list__name">
        Dinheiro
      </div>

      <div class="pay-list__value">
        ${formatCurrency(payments.dinheiro)}
      </div>
    </div>

    <div class="pay-list__row">
      <div class="pay-list__name">
        Cartão
      </div>

      <div class="pay-list__value">
        ${formatCurrency(payments.cartao)}
      </div>
    </div>
  `;
}
