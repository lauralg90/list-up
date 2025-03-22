'use strict'

function crearBoton (contenidoBoton, ubicacion) {
    let boton = document.createElement("button");
    boton.textContent = contenidoBoton;
    ubicacion.appendChild(boton);
    return boton;
}

function añadirTarea () {
    // La tarea no puede añadirse vacía   
    if(inputTarea.value.trim() !== ""){
        let contenidoInputTarea = inputTarea.value.trim();

        // 1. CREAR ELEMENTOS

        // ITEM TAREA
        let tarea = document.createElement("li");
        tarea.classList.add("card");
        // bgColor aleatorio
        let coloresFondo = ["var(--card1)", "var(--card2)", "var(--card3)", "var(--card4)",];
        let colorAleatorio = coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
        /* array[Redondeo a número entero anterior (Número rándom 0 - 0.99 * 4)];
        Por ejemplo:
            array[Redondeo (0.8 * 4)]
            array[Redondeo 3.2] = 3
            array[3] es "var(--card4)" */
        tarea.style.backgroundColor = colorAleatorio;

        // NOMBRE TAREA
        let nombreTarea = document.createElement("span");
        nombreTarea.textContent = contenidoInputTarea;
        
        // TAREA IMPORTANTE (checkbox)
        if (importante.checked) {
            nombreTarea.classList.add("negrita");
        }

        // BOTONES
        let divBotones = document.createElement("div");
        divBotones.classList.add("botonesGestion");

        let botonEliminar = crearBoton("Eliminar", divBotones);
        botonEliminar.classList.add("botonGhost");
        let botonModificar = crearBoton("Modificar", divBotones);
        botonModificar.classList.add("botonGhost");
        let botonImportante = crearBoton("Importante", divBotones);
        botonImportante.classList.add("boton");


        // 2. UBICAR LOS ELEMENTOS CREADOS
        tarea.appendChild(nombreTarea);
        tarea.appendChild(divBotones);
        lista.insertAdjacentElement("afterbegin", tarea);


        // 3. DEVOLVER FORM A SU ESTADO ORIGINAL
        inputTarea.value = "";
        importante.checked = false;
        importante.disabled = true;  
    }
};

function contadorTareas () {

    // TAREAS TOTALES
    let tareas = lista.querySelectorAll("li");
    let arrayTareas = Array.from(tareas);
    let numeroTareas = arrayTareas.length;
    // console.log("Número tareas: " + numeroTareas);

    // TAREAS IMPORTANTES
    let tareasImportantes = [];
    for(let tarea of arrayTareas){
        let nombreTarea = tarea.querySelector("span");
        if(nombreTarea.classList.contains("negrita")){
            tareasImportantes.push(tarea);
        }
    }
    let numeroTareasImportantes = tareasImportantes.length;
    // console.log("Tareas importantes: " + numeroTareasImportantes);

    // MENSAJE
    let mensajeContador = document.createElement("p");
    mensajeContador.classList.add("anchura");

    if(numeroTareas === 1 && numeroTareasImportantes === 0){
        mensajeContador.textContent = `${numeroTareas} tarea pendiente`;
    }else if(numeroTareas === 1 && numeroTareasImportantes === 1){
        mensajeContador.textContent = `${numeroTareasImportantes} tarea importante`;
    }else if(numeroTareas > 1 && numeroTareasImportantes === 0){
        mensajeContador.textContent = `${numeroTareas} tareas pendientes`;
    }else if(numeroTareas > 1 && numeroTareasImportantes === 1){
        mensajeContador.innerHTML = `${numeroTareas} tareas pendientes<br>
        ${numeroTareasImportantes} tarea importante`;
    }else if(numeroTareas > 1 && numeroTareasImportantes > 1){
        mensajeContador.innerHTML = `${numeroTareas} tareas pendientes<br>
        ${numeroTareasImportantes} tareas importantes`;
    }else {
        mensajeContador.textContent = `No tienes tareas pendientes`;
    }
  
    // UBICAR MENSAJE   
    let seccionTareas = document.querySelector("section#tareas");
    let mensajeOriginal = seccionTareas.firstElementChild;
    seccionTareas.replaceChild(mensajeContador, mensajeOriginal);
}

