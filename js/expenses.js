import { state } from "./state.js";

import { $, formatCurrency, generateId } from "./utils.js";

import { saveData } from "./storage.js";

import { flash } from "./ui.js";

import { closeModal, openModal } from "./modal.js";

import { updateDashboard } from "./dashboard.js";

let editingExpenseId = null;
let deletingExpenseId = null;

export function createExpense() {
    const name = $("#expenseName").value;

    const value = Number($("#expenseValue").value);

    if (!name || !value) {
        flash("Preencha os campos");

        return;
    }

    state.expenses.push({
        id: generateId(),
        name,
        value,
        createdAt: new Date(),
    });

    renderExpensesList();

    updateDashboard();

    closeModal("expenseModal");

    flash("Despesa cadastrada");

    $("#expenseName").value = "";
    $("#expenseValue").value = "";

    saveData();
}

export function renderExpensesList() {
    const container = document.querySelector("#despesas .card");

    if (!container) return;

    container.innerHTML = "";

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

    state.expenses.forEach((expense) => {
        const row = document.createElement("div");

        row.className = "expense-row";

        row.innerHTML = `
      <div>

        <div class="expense-row__name">
          ${expense.name}
        </div>

        <div class="expense-row__time">
          ${new Date(expense.createdAt).toLocaleTimeString("pt-BR")}
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

export function editExpense(expenseId) {
    const expense = state.expenses.find((e) => e.id === expenseId);

    if (!expense) return;

    editingExpenseId = expenseId;

    $("#editExpenseName").value = expense.name;

    $("#editExpenseValue").value = expense.value;

    openModal("editExpenseModal");
}

export function saveExpenseEdit() {
    const expense = state.expenses.find((e) => e.id === editingExpenseId);

    if (!expense) return;

    expense.name = $("#editExpenseName").value;

    expense.value = Number($("#editExpenseValue").value);

    renderExpensesList();

    updateDashboard();

    saveData();

    closeModal("editExpenseModal");

    flash("Despesa atualizada");
}

export function deleteExpense(expenseId) {
    deletingExpenseId = expenseId;

    openModal("deleteExpenseModal");
}

export function confirmDeleteExpense() {
    state.expenses = state.expenses.filter(
        (expense) => expense.id !== deletingExpenseId,
    );

    renderExpensesList();

    updateDashboard();

    saveData();

    closeModal("deleteExpenseModal");

    flash("Despesa excluída");
}
