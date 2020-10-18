const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;         // LA API OPEN WEATHER, NECESITA EL VALOR EN 2 CARACTERES Ejemplo CO=Colombia

    if( ciudad === '' || pais === '' ) {
        // Error
        mostrarError('Ambos campos son obligatorios');
        
        return;
    } else {
        console.log('Todo OK!')
    }

    // Consultar la API
    consultarApi(ciudad, pais);


    function mostrarError(mensaje) {

        const alerta = document.querySelector('.bg-red-100');

        if(!alerta) {
            
            // Crear una alerta
            const alerta = document.createElement('div');

            alerta.classList.add(
                'bg-red-100', 
                'border-red-400', 
                'text-red-700', 
                'px-4', 'py-3', 
                'rounded', 
                'max-w-md', 
                'mx-auto',
                'mt-6',
                'text-center'
            );

            alerta.innerHTML = `
                <strong class="font-bold">Error!</strong>
                <span class="block"> ${mensaje} </span>
            `;

            container.appendChild(alerta);

            // Eliminar alerta pasados 3 segundos
            setTimeout( () => {
                alerta.remove();
            }, 3000);
        }
    }

    function consultarApi(ciudad, pais){
        
        // Los datos enviados deben estar estructurados, segun la api lo requiera, por ejemplo si estoy como frontend en una empresa, los de 
        // Backend deben indicarme que URLs hay disponibles en la API para que pueda enviar los datos.
        
        // Para este proyecto estamos utilizando la siguiente API= Current Weather Data
        
        // Esta API requiere un ID de la aplicación...
        const appID = 'ecb98b65be4605b507dc7161aafab748'

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}`;

        spinner(); // Muestra un spinner de carga


        // En este caso el .catch del promise de fetch no se cumple, ya que si le entregamos una ciudad que no existe, la api de igual forma
        // está respondiendo, solo que con una información de error, por lo tanto se debe realizar una validación en el .then que muestra los datos
        
        fetch(url)
            .then( respuesta => respuesta.json() )
            .then( datos => {
                console.log(datos)
                limpiarHtml()   // Limpia el Html previo
                // validamos la respuesta 404 "Si la ciudad que enviamos NO existe...entonces...mostrarError"
                if(datos.cod === "404"){
                    mostrarError(`${ciudad} NO FUE ENCONTRADA`);
                    return;
                }

                // Imprime la respuesta en el Html
                mostrarClima(datos);
            } )
    }

    function mostrarClima(datos) {
        // Destructuring de un objeto que está dentro de otro objeto llamado main
        const { name, main: { temp, temp_max, temp_min }} = datos; // excepto por name, ya que está en la misma jerarquia de main

        // Hay que transformar el resultado de las temperaturas, ya que la api proporciona la información en grados Kelvin        
        // por ende para transformar de grados Kelvin a Celcius utilizamos la siguiente formula: valorKelvin - 273.15

        const centigrados = kelvinACentigrados(temp);
        const max = kelvinACentigrados(temp_max);
        const min = kelvinACentigrados(temp_min);
        
        const nombreCiudad = document.createElement('p');
        nombreCiudad.textContent = `Clima en ${name}`
        const actual = document.createElement('p');
        nombreCiudad.classList.add('font-bold', 'text-xl')
        // Como utilizaremos una entidad de HTML5, debemos utilizar el innerHtml, de otra forma como el textContent no nos permita escribir en una entidad
        actual.innerHTML = `Actual: ${centigrados} &#8451;`
        actual.classList.add('font-bold', 'text-6xl') // clase de tailwind para el tamaño de las fuentes

        const tempMaxima = document.createElement('p');
        tempMaxima.innerHTML = `Maxima ${max} &#8451;`
        tempMaxima.classList.add('text-xl');

        const tempMinima = document.createElement('p');
        tempMinima.innerHTML = `Mínima ${min} &#8451;`;
        tempMinima.classList.add('text-xl')
        
        const resultadoDiv = document.createElement('div');
        resultadoDiv.classList.add('text-center', 'text-white');
        resultadoDiv.appendChild(nombreCiudad);
        resultadoDiv.appendChild(actual);
        resultadoDiv.appendChild(tempMaxima);
        resultadoDiv.appendChild(tempMinima);

        resultado.appendChild(resultadoDiv);

    }

    const kelvinACentigrados = grados => parseInt(grados - 273.15);
    
    function limpiarHtml(){
        while (resultado.firstChild) {
            resultado.removeChild(resultado.firstChild);            
        }
    }

    function spinner() {

        limpiarHtml();

        const divSpinner = document.createElement('div');

        divSpinner.classList.add('sk-fading-circle');

        divSpinner.innerHTML = `
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        `;

        resultado.appendChild(divSpinner)
    }
}