// FUNCIONES PARA LA MODIFICACIÓN DE TAREAS
// Para evitar que se puedan añadir o buscar tareas mientras se está modificando una tarea, deshabilitar los elementos mientras el formulario de modificación está activo. Volver a habilitarlos tras guardar o cancelar la modificación. */

function deshabilitarElementos () {
    inputTarea.disabled = true;
    botonAñadir.disabled = true;
    buscador.disabled = true;

    let botonesGestion = lista.querySelectorAll("li div button");
    botonesGestion.forEach(boton => {
        boton.disabled = true;
    });
}

function habilitarElementos () {
    inputTarea.disabled = false;
    botonAñadir.disabled = false;
    buscador.disabled = false;

    let botonesGestion = lista.querySelectorAll("li div button");
    botonesGestion.forEach(boton => {
        boton.disabled = false;
    });
}


/* Selección de elementos  ------------------------------------------------------------------------------------------ */

let inputTarea = document.querySelector("input[name='tarea']");
let importante = document.querySelector("input#importante");
let botonAñadir = document.querySelector("button#añadir");
let buscador = document.querySelector("input[type='search']");
let lista = document.querySelector("ol#listaTareas");


/* AÑADIR TAREA  ===================================================================================================  */

// Habilitar checkbox si hay texto válido
inputTarea.addEventListener("input", () => {
    if(inputTarea.value.trim() !== "" && inputTarea.value.trim() !== "No puedes guardar una tarea vacía"){
        importante.disabled = false;
    }
});

botonAñadir.addEventListener("click", (e) => {
    e.preventDefault();
    /* El método .preventDefault() pertenece al objeto evento. Indica al navegador que no realice el comportamiento por defecto asociado al evento: en el caso del formulario, el comportamiento por defecto del button o submit es enviar y recargar la página. Sin .preventDefault() la página se recarga y desaparece el contenido dinámico añadido. */

    if(inputTarea.value.trim() !== "" && inputTarea.value.trim() !== "No puedes guardar una tarea vacía"){
        añadirTarea();
    }else{
        inputTarea.value = "No puedes guardar una tarea vacía";
    }

    // Permitir escribir otra tarea sin hacer focus manualmente (UX)
    inputTarea.focus();

    // Actualizar contador de tareas
    contadorTareas();   
});

inputTarea.addEventListener("keydown", (e) => {
/* Queremos que la acción agregar tarea ocurra cuando el usuario está interactuando con el inputTarea, por lo que el evento keydown debe aplicarse al elemento de interacción. No se aplica a window porque queremos que Enter haga su función sólo cuando se usa el inputTarea. */
    if(e.key === "Enter"){
        e.preventDefault();
        añadirTarea();
        inputTarea.focus();
        contadorTareas();
    }
});


/* GESTIÓN DE TAREAS  =============================================================================================  */

