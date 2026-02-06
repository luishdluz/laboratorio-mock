/* ========================
   TABS DE FUENTES
======================== */
document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        // quitar active de tabs
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // mostrar panel correspondiente
        const id = tab.dataset.tab;
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        document.getElementById(id).classList.add("active");
    });
});


/* ========================
   BUSCADOR
======================== */
document.querySelectorAll(".buscador").forEach(buscador => {
    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase();
        const panel = buscador.closest(".tab-panel");

        panel.querySelectorAll(".fuente-item").forEach(item => {
            const nombre = item.querySelector("span").textContent.toLowerCase();
            item.style.display = nombre.includes(texto) ? "flex" : "none";
        });
    });
});




// Delegación de eventos para escuchar clics en las opciones "Usar"
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("usar")) {

        // Encontrar el contenedor .fuente-item más cercano
        const fuenteItem = e.target.closest(".fuente-item");

        // Obtener el identificador de la fuente
        const idFuente = fuenteItem.getAttribute("identificador");

        // Código base con sustitución de id_fuente
        const codigo =
            `from repositorioBanxico import consultarFuente

try:
    respuesta = consultarFuente('${idFuente}')

    if not respuesta:
        print("No se obtuvo información.")
    else:
        print("Se consulto la fuente institucional correctamente...")



except Exception as e:
    print("Ocurrió un error al consultar la fuente:", str(e))`;

        // Insertar la celda de código (usa tu función actual)
        agregarCeldaCodigoDinamica(codigo);
    }
});





document.addEventListener("click", function(event) {
    // Detectar clic en la opción usarArchivo
    if (event.target.classList.contains("usarArchivo")) {

        // Obtener la fuente relacionada
        const fuente = event.target.closest(".fuente-item");

        if (!fuente) return;

       const archivo = fuente.getAttribute("archivo");
       const extension = fuente.getAttribute("extension");

        // Crear el código personalizado
        const codigo =
          `from repositorioLocalBanxico import leerArchivo

df = leerArchivo("${archivo}", "${extension}")
print(HERE)`;

         //Agregar la celda usando tu misma función
        agregarCeldaCodigoDinamica(codigo);
    }
});



/*Modal*/

// Fuente de datos (INSTITUCIONALES DE EJEMPLO)
const catalogoFuentes = [{
        nombre: "Operaciones de Préstamo",
        descripcion: "Costo promedio ponderado de préstamos concertados"
    },
    {
        nombre: "Operaciones de Reporto",
        descripcion: "Volumen, contrapartes, tasas y plazos"
    },
    {
        nombre: "Derivados cambiarios",
        descripcion: "Volumen operado, tipo de contrato y vencimiento"
    }
];

// Función para generar UUID (simple y rápido)
function generarUUID() {
    return crypto.randomUUID();
}

// Abrir Modal
document.getElementById("agregarFuenteInstitucional").addEventListener("click", () => {
    const cuerpoTabla = document.querySelector("#tablaFuentes tbody");
    cuerpoTabla.innerHTML = "";

    catalogoFuentes.forEach(fuente => {
        const uuid = generarUUID();

        const fila = document.createElement("tr");
        fila.innerHTML = `
      <td>${fuente.nombre}</td>
      <td>${fuente.descripcion}</td>
      <td><button class="usar-fuente-catalogo" data-uuid="${uuid}" data-nombre="${fuente.nombre}" data-descripcion="${fuente.descripcion}">Usar</button></td>
    `;

        cuerpoTabla.appendChild(fila);
    });

    document.getElementById("modalFuentes").style.display = "flex";
});

// Cerrar Modal
document.getElementById("cerrarModalFuentes").addEventListener("click", () => {
    document.getElementById("modalFuentes").style.display = "none";
});


document.addEventListener("click", function(event) {

    if (event.target.classList.contains("usar-fuente-catalogo")) {

        const uuid = event.target.dataset.uuid;
        const nombre = event.target.dataset.nombre;
        const descripcion = event.target.dataset.descripcion;

        // 🔥 Ajustado para usar la clase fuentesInstitucionales
        const contenedor = document.querySelector(".fuentesInstitucionales");

        const div = document.createElement("div");
        div.classList.add("fuente-item");
        div.setAttribute("identificador", uuid);

        div.innerHTML = `
      <img src="imagenes/info.png" class="fuente-icono" alt="icono">
      <span class="fuente-nombre">${nombre}: ${descripcion}
      <p class="identificadorFuente">Identificador: ${uuid}</p>
      </span>

      <div class="fuente-menu">
        <button class="menu-btn">☰</button>
        <div class="menu-opciones">
          <button class="opcion usar">Usar</button>
          <button class="opcion eliminar">Remover</button>
        </div>
      </div>
    `;

        contenedor.appendChild(div);

        // Cerrar modal
        document.getElementById("modalFuentes").style.display = "none";
    }

});



document.getElementById("agregarFuenteLocal").addEventListener("click", () => {
    document.getElementById("modalArchivo").classList.remove("oculto");
});


