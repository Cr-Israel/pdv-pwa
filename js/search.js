import { $, $$ } from "./utils.js";

export function setupSearch() {
    const input = $("#searchInput");

    if (!input) return;

    input.addEventListener("input", () => {
        const term = input.value.toLowerCase();

        const rows = $$(".prod-row");

        rows.forEach((row) => {
            const name = row.dataset.name.toLowerCase();

            row.style.display = name.includes(term) ? "flex" : "none";
        });
    });
}
