let cardMenuActual = null; 


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

    document.querySelectorAll('.opciones-proyecto').forEach(menu => {
        menu.style.display = 'none';
    });

    const boton = e.target.closest('.menu-proyecto');
    if (!boton) return;

    cardMenuActual = boton.closest('.card-proyecto'); // 👈 AQUÍ

    const menu = boton.querySelector('.opciones-proyecto');

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



const modal = document.getElementById('modalProyecto');
const btnNuevo = document.querySelector('.btn-agregar');
const btnCancelar = document.querySelector('.btn-cancelar');
const btnCrear = document.querySelector('.btn-crear');

btnNuevo.addEventListener('click', () => {
    modoEdicion = false;
    cardEditando = null;

    document.querySelector('.modal h2').textContent = 'Nuevo Proyecto';
    btnCrear.textContent = 'Crear';

    modal.style.display = 'flex';
});


btnCancelar.addEventListener('click', cerrarModal);

function cerrarModal() {
    modal.style.display = 'none';

    document.getElementById('nombreProyecto').value = '';
    document.getElementById('descripcionProyecto').value = '';

    modoEdicion = false;
    cardEditando = null;
}





btnCrear.addEventListener('click', () => {

    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();

    if (!nombre) {
        alert('El proyecto necesita un nombre');
        return;
    }

    // =====================
    // MODO EDICIÓN
    // =====================
    if (modoEdicion && cardEditando) {

        cardEditando.querySelector('h3').textContent = nombre;
        cardEditando.querySelector('p').textContent = descripcion || 'Sin descripción';
        mostrarToast("Proyecto actualizado correctamente","success");

    } 
    // =====================
    // MODO CREACIÓN
    // =====================
    else {

        const contenedor = document.getElementById('contenedor-proyectos');

        const card = document.createElement('div');
        card.classList.add('card-proyecto');

        card.innerHTML = `
            <h3>${nombre}</h3>
            <p>${descripcion || 'Sin descripción'}</p>

            <div class="menu-proyecto">
                ☰
                <div class="opciones-proyecto">
                    <div>Compartir</div>
                    <div>Editar</div>
                    <div class="eliminar">Eliminar</div>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    }

    cerrarModal();
});



let cardEditando = null;
let cardEliminando = null;
let modoEdicion = false;


document.addEventListener('click', function (e) {

    const opcionEditar = e.target.closest('.opciones-proyecto div');

    if (!opcionEditar || opcionEditar.textContent.trim() !== 'Editar') return;

    if (!cardMenuActual) return;

    cardEditando = cardMenuActual;
    modoEdicion = true;

    const titulo = cardEditando.querySelector('h3').textContent;
    const descripcion = cardEditando.querySelector('p').textContent;

    document.getElementById('nombreProyecto').value = titulo;
    document.getElementById('descripcionProyecto').value = descripcion;

    document.querySelector('.modal h2').textContent = 'Editar Proyecto';
    btnCrear.textContent = 'Guardar';

    modal.style.display = 'flex';
});



document.addEventListener('click', function (e) {

    // ELIMINAR PROYECTO
    if (e.target.classList.contains('eliminar')) {


        if (!cardMenuActual) return;

        cardEliminando = cardMenuActual;



            setTimeout(() => {
                cardEliminando.remove();
                mostrarToast("Proyecto eliminado correctamente","success");
            }, 300);

        
    }

});




const catalogoUsuarios = [
    { id: 1, nombre: 'Hernández Martínez Aidalit Guadalupe', clave: 'M18317', foto: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 2, nombre: 'Hernández De La Luz Luis Antonio', clave: 'B16847', foto: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { id: 3, nombre: 'Macías González José Jordan', clave: 'C18408', foto: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: 4, nombre: 'Mohedano Valdez Gabriel Oliver', clave: 'A12129', foto: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: 5, nombre: 'Rios Islas Antonio', clave: 'B14134', foto: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { id: 6, nombre: 'Cruz Hernández Jesús Gerardo', clave: 'D10367', foto: 'https://randomuser.me/api/portraits/men/3.jpg' }
];


let usuariosProyecto = [];
let usuariosConAcceso = [];


document.addEventListener('click', function (e) {

    const opcionCompartir = e.target.closest('.opciones-proyecto div');

    if (!opcionCompartir || opcionCompartir.textContent.trim() !== 'Compartir') return;
 
    // mock: proyecto ya tiene usuarios 1 y 2
    usuariosConAcceso = [1, 2];

    renderUsuariosConAcceso();
    document.getElementById('modal-compartir').classList.add('show');
    
});





document.getElementById('cerrar-compartir').addEventListener('click', () => {
    document.getElementById('modal-compartir').classList.remove('show');
});


function renderUsuariosConAcceso() {
    const cont = document.getElementById('lista-usuarios');
    cont.innerHTML = '';

    usuariosConAcceso.forEach(id => {
        const u = catalogoUsuarios.find(c => c.id === id);
        if (!u) return;

        const div = document.createElement('div');
        div.className = 'usuario-item';
        div.innerHTML = `
            <div class="usuario-info">
                <img src="${u.foto}">
                <div class="usuario-texto">
                    <strong>${u.nombre}</strong>
                    <span>${u.clave}</span>
                </div>
            </div>
            <button class="btn-quitar" data-id="${u.id}">Quitar</button>
        `;
        cont.appendChild(div);
    });
}


const inputBuscar = document.getElementById('buscador-usuarios');
const resultados = document.getElementById('resultados-autocomplete');

inputBuscar.addEventListener('input', () => {
    const texto = inputBuscar.value.toLowerCase();
    resultados.innerHTML = '';

    if (texto.length < 2) {
        resultados.style.display = 'none';
        return;
    }

    const coincidencias = catalogoUsuarios.filter(u =>
        !usuariosConAcceso.includes(u.id) &&
        (u.nombre.toLowerCase().includes(texto) ||
         u.clave.toLowerCase().includes(texto))
    );

    coincidencias.forEach(u => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.innerHTML = `
            <img src="${u.foto}">
            <div>
                <strong>${u.nombre}</strong><br>
                <small>${u.clave}</small>
            </div>
        `;
        div.onclick = () => {
            usuariosConAcceso.push(u.id);
            inputBuscar.value = '';
            resultados.style.display = 'none';
            renderUsuariosConAcceso();
            mostrarToast('Usuario agregado', 'success');
        };
        resultados.appendChild(div);
    });

    resultados.style.display = coincidencias.length ? 'block' : 'none';
});


document.getElementById('lista-usuarios').addEventListener('click', e => {
    if (e.target.classList.contains('btn-quitar')) {
        const id = Number(e.target.dataset.id);
        usuariosConAcceso = usuariosConAcceso.filter(u => u !== id);
        renderUsuariosConAcceso();
        mostrarToast('Usuario removido', 'success');
    }
});


