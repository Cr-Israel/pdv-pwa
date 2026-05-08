/* ──────────────────────────────────────────────────────────
   App State
────────────────────────────────────────────────────────── */
const state = {
  currentScreen: 'home',
  currentCategory: 'all',
  cart: [],
  paymentMethod: 'pix',

  products: [
    {
      id: 1,
      name: 'Coxinha',
      emoji: '🍗',
      price: 8,
      category: 'salgados',
      active: true
    },

    {
      id: 2,
      name: 'Pastel',
      emoji: '🥟',
      price: 10,
      category: 'salgados',
      active: true
    },

    {
      id: 3,
      name: 'Coca-Cola',
      emoji: '🥤',
      price: 6,
      category: 'bebidas',
      active: true
    },

    {
      id: 4,
      name: 'Brigadeiro',
      emoji: '🍫',
      price: 4,
      category: 'doces',
      active: true
    },

    {
      id: 5,
      name: 'Mini Pizza',
      emoji: '🍕',
      price: 12,
      category: 'salgados',
      active: true
    },

    {
      id: 6,
      name: 'Suco Natural',
      emoji: '🧃',
      price: 7,
      category: 'bebidas',
      active: true
    }
  ],

  sales: [],
  expenses: []
};

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function generateId() {
  return Date.now() + Math.random();
}

/* ──────────────────────────────────────────────────────────
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
}

/* ──────────────────────────────────────────────────────────
   Navigation
────────────────────────────────────────────────────────── */
function navigate(screenId) {

  $$('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const target =
    document.getElementById(screenId);

  if (target) {
    target.classList.add('active');
    state.currentScreen = screenId;
  }

  updateNav();
}

function updateNav() {

  $$('.nav-item').forEach(item => {

    item.classList.remove('active');

    if (item.dataset.screen === state.currentScreen) {
      item.classList.add('active');
    }
  });
}

$$('.nav-item').forEach(item => {

  item.addEventListener('click', () => {
    navigate(item.dataset.screen);
  });
});

/* ──────────────────────────────────────────────────────────
   Products
────────────────────────────────────────────────────────── */
function renderProducts() {

  const container =
    $('#productsGrid');

  if (!container) return;

  container.innerHTML = '';

  const filtered =
    state.products.filter(product => {

      if (!product.active) {
        return false;
      }

      if (state.currentCategory === 'all') {
        return true;
      }

      return (
        product.category ===
        state.currentCategory
      );
    });

  filtered.forEach(product => {

    const inCart =
      state.cart.find(item =>
        item.id === product.id
      );

    const card =
      document.createElement('div');

    card.className = `
      prod-card
      ${inCart ? 'in-cart' : ''}
    `;

    card.innerHTML = `
      <div class="prod-card__emoji">
        ${product.emoji}
      </div>

      <div class="prod-card__name">
        ${product.name}
      </div>

      <div class="prod-card__price">
        ${formatCurrency(product.price)}
      </div>

      ${inCart
        ? `<div class="prod-card__badge">${inCart.qty}</div>`
        : ''
      }
    `;

    card.addEventListener('click', () => {
      addToCart(product.id);
    });

    container.appendChild(card);
  });
}

/* ──────────────────────────────────────────────────────────
   Categories
────────────────────────────────────────────────────────── */
$$('.cat-btn').forEach(btn => {

  btn.addEventListener('click', () => {

    $$('.cat-btn').forEach(b => {
      b.classList.remove('active');
    });

    btn.classList.add('active');

    state.currentCategory =
      btn.dataset.category;

    renderProducts();
  });
});

/* ──────────────────────────────────────────────────────────
   Cart
────────────────────────────────────────────────────────── */
function addToCart(productId) {

  const existing =
    state.cart.find(item =>
      item.id === productId
    );

  if (existing) {
    existing.qty += 1;
  }

  else {

    const product =
      state.products.find(p =>
        p.id === productId
      );

    state.cart.push({
      ...product,
      qty: 1
    });
  }

  renderProducts();
  updateCartBar();
  renderCartModal();

  saveData();

  flashSuccess('Produto adicionado');
}

function decreaseCartItem(productId) {

  const item =
    state.cart.find(i =>
      i.id === productId
    );

  if (!item) return;

  item.qty--;

  if (item.qty <= 0) {

    state.cart =
      state.cart.filter(i =>
        i.id !== productId
      );
  }

  renderProducts();
  renderCartModal();
  updateCartBar();

  saveData();
}

function increaseCartItem(productId) {

  const item =
    state.cart.find(i =>
      i.id === productId
    );

  if (!item) return;

  item.qty++;

  renderProducts();
  renderCartModal();
  updateCartBar();

  saveData();
}

function getCartTotal() {

  return state.cart.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);
}

