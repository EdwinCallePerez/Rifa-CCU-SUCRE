// Obtener los elementos necesarios del DOM
const uploadForm = document.getElementById('uploadForm');
const excelFileInput = document.getElementById('excelFile');
const globosPanel = document.getElementById('globosPanel');
const ganadorBtn = document.getElementById('ganadorBtn');
const obtenerOtroBtn = document.getElementById('obtenerOtroBtn');
const ganadoresLista = document.getElementById('ganadoresLista');
const ganadorDisplay = document.getElementById('ganadorDisplay');
const ganadorNombre = document.getElementById('ganadorNombre');
const aceptarGanadorBtn = document.getElementById('aceptarGanadorBtn');
const listaParticipantes = document.getElementById('listaParticipantes');  // Elemento para mostrar la lista de participantes

let participantes = [];
let ganadores = [];

// Manejar el evento de subida del formulario
uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const file = excelFileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Ignorar la primera fila (títulos)
            const datosParticipantes = rows.slice(1); // Cortamos la primera fila que contiene los títulos

            // Procesar los participantes, asignando número y nombre
            participantes = datosParticipantes.map(row => ({
                numero: row[0],   // Número en la columna 1
                nombre: row[1]    // Nombre en la columna 2
            })).filter(participante => participante.numero && participante.nombre);

            if (participantes.length === 0) {
                alert('El archivo no contiene datos válidos.');
                return;
            }

            generarGlobos(participantes);
            mostrarListaParticipantes(participantes);
            ganadorBtn.style.display = 'inline-block';
        } catch (error) {
            alert('Hubo un error procesando el archivo. Asegúrate de que sea un archivo Excel válido.');
        }
    };

    reader.onerror = () => {
        alert('No se pudo leer el archivo.');
    };

    reader.readAsArrayBuffer(file);
});

// Generar colores aleatorios para los globos
function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Generar los globos con los números de los participantes
function generarGlobos(lista) {
    globosPanel.innerHTML = '';  // Limpiar los globos existentes
    lista.forEach((participante, index) => {
        const globo = document.createElement('div');
        globo.classList.add('globo');
        globo.textContent = participante.numero;  // Usar solo el número para los globos
        globo.dataset.index = index;
        globo.style.backgroundColor = generarColorAleatorio();
        globosPanel.appendChild(globo);
    });
}

// Mostrar la lista de participantes en la página
function mostrarListaParticipantes(lista) {
    listaParticipantes.innerHTML = '';  // Limpiar la lista de participantes
    lista.forEach(participante => {
        const listItem = document.createElement('li');
        listItem.textContent = `Nro. Rifa: ${participante.numero} - : ${participante.nombre}`;
        listaParticipantes.appendChild(listItem);
    });
}

// Elegir un ganador al azar
function elegirGanador() {
    if (participantes.length === 0) {
        alert('No hay participantes disponibles.');
        return;
    }

    // Primero desactivamos todos los globos brillando
    const globos = document.querySelectorAll('.globo');
    globos.forEach(globo => globo.classList.remove('ganador'));

    let indiceGanador;
    let intervalo;
    
    // Función que hace que los globos brillen aleatoriamente
    const animarGlobos = () => {
        const globoIndex = Math.floor(Math.random() * globos.length);
        globos[globoIndex].classList.add('ganador');
    };

    // Iniciar la animación
    intervalo = setInterval(animarGlobos, 12);

    // Seleccionar el ganador después de un tiempo
    setTimeout(() => {
        // Detenemos la animación
        clearInterval(intervalo);

        // Escoger un ganador aleatorio y evitar duplicados
        do {
            indiceGanador = Math.floor(Math.random() * participantes.length);
        } while (ganadores.includes(indiceGanador));

        const ganador = participantes[indiceGanador];
        ganadores.push(indiceGanador);

        // Resaltar el globo ganador
        globos[indiceGanador].classList.add('ganador');

        // Mostrar al ganador en el cuadro
        ganadorNombre.textContent = `¡GANADOR Rifa Nro: ${ganador.numero} ,De: ${ganador.nombre}!`;
        ganadorDisplay.style.display = 'block';

        // Ocultar el botón de "Elegir Ganador" y mostrar el botón "Obtener Otro"
        if (ganadores.length < participantes.length) {
            obtenerOtroBtn.style.display = 'inline-block';
        } else {
            ganadorBtn.style.display = 'none';
            obtenerOtroBtn.style.display = 'none';
        }
    }, 7000); // Esperamos 3 segundos para elegir el ganador
}

// Función para aceptar al ganador
// Función para aceptar al ganador
// Función para aceptar al ganador
aceptarGanadorBtn.addEventListener('click', () => {
    // Obtener el nombre del ganador
    const ganador = ganadorNombre.textContent.replace('¡El ganador es: ', '').replace('!', '');
    
    // Crear un contenedor para el nombre del ganador y el campo de premio
    const listItem = document.createElement('li');
    
    // Crear un texto con el nombre del ganador
    const ganadorTexto = document.createElement('span');
    ganadorTexto.textContent = ganador;
    
    // Crear un campo de texto para escribir el premio
    const premioInput = document.createElement('input');
    premioInput.type = 'text';
    premioInput.placeholder = 'Premio ..';
    premioInput.classList.add('premio-input');  // Añadir clase para estilos
    
    // Agregar el nombre y el campo de texto al contenedor
    listItem.appendChild(ganadorTexto);
    listItem.appendChild(premioInput);
    
    // Añadir el contenedor con el nombre y el campo de texto a la lista de ganadores
    ganadoresLista.appendChild(listItem);

    // Ocultar el cuadro de ganador y permitir elegir otro
    ganadorDisplay.style.display = 'none';
});


// Asociar eventos a los botones
ganadorBtn.addEventListener('click', elegirGanador);
obtenerOtroBtn.addEventListener('click', elegirGanador);
