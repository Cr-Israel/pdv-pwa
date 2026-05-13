/*
   Local Storage
────────────────────────────────────────────────────────── */
function saveData() {

  localStorage.setItem(
    'products',
    JSON.stringify(state.products)
  );

  localStorage.setItem(
    'sales',
    JSON.stringify(state.sales)
  );

  localStorage.setItem(
    'expenses',
    JSON.stringify(state.expenses)
  );

  localStorage.setItem(
    'cart',
    JSON.stringify(state.cart)
  );
}

function loadData() {

  const products =
    localStorage.getItem('products');

  const sales =
    localStorage.getItem('sales');

  const expenses =
    localStorage.getItem('expenses');

  const cart =
    localStorage.getItem('cart');

  if (products) {
    state.products = JSON.parse(products);
  }

  if (sales) {
    state.sales = JSON.parse(sales);
  }

  if (expenses) {
    state.expenses = JSON.parse(expenses);
  }

  if (cart) {
    state.cart = JSON.parse(cart);
  }

  updateDashboard();
  updateReports();
}

