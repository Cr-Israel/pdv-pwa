import { state } from "./state.js";

import { $, $$, formatCurrency, generateId } from "./utils.js";

import { saveData } from "./storage.js";

import { flash } from "./ui.js";

import { renderCartModal, updateCartBar } from "./cart.js";

import { updateDashboard } from "./dashboard.js";

import { closeModal, openModal } from "./modal.js";

/* ──────────────────────────────────────────────────────────
   State
────────────────────────────────────────────────────────── */
let editingProductId = null;
let deletingProductId = null;

/* ──────────────────────────────────────────────────────────
   Categories
────────────────────────────────────────────────────────── */
export function setupCategories() {
    $$(".cat-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            $$(".cat-btn").forEach((b) => {
                b.classList.remove("active");
            });

            btn.classList.add("active");

            state.currentCategory = btn.dataset.category;

            renderProducts();
        });
    });
}

/* ──────────────────────────────────────────────────────────
   Products Grid
────────────────────────────────────────────────────────── */
export function renderProducts() {
    const container = $("#productsGrid");

    if (!container) return;

    container.innerHTML = "";

    const filtered = state.products.filter((product) => {
        if (!product.active) {
            return false;
        }

        if (state.currentCategory === "all") {
            return true;
        }

        return product.category === state.currentCategory;
    });

    filtered.forEach((product) => {
        const inCart = state.cart.find((item) => item.id === product.id);

        const card = document.createElement("div");

        card.className = `
      prod-card
      ${inCart ? "in-cart" : ""}
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

      ${inCart ? `<div class="prod-card__badge">${inCart.qty}</div>` : ""}
    `;

        card.addEventListener("click", async () => {
            const cartModule = await import("./cart.js");

            cartModule.addToCart(product.id);
        });

        container.appendChild(card);
    });
}

/* ──────────────────────────────────────────────────────────
   Products List
────────────────────────────────────────────────────────── */
export function renderProductsList() {
    const container = $("#productsList");

    if (!container) return;

    container.innerHTML = "";

    state.products.forEach((product) => {
        const row = document.createElement("div");

        row.className = `
      prod-row
      ${!product.active ? "inactive" : ""}
    `;

        row.dataset.name = product.name.toLowerCase();

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
          ${product.active ? "on" : ""}
        "></div>

      </div>
    `;

        const toggle = row.querySelector(".toggle");

        toggle.addEventListener("click", (e) => {
            e.stopPropagation();

            product.active = !product.active;

            toggle.classList.toggle("on");

            row.classList.toggle("inactive", !product.active);

            renderProducts();

            saveData();
        });

        container.appendChild(row);
    });
}

/* ──────────────────────────────────────────────────────────
   Create Product
────────────────────────────────────────────────────────── */
export function createProduct() {
    const name = $("#productName").value;

    const price = Number($("#productPrice").value);

    const category = $("#productCategory").value;

    const emoji = $("#productEmoji").value || "📦";

    if (!name || !price) {
        flash("Preencha os campos");

        return;
    }

    state.products.push({
        id: generateId(),
        name,
        price,
        category,
        emoji,
        active: true,
    });

    renderProducts();
    renderProductsList();

    closeModal("productModal");

    flash("Produto criado");

    $("#productName").value = "";
    $("#productPrice").value = "";
    $("#productEmoji").value = "";

    saveData();
}

/* ──────────────────────────────────────────────────────────
   Edit Product
────────────────────────────────────────────────────────── */
export function editProduct(productId) {
    const product = state.products.find((p) => p.id === productId);

    if (!product) return;

    editingProductId = productId;

    $("#editProductName").value = product.name;

    $("#editProductPrice").value = product.price;

    $("#editProductCategory").value = product.category;

    openModal("editProductModal");
}

export function saveProductEdit() {
    const product = state.products.find((p) => p.id === editingProductId);

    if (!product) return;

    product.name = $("#editProductName").value;

    product.price = Number($("#editProductPrice").value);

    product.category = $("#editProductCategory").value;

    renderProducts();
    renderProductsList();

    updateDashboard();

    closeModal("editProductModal");

    flash("Produto atualizado");

    saveData();
}

/* ──────────────────────────────────────────────────────────
   Delete Product
────────────────────────────────────────────────────────── */
export function deleteProduct(productId) {
    deletingProductId = productId;

    openModal("deleteProductModal");
}

export function confirmDeleteProduct() {
    state.products = state.products.filter(
        (product) => product.id !== deletingProductId,
    );

    state.cart = state.cart.filter((item) => item.id !== deletingProductId);

    renderProducts();

    renderProductsList();

    renderCartModal();

    updateCartBar();

    saveData();

    closeModal("deleteProductModal");

    flash("Produto excluído");
}
