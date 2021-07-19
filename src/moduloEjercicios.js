import basededatos, { database } from './basededatos.js';


/**
* Devuelve el promedio de anios de estreno de todas las peliculas de la base de datos.
*/
export const promedioAnioEstreno = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    // console.log(basededatos.peliculas.length);
    
    let suma = 0;
    
    for(let pelicula of basededatos.peliculas)
        suma = suma + pelicula["anio"]
    
    return (suma/basededatos.peliculas.length);
};

/**
* Devuelve la lista de peliculas con promedio de critica mayor al numero que llega
* por parametro.
* @param {number} promedio
  */
export const pelicuasConCriticaPromedioMayorA = (promedio) => {
    
    let idPeliculaArray = []
    
    //obtengo los id de peliculas con criticas mayores a promedio
    basededatos.calificaciones.forEach(calificacion => {
        if (calificacion.puntuacion > promedio)  
            idPeliculaArray.push(calificacion.pelicula)
    } )
            
    return basededatos.peliculas.filter(pelicula => idPeliculaArray.includes(pelicula.id));
};

/**
* Devuelve la lista de peliculas de un director
* @param {string} nombreDirector
*/
export const peliculasDeUnDirector = (nombreDirector) => {
    let idDirector

    for(let director of basededatos.directores){
        if(director.nombre === nombreDirector)
            idDirector = director.id
    }
   
    return basededatos.peliculas.filter(pelicula => pelicula.directores.includes(idDirector));
};

/**
* Devuelve el promdedio de critica segun el id de la pelicula.
* @param {number} peliculaId
*/
export const promedioDeCriticaBypeliculaId = (peliculaId) => {

    let suma = 0
    let cont = 0
    
    for(let id of basededatos.calificaciones){
        
        if(id.pelicula === peliculaId){
            suma = suma + id.critico
            cont = cont + 1
        }
        
    }
    return (suma /cont)
};

/**
 * Obtiene la lista de peliculas con alguna critica con
 * puntuacion excelente (critica >= 9).
 * En caso de no existir el criticas que cumplan, devolver un array vacio [].
 * Ejemplo del formato del resultado: 
 *  [
        {
            id: 1,
            nombre: 'Back to the Future',
            anio: 1985,
            direccionSetFilmacion: {
                calle: 'Av. Siempre viva',
                numero: 2043,
                pais: 'Colombia',
            },
            directores: [1],
            generos: [1, 2, 6]
        },
        {
            id: 2,
            nombre: 'Matrix',
            anio: 1999,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Argentina'
            },
            directores: [2, 3],
            generos: [1, 2]
        },
    ],
 */
export const obtenerPeliculasConPuntuacionExcelente = () => {
    // Ejemplo de como accedo a datos dentro de la base de datos
    // console.log(basededatos.peliculas);

    let puntuacionesExcelentes = []

    for (let calificacion of database.calificaciones){
        if(calificacion.puntuacion >= 9)
            puntuacionesExcelentes.push(calificacion.pelicula)
    }    

    return basededatos.peliculas.filter(pelicula => puntuacionesExcelentes.includes(pelicula.id));
};

/**
 * Devuelve informacion ampliada sobre una pelicula.
 * Si no existe la pelicula con dicho nombre, devolvemos undefined.
 * Ademas de devolver el objeto pelicula,
 * agregar la lista de criticas recibidas, junto con los datos del critico y su pais.
 * Tambien agrega informacion de los directores y generos a los que pertenece.
 * Ejemplo de formato del resultado para 'Indiana Jones y los cazadores del arca perdida':
 * {
            id: 3,
            nombre: 'Indiana Jones y los cazadores del arca perdida',
            anio: 2012,
            direccionSetFilmacion: {
                calle: 'Av. Roca',
                numero: 3023,
                pais: 'Camboya'
            },
            directores: [
                { id: 5, nombre: 'Steven Spielberg' },
                { id: 6, nombre: 'George Lucas' },
            ],
            generos: [
                { id: 2, nombre: 'Accion' },
                { id: 6, nombre: 'Aventura' },
            ],
            criticas: [
                { critico: 
                    { 
                        id: 3, 
                        nombre: 'Suzana Mendez',
                        edad: 33,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 5 
                },
                { critico: 
                    { 
                        id: 2, 
                        nombre: 'Alina Robles',
                        edad: 21,
                        pais: 'Argentina'
                    }, 
                    puntuacion: 7
                },
            ]
        },
 * @param {string} nombrePelicula
 */
export const expandirInformacionPelicula = (nombrePelicula) => {

    let datosPeli =(basededatos.peliculas.filter(pelicula => pelicula.nombre === nombrePelicula))[0]
    
    console.log("Nombre de Pelicula: "+nombrePelicula)

    const directores = obtenerDirectores(datosPeli)
    const generos = obtenerGeneros(datosPeli)
    const criticos = obtenerCriticos(datosPeli)

    return {
        //...datosPeli,
        nombre: datosPeli.nombre,
        anio: datosPeli.anio,
        direccion: datosPeli.direccionSetFilmacion,
        directores,
        generos,
        criticos
    };
};

const obtenerDirectores = (pelicula) => {

    return basededatos.directores.filter(director => pelicula.directores.includes(director.id))
}

const obtenerGeneros = (pelicula) => {
    return basededatos.generos.filter(genero => pelicula.generos.includes(genero.id))
}

const obtenerCriticos = (pelicula) => {

    const calificaciones = obtenerCalificaciones(pelicula)
    const criticos = basededatos.criticos
    const paises = basededatos.paises
    let criticosPelicula = []

    for (let calificacion of calificaciones){
        let unCritico = criticos.filter(critico => critico.id === calificacion.critico)
        
        let pais = paises.filter(pais => pais.id === unCritico[0].pais)

        const infoCritico = {
            id: unCritico[0].id,
            nombre: unCritico[0].nombre,
            edad: unCritico[0].edad,
            pais: pais[0].nombre,
            calificacion: calificacion.puntuacion
        }
        criticosPelicula.push(infoCritico)
    }

    return criticosPelicula
}

const obtenerCalificaciones = (pelicula) => {
    return basededatos.calificaciones.filter(calificacion => calificacion.pelicula === pelicula.id)
}
