// Inicializar el carrito de compras recuperando los productos almacenados en localStorage.
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

// Elementos del DOM para actualizar el estado del carrito.
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Cargar los productos en el carrito y actualizar la interfaz según el estado del carrito.
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        // Limpiar el contenedor y agregar cada producto del carrito.
        contenedorCarritoProductos.innerHTML = "";
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo"><small>Título</small><h3>${producto.titulo}</h3></div>
                <div class="carrito-producto-cantidad"><small>Cantidad</small><p>${producto.cantidad}</p></div>
                <div class="carrito-producto-precio"><small>Precio</small><p>S/${producto.precio}</p></div>
                <div class="carrito-producto-subtotal"><small>Subtotal</small><p>S/${producto.precio * producto.cantidad}</p></div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });
    
        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        // Si el carrito está vacío, mostrar el mensaje correspondiente.
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito(); // Llamada inicial para cargar los productos en el carrito.

// Actualizar el evento de eliminación para cada botón.
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => boton.addEventListener("click", eliminarDelCarrito));
}

// Eliminar un producto del carrito y mostrar una notificación.
function eliminarDelCarrito(e) {


    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1); // Remover el producto seleccionado.
    cargarProductosCarrito(); // Recargar el carrito.
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Vaciar el carrito con confirmación usando SweetAlert.
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0; // Vaciar el array del carrito.
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

// Actualizar el total del carrito.
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `S/${totalCalculado}`;
}

// Finalizar la compra y mostrar un mensaje de confirmación.
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}
