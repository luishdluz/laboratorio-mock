// ================================
// TABS
// ================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {

        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const target = button.getAttribute('data-tab');

        tabContents.forEach(content => {
            content.style.display = (content.id === target) ? 'block' : 'none';
        });

        tabContents.forEach(content => {
            if (content.id === target) {
                content.style.display = 'block';
                content.style.animation = 'fadeTab 0.3s ease';
            } else {
                content.style.display = 'none';
            }
        });

    });
});

// ================================
// FILTRO DE PROYECTOS (GENÉRICO)
// ================================
function activarBuscador(idInput, idContenedor) {
    const input = document.getElementById(idInput);
    const contenedor = document.getElementById(idContenedor);

    if (!input || !contenedor) return;

    input.addEventListener('keyup', function () {
        const filtro = input.value.toLowerCase();
        const cards = contenedor.querySelectorAll('.card-proyecto');

        cards.forEach(card => {
            const titulo = card.querySelector('h3').textContent.toLowerCase();
            const descripcion = card.querySelector('p').textContent.toLowerCase();

            if (titulo.includes(filtro) || descripcion.includes(filtro)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ================================
// ACTIVAR BUSCADORES
// ================================
activarBuscador('buscar-biblioteca', 'contenedor-proyectos');
activarBuscador('buscar-dashboards', 'contenedor-dashboards');


// ================================
// MENÚ HAMBURGUESA FLOTANTE
// ================================
document.addEventListener('click', function (e) {

    // Cerrar todos los menús
    document.querySelectorAll('.opciones-proyecto').forEach(menu => {
        menu.style.display = 'none';
    });

    const boton = e.target.closest('.menu-proyecto');
    if (!boton) return;

    const menu = boton.querySelector('.opciones-proyecto');

    // Mover al body si no está ahí
    if (!menu.dataset.flotante) {
        document.body.appendChild(menu);
        menu.dataset.flotante = 'true';
    }

    const rect = boton.getBoundingClientRect();

    menu.style.display = 'block';
    menu.style.top = rect.bottom + 6 + 'px';
    menu.style.left = rect.right - menu.offsetWidth + 'px';
});




// ================================
// DOBLE CLIC EN CARD → REDIRIGIR A laboratorio.html
// ================================
document.addEventListener('dblclick', function(e) {
    const card = e.target.closest('.card-proyecto');

    if (card) {
        window.location.href = 'laboratorio.html';
    }
});
