



let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const DOMmodal = document.querySelector("#modal-body")
const miLocalStorage = window.localStorage;

/**
            * Dibuja todos los productos a partir de la base de datos.
            */

//fetch



let baseDeDatos;

fetch('../servicios.json')
.then(res => { return res.json()})
.then( data => {

    baseDeDatos = data;

  
})

.then(fun =>{
    renderizarProductos();
 renderizarCarrito();

})

function renderizarProductos() {
baseDeDatos.forEach((info) => {
        // Estructura
        const miNodo = document.createElement('div');
        miNodo
            .classList
            .add('card', 'col-sm-4', 'bgBlue', 'txtColor');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody
            .classList
            .add('card-body');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle
            .classList
            .add('card-title', 'txtColor');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen
            .classList
            .add('img-fluid');
        miNodoImagen.setAttribute('src', info.imagen);
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio
            .classList
            .add('card-text', 'txtColor');
        miNodoPrecio.textContent = `${divisa}${info.precio}`;
        // Boton
        const miNodoBoton = document.createElement('button', 'txtColor');
        miNodoBoton
            .classList
            .add('btn', 'btn-primary');
        miNodoBoton.textContent = '+';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Inserto
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
 
    });
}

    


/**
            * Evento para añadir un producto al carrito de la compra
            */
function anyadirProductoAlCarrito(evento) {
    // Anadir el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}

/**
            * Dibuja todos los productos guardados en el carrito
            */
function renderizarCarrito() {
    // Vaciamos todo el html
    DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = buscarEnDB(item);
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = getCantidadUnidades(item);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo
            .classList
            .add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = getTextoFormateado(numeroUnidadesItem, miItem);
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton
            .classList
            .add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);

        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}

function getTextoFormateado(numeroUnidadesItem, miItem) {
    return `${numeroUnidadesItem} x ${miItem[0]
        .nombre}  ${divisa}${miItem[0]
        .precio}`;
}

function getCantidadUnidades(item) {
    return carrito.reduce((total, itemId) => {
        // ¿Coincide las id? Incremento el contador
        return itemId === item
            ? total += 1
            : total;
    }, 0);
}

/**
            * Evento para borrar un elemento del carrito
            */
function borrarItemCarrito(evento) {

    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();

}

/**
             * Calcula el precio total teniendo en cuenta los productos repetidos
             */
function calcularTotal() {
    removeAllChildNodes(DOMmodal);
    completarTextoModal();
    var total =
    // Recorremos el array del carrito
    carrito
        .reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0)
        .toFixed(2);

    DOMmodal.appendChild(crearParrafo("Total: $" + total));
    return total;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function completarTextoModal() {
    var texto = "";
    var myItem;
    var cantidad;
    const carritoSinDuplicados = [...new Set(carrito)];
    carritoSinDuplicados.forEach(item => {
        myItem = buscarEnDB(item);
        cantidad = getCantidadUnidades(item);
        texto = getTextoFormateado(cantidad, myItem)
        DOMmodal.appendChild(crearParrafo(texto));

    });
    return texto;
}

function crearParrafo(texto) {
    var p = document.createElement("p");
    p.innerHTML = texto
    return p;
}

/**
            * Varia el carrito y vuelve a dibujarlo
            */
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();

}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

function buscarEnDB(item) {
    return baseDeDatos.filter((itemBaseDatos) => {

        return itemBaseDatos.id === parseInt(item);
    });
}


DOMbotonVaciar.addEventListener('click', () => {

Swal.fire({
    title: 'Esta segur@ que quiere vaciar el carrito?',
    text: "Debera cargar los productos nuevamente",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00d858',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, vaciar!',
    cancelButtonText: 'No me borres nada por favor!!'
  }).then((result) => {

    if(result.isConfirmed ) {

        vaciarCarrito()
        
        Swal.fire(
        
        'Carrito vaciado')
        
                } else {
        
        Swal.fire(
        
        'Menos mal, volvamos al inicio'
        
                    )
        
                }
  })
})



  cargarCarritoDeLocalStorage();
//renderizarProductos();
 //renderizarCarrito();