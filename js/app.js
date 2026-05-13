/*
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
