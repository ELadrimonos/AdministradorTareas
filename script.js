var tareas = [];
var contTareas = 0;
var modificando = false;

const crearTarea = () => {

    let formulario = document.getElementById('formulario');
    // if (!formulario.checkValidity()) {
    if (false){
        alert('Por favor, rellena todos los campos requeridos.');
    } else {
        const nombre = document.getElementById("nombre").value;
        const tiempo = document.getElementById("tiempo").value;
        const fechaMax = document.getElementById("fechaMax").value;
        const fechaAlta = document.getElementById("fechaAlta").value;
        const estado = document.getElementById("estado").value;
        const descripcion = document.getElementById("descripcion").value;
        let id = contTareas++;

        let tiempoFormateado;
        try{
            tiempoFormateado = obtenerTiempo(tiempo);
        } catch (e){
            console.warn(e);
            return;
        }
        tareas.push(new Tarea(id,nombre, tiempoFormateado, fechaMax, fechaAlta, estado, descripcion));
        tareas = tareas.filter(tarea => tarea !== null);
        console.log(id);
        document.getElementById("formulario").reset();
        mostrarTareas();
    }
    return false;
}

const ordenar = (columna,elemento) =>{
    let orden = elemento.className;
    let descendente;

    if (orden === "descendente"){
        descendente = true;
        elemento.className = "ascendente";
    } else{
        descendente = false;
        elemento.className = "descendente";
    }
        console.log(tareas)
    try {


        for (let i = 1; i < tareas.length; i++) {
            for (let j = 0; j < tareas.length - i; j++) {
                switch (columna) {
                    case 2:
                        // Si hubiera guardado los minutos en el array y no el string formateado hubiera sido mucho más fácil,
                        // menos costoso y más limpio

                        // Si el índice no se encuentra devuelve -1
                        let indiceH1 = tareas[j].tiempo.indexOf("h");
                        let indiceH2 = tareas[j + 1].tiempo.indexOf("h");
                        // Si no hay un indicador de horas (solo hay minutos), asignamos las horas a 0
                        let horas1 = parseInt((indiceH1 === -1 ? 0 : tareas[j].tiempo.substring(0, indiceH1)));
                        let horas2 = parseInt((indiceH2 === -1 ? 0 : tareas[j + 1].tiempo.substring(0, indiceH2)));

                        let indiceM1 = tareas[j].tiempo.indexOf("m");
                        let indiceM2 = tareas[j + 1].tiempo.indexOf("m");
                        // Si no hay un índice de la h se sabe que los minutos empiezan por la posición 0
                        let posicionM1 = (indiceH1 === -1 ? 0 : indiceH1 + 2);
                        let posicionM2 = (indiceH2 === -1 ? 0 : indiceH2 + 2);

                        let min1 = parseInt((indiceM1 === -1 ? 0 : tareas[j].tiempo.substring(posicionM1, indiceM1)));
                        let min2 = parseInt((indiceM2 === -1 ? 0 : tareas[j + 1].tiempo.substring(posicionM2, indiceM2)));

                        if (descendente) {
                            if (horas1 < horas2) {
                                [tareas[j], tareas[j + 1]] = [tareas[j + 1], tareas[j]];
                            } else if (horas1 === horas2) {
                                if (min1 < min2) {
                                    [tareas[j], tareas[j + 1]] = [tareas[j + 1], tareas[j]];
                                }
                            }

                        } else {
                            if (horas1 > horas2) {
                                [tareas[j], tareas[j + 1]] = [tareas[j + 1], tareas[j]];
                            } else if (horas1 === horas2) {
                                if (min1 > min2) {
                                    [tareas[j], tareas[j + 1]] = [tareas[j + 1], tareas[j]];
                                }
                            }

                        }
                        break;

                    case 3:
                        let fecha1 = new Date(tareas[j].fechaMax);
                        let fecha2 = new Date(tareas[j + 1].fechaMax);
                        if (descendente) {
                            if (fecha1.getTime() < fecha2.getTime()) {
                                [tareas[j], tareas[j + 1]] = [tareas[j + 1], tareas[j]];
                            }

                        } else {
                            if (fecha1.getTime() > fecha2.getTime()) {
                                [tareas[j], tareas[j + 1]] = [tareas[j + 1], tareas[j]];
                            }

                        }
                        break;
                    default:
                        console.error("No esta progamado para ordenar con esta columna")
                }
            }

        }
    } catch (e){
        console.warn("Hay una entrada vacia")
    }
    mostrarTareas();
}


