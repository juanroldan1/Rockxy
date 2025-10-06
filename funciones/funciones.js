// Variables del carrito
let carritoCompras = [];

//Agregar desde el JSON (API)
async function mostrarCatalogoAPI() {
    const url = "https://script.google.com/macros/s/AKfycbzjqCvKP-Ny1sIVSooAcVu1WXMi4oU1iIbi975jZ9T_bz9eC4dkZiP54zXts-pmE30/exec";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const respuesta = await response.json();
        const productos = respuesta.data || [];

        // Coctelería
        const contenedorCocteles = document.querySelector('.cocteleria-grid');
        if (contenedorCocteles) {
            contenedorCocteles.innerHTML = '';
            const cocteles = productos.filter(producto => producto.Categoría === "Coctelería");
            cocteles.forEach(producto => {
                const productoId = producto.Nombre.toLowerCase().replace(/\s+/g, '-');
                const div = document.createElement('div');
                div.className = 'producto';
                div.innerHTML = `
                    <img src="${producto.Imagen || ''}" alt="${producto.Nombre}" />
                    <h4>${producto.Nombre}</h4>
                    <p>${producto.Ingredientes}</p>
                    <span class="precio">${Number(producto.Precio).toLocaleString()}</span>
                    <button class="AñadirCarrito" data-producto="${productoId}" data-precio="${producto.Precio}" data-nombre="${producto.Nombre}">Añadir al carrito</button>
                `;
                contenedorCocteles.appendChild(div);
            });
        }

        // Licores
        const contenedorLicores = document.querySelector('.licores-grid');
        if (contenedorLicores) {
            contenedorLicores.innerHTML = '';
            const licores = productos.filter(producto => producto.Categoría === "Licores");
            licores.forEach(producto => {
                const productoId = producto.Nombre.toLowerCase().replace(/\s+/g, '-');
                const div = document.createElement('div');
                div.className = 'producto';
                div.innerHTML = `
                    <img src="${producto.Imagen || ''}" alt="${producto.Nombre}" />
                    <h4>${producto.Nombre}</h4>
                    <p>${producto.Ingredientes}</p>
                    <span class="precio">${Number(producto.Precio).toLocaleString()}</span>
                    <button class="AñadirCarrito" data-producto="${productoId}" data-precio="${producto.Precio}" data-nombre="${producto.Nombre}">Añadir al carrito</button>
                `;
                contenedorLicores.appendChild(div);
            });
        }
        // Cervezas
        const contenedorCervezas = document.querySelector('.cervezas-grid');
        if (contenedorCervezas) {
            contenedorCervezas.innerHTML = '';
            const cervezas = productos.filter(producto => producto.Categoría === "Cervezas");
            cervezas.forEach(producto => {
                const productoId = producto.Nombre.toLowerCase().replace(/\s+/g, '-');
                const div = document.createElement('div');
                div.className = 'producto';
                div.innerHTML = `
                    <img src="${producto.Imagen || ''}" alt="${producto.Nombre}" />
                    <h4>${producto.Nombre}</h4>
                    <p>${producto.Ingredientes}</p>
                    <span class="precio">${Number(producto.Precio).toLocaleString()}</span>
                    <button class="AñadirCarrito" data-producto="${productoId}" data-precio="${producto.Precio}" data-nombre="${producto.Nombre}">Añadir al carrito</button>
                `;
                contenedorCervezas.appendChild(div);
            });
        }

        console.log('Productos cargados:', productos.length);
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
        const contenedorCocteles = document.querySelector('.cocteleria-grid');
        const contenedorLicores = document.querySelector('.licores-grid');
        if (contenedorCocteles) {
            contenedorCocteles.innerHTML = '<p style="color: red;">Error al cargar los productos.</p>';
        }
        if (contenedorLicores) {
            contenedorLicores.innerHTML = '<p style="color: red;">Error al cargar los productos.</p>';
        }
    }
}

// Función para guardar el carrito en Local Storage
function guardarCarrito() {
    localStorage.setItem('carritoCompras', JSON.stringify(carritoCompras));
}

// Función para cargar el carrito de Local Storage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoCompras');
    if (carritoGuardado) {
        carritoCompras = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Función para actualizar el contador de productos en el menú
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    const cantidadTotal = carritoCompras.reduce((total, item) => total + item.cantidad, 0);
    if (contador) {
        if (cantidadTotal > 0) {
            contador.textContent = cantidadTotal;
            contador.style.display = 'inline-flex';
        } else {
            contador.style.display = 'none';
            contador.textContent = '';
        }
    }
}

// AÑADIR PRODUCTO
function añadirAlCarrito(productoId, precio, nombre) {
    const productoExistente = carritoCompras.find(item => item.id === productoId);
    if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
    } else {
        const nuevoProducto = {
            id: productoId,
            nombre: nombre,
            precio: parseFloat(precio),
            cantidad: 1,
            subtotal: parseFloat(precio)
        };
        carritoCompras.push(nuevoProducto);
    }
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarProductosEnCarrito();
    alert(`${nombre} agregado al carrito`);
}

