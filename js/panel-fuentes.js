$('.sidebar-tab').on('click', function () {
    const tab = $(this).data('tab');
    // Tabs
    $('.sidebar-tab').removeClass('activa');
    $(this).addClass('activa');

    // Panels
    $('.sidebar-panel').removeClass('activo');
    $('#tab-' + tab).addClass('activo');
});


const descripcionLenguajes = {
    python: 'Python es el lenguaje por defecto para análisis de datos, machine learning y visualización.',
    r: 'R es ideal para estadística avanzada, análisis exploratorio y visualización académica.',
    java: 'Java permite ejecutar procesos robustos, integraciones empresariales y lógica compleja.'
};

$(document).on('change', 'input[name="lenguaje"]', function () {

    const lenguaje = $(this).val();

    $('.lenguaje-card').removeClass('activa');
    $(this).closest('.lenguaje-card').addClass('activa');

    $('#descripcionLenguaje').text(descripcionLenguajes[lenguaje]);

});
