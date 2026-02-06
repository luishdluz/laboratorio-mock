document.getElementById('btnAgregarTexto').addEventListener('click', () => {
    const nuevaCelda = crearCeldaTexto();


    const celdaActiva = document.querySelector('.celdaActiva');



    if (celdaActiva) {
        celdaActiva.after(nuevaCelda);
    } else {
        document.querySelector('.contenido-principal').appendChild(nuevaCelda);
    }

    activarCelda(nuevaCelda);
});

function crearCeldaTexto() {
    const celda = document.createElement('div');
    celda.className = 'celda-texto';

    celda.innerHTML = `
        <div class="toolbar-celda" hidden>
            <button onclick="formato('bold')"><b>B</b></button>
            <button onclick="formato('italic')"><i>I</i></button>
            <select onchange="formatoFuente(this.value)">
                <option value="">Tamaño</option>
                <option value="3">Normal</option>
                <option value="4">Grande</option>
                <option value="5">Muy grande</option>
            </select>
            <input type="color" onchange="formatoColor(this.value)">
        </div>
        <div class="editor" contenteditable="true">
            Escribe aquí...
        </div>
    `;

    celda.addEventListener('click', e => {
        e.stopPropagation();
        activarCelda(celda);
    });
    habilitarDragCelda(celda);

    return celda;
}

/*function activarCelda(celda) {
    document.querySelectorAll('.celda-texto').forEach(c => {
        c.classList.remove('celdaActiva');
        c.querySelector('.toolbar-celda').hidden = true;
        c.querySelector('.editor').classList.add('visual');
        c.querySelector('.editor').setAttribute('contenteditable', 'false');
    });

    celda.classList.add('celdaActiva');
    celda.querySelector('.toolbar-celda').hidden = false;
    celda.querySelector('.editor').classList.remove('visual');
    celda.querySelector('.editor').setAttribute('contenteditable', 'true');
    celda.querySelector('.editor').focus();
}*/

/* Click fuera: desactivar celda */
/*document.addEventListener('click', () => {
    document.querySelectorAll('.celda-texto').forEach(c => {
        c.classList.remove('celdaActiva');
        c.querySelector('.toolbar-celda').hidden = true;
        c.querySelector('.editor').classList.add('visual');
        c.querySelector('.editor').setAttribute('contenteditable', 'false');
    });
});*/

/* Formatos */
function formato(cmd) {
    document.execCommand(cmd, false, null);
}

function formatoFuente(size) {
    document.execCommand('fontSize', false, size);
}

function formatoColor(color) {
    document.execCommand('foreColor', false, color);
}


document.getElementById('btnBorrarCelda').addEventListener('click', () => {
    const celdaActiva = document.querySelector('.celdaActiva');

    if (!celdaActiva) {
        alert('Selecciona una celda para borrar');
        return;
    }

    celdaActiva.classList.add('celda-saliendo');

    celdaActiva.addEventListener('animationend', () => {
        celdaActiva.remove();
    }, { once: true });
});



/*Drag and drop*/
let celdaArrastrada = null;
let indicadorDrop = document.createElement('div');
indicadorDrop.className = 'drop-indicator';

function habilitarDragCelda(celda) {
    if (!celda) return;

    celda.setAttribute('draggable', 'true');

    celda.addEventListener('dragstart', () => {
        celdaArrastrada = celda;
        celda.classList.add('celda-dragging');
    });

    celda.addEventListener('dragend', () => {
        celda.classList.remove('celda-dragging');
        if (indicadorDrop.parentNode) indicadorDrop.remove();
        celdaArrastrada = null;
    });

    celda.addEventListener('dragover', e => {
        e.preventDefault();
        if (!celdaArrastrada || celdaArrastrada === celda) return;

        const rect = celda.getBoundingClientRect();
        const mitad = rect.top + rect.height / 2;

        if (e.clientY < mitad) {
            celda.before(indicadorDrop);
        } else {
            celda.after(indicadorDrop);
        }
    });

    celda.addEventListener('drop', e => {
        e.preventDefault();
        if (!celdaArrastrada) return;

        // 🔥 AQUÍ está la magia
        indicadorDrop.replaceWith(celdaArrastrada);

        activarCelda(celdaArrastrada);
    });
}


