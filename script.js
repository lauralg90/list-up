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

        // 1. CREAR LOS ELEMENTOS: tarea y botones (ubicar en div separados para poder manejarlos mejor)

        // ITEM TAREA
        let tarea = document.createElement("li");
        // Estilo css
        tarea.classList.add("card");

        // Contenedor para el nombre de la tarea
        let nombreTarea = document.createElement("span");
        nombreTarea.textContent = contenidoInputTarea;
        
        // Si se marca la tarea como importante aparecerá en negrita
        // Para comprobar si un checkbox está marcado se usa la propiedad .checked (devuelve true si está marcado)
        if (importante.checked) {
            nombreTarea.classList.add("negrita");
        }

        // Contenedor para los botones
        let divBotones = document.createElement("div");
        divBotones.classList.add("gestion");

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
        // La última tarea se inserta la primera en la lista para verla sin hacer scroll


        // 3. DEVOLVER FORM A SU ESTADO ORIGINAL
        inputTarea.value = "";
        importante.checked = false;
        importante.disabled = true;
    }   
};



/* Selección de elementos recurrentes  ------------------------------------------------------------------------------ */

let inputTarea = document.querySelector("input[name='tarea']");
let importante = document.querySelector("input#importante");
let botonAñadir = document.querySelector("button#añadir");
let buscador = document.querySelector("input[type='search']");
let lista = document.querySelector("ol#listaTareas");


/* AÑADIR TAREA  ===================================================================================================  */

// El checkbox se habilita sólo si se ha escrito contenido en el input:
inputTarea.addEventListener("input", () => { 
    importante.disabled = true;
    botonAñadir.disabled = true;
    if(inputTarea.value.trim() !== ""){
        importante.disabled = false;
        botonAñadir.disabled = false;
    }
});

// La tarea se añade al clicar el botón "Añadir" o presionar "Enter":

botonAñadir.addEventListener("click", (e) => {
    e.preventDefault();
    /* El método .preventDefault() pertenece al objeto evento. Al aplicar el método indicamos al navegador que no realice el comportamiento por defecto asociado al evento: en el caso de un formulario, el evento al clicar el button o input[submit] es enviar y recargar la página. Sin .preventDefault() la página se recarga al clicar el botón y desaparece el contenido dinámico añadido. */   
    añadirTarea();
    inputTarea.focus();
    /* Una vez añadida la tarea el foco sigue en el inputTarea, permitiendo escribir y añadir otra tarea sin necesidad de hacer focus manualmente, mejorando la experiencia de usuario. */
});

inputTarea.addEventListener("keydown", (e) => {
/* Queremos que la acción de agregar una tarea ocurra cuando el usuario está interactuando con el inputTarea, por lo que el evento keydown debe aplicarse al elemento de interacción. No se aplica a window porque queremos que Enter haga su función sólo cuando se usa el inputTarea. */
    if(e.key === "Enter"){
        e.preventDefault();
        /* Sin e.preventDefault(); la tarea se añade dos veces. ¿Por qué? Por un lado, al presionar Enter se ejecuta la función añadirTarea(), por otro lado el formulario está siguiendo su comportamiento por defecto (añadir tarea y recargar la página).  */
        añadirTarea();
        inputTarea.focus();
    }
});


/* CONTADOR DE TAREAS  ============================================================================================  */

// "Tienes 12 tareas pendientes" Ubicar al lado del título "Mi lista de tareas"
// Debe actualizarse al añadir y eliminar tareas


/* GESTIÓN DE TAREAS  =============================================================================================  */

