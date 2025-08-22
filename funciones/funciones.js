// Variables globales del carrito
let carritoCompras = [];

//añadir
function añadirAlCarrito(productoId, precio, nombre) {
    
    const productoExistente = carritoCompras.find(item => item.id === productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
    } else{
        const nuevoProducto = {
            id: productoId,
            nombre: nombre,
            precio: parseFloat(precio),
            cantidad: 1,
            subtotal: parseFloat(precio)
        };
        carritoCompras.push(nuevoProducto);
    }
    calcularTotalCarrito();

    alert(`${nombre} añadido al carrito`);
    
    console.log('Carrito actualizado:', carritoCompras);
}

// Eliminar
function eliminarDelCarrito(productoId) {
    // Encontrar el índice del producto
    const indiceProducto = carritoCompras.findIndex(item => item.id === productoId);
    
    if (indiceProducto !== -1) {
        const nombreProducto = carritoCompras[indiceProducto].nombre;
        
        // Eliminar el producto
        carritoCompras.splice(indiceProducto, 1);
        calcularTotalCarrito();
        // Confirmar eliminación
        alert(`${nombreProducto} eliminado del carrito`);
        
        console.log('Producto eliminado. Carrito:', carritoCompras);
    }
}

// Función para reducir cantidad (opcional)
function reducirCantidad(productoId) {
    const producto = carritoCompras.find(item => item.id === productoId);
    
    if (producto) {
        if (producto.cantidad > 1) {
            // Reducir cantidad
            producto.cantidad -= 1;
            producto.subtotal = producto.precio * producto.cantidad;
        } else {
            // Si cantidad es 1, eliminar completamente
            eliminarDelCarrito(productoId);
            return;
        }
        
        calcularTotalCarrito();
        console.log('Cantidad reducida:', producto);
    }
}

// ========== 3. FUNCIÓN CALCULAR TOTAL DEL CARRITO ==========
function calcularTotalCarrito() {
    let totalGeneral = 0;
    
    // Sumar todos los subtotales
    carritoCompras.forEach(item => {
        totalGeneral += item.subtotal;
    });
    
    console.log(`Total del carrito: $${totalGeneral.toFixed(2)}`);
    
    // Actualizar en la página si existe el elemento
    const elementoTotal = document.getElementById('total-carrito');
    if (elementoTotal) {
        elementoTotal.textContent = totalGeneral.toFixed(2);
    }
    
    return totalGeneral;
}

// ========== FUNCIONES AUXILIARES ==========

// Obtener cantidad total de productos
function obtenerCantidadTotal() {
    return carritoCompras.reduce((total, item) => total + item.cantidad, 0);
}

// Vaciar carrito completo
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        carritoCompras = [];
        calcularTotalCarrito();
        alert('Carrito vaciado');
    }
}

// Mostrar contenido del carrito
function mostrarCarrito() {
    if (carritoCompras.length === 0) {
        console.log('El carrito está vacío');
        return;
    }
    
    console.log('=== CONTENIDO DEL CARRITO ===');
    carritoCompras.forEach(item => {
        console.log(`${item.nombre} - Cantidad: ${item.cantidad} - Subtotal: $${item.subtotal.toFixed(2)}`);
    });
    console.log(`TOTAL: $${calcularTotalCarrito().toFixed(2)}`);
}

// ========== INICIALIZACIÓN EN DOM ==========
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones "Añadir al carrito" en index.html
    const botonesAñadir = document.querySelectorAll('.AñadirCarrito');
    
    botonesAñadir.forEach(boton => {
        boton.addEventListener('click', function() {
            const productoId = this.getAttribute('data-producto');
            const precio = this.getAttribute('data-precio');
            const nombre = this.parentElement.querySelector('h4').textContent;
            
            // Llamar función principal
            añadirAlCarrito(productoId, precio, nombre);
        });
    });
    
    // Si estamos en la página del carrito, mostrar productos
    if (document.getElementById('lista-productos')) {
        mostrarProductosEnCarrito();
    }
});

// ========== FUNCIÓN PARA MOSTRAR EN PÁGINA DEL CARRITO ==========
function mostrarProductosEnCarrito() {
    const listaProductos = document.getElementById('lista-productos');
    const mensajeVacio = document.getElementById('no_elementos');
    
    if (carritoCompras.length === 0) {
        if (mensajeVacio) mensajeVacio.style.display = 'block';
        if (listaProductos) listaProductos.innerHTML = '';
        return;
    }
    
    if (mensajeVacio) mensajeVacio.style.display = 'none';
    
    if (listaProductos) {
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
    }
    
    calcularTotalCarrito();
}