//ELIMINAR PRODUCTO
function eliminarDelCarrito(productoId) {
    const indiceProducto = carritoCompras.findIndex(item => item.id === productoId);
    if (indiceProducto !== -1) {
        carritoCompras.splice(indiceProducto, 1);
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    }
}

// Función para reducir la cantidad
function reducirCantidad(productoId) {
    const producto = carritoCompras.find(item => item.id === productoId);
    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad -= 1;
            producto.subtotal = producto.precio * producto.cantidad;
        } else {
            eliminarDelCarrito(productoId);
            return;
        }
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    }
}

//CALCULAR TOTAL DEL CARRITO
function calcularTotalCarrito() {
    let totalGeneral = 0;
    carritoCompras.forEach(item => {
        totalGeneral += item.subtotal;
    });
    const elementoTotal = document.getElementById('total-carrito');
    if (elementoTotal) {
        elementoTotal.textContent = totalGeneral.toFixed(2);
    }
    return totalGeneral;
}

// Función para vaciar el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        carritoCompras = [];
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    }
}

// FUNCIONES DEL MODAL
function mostrarModalCliente() {
    if (carritoCompras.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }
    const modal = document.getElementById('modal-cliente');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarModalCliente() {
    const modal = document.getElementById('modal-cliente');
    if (modal) {
        modal.style.display = 'none';
        // Limpiar el formulario
        document.getElementById('form-cliente').reset();
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modal-cliente');
    if (event.target === modal) {
        cerrarModalCliente();
    }
}

//ENVÍO AL SERVIDOR
function enviarformulario(event) {
    event.preventDefault(); 
    
    if (carritoCompras.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    // Obtener datos del formulario
    const nombreCliente = document.getElementById('nombre-cliente').value;
    const telefonoCliente = document.getElementById('telefono-cliente').value;
    const direccionCliente = document.getElementById('direccion-cliente').value;

    // Validar que los campos no estén vacíos
    if (!nombreCliente || !telefonoCliente || !direccionCliente) {
        alert("Por favor completa todos los campos.");
        return;
    }

    // Construir la lista de productos
    const productos = carritoCompras.map(item => ({
        id: item.id,
        precio: item.precio,
        cantidad: item.cantidad
    }));

    // Construir el objeto pedido 
    const pedido = {
        nombreCliente: nombreCliente,
        telefonoCliente: telefonoCliente,
        direccionCliente: direccionCliente,
        productos: productos,
        total: calcularTotalCarrito()
    };

    console.log("Enviando pedido al servidor:", JSON.stringify(pedido, null, 2));

    
    const url = 'https://script.google.com/macros/s/AKfycbzjqCvKP-Ny1sIVSooAcVu1WXMi4oU1iIbi975jZ9T_bz9eC4dkZiP54zXts-pmE30/exec';

    

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert('¡Pedido enviado con éxito!\n\nDetalles:\nCliente: ' + nombreCliente + '\nTotal: ' + calcularTotalCarrito().toFixed(2));
        
        // Cerrar modal
        cerrarModalCliente();
        
        // Vaciar carrito después de enviar
        carritoCompras = [];
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    })
    .catch((error) => {
        console.error('Error al enviar al servidor:', error);
        alert('Ocurrió un error al procesar tu pedido. Por favor, inténtalo de nuevo.');
    });
}

//MOSTRAR PRODUCTOS EN LA PÁGINA DEL CARRITO
function mostrarProductosEnCarrito() {
    const listaProductos = document.getElementById('lista-productos');
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoConContenido = document.getElementById('carrito-con-contenido');
    if (!listaProductos || !carritoVacio || !carritoConContenido) {
        return;
    }
    if (carritoCompras.length === 0) {
        carritoVacio.style.display = 'block';
        carritoConContenido.style.display = 'none';
    } else {
        carritoVacio.style.display = 'none';
        carritoConContenido.style.display = 'block';
        listaProductos.innerHTML = '';
        carritoCompras.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'producto-carrito';
            itemDiv.innerHTML = `
                <div class="info-producto">
                    <h4>${item.nombre}</h4>
                    <p>Precio: ${item.precio.toFixed(2)}</p>
                </div>
                <div class="controles-cantidad">
                    <button onclick="reducirCantidad('${item.id}')">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="añadirAlCarrito('${item.id}', ${item.precio}, '${item.nombre}')">+</button>
                </div>
                <div class="subtotal-producto">
                    <p>${item.subtotal.toFixed(2)}</p>
                    <button onclick="eliminarDelCarrito('${item.id}')" class="btn-eliminar">Eliminar</button>
                </div>
            `;
            listaProductos.appendChild(itemDiv);
        });
        calcularTotalCarrito();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    mostrarCatalogoAPI();
    
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('AñadirCarrito')) {
            const productoId = e.target.getAttribute('data-producto');
            const precio = e.target.getAttribute('data-precio');
            const nombre = e.target.getAttribute('data-nombre');
            añadirAlCarrito(productoId, precio, nombre);
        }
    });
    // MOSTRAR PRODUCTOS EN LA PÁGINA DEL CARRITO
    if (document.getElementById('lista-productos')) {
        mostrarProductosEnCarrito();
    }
});