lista.addEventListener("click", (e) => {
    console.log(e);

    // ELIMINAR  ==================================================================================================
    
    if(e.target.innerText === "Eliminar"){
        // Seleccionar el li -> tarea = boton.div.li
        let tarea = e.target.parentElement.parentElement;
        lista.removeChild(tarea);
    }

    // MODIFICAR  =================================================================================================

    if(e.target.innerText === "Modificar"){

        // Deshabilitar elementos de añadir y buscar tareas
        inputTarea.disabled = true;
        botonAñadir.disabled = true;
        buscador.disabled = true;

        // 1. SELECCIONAR ELEMENTOS
        // Seleccionar el li
        let tarea = e.target.parentElement.parentElement;
        // Seleccionar el nombre de la tarea (lo había ubicado en un span)
        let nombreTarea = tarea.querySelector("span");

        // 2. CREAR FORM DE MODIFICACIÓN      
        let formModificar = document.createElement("form");
        // Estilo css
        formModificar.classList.add(".anchura");
        formModificar.style.display = "flex";
        formModificar.style.flexDirection = "column";
        formModificar.style.rowGap = "16px";

        // Input
        let inputModificar = document.createElement("input");
        inputModificar.setAttribute("type", "text");
        inputModificar.setAttribute("placeholder", nombreTarea.textContent);
        // Estilo css
        inputModificar.classList.add("input");
        

        // Botones
        let botonGuardar = document.createElement("button");
        botonGuardar.textContent = "Guardar";
        botonGuardar.classList.add("boton");
        let botonCancelar = document.createElement("button");
        botonCancelar.textContent = "Cancelar";
        botonCancelar.classList.add("botonGhost");

        // Contenedor para los botones
        let divBotones = document.createElement("div");
        // Estilo css
        divBotones.style.display = "flex";
        divBotones.style.columnGap = "20px";

        // Ubicar input y botones
        divBotones.appendChild(botonGuardar);
        divBotones.appendChild(botonCancelar);
        formModificar.appendChild(inputModificar);
        formModificar.appendChild(divBotones);  
        

        // 3. UBICAR FORM DE MODIFICACIÓN
        // Reemplazar tarea por form de manera temporal, mientras el usuario realiza la modificación
        tarea.style.display = "none";
        tarea.insertAdjacentElement("afterend", formModificar);
        inputModificar.focus();
        // Autofocus es una propiedad html, .focus() es un método del DOM
        // El comportamiento que queremos darle a un nuevo elemento se debe poner después de que el elemento exista en el DOM, es decir, antes de ubicarlo

        // 4. EVENTO MODIFICACIÓN
        /* Para evitar que el usuario pueda añadir tareas o buscar mientras está modificando una tarea, deshabilitar los elementos (input, botón "Añadir" y buscador) mientras el formulario de modificación está activo. Volver a habilitarlos cuando desaparezca el formulario de modificación (tras guardar o cancelar modificación). */
        botonGuardar.addEventListener("click", (e) => {        
            e.preventDefault();
            let nuevoNombre = inputModificar.value;
            if(nuevoNombre.trim() !== ""){
                nombreTarea.textContent = nuevoNombre;
                formModificar.style.display = "none";
                tarea.style.display = "";

                // Habilitar elementos de añadir y buscar tareas
                inputTarea.disabled = false;
                botonAñadir.disabled = false;
                buscador.disabled = false;
            }
        });
        // Comportamiento por defecto del formulario hace que al presionar Enter se modifique la tarea porque el botón Guardar va después del input.

        // Cancelar modificación
        botonCancelar.addEventListener("click", (e) => {
            e.preventDefault();
            formModificar.style.display = "none";
            tarea.style.display = "";

            // Habilitar elementos de añadir y buscar tareas
            inputTarea.disabled = false;
            botonAñadir.disabled = false;
            buscador.disabled = false;
            
        });
        formModificar.addEventListener("keydown", (e) => {
            console.log(e);
            if(e.key === "Escape"){
                formModificar.style.display = "none";
                tarea.style.display = "";

                // Habilitar elementos de añadir y buscar tareas
                inputTarea.disabled = false;
                botonAñadir.disabled = false;
                buscador.disabled = false;                
            }
        });
    }

    // IMPORTANTE  =================================================================================================

    if(e.target.innerText === "Importante"){
        let tarea = e.target.parentElement.parentElement;
        let nombreTarea = tarea.querySelector("span");
        nombreTarea.classList.toggle("negrita");
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

    // Seleccionar los valores a comparar (texto introducido en el buscador y tareas de la lista):
    let textoBuscador = e.target.value.trim().toLowerCase();
    let tareas = lista.querySelectorAll("li");

    // Condición para mostar o no el mensaje "Sin resultados":
    let tareaEncontrada = false;

    // Recorrer la lista buscando coincidencias:
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



