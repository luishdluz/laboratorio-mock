const comentariosPorCelda = {
    "celda-1": [
        { id: 1, texto: "Revisar este for", fecha: "2026-02-09" }
    ]
};

function generarIdCelda() {
    return 'celda-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

let celdaComentariosActual = null;

$(document).on('click', '.btn-comentarios', function (e) {
    e.stopPropagation();

    const celda = $(this).closest('.celda-codigo')[0];
    celdaComentariosActual = celda.dataset.idCelda;

    $('#comentarios-celda-id').text(celdaComentariosActual);
    $('#panel-comentarios').removeClass('oculto');

    renderComentarios();
});


$('#cerrarComentarios').on('click', () => {
    $('#panel-comentarios').addClass('oculto');
    celdaComentariosActual = null;
});


function renderComentarios() {
    const lista = $('#lista-comentarios');
    lista.empty();

    const comentarios = comentariosPorCelda[celdaComentariosActual] || [];

    comentarios.forEach(c => {
        lista.append(`
            <div class="comentario" data-id="${c.id}">
                <div class="texto">${c.texto}</div>
                <div class="acciones">
                    <button class="editar-comentario btn-comen">Editar</button>
                    <button class="eliminar-comentario btn-comen">Eliminar</button>
                </div>
            </div>
        `);
    });
}


$('#agregarComentario').on('click', () => {
    const texto = $('#texto-comentario').val().trim();
    if (!texto || !celdaComentariosActual) return;

    if (!comentariosPorCelda[celdaComentariosActual]) {
        comentariosPorCelda[celdaComentariosActual] = [];
    }

    comentariosPorCelda[celdaComentariosActual].push({
        id: Date.now(),
        texto,
        fecha: new Date().toISOString()
    });

    $('#texto-comentario').val('');
    renderComentarios();
});


$(document).on('click', '.editar-comentario', function () {
    const contenedor = $(this).closest('.comentario');
    const id = contenedor.data('id');

    const comentario = comentariosPorCelda[celdaComentariosActual]
        .find(c => c.id === id);

    const nuevoTexto = prompt("Editar comentario", comentario.texto);
    if (nuevoTexto !== null) {
        comentario.texto = nuevoTexto;
        renderComentarios();
    }
});


$(document).on('click', '.eliminar-comentario', function () {
    const id = $(this).closest('.comentario').data('id');

    comentariosPorCelda[celdaComentariosActual] =
        comentariosPorCelda[celdaComentariosActual]
            .filter(c => c.id !== id);

    renderComentarios();
});
