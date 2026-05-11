import { $$ } from "./utils.js";

export function openModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");
}

export function closeModal(id) {
    const modal = document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");
}

export function setupModalClose() {
    $$(".modal-overlay").forEach((modal) => {
        modal.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal-overlay")) {
                modal.classList.remove("open");
            }
        });
    });
}
