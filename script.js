//API CODE5971ce05

//Send all data requests to:
//http://www.omdbapi.com/?apikey=5971ce05&

//Poster API requests:
//http://img.omdbapi.com/?apikey=[yourkey]&

const divPeliculas = document.getElementById("peliculas")
const divZoomTapa = document.getElementById("zoomTapa")
const divSombreado = document.getElementById("sombreado");

function buscar() {

    // Creo objeto XMLHttpRequest
    let xhr = new XMLHttpRequest();

    // Asigno callback de respuesta completa (se llamará cuando se reciba toda la información)
    xhr.onload = function() {

        if (xhr.status == 200) {

            // Convierto el JSON de la respuesta en objeto y lo guardo en una variable
            let peliculas = JSON.parse(xhr.responseText);

            // Limpio el texto del div (que decía "Consultando datos....")
            divPeliculas.textContent = "";

            // Recorro el objeto de la respuesta (que sé que es un array)
            peliculas.forEach(pelicula => {
                divPeliculas.appendChild(crearDivPelicula(pelicula));
            });

        } else {
            divPeliculas.textContent = xhr.responseText;
        }
    }

    let filtroTitulo = document.getElementById("busqueda").value;

    // Abro conexión para request GET a la url de la API que retorna el JSON con peliculas
    xhr.open("GET", `http://www.omdbapi.com/?apikey=5971ce05&s=${filtroTitulo}`);
    // Envío el request
    xhr.send();

    // Pongo texto "Consultando datos...." para que se lea mientras espera respuesta.
    divPeliculas.textContent = "Consultando datos....";

}



/**
 * Función alternativa a crearDivDisco con otra forma de resolución
 * 
 * @param {Object} datospelicula idem crearDivDisco
 */
function crearDivPelicula(datospelicula) {

    // Creo un elemento div para contener todo lo que estoy creando
    let divRespuesta = document.createElement("div");

    // Declaro una variable html y la inicializo con un string vacío
    let html = '';

    // Concateno valores en esa variable formando un pedazo de código HTML
    html += `<div class="contenedor-pelicula">`;
    html += `<img src="${datospelicula.poster}">`;
    html += `<ul>`;
    html += `<li>Titulo: ${datospelicula.title}</li>`;
    html += `<li>Año: ${datospelicula.year}</li>`;
    html += `<li>Tipo: ${datospelicula.type}</li>`;
    html += `</ul>`;
    html += `</div>`;

    // Asigno ese texto como HTML del div
    divRespuesta.innerHTML = html;

    // Retorno el div
    return divRespuesta;

}