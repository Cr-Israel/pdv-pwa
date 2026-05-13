/*
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

