// 🔥 VARIABLE GLOBAL
let tooltip;

$(document).ready(function () {
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    document.body.appendChild(tooltip);

    document.addEventListener("mouseover", e => {
        const el = e.target.closest("[data-tooltip]");
        if (!el) return;

        tooltip.textContent = el.dataset.tooltip;

        tooltip.style.background =
            el.dataset.tooltipColor || "var(--tooltip-bg)";

        tooltip.classList.add("show");

        posicionarTooltip(el);
    });

    document.addEventListener("mouseout", e => {
        if (e.target.closest("[data-tooltip]")) {
            tooltip.classList.remove("show");
        }
    });
});

function posicionarTooltip(el) {
    if (!tooltip) return;

    const rect = el.getBoundingClientRect();
    const pos = el.dataset.tooltipPosition || "top";
    const gap = 10;

    // reset
    tooltip.style.top = "0";
    tooltip.style.left = "0";

    const tRect = tooltip.getBoundingClientRect();

    let top, left;

    switch (pos) {
        case "bottom":
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2 - tRect.width / 2;
            break;
        case "left":
            top = rect.top + rect.height / 2 - tRect.height / 2;
            left = rect.left - tRect.width - gap;
            break;
        case "right":
            top = rect.top + rect.height / 2 - tRect.height / 2;
            left = rect.right + gap;
            break;
        default:
            top = rect.top - tRect.height - gap;
            left = rect.left + rect.width / 2 - tRect.width / 2;
    }

    // evitar que se salga de la pantalla
    top = Math.max(10, Math.min(top, window.innerHeight - tRect.height - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - tRect.width - 10));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}