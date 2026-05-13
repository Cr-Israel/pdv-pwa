/*
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

