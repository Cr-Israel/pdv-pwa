import { state } from "./state.js";

import { $$ } from "./utils.js";

export function navigate(screenId) {
    $$(".screen").forEach((screen) => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(screenId);

    if (target) {
        target.classList.add("active");

        state.currentScreen = screenId;
    }

    updateNav();
}

export function updateNav() {
    $$(".nav-item").forEach((item) => {
        item.classList.remove("active");

        if (item.dataset.screen === state.currentScreen) {
            item.classList.add("active");
        }
    });
}

export function setupNavigation() {
    $$(".nav-item").forEach((item) => {
        item.addEventListener("click", () => {
            navigate(item.dataset.screen);
        });
    });
}
