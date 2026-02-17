document.getElementById('btnAgregarCodigo').addEventListener('click', () => {
    agregarCeldaCodigo();
});

let celdaCodigoOrion = null;

/* === AGREGAR CELDA DE CÓDIGO === */
function agregarCeldaCodigo() {
    const celda = document.createElement('div');
    celda.className = 'celda-codigo';

    celda.innerHTML = `
        <div class="header-codigo">
            <span>Python</span>
            
            <button type="button" class="btn-importar-codigo" title="Cargar archivo Python" data-importar-codigo>
              <img src="imagenes/uploadFile.svg" alt="Importar código">
            </button>
            <input type="file" class="input-importar-codigo" accept=".py" hidden>
            

            <button class="btn-play-codigo ejecutarCelda">
                <img src="imagenes/play.svg" alt="PLAY">
            </button>

            <button class="btn-play-codigo btn-comentarios">
                <img src="imagenes/comentario.svg" alt="PLAY">
            </button>

            <button class="btn-orion">
                <img src="imagenes/bot.svg" alt="ORION">
            </button>

        </div>
        <textarea class="editor-codigo">print("Hola mundo")</textarea>
        <div class="explicacion-codigo"></div>
        <div class="resultado-codigo"></div>
    `;

    celda.addEventListener('click', e => {
        //e.stopPropagation();
        activarCelda(celda);
    });

    celda.querySelector('.btn-orion').addEventListener('click', e => {
        e.stopPropagation();
        abrirOrion(celda);
    });

    const activa = document.querySelector('.celdaActiva');
    if (activa) activa.after(celda);
    else document.querySelector('.contenido-principal').appendChild(celda);

    const idCelda = generarIdCelda();
    celda.dataset.idCelda = idCelda;


    activarCelda(celda);

    const editor = celda.querySelector('.editor-codigo');

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

/* === ACTIVAR CELDA === */
function activarCelda(celda) {
    document.querySelectorAll('.celdaActiva').forEach(c => c.classList.remove('celdaActiva'));
    celda.classList.add('celdaActiva');
}

/* === ORION CHAT === */
function abrirOrion(celda) {
    cerrarOrion();
    celdaCodigoOrion = celda;

    const chat = document.createElement('div');
    chat.className = 'orion-chat';
    chat.innerHTML = `
        <div class="orion-header">
            <strong>ORION</strong>
            <button type="button" class="orion-cerrar" title="Cerrar">✕</button>
        </div>

        <textarea placeholder="Describe el código Python que quiere generar..."></textarea>
        <button type="button" class="btn-generar">Enviar</button>
    `;

    // Cerrar (NO genera código)
    chat.querySelector('.orion-cerrar').addEventListener('click', (e) => {
        e.stopPropagation();
        cerrarOrion();
    });

    chat.querySelector('.btn-generar').addEventListener('click', (e) => {
        e.stopPropagation();
        generarCodigoIA(chat.querySelector('textarea').value);
        cerrarOrion();
    });

    document.body.appendChild(chat);
}

function cerrarOrion() {
    document.querySelector('.orion-chat')?.remove();
}

/* === MOCK IA === */
function generarCodigoIA(prompt) {
    if (!celdaCodigoOrion) return;

    const editor = celdaCodigoOrion.querySelector('.editor-codigo');
    const codigo = editor.value;
    const promptNormalizado = prompt.toLowerCase();

    if (promptNormalizado.includes('explica') || promptNormalizado.includes('explicame')) {
        const explicacion = analizarCodigo(codigo);
        mostrarExplicacionCodigo(explicacion);
        const explicacionCelda = celdaCodigoOrion.querySelector('.explicacion-codigo');
        scrollAResultado(explicacionCelda);
        return;
    }

    // Comportamiento normal
    editor.value =
`# Código generado por ORION
total = 0
for i in range(1, 6):
    total += i

print("La suma es:", total)
`;

    autoResizeTextarea(editor);
}



/* === EJECUTAR CELDA === */
//document.getElementById('ejecutarCelda').addEventListener('click', () => {
$(document).on('click', '.ejecutarCelda', function () {
    //const celda = document.querySelector('.celdaActiva');
     const celda = this.closest('.celda-codigo');
    const salida = celda.querySelector('.resultado-codigo');

    if (!celda || !celda.classList.contains('celda-codigo')) {
        mostrarToast("Selecciona una celda de código para ejecutar","warning");
        return;
    }

    //const editor = celda.querySelector('.editor-codigo');
    //const resultado = celda.querySelector('.resultado-codigo');

    //resultado.style.display = 'block';
    //resultado.innerHTML = simularEjecucion(editor.value);
    ejecutarCelda(celda);
    scrollAResultado(salida);
});

/* === SIMULACIÓN DE RESULTADO === */
function simularEjecucion(codigo) {

    if (codigo.startsWith('# Código generado por ORION')) {

        return 'La suma es: 15';
    }

    if (codigo.startsWith('# EJEMPLO LAB1') || codigo.startsWith('# LAB2') || codigo.startsWith('#LAB BD')) {
        return simularEjecucionCodigo(codigo);
    }

    if (codigo.startsWith('from repositorioBanxico import consultarFuente')) {
        return 'Se consulto la fuente institucional correctamente...';
    }

    if (codigo.startsWith('from repositorioLocalBanxico import leerArchivo')) {
        return 'Se consulto el archivo correctamente...';
    }

    return 'Hola mundo';
}


function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}






