/*
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

