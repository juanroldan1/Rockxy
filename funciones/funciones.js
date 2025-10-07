// Variables del carrito
let carritoCompras = [];

// ========== FUNCIONES DEL SPINNER ==========
function mostrarSpinner(texto = 'Cargando...') {
    const spinner = document.getElementById('spinner-overlay');
    const spinnerText = document.getElementById('spinner-text');
    if (spinner) {
        if (spinnerText) {
            spinnerText.textContent = texto;
        }
        spinner.classList.add('active');
        
        document.body.style.overflow = 'hidden';
    }
}

function ocultarSpinner() {
    const spinner = document.getElementById('spinner-overlay');
    if (spinner) {
        spinner.classList.remove('active');

        document.body.style.overflow = '';
    }
}

//Agregar desde el JSON (API)
async function mostrarCatalogoAPI() {
    const url = "https://script.google.com/macros/s/AKfycbzjqCvKP-Ny1sIVSooAcVu1WXMi4oU1iIbi975jZ9T_bz9eC4dkZiP54zXts-pmE30/exec";
    
    // Mostrar spinner mientras carga
    const contenedorCocteles = document.querySelector('.cocteleria-grid');
    const contenedorLicores = document.querySelector('.licores-grid');
    const contenedorCervezas = document.querySelector('.cervezas-grid');
    
    if (contenedorCocteles) {
        contenedorCocteles.innerHTML = '<div class="productos-loading"><div class="spinner-small"></div><p>Cargando productos...</p></div>';
    }
    if (contenedorLicores) {
        contenedorLicores.innerHTML = '<div class="productos-loading"><div class="spinner-small"></div><p>Cargando productos...</p></div>';
    }
    if (contenedorCervezas) {
        contenedorCervezas.innerHTML = '<div class="productos-loading"><div class="spinner-small"></div><p>Cargando productos...</p></div>';
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const respuesta = await response.json();
        const productos = respuesta.data || [];

        // Coctelería
        if (contenedorCocteles) {
            contenedorCocteles.innerHTML = '';
            const cocteles = productos.filter(producto => producto.Categoría === "Coctelería");
            if (cocteles.length === 0) {
                contenedorCocteles.innerHTML = '<p style="color: #999;">No hay productos disponibles</p>';
            } else {
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
        }

        // Licores
        if (contenedorLicores) {
            contenedorLicores.innerHTML = '';
            const licores = productos.filter(producto => producto.Categoría === "Licores");
            if (licores.length === 0) {
                contenedorLicores.innerHTML = '<p style="color: #999;">No hay productos disponibles</p>';
            } else {
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
        }

        // Cervezas
        if (contenedorCervezas) {
            contenedorCervezas.innerHTML = '';
            const cervezas = productos.filter(producto => producto.Categoría === "Cervezas");
            if (cervezas.length === 0) {
                contenedorCervezas.innerHTML = '<p style="color: #999;">No hay productos disponibles</p>';
            } else {
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
        }

        console.log('Productos cargados:', productos.length);
    } catch (error) {
        console.error('Error al cargar productos:', error.message);
        if (contenedorCocteles) {
            contenedorCocteles.innerHTML = '<p style="color: red;">Error al cargar los productos. Por favor, recarga la página.</p>';
        }
        if (contenedorLicores) {
            contenedorLicores.innerHTML = '<p style="color: red;">Error al cargar los productos. Por favor, recarga la página.</p>';
        }
        if (contenedorCervezas) {
            contenedorCervezas.innerHTML = '<p style="color: red;">Error al cargar los productos. Por favor, recarga la página.</p>';
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
        const subtotal = item.subtotal || 0;
        totalGeneral += subtotal;
    });
    const elementoTotal = document.getElementById('total-carrito');
    if (elementoTotal) {
        elementoTotal.textContent = totalGeneral.toLocaleString();
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

    const nombreCliente = document.getElementById('nombre-cliente').value;
    const telefonoCliente = document.getElementById('telefono-cliente').value;
    const direccionCliente = document.getElementById('direccion-cliente').value;

    if (!nombreCliente || !telefonoCliente || !direccionCliente) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const productos = carritoCompras.map(item => ({
        id: item.id,
        precio: item.precio || 0,
        cantidad: item.cantidad
    }));

    const pedido = {
        nombreCliente: nombreCliente,
        telefonoCliente: telefonoCliente,
        direccionCliente: direccionCliente,
        productos: productos,
        total: calcularTotalCarrito()
    };

    console.log("Enviando pedido al servidor:", JSON.stringify(pedido, null, 2));

    // Mostrar spinner
    mostrarSpinner('Enviando tu pedido...');
    
    // Cerrar modal antes del spinner
    cerrarModalCliente();

    const urlPedidos = 'https://script.google.com/macros/s/AKfycbzjqCvKP-Ny1sIVSooAcVu1WXMi4oU1iIbi975jZ9T_bz9eC4dkZiP54zXts-pmE30/exec';

    fetch(urlPedidos, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
    })
    .then(() => {
        setTimeout(() => {
            ocultarSpinner();
            console.log('Pedido enviado');
            alert('¡Pedido enviado con éxito!\n\nDetalles:\nCliente: ' + nombreCliente + '\nTotal: $' + calcularTotalCarrito().toLocaleString());
            
            carritoCompras = [];
            guardarCarrito();
            actualizarContadorCarrito();
            mostrarProductosEnCarrito();
        }, 1000);
    })
    .catch((error) => {
        ocultarSpinner();
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
            // FIX: Validar que precio no sea null
            const precioValido = item.precio || 0;
            const subtotalValido = item.subtotal || 0;
            
            itemDiv.innerHTML = `
                <div class="info-producto">
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${precioValido.toLocaleString()}</p>
                </div>
                <div class="controles-cantidad">
                    <button onclick="reducirCantidad('${item.id}')">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="añadirAlCarrito('${item.id}', ${precioValido}, '${item.nombre}')">+</button>
                </div>
                <div class="subtotal-producto">
                    <p>$${subtotalValido.toLocaleString()}</p>
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