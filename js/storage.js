import { state } from "./state.js";

export function saveData() {
    localStorage.setItem("products", JSON.stringify(state.products));

    localStorage.setItem("sales", JSON.stringify(state.sales));

    localStorage.setItem("expenses", JSON.stringify(state.expenses));

    localStorage.setItem("cart", JSON.stringify(state.cart));
}

export function loadData() {
    const products = localStorage.getItem("products");

    const sales = localStorage.getItem("sales");

    const expenses = localStorage.getItem("expenses");

    const cart = localStorage.getItem("cart");

    if (products) {
        state.products = JSON.parse(products);
    }

    if (sales) {
        state.sales = JSON.parse(sales).map((sale) => ({
            ...sale,
            createdAt: new Date(sale.createdAt),
        }));
    }

    if (expenses) {
        state.expenses = JSON.parse(expenses).map((expense) => ({
            ...expense,
            createdAt: new Date(expense.createdAt),
        }));
    }

    if (cart) {
        state.cart = JSON.parse(cart);
    }
}