document.addEventListener('change', function (e) {
  if (!e.target.classList.contains('input-importar-codigo')) return;

  const input = e.target;
  const file = input.files[0];

  if (!file) return;

  console.log('Archivo seleccionado:', file.name);

  const celda = input.closest('.celda-codigo');
  const editor = celda.querySelector('.editor-codigo');

  const reader = new FileReader();
  reader.onload = function (ev) {
    editor.value = ev.target.result;
    console.log('Código cargado en la celda');
    autoResizeTextarea(editor);
  };

  reader.readAsText(file);
});


function scrollAResultado(resultado) {
    resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });

    resultado.classList.add('resaltado');
    setTimeout(() => {
        resultado.classList.remove('resaltado');
    }, 1200);
}



function simularEjecucionCodigo(codigo) {
    const codigoLimpio = codigo.trim();

    if (codigoLimpio.startsWith('# EJEMPLO LAB1')) {
        return `
Se muestra el 10% del conjunto de datos:
     Edad  Ingresos  Compras_Mensuales     Genero  Cliente_Fiel
0     56  31270.12                  1   Femenino             1
1     69  17505.56                  5   Femenino             0
2     46  49451.16                  2  Masculino             1
3     32  28466.64                  4  Masculino             0
4     60  20930.13                  3   Femenino             0
5     25  21826.46                  3  Masculino             0
6     38  25168.77                  2   Femenino             0
7     56  24301.72                  5  Masculino             1
8     36   9084.00                  2  Masculino             1
9     40  42637.41                  3  Masculino             0
10    28  29845.17                  4  Masculino             1
11    28  29726.24                  8   Femenino             0
12    41  38178.74                  3  Masculino             0
13    53  19453.96                  4  Masculino             0
14    57  22416.73                  5   Femenino             0
15    41  34574.16                  3  Masculino             0
16    20  29356.22                  3  Masculino             1
17    39  33449.02                  5   Femenino             0
18    19  29199.13                  1  Masculino             0
19    41  27586.20                  5   Femenino             0

Resumen estadístico general:
             Edad      Ingresos  Compras_Mensuales  Cliente_Fiel
count  200.00000    200.000000          200.00000    200.000000
mean    43.42500  29994.080650            3.07500      0.235000
std     14.94191  10574.357147            1.95409      0.425063
min     18.00000   1205.430000            0.00000      0.000000
25%     31.00000  22934.217500            2.00000      0.000000
50%     43.50000  29918.500000            3.00000      0.000000
75%     56.00000  37205.542500            4.00000      0.000000
max     69.00000  61870.330000           10.00000      1.000000

Conteo por clase en Cliente_Fiel:
 Cliente_Fiel
0    153
1     47
Name: count, dtype: int64

<img src="imagenes/e11.png" class="img-salida">

Cantidad de outliers en Ingresos: 2

Valores nulos por columna:
 Edad                 0
Ingresos             0
Compras_Mensuales    0
Genero               0
Cliente_Fiel         0
dtype: int64

Registros duplicados:  0

Se muestra el 10% del conjunto de datos limpio y transformado:
         Edad  Ingresos  Compras_Mensuales  Genero  Cliente_Fiel
0   0.837618  0.127229          -1.065799       0             1
1   1.710505 -1.228613           0.983019       0             0
2   0.166167  1.918104          -0.553595       1             1
3  -0.773864 -0.148920           0.470814       1             0
4   1.106199 -0.891285          -0.041390       0             0
5  -1.243880 -0.802994          -0.041390       1             0
6  -0.370994 -0.473768          -0.553595       0             0
7   0.837618 -0.559175           0.983019       1             1
8  -0.505284 -2.058156          -0.553595       1             1
9  -0.236703  1.246934          -0.041390       1             0
10 -1.042445 -0.013132           0.470814       1             1
11 -1.042445 -0.024847           2.519632       0             0
12 -0.169558  0.807744          -0.041390       1             0
13  0.636183 -1.036691           0.470814       1             0
14  0.904763 -0.744851           0.983019       0             0
15 -0.169558  0.452685          -0.041390       1             0
16 -1.579606 -0.061295          -0.041390       1             1
17 -0.303849  0.341856           0.983019       0             0
18 -1.646751 -0.076768          -1.065799       1             0
19 -0.169558 -0.235646           0.983019       0             0

Se muestra el 10% del conjunto de datos limpio y transformado y reducido a 2 dimensiones:
     Componente_Principal_1  Componente_Principal_2  Cliente_Fiel
0                 0.181720               -1.259801             1
1                 0.710501                0.723263             0
2                 1.117968               -1.092091             1
3                -0.399745                0.704488             0
4                 0.118191               -0.122123             0
5                -1.335289                0.563045             0
6                -0.772462               -0.259594             0
7                 0.581914                0.799358             1
8                -1.882304                0.224938             1
9                 0.636345               -0.315617             0
10               -0.484655                0.747571             1
11                0.351393                2.617674             0
12                0.395783               -0.212834             0
13               -0.066942                0.527309             0
14                0.505124                0.831104             0
15                0.166411               -0.113342             0
16               -1.071934                0.456626             1
17                0.430308                0.891690             0
18               -1.546896               -0.452165             0
19                0.143552                1.012947             0

<img src="imagenes/e12.png" class="img-salida">

Distribución original:
Cliente_Fiel
0    103
1     35
Name: count, dtype: int64

Distribución balanceada con SMOTE:
Cliente_Fiel
0    103
1    103
Name: count, dtype: int64

Matriz de Confusión:
[[36 13]
 [ 8  3]]

Reporte de Clasificación:
              precision    recall  f1-score   support

           0       0.82      0.73      0.77        49
           1       0.19      0.27      0.22        11

    accuracy                           0.65        60
   macro avg       0.50      0.50      0.50        60
weighted avg       0.70      0.65      0.67        60


        `.trim();
    }

    if (codigoLimpio.startsWith('# LAB2')) {
        return `
Media: 6.963
Mediana: 7.0
Moda: 7
Rango: 10
Varianza: 5.926
Desviación estándar: 2.434
Coeficiente de variación: 34.960

Valores:
0      2
1      3
2      4
3      5
4      6
5      7
6      8
7      9
8     10
9     11
10    12
Name: Suma, dtype: int64

Frecuencias Simuladas:
0      29
1      60
2      85
3     116
4     135
5     160
6     130
7     120
8      84
9      57
10     24
Name: Frecuencia Simulada, dtype: int64

Frecuencias Teóricas:
0      27.777778
1      55.555556
2      83.333333
3     111.111111
4     138.888889
5     166.666667
6     138.888889
7     111.111111
8      83.333333
9      55.555556
10     27.777778
Name: Frecuencia Teórica, dtype: float64

<img src="imagenes/e21.png" class="img-salida">
<img src="imagenes/e22.png" class="img-salida">

        `.trim();
    }   

if (codigoLimpio.startsWith('#LAB BD')) {
return `
Se consultó la fuente institucional correctamente...

╒════════════╤══════╤═══════╤══════╤══════╕
│ fecha      │   c1 │    c2 │   c3 │   c4 │
╞════════════╪══════╪═══════╪══════╪══════╡
│ 2004-01-02 │ 6.05 │ 18.44 │ 4.22 │ 6.11 │
├────────────┼──────┼───────┼──────┼──────┤
│ 2004-01-05 │ 5.78 │  6.85 │ 4.18 │ 5.83 │
├────────────┼──────┼───────┼──────┼──────┤
│ 2004-01-06 │ 5.6  │  7.65 │ 4.18 │ 5.64 │
╘════════════╧══════╧═══════╧══════╧══════╛

<img src="imagenes/e31.png" class="img-salida">

`.trim();
}

}



