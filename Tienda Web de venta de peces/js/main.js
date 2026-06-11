// Declaración del array de productos
let productos = [];

// Cargar productos desde el archivo JSON
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data; // Almacena los productos en el array
        cargarProductos(productos); // Llama a la función para mostrarlos en la página
    });

// Selección de elementos 
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

let categoriaActual = "todos"; // Inicializa la categoría como "todos"


// Ocultar el menú lateral al hacer clic en una categoría
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

// Función para actualizar los botones de "Agregar" en los productos
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => boton.addEventListener("click", agregarAlCarrito));
}

// Inicialización del carrito de compras
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS); // Recupera el carrito desde localStorage
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

// Función para agregar productos al carrito
function agregarAlCarrito(e) {
    // Notificación de producto agregado usando Toastify
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: { x: '1.5rem', y: '1.5rem' },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    // Verifica si el producto ya está en el carrito
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++; // Aumenta la cantidad
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado); // Agrega el producto al carrito
    }

    actualizarNumerito(); // Actualiza el contador de productos en el carrito

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); // Guarda en localStorage
}

// Actualiza el número de productos en el carrito
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito; // Muestra la cantidad actualizada
}







// Filtros para Mascotas
const filtroTipo = document.getElementById('filtro-tipo');
const filtroTamaño = document.getElementById('filtro-tamaño');
const filtroCompatibilidad = document.getElementById('filtro-compatibilidad');
const filtroExperiencia = document.getElementById('filtro-experiencia');

// Filtros para Accesorios
const filtroTipoAccesorio = document.getElementById('filtro-tipo-accesorio');
const filtroTamañoAccesorio = document.getElementById('filtro-tipo-tamaño');

// Filtros para Otros
const filtroExperienciaOtros = document.getElementById('filtro-experiencia-otros');


// Función para cargar productos en la página
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = ""; // Limpia el contenedor de productos

    // Itera y crea elementos para cada producto
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">S/${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div); // Agrega el producto al contenedor
    });

    actualizarBotonesAgregar(); // Actualiza los botones de agregar al carrito
}

// Asigna evento a los botones de categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        categoriaActual = e.currentTarget.id; // Actualiza la categoría actual

        // Filtra los productos según la categoría seleccionada
        if (categoriaActual !== "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === categoriaActual);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === categoriaActual);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos); // Muestra todos los productos
        }
    });
});

// Campo de entrada para la búsqueda de productos
const searchInput = document.querySelector("#busqueda");

//Busqueda lineal-------Filtrado por Categoría
// Filtrar productos mientras el usuario escribe
searchInput.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const productosFiltrados = productos.filter(producto => {
        const enCategoriaSeleccionada = categoriaActual === "todos" || producto.categoria.id === categoriaActual;
        const coincideConBusqueda = producto.titulo.toLowerCase().includes(searchText);
        return enCategoriaSeleccionada && coincideConBusqueda;
    });

    cargarProductos(productosFiltrados); // Muestra los productos filtrados
});


// Función para aplicar los filtros
function aplicarFiltros() {
    const tipoAgua = filtroTipo.value;
    const tamaño = filtroTamaño.value;
    const compatibilidad = filtroCompatibilidad.value;
    const experiencia = filtroExperiencia.value;
    const tipoAccesorio = filtroTipoAccesorio.value;
    const tamañoAccesorio = filtroTamañoAccesorio.value;
    const dificultadOtros = filtroExperienciaOtros.value;

    // Filtra los productos de acuerdo con las selecciones
    const productosFiltrados = productos.filter(producto => {
        // Verifica si el producto pertenece a la categoría activa
        const esCategoriaValida = producto.categoria === categoriaActiva || categoriaActiva === 'todos';

        // Filtra por los otros criterios
        const cumpleTipoAgua = tipoAgua === 'todos' || producto.tipo === tipoAgua;
        const cumpleTamaño = tamaño === 'todos' || producto.tamaño === tamaño;
        const cumpleCompatibilidad = compatibilidad === 'todos' || producto.compatibilidad === compatibilidad;
        const cumpleExperiencia = experiencia === 'todos' || producto.experiencia === experiencia;
        const cumpleTipoAccesorio = tipoAccesorio === 'todos' || producto.tipo === tipoAccesorio;
        const cumpleTamañoAccesorio = tamañoAccesorio === 'todos' || producto.cantidad === tamañoAccesorio;
        const cumpleDificultadOtros = dificultadOtros === 'todos' || producto.dificultad === dificultadOtros;
        
        // Devuelve true solo si el producto pasa todos los filtros y pertenece a la categoría activa
        return esCategoriaValida && cumpleTipoAgua && cumpleTamaño && cumpleCompatibilidad && cumpleExperiencia &&
               cumpleTipoAccesorio && cumpleTamañoAccesorio && cumpleDificultadOtros;
    });

    cargarProductos(productosFiltrados); // Carga los productos filtrados
}

