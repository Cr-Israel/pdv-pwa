/*
   Dashboard
────────────────────────────────────────────────────────── */
function updateDashboard() {

  const revenue = state.sales.reduce((acc, sale) => {
    return acc + sale.total;
  }, 0);

  const expenses = state.expenses.reduce((acc, item) => {
    return acc + item.value;
  }, 0);

  const balance = revenue - expenses;

  const salesCount = state.sales.length;

  const balanceEl = $('#balanceValue');
  const salesEl = $('#salesCount');
  const revenueEl = $('#revenueValue');

  if (balanceEl) {
    balanceEl.textContent = formatCurrency(balance);
  }

  if (salesEl) {
    salesEl.textContent = salesCount;
  }

  if (revenueEl) {
    revenueEl.textContent = formatCurrency(revenue);
  }

  const pixTotal = state.sales
  .filter(sale => sale.payment === 'pix')
  .reduce((acc, sale) => acc + sale.total, 0);

  const dinheiroTotal = state.sales
    .filter(sale => sale.payment === 'dinheiro')
    .reduce((acc, sale) => acc + sale.total, 0);

  const cartaoTotal = state.sales
    .filter(sale => sale.payment === 'cartao')
    .reduce((acc, sale) => acc + sale.total, 0);

  const ticketAverage =
    salesCount > 0
      ? revenue / salesCount
      : 0;

  /* HOME */
  const ticketAverageEl =
    $('#ticketAverage');

  const paymentPixEl =
    $('#paymentPix');

  const paymentDinheiroEl =
    $('#paymentDinheiro');

  const paymentCartaoEl =
    $('#paymentCartao');

  /* RELATÓRIOS */
  const reportRevenueEl =
    $('#reportRevenue');

  const reportExpensesEl =
    $('#reportExpenses');

  const reportProfitEl =
    $('#reportProfit');

  const reportTicketEl =
    $('#reportTicket');

  const reportPixEl =
    $('#reportPix');

  const reportDinheiroEl =
    $('#reportDinheiro');

  const reportCartaoEl =
    $('#reportCartao');

  /* HOME */
  if (ticketAverageEl) {
    ticketAverageEl.textContent =
      formatCurrency(ticketAverage);
  }

  if (paymentPixEl) {
    paymentPixEl.textContent =
      formatCurrency(pixTotal);
  }

  if (paymentDinheiroEl) {
    paymentDinheiroEl.textContent =
      formatCurrency(dinheiroTotal);
  }

  if (paymentCartaoEl) {
    paymentCartaoEl.textContent =
      formatCurrency(cartaoTotal);
  }

  /* RELATÓRIOS */
  if (reportRevenueEl) {
    reportRevenueEl.textContent =
      formatCurrency(revenue);
  }

  if (reportExpensesEl) {
    reportExpensesEl.textContent =
      formatCurrency(expenses);
  }

  if (reportProfitEl) {
    reportProfitEl.textContent =
      formatCurrency(balance);
  }

  if (reportTicketEl) {
    reportTicketEl.textContent =
      formatCurrency(ticketAverage);
  }

  if (reportPixEl) {
    reportPixEl.textContent =
      formatCurrency(pixTotal);
  }

  if (reportDinheiroEl) {
    reportDinheiroEl.textContent =
      formatCurrency(dinheiroTotal);
  }

  if (reportCartaoEl) {
    reportCartaoEl.textContent =
      formatCurrency(cartaoTotal);
  }

  updateReports();
}

function updateReports() {

  const revenue = state.sales.reduce((acc, sale) => {
    return acc + sale.total;
  }, 0);

  const expenses = state.expenses.reduce((acc, item) => {
    return acc + item.value;
  }, 0);

  const profit = revenue - expenses;

  const salesCount = state.sales.length;

  const ticketAverage =
    salesCount > 0
      ? revenue / salesCount
      : 0;

  /* ─────────────────────────────
     Produtos vendidos
  ───────────────────────────── */
  const productsMap = {};

  state.sales.forEach(sale => {

    sale.items.forEach(item => {

      if (!productsMap[item.name]) {

        productsMap[item.name] = {
          qty: 0,
          emoji: item.emoji
        };
      }

      productsMap[item.name].qty += item.qty;
    });

  });

  let topProduct = null;

  Object.entries(productsMap).forEach(([name, data]) => {

    if (
      !topProduct ||
      data.qty > topProduct.qty
    ) {
      topProduct = {
        name,
        qty: data.qty,
        emoji: data.emoji
      };
    }

  });

  /* ─────────────────────────────
     Pagamentos
  ───────────────────────────── */
  const payments = {
    pix: 0,
    dinheiro: 0,
    cartao: 0
  };

  state.sales.forEach(sale => {

    payments[sale.payment] += sale.total;

  });

  /* ─────────────────────────────
     Atualizar DOM
  ───────────────────────────── */
  const revenueEl =
    $('#reportRevenue');

  const expensesEl =
    $('#reportExpenses');

  const profitEl =
    $('#reportProfit');

  const salesEl =
    $('#reportSalesCount');

  const ticketEl =
    $('#reportTicket');

  const topEl =
    $('#topProduct');

  const paymentEl =
    $('#paymentReports');

  if (revenueEl) {
    revenueEl.textContent =
      formatCurrency(revenue);
  }

  if (expensesEl) {
    expensesEl.textContent =
      formatCurrency(expenses);
  }

  if (profitEl) {
    profitEl.textContent =
      formatCurrency(profit);
  }

  if (salesEl) {
    salesEl.textContent =
      salesCount;
  }

  if (ticketEl) {
    ticketEl.textContent =
      formatCurrency(ticketAverage);
  }

  if (topEl) {

    if (topProduct) {

      topEl.innerHTML = `
        <div class="top-item">

          <div class="top-item__row">

            <div class="top-item__left">

              <div class="top-item__emoji">
                ${topProduct.emoji}
              </div>

              <div>

                <div class="top-item__name">
                  ${topProduct.name}
                </div>

                <div class="top-item__meta">
                  ${topProduct.qty} vendidos
                </div>

              </div>

            </div>

            <div class="top-item__rank">
              #1
            </div>

          </div>

        </div>
      `;
    }

    else {

      topEl.innerHTML = `
        <div class="top-item__name">
          Nenhuma venda ainda
        </div>
      `;
    }
  }

  if (paymentEl) {

    paymentEl.innerHTML = `
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
}