const mostrarTareas = () =>{
    const tabla = document.getElementById("tablaTareas");
    // Cada vez que mostremos los datos vaciamos el tbody de la tabla
    tabla.innerHTML = "";

    for (const id in tareas) {
        const tarea = tareas[id];
        const fila = document.createElement("tr");
        fila.id = "tarea"+id;
        const celdaNombre = document.createElement("td");
        celdaNombre.innerText = tarea.nombre;
        fila.appendChild(celdaNombre);
        const celdaTiempo = document.createElement("td");
        celdaTiempo.innerText = tarea.tiempo;
        fila.appendChild(celdaTiempo);

        const celdaFM = document.createElement("td");
        let FechaMaxima = new Date(tarea.fechaMax);
        celdaFM.innerText = formatearFecha(FechaMaxima);
        fila.appendChild(celdaFM)

        let hoy = new Date();
        let diasRestantes = new Date();
        diasRestantes.setDate(hoy.getDate() + 10);

        if (FechaMaxima.getTime() < hoy.getTime()) {
            // Si el plazo ya ha pasado cambio el fondo a un negro
            fila.className = "expirado";
            // fila.style.backgroundColor = "rgb(105,105,105)";
            // fila.style.color = "white";
        } else if (FechaMaxima.getTime() <= diasRestantes.getTime()) {
            // Si quedan 10 días para el plazo lo pongo en rojo
            fila.style.backgroundColor = "rgb(231,222,86)";
        }

        const celdaFA = document.createElement("td");
        let FechaAlta = new Date(tarea.fechaAlta);
        celdaFA.innerText = formatearFecha(FechaAlta);
        fila.appendChild(celdaFA)

        const celdaEstado = document.createElement("td");
        const seleccionEstado = document.createElement("select");
        seleccionEstado.id = "estado" + tarea.id;

        const opcion1 = document.createElement("option");
        opcion1.value = "PENDIENTE";
        opcion1.innerText = "PENDIENTE";
        const opcion2 = document.createElement("option");
        opcion2.value = "EN PROCESO";
        opcion2.innerText = "EN PROCESO";
        const opcion3 = document.createElement("option");
        opcion3.value = "REALIZADA";
        opcion3.innerText = "REALIZADA";

        seleccionEstado.appendChild(opcion1);
        seleccionEstado.appendChild(opcion2);
        seleccionEstado.appendChild(opcion3);
        seleccionEstado.value = tarea.estado;
        seleccionEstado.onchange = () => {
            tarea.estado = seleccionEstado.value;
        }
        celdaEstado.appendChild(seleccionEstado);
        fila.appendChild(celdaEstado);

        const celdaDesc = document.createElement("td");
        if (tarea.descripcion.length > 10){
            celdaDesc.innerText = acortarDescripcion(tarea);
            celdaDesc.className = "desactivado";
            // En mi opinion queda mejor sin mostrar el texto con hover
            // celdaDesc.onmouseenter = () => {
            //     if (celdaDesc.className === "desactivado")
            //         celdaDesc.innerText = tarea.descripcion;
            // }
            // celdaDesc.onmouseleave = () =>{
            //     if (celdaDesc.className === "desactivado")
            //         celdaDesc.innerText = acortarDescripcion(tarea);
            // }
            celdaDesc.onclick = () =>{
                if (celdaDesc.className === "desactivado"){
                    celdaDesc.innerText = tarea.descripcion;
                    celdaDesc.className = "activado";
                } else {
                    celdaDesc.innerText = acortarDescripcion(tarea);
                    celdaDesc.className = "desactivado";
                }
            }
        } else celdaDesc.innerText = tarea.descripcion;

        fila.appendChild(celdaDesc);

        const celdaModificar = document.createElement("td");
        const botonModificar = document.createElement("button");
        botonModificar.onclick = () => modificarTarea(id);
        botonModificar.innerText = "MODIFICAR";
        celdaModificar.appendChild(botonModificar);
        fila.appendChild(celdaModificar);

        const celdaBorrar = document.createElement("td");
        const botonBorrar = document.createElement("button");
        botonBorrar.onclick = () => borrarTarea(id);
        botonBorrar.innerText = "BORRAR";
        celdaBorrar.appendChild(botonBorrar);
        fila.appendChild(celdaBorrar);
        tabla.appendChild(fila);
    }
}

const acortarDescripcion = (tarea)=>{
    return tarea.descripcion.substring(0, 15) + "...";
}