function getCartItemsCount() {

  return state.cart.reduce((acc, item) => {
    return acc + item.qty;
  }, 0);
}

function updateCartBar() {

  const wrap =
    $('#cartBarWrap');

  if (!wrap) return;

  if (state.cart.length === 0) {

    wrap.classList.add(
      'cart-bar--hidden'
    );

    return;
  }

  wrap.classList.remove(
    'cart-bar--hidden'
  );

  $('#cartItemsCount').textContent =
    `${getCartItemsCount()} itens`;

  $('#cartTotal').textContent =
    formatCurrency(getCartTotal());
}

/* ──────────────────────────────────────────────────────────
   Cart Modal
────────────────────────────────────────────────────────── */
function renderCartModal() {

  const container =
    $('#cartItems');

  if (!container) return;

  container.innerHTML = '';

  if (state.cart.length === 0) {

    container.innerHTML = `
      <div style="
        padding:24px;
        text-align:center;
        color:var(--text-muted);
      ">
        Carrinho vazio
      </div>
    `;

    $('#cartModalTotal').textContent =
      'R$ 0,00';

    return;
  }

  state.cart.forEach(item => {

    const row =
      document.createElement('div');

    row.className = 'cart-item';

    row.innerHTML = `
      <div class="cart-item__left">

        <div class="cart-item__emoji">
          ${item.emoji}
        </div>

        <div>

          <div class="cart-item__name">
            ${item.name}
          </div>

          <div class="cart-item__sub">
            ${formatCurrency(item.price)}
          </div>

        </div>

      </div>

      <div class="cart-item__right">

        <button class="qty-btn minus">
          −
        </button>

        <div class="qty-val">
          ${item.qty}
        </div>

        <button class="qty-btn plus">
          +
        </button>

      </div>
    `;

    row.querySelector('.minus')
      .addEventListener('click', () => {
        decreaseCartItem(item.id);
      });

    row.querySelector('.plus')
      .addEventListener('click', () => {
        increaseCartItem(item.id);
      });

    container.appendChild(row);
  });

  $('#cartModalTotal').textContent =
    formatCurrency(getCartTotal());
}

/* ──────────────────────────────────────────────────────────
   Modal
────────────────────────────────────────────────────────── */
function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.classList.add('open');
}

function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.classList.remove('open');
}

$$('.modal-overlay').forEach(modal => {

  modal.addEventListener('click', (e) => {

    if (
      e.target.classList.contains(
        'modal-overlay'
      )
    ) {
      modal.classList.remove('open');
    }
  });
});

/* ──────────────────────────────────────────────────────────
   Payment
────────────────────────────────────────────────────────── */
$$('.pay-option').forEach(option => {

  option.addEventListener('click', () => {

    $$('.pay-option').forEach(p => {
      p.classList.remove('active');
    });

    option.classList.add('active');

    state.paymentMethod =
      option.dataset.payment;
  });
});

/* ──────────────────────────────────────────────────────────
   Checkout
────────────────────────────────────────────────────────── */
function checkout() {

  if (state.cart.length === 0) {

    flashSuccess('Carrinho vazio');

    return;
  }

  const sale = {
    id: generateId(),
    items: [...state.cart],
    total: getCartTotal(),
    payment: state.paymentMethod,
    createdAt: new Date()
  };

  state.sales.push(sale);

  state.cart = [];

  renderProducts();
  renderCartModal();
  updateCartBar();
  updateDashboard();

  closeModal('cartModal');

  flashSuccess(
    'Venda realizada com sucesso'
  );

  saveData();
}

