$(document).ready(function () {
	
	const btnOcultarMenu = document.getElementById('btnOcultarMenu');
	const btnMostrarMenuContenido = document.getElementById('btnMostrarMenuContenido');
	const layout = document.querySelector('.layout-dashboard');

	btnOcultarMenu.addEventListener('click', () => {
	    layout.classList.add('menu-oculto');
	    $("#btnMostrarMenuContenido").css("display","flex");
	});

	btnMostrarMenuContenido.addEventListener('click', () => {
	    layout.classList.remove('menu-oculto');
	    $("#btnMostrarMenuContenido").css("display","none");
	});


});