const formatearFecha = (fecha) => {
    // getMonth devuelve Enero como 0, asi que para mostrarlo bien debo incrementar 1;
    return fecha.getDate()+"/"+(parseInt(fecha.getMonth())+1)+"/"+fecha.getFullYear();
}

const borrarTarea = (id) => {
    if (modificando){
        document.getElementById("botonCrear").style.display = 'block';
        document.getElementById('botonActualizar').remove();
        document.getElementById("formulario").reset();
        modificando = false;
    }
    let fila = document.getElementById("tarea" + id);
    console.log(id)
    if (fila) {
        fila.remove();
        tareas.splice(id,1);
        console.log(tareas)
        // Quitamos los índices vacíos que se quedan al borrar una entrada
        tareas = tareas.filter(tarea => tarea !== null);
        // Asignamos el id de cada objeto Tarea a su índice en el array
        tareas = tareas.map((tarea, indice) => {tarea.id = indice;return tarea;});
        console.log(tareas)

    } else {
        console.log("Error: No se pudo encontrar la fila con el ID proporcionado.");
    }
    mostrarTareas();
}

const actualizarTarea = (id) => {
    modificando = false;
    let tarea = tareas[id];
    tarea.nombre = document.getElementById("nombre").value;
    tarea.estado = document.getElementById("estado").value;
    tarea.descripcion = document.getElementById("descripcion").value;
    tarea.tiempo = obtenerTiempo(document.getElementById("tiempo").value);
    tarea.fechaAlta = document.getElementById("fechaAlta").value;
    tarea.fechaMax = document.getElementById("fechaMax").value;
    document.getElementById("botonCrear").style.display = 'block';
    document.getElementById('botonActualizar').remove();
    document.getElementById("formulario").reset();
    mostrarTareas();
}

const modificarTarea = (id) => {
    let objetoTarea = tareas[id];
    document.getElementById("nombre").value = objetoTarea.nombre;
    document.getElementById("fechaMax").value = objetoTarea.fechaMax;
    document.getElementById("fechaAlta").value = objetoTarea.fechaAlta;
    document.getElementById("estado").value = objetoTarea.estado;
    document.getElementById("descripcion").value = objetoTarea.descripcion;
    let horas = '';
    let minutos = '';
    let resultadoTiempo = '';
    if (objetoTarea.tiempo.includes('h')){
        let indiceH = objetoTarea.tiempo.indexOf("h");
        horas = objetoTarea.tiempo.substring(0,indiceH);
        let indiceM = objetoTarea.tiempo.indexOf("m");
        minutos = objetoTarea.tiempo.substring(indiceH+2, indiceM);
        resultadoTiempo += horas + ":" + minutos;
    } else {
        let indiceM = objetoTarea.tiempo.indexOf("m");
        resultadoTiempo = objetoTarea.tiempo.substring(0,indiceM);
    }
    document.getElementById("tiempo").value = resultadoTiempo;

    document.getElementById("botonCrear").style.display = 'none';
    let botonAsignarMod;
    if (!modificando){
        botonAsignarMod = document.createElement("input");
    } else botonAsignarMod = document.getElementById("botonActualizar");
    botonAsignarMod.type = "button";
    botonAsignarMod.value = "Actualizar";
    botonAsignarMod.id = 'botonActualizar';
    botonAsignarMod.onclick = () =>actualizarTarea(id);
    document.getElementById("formulario").appendChild(botonAsignarMod);
    modificando = true;

}

const obtenerTiempo = (valor) => {
    var regex = valor.match(/^(\d+:\d{1,2}|\d+)$/);
    var horas = 0;
    var minutos = 0;

    if (regex) {
        const partes = regex[0].split(':');
        if (partes.length === 2) {
            horas = parseInt(partes[0]);
            minutos = parseInt(partes[1]);
            console.log(minutos)
            if (minutos > 59) {
                alert("Los minutos no pueden superar el valor 50")
                throw new Error("Los minutos deben ser menores o iguales a 59.");
            }
        } else {
            minutos = parseInt(partes[0]);
        }

        while (minutos >= 60) {
            minutos -= 60;
            horas++;
        }

        return (horas === 0 ? "" : horas + "h ") + minutos + "m";
    } else {
        alert("El formato no es correcto. h...:mm o m...")
        throw new Error("El formato no es correcto")
    }
}

class Tarea {
    constructor(id,n,t,fm,fa,e,d) {
        this.id = id;
        this.nombre = n;
        this.tiempo = t;
        this.fechaMax = fm;
        this.fechaAlta = fa;
        this.estado = e;
        this.descripcion = d;
    }

}