/* ──────────────────────────────────────────────────────────
   Dashboard
────────────────────────────────────────────────────────── */
function updateDashboard() {

  const revenue =
    state.sales.reduce((acc, sale) => {
      return acc + sale.total;
    }, 0);

  const expenses =
    state.expenses.reduce((acc, item) => {
      return acc + item.value;
    }, 0);

  const balance =
    revenue - expenses;

  const salesCount =
    state.sales.length;

  const balanceEl =
    $('#balanceValue');

  const salesEl =
    $('#salesCount');

  const revenueEl =
    $('#revenueValue');

  if (balanceEl) {
    balanceEl.textContent =
      formatCurrency(balance);
  }

  if (salesEl) {
    salesEl.textContent =
      salesCount;
  }

  if (revenueEl) {
    revenueEl.textContent =
      formatCurrency(revenue);
  }
}

/* ──────────────────────────────────────────────────────────
   Search
────────────────────────────────────────────────────────── */
function setupSearch() {

  const input =
    $('#searchInput');

  if (!input) return;

  input.addEventListener('input', () => {

    const term =
      input.value.toLowerCase();

    const rows =
      $$('.prod-row');

    rows.forEach(row => {

      const name =
        row.dataset.name.toLowerCase();

      row.style.display =
        name.includes(term)
          ? 'flex'
          : 'none';
    });
  });
}

/* ──────────────────────────────────────────────────────────
   Date
────────────────────────────────────────────────────────── */
function setCurrentDate() {

  const el =
    $('#currentDate');

  if (!el) return;

  const date =
    new Date();

  const formatted =
    date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

  el.textContent = formatted;
}

/* ──────────────────────────────────────────────────────────
   Greeting
────────────────────────────────────────────────────────── */
function updateGreeting() {

  const greetingEl =
    $('#greetingText');

  if (!greetingEl) return;

  const hour =
    new Date().getHours();

  let period = 'Olá';

  if (hour >= 5 && hour < 12) {
    period = 'Bom dia';
  }

  else if (hour >= 12 && hour < 18) {
    period = 'Boa tarde';
  }

  else {
    period = 'Boa noite';
  }

  greetingEl.textContent =
    `${period}, Carlos!`;
}

/* ──────────────────────────────────────────────────────────
   Flash
────────────────────────────────────────────────────────── */
function flashSuccess(message) {

  const flash =
    $('#successFlash');

  if (!flash) return;

  flash.textContent = message;

  flash.classList.add('show');

  setTimeout(() => {

    flash.classList.remove('show');

  }, 1800);
}

/* ──────────────────────────────────────────────────────────
   Create Product
────────────────────────────────────────────────────────── */
function createProduct() {

  const name =
    $('#productName').value;

  const price =
    Number($('#productPrice').value);

  const category =
    $('#productCategory').value;

  const emoji =
    $('#productEmoji').value || '📦';

  if (!name || !price) {

    flashSuccess('Preencha os campos');

    return;
  }

  state.products.push({
    id: generateId(),
    name,
    price,
    category,
    emoji,
    active: true
  });

  renderProducts();
  renderProductsList();

  closeModal('productModal');

  flashSuccess('Produto criado');

  $('#productName').value = '';
  $('#productPrice').value = '';
  $('#productEmoji').value = '';

  saveData();
}

/* ──────────────────────────────────────────────────────────
   Create Expense
────────────────────────────────────────────────────────── */
function createExpense() {

  const name =
    $('#expenseName').value;

  const value =
    Number($('#expenseValue').value);

  if (!name || !value) {

    flashSuccess('Preencha os campos');

    return;
  }

  state.expenses.push({
    id: generateId(),
    name,
    value,
    createdAt: new Date()
  });

  renderExpensesList();

  updateDashboard();

  closeModal('expenseModal');

  flashSuccess('Despesa cadastrada');

  $('#expenseName').value = '';
  $('#expenseValue').value = '';

  saveData();
}

