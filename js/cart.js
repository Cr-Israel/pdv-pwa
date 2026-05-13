/*
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