lista.addEventListener("click", (e) => {
    // console.log(e);

    // ELIMINAR  ==================================================================================================
    
    if(e.target.innerText === "Eliminar"){
        // Seleccionar li -> tarea = boton.div.li
        let tarea = e.target.parentElement.parentElement;
        lista.removeChild(tarea);

        // Actualizar contador de tareas:
        contadorTareas();
    }

    // MODIFICAR  =================================================================================================

    if(e.target.innerText === "Modificar"){

        // Deshabilitar elementos mientras se modifica una tarea
        deshabilitarElementos();

        // 1. SELECCIONAR ELEMENTOS
        // Seleccionar li
        let tarea = e.target.parentElement.parentElement;
        // Seleccionar nombre de la tarea (lo había ubicado en un span)
        let nombreTarea = tarea.querySelector("span");

        // 2. CREAR FORM DE MODIFICACIÓN      
        let formModificar = document.createElement("form");
        formModificar.classList.add("formModificar");
        formModificar.style.backgroundColor = tarea.style.backgroundColor;

        // Input
        let inputModificar = document.createElement("input");
        inputModificar.setAttribute("type", "text");
        inputModificar.value = nombreTarea.textContent;
        inputModificar.classList.add("input");
        
        // Botones
        let divBotones = document.createElement("div");
        divBotones.style.display = "flex";
        divBotones.style.columnGap = "20px";
  
        let botonGuardar = crearBoton("Guardar", divBotones);
        botonGuardar.classList.add("boton");
        let botonCancelar = crearBoton("Cancelar", divBotones);
        botonCancelar.classList.add("botonGhost");

        // Ubicar input y botones
        formModificar.appendChild(inputModificar);
        formModificar.appendChild(divBotones);  
        

        // 3. UBICAR FORM DE MODIFICACIÓN
        // Reemplazar tarea por form de manera temporal, mientras el usuario realiza la modificación
        tarea.style.display = "none";
        tarea.insertAdjacentElement("afterend", formModificar);
        inputModificar.focus();
        // Autofocus es una propiedad html, .focus() es un método del DOM
        // El comportamiento que queremos darle a un nuevo elemento se debe poner después de que el elemento exista en el DOM, es decir, después de ubicarlo

        // 4. EVENTO MODIFICACIÓN
        botonGuardar.addEventListener("click", (e) => {        
            e.preventDefault();
            let nuevoNombre = inputModificar.value;
            if(nuevoNombre.trim() !== "" && nuevoNombre.trim() !== "No puedes guardar una tarea vacía"){
                nombreTarea.textContent = nuevoNombre;
                formModificar.style.display = "none";
                tarea.style.display = "";

                habilitarElementos();

            }else{
                inputModificar.value = "No puedes guardar una tarea vacía";
            }
        });
        // Comportamiento por defecto del formulario hace que al presionar Enter se modifique la tarea porque el botón Guardar va después del input.

        botonCancelar.addEventListener("click", (e) => {
            e.preventDefault();
            formModificar.style.display = "none";
            tarea.style.display = "";
            habilitarElementos();
        });

        formModificar.addEventListener("keydown", (e) => {
            console.log(e);
            if(e.key === "Escape"){
                formModificar.style.display = "none";
                tarea.style.display = "";
                habilitarElementos();              
            }
        });
    }

    // IMPORTANTE  =================================================================================================

    if(e.target.innerText === "Importante"){
        let tarea = e.target.parentElement.parentElement;
        let nombreTarea = tarea.querySelector("span");
        nombreTarea.classList.toggle("negrita");

        contadorTareas();
    }
});


/* BUSCADOR DE TAREAS  ============================================================================================  */

// El mensaje para el usuario en caso de no hallar coincidencias de búsqueda debe crearse fuera del evento, si no, se crea un nuevo mensaje cada vez que el usuario introduce un caracter en el buscador, apareciendo repetido en pantalla.
let mensajeSinResultados = document.createElement("span");
mensajeSinResultados.textContent = "La tarea que buscas no está en tu lista.";
mensajeSinResultados.classList.add("anchura");
lista.insertAdjacentElement("beforebegin", mensajeSinResultados);
mensajeSinResultados.style.display = "none";

buscador.addEventListener("input", (e) => {
    // console.log(e);

    // Seleccionar los valores a comparar
    let textoBuscador = e.target.value.trim().toLowerCase();
    let tareas = lista.querySelectorAll("li");

    // Condición para mostar el mensaje "Sin resultados"
    let tareaEncontrada = false;

    // Recorrer la lista buscando coincidencias
    tareas.forEach(tarea => {
        let nombreTarea = tarea.querySelector("span");
        if(nombreTarea.textContent.toLowerCase().includes(textoBuscador)){
            tarea.style.display = "";
            tareaEncontrada = true;
        }else{
            tarea.style.display = "none";
        }
    });

    if(tareaEncontrada === false){
        mensajeSinResultados.style.display = "";    
    }else{
        mensajeSinResultados.style.display = "none";
    } 
});