function editExpense(expenseId) {

  const expense = state.expenses.find(
    e => e.id === expenseId
  );

  if (!expense) return;

  editingExpenseId = expenseId;

  $('#editExpenseName').value =
    expense.name;

  $('#editExpenseValue').value =
    expense.value;

  openModal('editExpenseModal');
}

function saveExpenseEdit() {

  const expense = state.expenses.find(
    e => e.id === editingExpenseId
  );

  if (!expense) return;

  expense.name =
    $('#editExpenseName').value;

  expense.value =
    Number($('#editExpenseValue').value);

  renderExpensesList();

  updateDashboard();

  saveData();

  closeModal('editExpenseModal');

  flashSuccess('Despesa atualizada');
}

function deleteExpense(expenseId) {

  deletingExpenseId = expenseId;

  openModal('deleteExpenseModal');
}

function confirmDeleteExpense() {

  state.expenses = state.expenses.filter(
    expense => expense.id !== deletingExpenseId
  );

  renderExpensesList();

  updateDashboard();

  saveData();

  closeModal('deleteExpenseModal');

  flashSuccess('Despesa excluída');
}

/* ──────────────────────────────────────────────────────────
   Expenses
────────────────────────────────────────────────────────── */
function renderExpenses() {

  const container =
    document.querySelector(
      '#despesas .card'
    );

  if (!container) return;

  container.innerHTML = '';

  if (state.expenses.length === 0) {

    container.innerHTML = `
      <div class="expense-row">

        <div>

          <div class="expense-row__name">
            Sem despesas cadastradas
          </div>

          <div class="expense-row__time">
            Nenhum registro encontrado
          </div>

        </div>

        <div class="expense-row__val">
          R$ 0,00
        </div>

      </div>
    `;

    return;
  }

  state.expenses.forEach(expense => {

    container.innerHTML += `
      <div class="expense-row">

        <div>

          <div class="expense-row__name">
            ${expense.name}
          </div>

          <div class="expense-row__time">
            ${new Date(expense.createdAt)
        .toLocaleTimeString('pt-BR')}
          </div>

        </div>

        <div class="expense-row__val">
          ${formatCurrency(expense.value)}
        </div>

      </div>
    `;
  });
}

function renderExpensesList() {

  const container =
    document.querySelector('#despesas .card');

  if (!container) return;

  container.innerHTML = '';

  if (state.expenses.length === 0) {

    container.innerHTML = `
      <div class="expense-row">

        <div>

          <div class="expense-row__name">
            Sem despesas cadastradas
          </div>

          <div class="expense-row__time">
            Nenhum registro encontrado
          </div>

        </div>

        <div class="expense-row__val">
          R$ 0,00
        </div>

      </div>
    `;

    return;
  }

  state.expenses.forEach(expense => {

    const row = document.createElement('div');

    row.className = 'expense-row';

    row.innerHTML = `
      <div>

        <div class="expense-row__name">
          ${expense.name}
        </div>

        <div class="expense-row__time">
          ${new Date(expense.createdAt)
        .toLocaleTimeString('pt-BR')}
        </div>

      </div>

      <div class="expense-actions">

        <div class="expense-row__val">
          ${formatCurrency(expense.value)}
        </div>

        <button
          class="edit-btn"
          onclick="editExpense(${expense.id})"
        >
          ✏️
        </button>

        <button
          class="delete-btn"
          onclick="deleteExpense(${expense.id})"
        >
          🗑️
        </button>

      </div>
    `;

    container.appendChild(row);
  });
}