document.getElementById("btnCancelarArchivo").addEventListener("click", () => {
    document.getElementById("modalArchivo").classList.add("oculto");
});


document.getElementById("btnAgregarArchivo").addEventListener("click", () => {
    const nombreManual = document.getElementById("nombreArchivoManual").value.trim();
    const archivoInput = document.getElementById("archivoLocal");

    if (!archivoInput.files.length) {
        mostrarToast("Selecciona un archivo","warning");
        return;
    }

    const archivo = archivoInput.files[0];
    const nombreReal = archivo.name.split('.').slice(0, -1).join('.');
    const extension = archivo.name.split('.').pop();

    const nombreFinal = nombreManual || nombreReal;

    // Buscar contenedor correcto
    const contenedor = document.querySelector(".fuentesLocales");
    if (!contenedor) {
        console.error("No existe el contenedor .fuentesLocales");
        return;
    }

    // Crear nodo fuente-item
    const div = document.createElement("div");
    div.classList.add("fuente-item");
    div.setAttribute("archivo", nombreReal);
    div.setAttribute("extension", extension);

    div.innerHTML = `
      <img src="imagenes/document.png" class="fuente-icono" alt="icono">
      <span class="fuente-nombre">${nombreFinal}
      <p class="identificadorFuente">Archivo: ${nombreReal}.${extension}</p></span>
      </span>
      <div class="fuente-menu">
          <button class="menu-btn">☰</button>
          <div class="menu-opciones">
              <button class="opcion usarArchivo">Usar</button>
              <button class="opcion eliminar">Remover</button>
          </div>
      </div>
  `;

    contenedor.appendChild(div);

    // Volver a enganchar eventos
    //enlazarEventosFuente(div);

    // Cerrar modal
    document.getElementById("modalArchivo").classList.add("oculto");

    // Reset inputs
    document.getElementById("nombreArchivoManual").value = "";
    document.getElementById("archivoLocal").value = "";
});



function enlazarEventosFuente(fuenteItem) {

    const btnEliminar = fuenteItem.querySelector(".opcion.eliminar");
    const btnUsarArchivo = fuenteItem.querySelector(".opcion.usarArchivo");

    if (btnEliminar) {
        btnEliminar.addEventListener("click", () => {
            fuenteItem.remove();
        });
    }

    if (btnUsarArchivo) {
        btnUsarArchivo.addEventListener("click", () => {
            const archivo = fuenteItem.getAttribute("archivo");
            const ext = fuenteItem.getAttribute("extension");

            agregarCeldaCodigoDinamica(`
from repositorioLocalBanxico import leerArchivo

df = leerArchivo("${archivo}", "${ext}")
print('Se consulto el archivo correctamente...')
      `);
        });
    }
}


document.addEventListener("click", function(e) {
    const isMenuBtn = e.target.classList.contains("menu-btn");

    // Cerrar todos los menús
    document.querySelectorAll(".menu-opciones").forEach(m => m.style.display = "none");

    if (isMenuBtn) {
        const opciones = e.target.nextElementSibling;
        opciones.style.display = "flex"; // mostrar menú de esa fuente
        e.stopPropagation();
    }
});


function agregarCeldaCodigoDinamica(codigoInicial = '') {
    const celda = document.createElement('div');
    celda.className = 'celda-codigo';

    celda.innerHTML = `
        <div class="header-codigo">
            <span>Python</span>

            <button type="button" class="btn-importar-codigo" title="Cargar archivo Python">
                <img src="imagenes/uploadFile.svg" alt="Importar código">
            </button>

            <input type="file" class="input-importar-codigo" accept=".py" hidden>

            <button class="btn-orion" title="Generar código con ORION">
                <img src="imagenes/bot.svg" alt="ORION">
            </button>
        </div>

        <textarea class="editor-codigo"></textarea>

        <div class="resultado-codigo ejecutando">
            Ejecutando código...
        </div>
    `;

    celda.addEventListener('click', e => {
        e.stopPropagation();
        activarCelda(celda);
    });

    celda.querySelector('.btn-orion').addEventListener('click', e => {
        e.stopPropagation();
        abrirOrion(celda);
    });

    const activa = document.querySelector('.celdaActiva');
    if (activa) activa.after(celda);
    else document.querySelector('.contenido-principal').appendChild(celda);

    activarCelda(celda);

    const editor = celda.querySelector('.editor-codigo');

    editor.value = codigoInicial;

    editor.addEventListener('input', () => {
        autoResizeTextarea(editor);
    });

    const btnImportar = celda.querySelector('.btn-importar-codigo');
    const inputFile = celda.querySelector('.input-importar-codigo');

    btnImportar.addEventListener('click', e => {
        e.stopPropagation(); 
        inputFile.value = '';
        inputFile.click();
    });

    /* Ajuste inicial */
    setTimeout(() => autoResizeTextarea(editor), 0);
}