// Aplica los filtros cuando cambian los valores
filtroTipo.addEventListener('change', aplicarFiltros);
filtroTamaño.addEventListener('change', aplicarFiltros);
filtroCompatibilidad.addEventListener('change', aplicarFiltros);
filtroExperiencia.addEventListener('change', aplicarFiltros);
filtroTipoAccesorio.addEventListener('change', aplicarFiltros);
filtroTamañoAccesorio.addEventListener('change', aplicarFiltros);
filtroExperienciaOtros.addEventListener('change', aplicarFiltros);

function mostrarFiltro(categoria) {
    // Ocultar todos los filtros
    document.getElementById("filtro-mascotas").querySelector(".filtro-desplegable").style.display = "none";
    document.getElementById("filtro-accesorios").querySelector(".filtro-desplegable").style.display = "none";
    document.getElementById("filtro-otros").querySelector(".filtro-desplegable").style.display = "none";
    
    // Mostrar solo el filtro seleccionado
    if (categoria === "mascotas") {
        document.getElementById("filtro-mascotas").querySelector(".filtro-desplegable").style.display = "block";
    } else if (categoria === "accesorios") {
        document.getElementById("filtro-accesorios").querySelector(".filtro-desplegable").style.display = "block";
    } else if (categoria === "otros") {
        document.getElementById("filtro-otros").querySelector(".filtro-desplegable").style.display = "block";
    }
}

// Variables globales para saber cuál es la categoría activa
let categoriaActiva = 'todos'; // Inicialmente todos

// Función para mostrar todos los productos de una categoría
function mostrarTodosLosProductos() {
    // Restablecer los filtros según la categoría activa
    if (categoriaActiva === 'mascotas') {
        // Restablecer filtros para 'Peces'
        filtroTipo.value = 'todos';
        filtroTamaño.value = 'todos';
        filtroCompatibilidad.value = 'todos';
        filtroExperiencia.value = 'todos';
    } else if (categoriaActiva === 'accesorios') {
        // Restablecer filtros para 'Accesorios'
        filtroTipoAccesorio.value = 'todos';
        filtroTamañoAccesorio.value = 'todos';
    } else if (categoriaActiva === 'otros') {
        // Restablecer filtros para 'Plantas' u 'Otros'
        filtroExperienciaOtros.value = 'todos';
    }

    // Ahora mostrar los productos según la categoría activa
    mostrarProductos(categoriaActiva); // Función que muestra los productos según la categoría
}

// Función para mostrar productos de la categoría activa
function mostrarProductos(categoria) {
    // Mostrar los productos según la categoría y filtros seleccionados
    let productosFiltrados = productos.filter(producto => producto.categoria === categoria);
    // Aplica los filtros (como el tipo, tamaño, etc.) si es necesario
    productosFiltrados = aplicarFiltros(productosFiltrados);
    // Mostrar los productos filtrados
    renderizarProductos(productosFiltrados);
}

// Función para el botón "Todos los productos"
const botonTodos = document.getElementById('todos');
botonTodos.addEventListener('click', () => {
    categoriaActiva = 'todos'; // Restablece la categoría a "todos"
    mostrarTodosLosProductos(); // Muestra todos los productos sin filtros
});



