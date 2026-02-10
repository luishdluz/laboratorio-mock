let cuadernos = [];
let contadorCuadernos = 1;
let cuadernoActivo = null;

let modoCuaderno = 'crear'; // crear | editar
let cuadernoEditandoId = null;
let cuadernoEliminarId = null;

//Creamos el primer cuaderno
const nombre = "Calculos";
cuadernos.push({
    id: 'cuaderno_0',
    nombre
});


$('#btnToggleCuadernos').on('click', function () {
	var estatus = $(this).attr("status");
	if(estatus == 'visible'){
		$(this).text('📓 Mostrar opciones'); 
		$(this).attr("status","oculto");
	}else{
		$(this).text('📓 Ocultar opciones'); 
		$(this).attr("status","visible");
	}
    $('.workspace').toggleClass('ocultar-cuadernos');
});


//Crear un cuaderno nuevo
$(document).on('click', '.btn-nuevo-cuaderno', function () {
    modoCuaderno = 'crear';
    $('#modalCuadernoTitulo').text('Nuevo cuaderno');
    abrirModal('#modalCuaderno');
});


//Editar cuaderno
$(document).on('click', '.btn-editar', function (e) {

    e.stopPropagation();

    const id = $(this).closest('.cuaderno-item').data('id');
    const cuaderno = cuadernos.find(c => c.id === id);
    if (!cuaderno) return;

    modoCuaderno = 'editar';
    cuadernoEditandoId = id;

    $('#modalCuadernoTitulo').text('Editar cuaderno');
    $('#inputNombreCuaderno').val(cuaderno.nombre);

    abrirModal('#modalCuaderno');
});



//Eliminar cuaderno
$(document).on('click', '.btn-eliminar', function (e) {
    e.stopPropagation();

    cuadernoEliminarId = $(this).closest('.cuaderno-item').data('id');
    abrirModal('#modalEliminar');
});







//Buscador de cuadernos
$(document).on('input', '.buscador-cuadernos', function () {
    const texto = $(this).val().toLowerCase();

    $('.cuaderno-item').each(function () {
        const nombre = $(this).find('.cuaderno-nombre').text().toLowerCase();
        $(this).toggle(nombre.includes(texto));
    });
});


//Renderizar cuadernos
function renderizarCuadernos() {
    const $lista = $('.lista-cuadernos');
    $lista.empty();

    if (cuadernos.length === 0) {
        $lista.append('<div class="sin-resultados">No hay cuadernos</div>');
        return;
    }

    cuadernos.forEach(c => {
        const item = `
            <div class="cuaderno-item" data-id="${c.id}">
                <span class="cuaderno-nombre">${c.nombre}</span>
                <div class="cuaderno-acciones">
                    <button class="btn-editar" title="Editar">✏️</button>
                    <button class="btn-eliminar" title="Eliminar">🗑️</button>
                </div>
            </div>
        `;
        $lista.append(item);
    });
}


//Abrir modal
function abrirModal(id) {
    $('#modalOverlay').fadeIn(150);
    $(id).addClass('activo');
}

//Cerrar modal
function cerrarModales() {
    $('#modalOverlay').fadeOut(150);
    $('.modal').removeClass('activo');
    $('#inputNombreCuaderno').val('');
    cuadernoEditandoId = null;
    cuadernoEliminarId = null;
}


//Boton guardar cuaderno
$('#btnGuardarCuaderno').on('click', function () {
    const nombre = $('#inputNombreCuaderno').val().trim();
    var mensaje = "";
    if (!nombre) return;

    if (modoCuaderno === 'crear') {
    	mensaje = "Se creo el cuaderno...";
        cuadernos.push({
            id: 'cuaderno_' + contadorCuadernos++,
            nombre
        });
    } else {
    	mensaje = "Se actualizo el cuaderno...";
        const c = cuadernos.find(c => c.id === cuadernoEditandoId);
        if (c) c.nombre = nombre;
    }

    renderizarCuadernos();
    cerrarModales();
    mostrarToast(""+mensaje,"success");
});


//Boton eliminar cuaderno
$('#btnConfirmarEliminar').on('click', function () {
    cuadernos = cuadernos.filter(c => c.id !== cuadernoEliminarId);
    renderizarCuadernos();
    cerrarModales();
    mostrarToast("Se elimino el cuaderno...","success");
});


//Cerrar modales
$(document).on('click', '.modal-cerrar, .modal-cancelar, #modalOverlay', cerrarModales);


$(document).on('dblclick', '.cuaderno-item', function () {

    const id = $(this).data('id');
    const nombre = $(this).find(".cuaderno-nombre").text();

    // ¿Ya existe la pestaña?
    if ($('.tab[data-id="' + id + '"]').length) {
        activarTab(id);
        return;
    }

    // Crear pestaña
    $('.tabs-bar').append(`
        <div class="tab activa" data-id="${id}">
            ${nombre}
            <span class="cerrar">×</span>
        </div>
    `);

    // Crear contenido
    $('.tabs-content').append(`
        <div class="tab-panel activo" id="panel-${id}">
            <h3>${nombre}</h3>
            <p>Contenido del cuaderno...</p>
        </div>
    `);

    activarTab(id);
});


function activarTab(id) {
    const $contenedor = $('.panel-trabajo');

    $contenedor.find('.tab').removeClass('activa');
    $contenedor.find('.tab-panel').removeClass('activo');

    $contenedor.find('.tab[data-id="' + id + '"]').addClass('activa');
    $contenedor.find('#panel-' + id).addClass('activo');
}



$(document).on('click', '.tab', function (e) {
    if ($(e.target).hasClass('cerrar')) return;

    const id = $(this).data('id');
    activarTab(id);
});


$(document).on('click', '.tab .cerrar', function (e) {
    e.stopPropagation();

    const tab = $(this).closest('.tab');
    const id = tab.data('id');
    const estabaActiva = tab.hasClass('activa');

    $('#panel-' + id).remove();
    tab.remove();

    // Si cerró la activa, activar la última
    if (estabaActiva) {
        const ultima = $('.tab').last();
        if (ultima.length) {
            activarTab(ultima.data('id'));
        }
    }
});