/* ──────────────────────────────────────────────────────────
   Products List
────────────────────────────────────────────────────────── */
function renderProductsList() {

  const container =
    $('#productsList');

  if (!container) return;

  container.innerHTML = '';

  state.products.forEach(product => {

    const row =
      document.createElement('div');

    row.className = 'prod-row';

    row.dataset.name =
      product.name.toLowerCase();

    row.innerHTML = `
      <div class="prod-row__left">

        <div class="prod-row__emoji">
          ${product.emoji}
        </div>

        <div>

          <div class="prod-row__name">
            ${product.name}
          </div>

          <div class="prod-row__cat">
            ${product.category}
          </div>

        </div>

      </div>

      <div class="prod-row__right">

        <div class="prod-row__price">
          ${formatCurrency(product.price)}
        </div>

        <div class="prod-actions">

          <button
            class="edit-btn"
            onclick="editProduct(${product.id})"
          >
            ✏️
          </button>

          <button
            class="delete-btn"
            onclick="deleteProduct(${product.id})"
          >
            🗑️
          </button>

        </div>

        <div class="
          toggle
          ${product.active ? 'on' : ''}
        "></div>

      </div>
    `;

    const toggle =
      row.querySelector('.toggle');

    toggle.addEventListener('click', (e) => {

      e.stopPropagation();

      product.active =
        !product.active;

      toggle.classList.toggle('on');

      renderProducts();

      saveData();
    });

    container.appendChild(row);
  });
}

/* ──────────────────────────────────────────────────────────
   Edit Product
────────────────────────────────────────────────────────── */
let editingProductId = null;
let deletingProductId = null;
let editingExpenseId = null;
let deletingExpenseId = null;

function editProduct(productId) {

  const product =
    state.products.find(p =>
      p.id === productId
    );

  if (!product) return;

  editingProductId = productId;

  $('#editProductName').value =
    product.name;

  $('#editProductPrice').value =
    product.price;

  $('#editProductCategory').value =
    product.category;

  openModal('editProductModal');
}

function saveProductEdit() {

  const product =
    state.products.find(p =>
      p.id === editingProductId
    );

  if (!product) return;

  product.name =
    $('#editProductName').value;

  product.price =
    Number($('#editProductPrice').value);

  product.category =
    $('#editProductCategory').value;

  renderProducts();

  renderProductsList();

  updateDashboard();

  closeModal('editProductModal');

  flashSuccess('Produto atualizado');

  saveData();
}

function deleteProduct(productId) {

  deletingProductId = productId;

  openModal('deleteProductModal');
}

function confirmDeleteProduct() {

  state.products = state.products.filter(
    product => product.id !== deletingProductId
  );

  state.cart = state.cart.filter(
    item => item.id !== deletingProductId
  );

  renderProducts();

  renderProductsList();

  renderCartModal();

  updateCartBar();

  saveData();

  closeModal('deleteProductModal');

  flashSuccess('Produto excluído');
}

/* ──────────────────────────────────────────────────────────
   Init
────────────────────────────────────────────────────────── */
function init() {

  loadData();

  setCurrentDate();

  updateGreeting();

  renderProducts();

  renderCartModal();

  updateCartBar();

  updateDashboard();

  renderProductsList();

  renderExpensesList();

  setupSearch();
}

document.addEventListener(
  'DOMContentLoaded',
  init
);

/* ──────────────────────────────────────────────────────────
   Globals
────────────────────────────────────────────────────────── */
window.createProduct =
  createProduct;

window.createExpense =
  createExpense;

window.editProduct =
  editProduct;

window.saveProductEdit =
  saveProductEdit;

window.navigate =
  navigate;

window.openModal =
  openModal;

window.closeModal =
  closeModal;

window.checkout =
  checkout;

window.deleteProduct =
  deleteProduct;

window.confirmDeleteProduct =
  confirmDeleteProduct;

window.editExpense =
  editExpense;

window.saveExpenseEdit =
  saveExpenseEdit;

window.deleteExpense =
  deleteExpense;

window.confirmDeleteExpense =
  confirmDeleteExpense;

  
if ('serviceWorker' in navigator) {

  window.addEventListener('load', () => {

    navigator.serviceWorker
      .register('./service-worker.js')
      .then(() => {
        console.log('Service Worker registrado');
      })
      .catch(error => {
        console.log('Erro Service Worker:', error);
      });

  });

}