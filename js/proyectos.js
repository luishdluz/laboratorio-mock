let proyectos = [
    { id: 1, nombre: 'Indicadores Financieros' },
    { id: 2, nombre: 'Análisis Macroeconómico' },
    { id: 3, nombre: 'Reporte Trimestral' }
];

const catalogoUsuarios = [
    { id: 1, nombre: 'Hernández Martínez Aidalit Guadalupe', clave: 'M18317', foto: 'imagenes/m18317.png' },
    { id: 2, nombre: 'Hernández De La Luz Luis Antonio', clave: 'B16847', foto: 'imagenes/b16847.png' },
    { id: 3, nombre: 'Macías González José Jordan', clave: 'C18408', foto: 'imagenes/c18408.png' },
    { id: 4, nombre: 'Mohedano Valdez Gabriel Oliver', clave: 'A12129', foto: 'imagenes/a12129.png' },
    { id: 5, nombre: 'Rios Islas Antonio', clave: 'B14134', foto: 'imagenes/b14134.png' },
    { id: 6, nombre: 'Cruz Hernández Jesús Gerardo', clave: 'D10367', foto: 'imagenes/d10367.png' }
];

const usuariosProyecto = [
    { id: 5, nombre: 'Rios Islas Antonio', clave: 'B14134', foto: 'imagenes/b14134.png' },
    { id: 6, nombre: 'Cruz Hernández Jesús Gerardo', clave: 'D10367', foto: 'imagenes/d10367.png' }
];

let proyectoSeleccionadoId = null;

$('#nombreProyecto').on('click', function () {
    abrirModalProyectos();
});


function renderizarProyectos(filtro = '') {
    const contenedor = $('#listaProyectos');
    contenedor.empty();

    proyectos
        .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
            contenedor.append(`
                <div class="card-proyecto"
                     data-id="${p.id}"
                     style="border:2px solid #e5e7eb; border-radius:10px;
                            padding:12px; cursor:pointer;">
                    <strong>${p.nombre}</strong>
                </div>
            `);
        });
}


function abrirModalProyectos() {
    renderizarProyectos();
    $('#overlayProyectos').fadeIn(150);
    $('#modalProyectos').addClass('activo');
}

function cerrarModalProyectos() {
    $('#modalProyectos').removeClass('activo');
    $('#overlayProyectos').fadeOut(150);
    proyectoSeleccionadoId = null;
    $('#btnSeleccionarProyecto').prop('disabled', true);
}


$('#cerrarModalProyectos, #overlayProyectos').on('click', cerrarModalProyectos);


$('#buscadorProyectos').on('input', function () {
    renderizarProyectos($(this).val());
});

$(document).on('click', '.card-proyecto', function () {
    $('.card-proyecto').css('border', '2px solid #e5e7eb');
    $(this).css('border', '2px solid #04b3bb');

    proyectoSeleccionadoId = $(this).data('id');
    $('#btnSeleccionarProyecto').prop('disabled', false);
});



$('#btnSeleccionarProyecto').on('click', function () {
    const proyecto = proyectos.find(p => p.id === proyectoSeleccionadoId);
    if (!proyecto) return;

    $('#nombreProyecto strong').text(proyecto.nombre);
    cerrarModalProyectos();
    mostrarToast("Proyecto seleccionado","success");
});


$('#btnNuevoProyecto').on('click', function () {
    $('#inputNombreProyecto').val('');
    $('#overlayCrearProyecto').fadeIn(150);
    $('#modalCrearProyecto').addClass('activo');
});


function cerrarModalCrearProyecto() {
    $('#modalCrearProyecto').removeClass('activo');
    $('#overlayCrearProyecto').fadeOut(150);
}

$('#cerrarCrearProyecto, #cancelarCrearProyecto, #overlayCrearProyecto')
    .on('click', cerrarModalCrearProyecto);


$('#confirmarCrearProyecto').on('click', function () {

    const modal = $(this).closest('.modal');
    const nombre = modal.find('#inputNombreProyecto').val().trim();
    if (!nombre) return;

    proyectos.push({
        id: Date.now(),
        nombre
    });

    cerrarModalCrearProyecto();
    renderizarProyectos();
    mostrarToast("Proyecto creado correctamente","success");
});


$('#btnCompartirProyecto').on('click', function () {
    $('#overlayCompartirProyecto').show();
    $('#modalCompartirProyecto').addClass('activo');
    renderUsuariosProyecto();
});

function cerrarModalCompartir() {
    $('#overlayCompartirProyecto').hide();
    $('#modalCompartirProyecto').removeClass('activo');
    $('#inputBuscarUsuario').val('');
    $('#btnAsignarUsuario').prop('disabled', true);
    usuarioSeleccionado = null;
}

$('#cerrarCompartirProyecto, #cancelarCompartirProyecto, #overlayCompartirProyecto')
    .on('click', cerrarModalCompartir);

function renderUsuariosProyecto() {
    const contenedor = $('#listaUsuariosProyecto');
    contenedor.empty();

    usuariosProyecto.forEach(u => {
        contenedor.append(`
            <div class="usuario-item">
                <img src="${u.foto}">
                <div class="usuario-info">
                    <div>${u.nombre}</div>
                    <small>${u.clave}</small>
                </div>
            </div>
        `);
    });
}


$('#inputBuscarUsuario').autocomplete({
    minLength: 1,
    appendTo: '#modalCompartirProyecto',
    source: function (request, response) {

        const term = request.term.toLowerCase();

        const resultados = catalogoUsuarios.filter(u =>
            u.nombre.toLowerCase().includes(term) ||
            u.clave.toLowerCase().includes(term)
        );

        response(resultados.map(u => ({
            label: `${u.nombre} (${u.clave})`,
            value: u.nombre,
            data: u
        })));
    },
    select: function (event, ui) {
        usuarioSeleccionado = ui.item.data;
        $('#btnAsignarUsuario').prop('disabled', false);
    }
});



$('#btnAsignarUsuario').on('click', function () {

    if (!usuarioSeleccionado) return;

    const yaExiste = usuariosProyecto.some(u => u.id === usuarioSeleccionado.id);

    if (yaExiste) {
        mostrarToast("Este usuario ya tiene permisos","warning");
        return;
    }

    usuariosProyecto.push(usuarioSeleccionado);
    renderUsuariosProyecto();

	mostrarToast("Permisos asignados correctamente","success");
    $('#inputBuscarUsuario').val('');
    $('#btnAsignarUsuario').prop('disabled', true);
    usuarioSeleccionado = null;
});