$('#ejecutarTodoCeldas').on('click', function () {

    const celdas = document.querySelectorAll('.celda-codigo');

    if (celdas.length === 0) {
        mostrarToast("No hay celdas de código para ejecutar", "warning");
        return;
    }

    celdas.forEach((celda, index) => {
        ejecutarCelda(celda);

        // Opcional: marcar visualmente la celda ejecutada
        $('.celda-codigo').removeClass('celdaActiva');
        celda.classList.add('celdaActiva');
    });

    // Scroll al último resultado
    const ultimaCelda = celdas[celdas.length - 1];
    scrollAResultado(ultimaCelda.querySelector('.resultado-codigo'));
});


function ejecutarCelda(celda) {
    if (!celda || !celda.classList.contains('celda-codigo')) return;

    const editor = celda.querySelector('.editor-codigo');
    const resultado = celda.querySelector('.resultado-codigo');

    resultado.style.display = 'block';
    resultado.innerHTML = simularEjecucion(editor.value);
}


function mostrarExplicacionCodigo(texto) {
    const resultado = celdaCodigoOrion.querySelector('.explicacion-codigo');
    resultado.style.display = 'block';
    resultado.innerHTML = `<pre>${texto}</pre>`;
}


function analizarCodigo(codigo) {
    const codigoLimpio = codigo.trim();

    // 🔹 Python - print
    if (codigoLimpio.startsWith('# EJEMPLO LAB1')) {
        return `
Claro, este código Python realiza un proceso completo de análisis de datos y modelado para predecir clientes fieles utilizando un clasificador Random Forest. Aquí te detallo cada uno de sus pasos:
Paso 1: Generación de Datos Ficticios Se crea un conjunto de datos simulado de 200 clientes con variables como edad, ingresos, compras mensuales, género y una etiqueta binaria para identificar si son clientes fieles (1) o no (0).
Paso 2: Análisis Exploratorio de Datos (EDA) Esta sección se enfoca en entender las características del conjunto de datos. Imprime las primeras filas del DataFrame, un resumen estadístico de las columnas numéricas y el conteo de clientes fieles y no fieles. También genera gráficos 'pairplot' para visualizar las distribuciones y relaciones entre las variables, diferenciando por la etiqueta 'Cliente_Fiel'.
Paso 3: Identificación de Problemas de Calidad de Datos Aquí se buscan problemas comunes en los datos:
•   Outliers en 'Ingresos': Se define una función para detectar valores atípicos utilizando el método del rango intercuartílico (IQR).
•   Valores Nulos y Duplicados: Se verifica la presencia de datos faltantes y registros duplicados en el DataFrame.
Paso 4: Limpieza y Transformación de Datos Este paso prepara los datos para el modelado:
•   Codificación de Género: La variable categórica 'Genero' ('Masculino', 'Femenino') se convierte a valores numéricos (1, 0) usando LabelEncoder.
•   Eliminación de Outliers: Los registros identificados como outliers en la columna 'Ingresos' se eliminan del conjunto de datos.
•   Escalado de Variables Numéricas: Las columnas 'Edad', 'Ingresos' y 'Compras_Mensuales' se escalan utilizando StandardScaler para que tengan una media de 0 y una desviación estándar de 1. Esto es importante para muchos algoritmos de aprendizaje automático.
Paso 5: Reducción de Dimensionalidad con PCA Se aplica el Análisis de Componentes Principales (PCA) para reducir la dimensionalidad de las características escaladas a dos componentes principales. Esto facilita la visualización de los datos en un espacio 2D y permite identificar patrones. Luego, estos componentes se visualizan en un gráfico de dispersión coloreado por 'Cliente_Fiel'.
Paso 6: División de Datos y Balanceo de Clases
•   División Entrenamiento/Prueba: El conjunto de datos limpio se divide en conjuntos de entrenamiento (70%) y prueba (30%). El conjunto de entrenamiento se usa para que el modelo aprenda, y el de prueba para evaluar su rendimiento en datos no vistos.
•   Balanceo de Clases con SMOTE: Dado que la clase 'Cliente_Fiel' probablemente esté desbalanceada (más clientes no fieles que fieles), se aplica SMOTE (Synthetic Minority Over-sampling Technique) al conjunto de entrenamiento. SMOTE genera muestras sintéticas de la clase minoritaria para equilibrar las clases, lo que ayuda a prevenir que el modelo tenga un sesgo hacia la clase mayoritaria.
Paso 7: Entrenamiento y Evaluación del Modelo Random Forest
•   Entrenamiento del Modelo: Se entrena un clasificador RandomForestClassifier con 100 árboles de decisión utilizando el conjunto de entrenamiento balanceado. Random Forest es un algoritmo de ensemble que construye múltiples árboles de decisión y combina sus predicciones para obtener un resultado más robusto.
•   Predicción: El modelo entrenado se utiliza para hacer predicciones sobre el conjunto de prueba.
•   Evaluación: Se evalúa el rendimiento del modelo mostrando:
o   La Matriz de Confusión: Muestra el número de aciertos y errores para cada clase.
o   El Reporte de Clasificación: Proporciona métricas como precisión, recall y f1-score para cada clase, así como la exactitud general (accuracy) y el promedio ponderado de las métricas.

        `;
    }

    // 🔹 Python - for
    if (codigoLimpio.startsWith('# LAB2')) {
        return `
Este código Python simula el lanzamiento de dos dados un número determinado de veces (1000 en este caso). 
Calcula las frecuencias simuladas de las sumas obtenidas y las compara con las frecuencias teóricas esperadas. 
Además, calcula varias medidas de tendencia central y dispersión, como la media, mediana, moda, rango, varianza, 
desviación estándar y coeficiente de variación. Finalmente, visualiza estas comparaciones y medidas estadísticas 
utilizando gráficos de barras, líneas y un diagrama de caja, incluyendo una curva de distribución normal escalada 
para referencia.

        `;
    }


    if (!codigoLimpio) {
        return 'La celda está vacía. Escribe código para poder explicarlo.';
    }

    // 🔹 Default
    return `
No puedo explicar el código en este momento, intenta más tarde...
    `;
}
