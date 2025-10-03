// Variables del carrito
let carritoCompras = [];

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
            contador.style.display = 'block';
        } else {
            contador.style.display = 'none';
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
    mostrarProductosEnCarrito(); // Llama a esta función para que se actualice la vista
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

//ENVÍO AL SERVIDOR
function enviarformulario() {
    if (carritoCompras.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    // Aquí se simula el envío de datos a un servidor
    console.log("Enviando datos del carrito al servidor:", JSON.stringify(carritoCompras, null, 2));

    
    const url = 'https://jsonplaceholder.typicode.com/posts';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombreCliente,
            items: carritoCompras,
            total: calcularTotalCarrito()
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        alert('¡Compra finalizada con éxito!');
        // Opcionalmente, vaciar el carrito después de la compra
        carritoCompras = [];
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    })
    .catch((error) => {
        console.error('Error al enviar al servidor:', error);
        alert('Ocurrió un error al procesar tu compra. Por favor, inténtalo de nuevo.');
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
                    <p>Precio: $${item.precio.toFixed(2)}</p>
                </div>
                <div class="controles-cantidad">
                    <button onclick="reducirCantidad('${item.id}')">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="añadirAlCarrito('${item.id}', ${item.precio}, '${item.nombre}')">+</button>
                </div>
                <div class="subtotal-producto">
                    <p>$${item.subtotal.toFixed(2)}</p>
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
    
    const botonesAñadir = document.querySelectorAll('.AñadirCarrito');
    
    botonesAñadir.forEach(boton => {
        boton.addEventListener('click', function() {
            const productoId = this.getAttribute('data-producto');
            const precio = this.getAttribute('data-precio');
            const nombre = this.parentElement.querySelector('h4').textContent;
            
            añadirAlCarrito(productoId, precio, nombre);
        });
    });
    
    // Si estamos en la página del carrito, mostrar productos
    if (document.getElementById('lista-productos')) {
        mostrarProductosEnCarrito();
    }
});