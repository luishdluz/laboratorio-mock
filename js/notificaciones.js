function mostrarToast(mensaje, tipo = "info", duracion = 3000) {

    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = `
        <span>${mensaje}</span>
        <span class="toast-close">&times;</span>
    `;

    container.appendChild(toast);

    // cerrar manual
    toast.querySelector(".toast-close").onclick = () => {
        toast.remove();
    };

    // autocerrar
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, duracion);
}