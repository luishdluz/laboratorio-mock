$(document).ready(function () {


    // Mostrar / ocultar acciones
    $(".menu-acciones").on("click", function (e) {
        e.stopPropagation();
        $(this).toggleClass("activo");
    });

    // Cerrar submenu al hacer click fuera
    $(document).on("click", function () {
        $(".menu-acciones").removeClass("activo");
    });

    // Guardar proyecto
    $("#btnGuardarProyecto").on("click", function () {
        mostrarToast("Proyecto guardado correctamente","success");
    });    


    //Abre modal para editar el proyecto
    $('#btnEditarProyecto').on('click', function () {
        const nombreActual = $('#nombreProyecto strong').text().trim();

        $('#inputNombreProyecto').val(nombreActual);

        $('#overlayEditarProyecto').fadeIn(150);
        $('#modalEditarProyecto').addClass('activo');
    });

    function cerrarModalEditarProyecto() {
        $('#modalEditarProyecto').removeClass('activo');
        $('#overlayEditarProyecto').fadeOut(150);
    }

    $('#cerrarEditarProyecto, #cancelarEditarProyecto, #overlayEditarProyecto').on('click', cerrarModalEditarProyecto);


    //Boton editar proyecto
    $('#guardarEditarProyecto').on('click', function () {
        const nuevoNombre = $('#inputNombreProyecto').val().trim();

        if (nuevoNombre === '') {
            alert('El nombre del proyecto no puede estar vacío');
            return;
        }

        // Actualiza solo el <strong>
        $('#nombreProyecto strong').text(nuevoNombre);

        cerrarModalEditarProyecto();

        // Notificación
        mostrarToast("Proyecto actualizado correctamente...","success");
    });


    //Abre modal de eliminación
    $('#btnEliminarProyecto').on('click', function () {
        $('#overlayEliminarProyecto').fadeIn(150);
        $('#modalEliminarProyecto').addClass('activo');
    });

    function cerrarModalEliminarProyecto() {
        $('#modalEliminarProyecto').removeClass('activo');
        $('#overlayEliminarProyecto').fadeOut(150);
    }

    $('#cerrarEliminarProyecto, #cancelarEliminarProyecto, #overlayEliminarProyecto').on('click', cerrarModalEliminarProyecto);

    $('#confirmarEliminarProyecto').on('click', function () {

        /* Resetear nombre del proyecto */
        $('#nombreProyecto strong').text('Seleccione un proyecto...');

        /* Eliminar todos los cuadernos */
        $('.lista-cuadernos').empty(); 

        /* Limpiar área de trabajo */
        $('.panel-trabajo').empty(); 

        cerrarModalEliminarProyecto();
        mostrarToast("Proyecto eliminado correctamente...","success");
    });





});
