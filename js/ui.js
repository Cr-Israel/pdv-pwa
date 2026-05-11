import { $ } from "./utils.js";

export function flash(message) {
    const flash = $("#successFlash");

    if (!flash) return;

    flash.textContent = message;

    flash.classList.add("show");

    setTimeout(() => {
        flash.classList.remove("show");
    }, 1800);
}

export function setCurrentDate() {
    const el = $("#currentDate");

    if (!el) return;

    const date = new Date();

    const formatted = date.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    el.textContent = formatted;
}

export function updateGreeting() {
    const greetingEl = $("#greetingText");

    if (!greetingEl) return;

    const hour = new Date().getHours();

    let period = "Olá";

    if (hour >= 5 && hour < 12) {
        period = "Bom dia";
    } else if (hour >= 12 && hour < 18) {
        period = "Boa tarde";
    } else {
        period = "Boa noite";
    }

    greetingEl.textContent = `${period}, Carlos!`;
}
