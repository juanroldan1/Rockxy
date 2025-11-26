

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

// ========== CARGAR PRODUCTOS DESDE EL BACKEND ==========
async function mostrarCatalogoAPI() {
    const API_URL = "https://rockxy-production.up.railway.app/api";
    const url = `${API_URL}/productos`;
    
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
        console.log('🔄 Cargando productos desde:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productos = await response.json();
        console.log('✅ Productos cargados:', productos.length);

        // ========== COCTELERÍA ==========
        if (contenedorCocteles) {
            contenedorCocteles.innerHTML = '';
            const cocteles = productos.filter(producto => producto.categoria === "Coctelería");
            
            if (cocteles.length === 0) {
                contenedorCocteles.innerHTML = '<p style="color: #999;">No hay productos disponibles en esta categoría</p>';
            } else {
                cocteles.forEach(producto => {
                    const productoId = producto.id;
                    const precio = producto.precio || 0;
                    
                    const div = document.createElement('div');
                    div.className = 'producto';
                    div.innerHTML = `
                        <img src="${producto.imagenUrl || 'https://via.placeholder.com/200'}" 
                             alt="${producto.nombre}" 
                             onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'" />
                        <h4>${producto.nombre}</h4>
                        <p>${producto.ingredientes || ''}</p>
                        <span class="precio">$${precio.toLocaleString('es-CO')}</span>
                        <button class="AñadirCarrito" 
                                data-producto="${productoId}" 
                                data-precio="${precio}" 
                                data-nombre="${producto.nombre}"
                                ${!producto.disponible ? 'disabled' : ''}>
                            ${producto.disponible ? 'Añadir al carrito' : 'No disponible'}
                        </button>
                    `;
                    contenedorCocteles.appendChild(div);
                });
            }
        }

        // ========== LICORES ==========
        if (contenedorLicores) {
            contenedorLicores.innerHTML = '';
            const licores = productos.filter(producto => producto.categoria === "Licores");
            
            if (licores.length === 0) {
                contenedorLicores.innerHTML = '<p style="color: #999;">No hay productos disponibles en esta categoría</p>';
            } else {
                licores.forEach(producto => {
                    const productoId = producto.id;
                    
                    const precioBotella = producto.precioBotella || null;
                    const precioShot = producto.precioShot || null;
                    const precioMedia = producto.precioMedia || null;
                    
                    // HTML de precios
                    let preciosHTML = '<div class="precios-licor">';
                    
                    if (precioBotella) {
                        preciosHTML += `<div class="precio-item"><strong>Botella:</strong> $${Number(precioBotella).toLocaleString('es-CO')}</div>`;
                    } else {
                        preciosHTML += '<div class="precio-item no-disponible"><strong>Botella:</strong> No disponible</div>';
                    }
                    
                    if (precioShot) {
                        preciosHTML += `<div class="precio-item"><strong>Shot:</strong> $${Number(precioShot).toLocaleString('es-CO')}</div>`;
                    } else {
                        preciosHTML += '<div class="precio-item no-disponible"><strong>Shot:</strong> No disponible</div>';
                    }
                    
                    if (precioMedia) {
                        preciosHTML += `<div class="precio-item"><strong>Media:</strong> $${Number(precioMedia).toLocaleString('es-CO')}</div>`;
                    } else {
                        preciosHTML += '<div class="precio-item no-disponible"><strong>Media:</strong> No disponible</div>';
                    }
                    
                    preciosHTML += '</div>';
                    
                    // Precio para el carrito (prioridad: botella > shot > media)
                    const precioCarrito = precioBotella || precioShot || precioMedia || 0;
                    
                    const div = document.createElement('div');
                    div.className = 'producto producto-licor';
                    div.innerHTML = `
                        <img src="${producto.imagenUrl || 'https://via.placeholder.com/200'}" 
                             alt="${producto.nombre}"
                             onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'" />
                        <h4>${producto.nombre}</h4>
                        <p>${producto.ingredientes || ''}</p>
                        ${preciosHTML}
                        <button class="AñadirCarrito" 
                                data-producto="${productoId}" 
                                data-precio="${precioCarrito}" 
                                data-nombre="${producto.nombre}"
                                ${!producto.disponible ? 'disabled' : ''}>
                            ${producto.disponible ? 'Añadir al carrito' : 'No disponible'}
                        </button>
                    `;
                    contenedorLicores.appendChild(div);
                });
            }
        }

        // ========== CERVEZAS ==========
        if (contenedorCervezas) {
            contenedorCervezas.innerHTML = '';
            const cervezas = productos.filter(producto => producto.categoria === "Cervezas");
            
            if (cervezas.length === 0) {
                contenedorCervezas.innerHTML = '<p style="color: #999;">No hay productos disponibles en esta categoría</p>';
            } else {
                cervezas.forEach(producto => {
                    const productoId = producto.id;
                    const precio = producto.precio || 0;
                    
                    const div = document.createElement('div');
                    div.className = 'producto';
                    div.innerHTML = `
                        <img src="${producto.imagenUrl || 'https://via.placeholder.com/200'}" 
                             alt="${producto.nombre}"
                             onerror="this.src='https://via.placeholder.com/200?text=Sin+Imagen'" />
                        <h4>${producto.nombre}</h4>
                        <p>${producto.ingredientes || ''}</p>
                        <span class="precio">$${precio.toLocaleString('es-CO')}</span>
                        <button class="AñadirCarrito" 
                                data-producto="${productoId}" 
                                data-precio="${precio}" 
                                data-nombre="${producto.nombre}"
                                ${!producto.disponible ? 'disabled' : ''}>
                            ${producto.disponible ? 'Añadir al carrito' : 'No disponible'}
                        </button>
                    `;
                    contenedorCervezas.appendChild(div);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error al cargar productos:', error.message);
        
        const mensajeError = '<p style="color: #ff4757; padding: 2rem;">Error al cargar los productos. Por favor, recarga la página o verifica la conexión con el servidor.</p>';
        
        if (contenedorCocteles) {
            contenedorCocteles.innerHTML = mensajeError;
        }
        if (contenedorLicores) {
            contenedorLicores.innerHTML = mensajeError;
        }
        if (contenedorCervezas) {
            contenedorCervezas.innerHTML = mensajeError;
        }
    }
}

// ========== GESTIÓN DEL CARRITO ==========

// Guardar el carrito en Local Storage
function guardarCarrito() {
    localStorage.setItem('carritoCompras', JSON.stringify(carritoCompras));
}

// Cargar el carrito de Local Storage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carritoCompras');
    if (carritoGuardado) {
        carritoCompras = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Actualizar el contador de productos en el menú
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

// AÑADIR PRODUCTO AL CARRITO
function añadirAlCarrito(productoId, precio, nombre) {
    const productoExistente = carritoCompras.find(item => item.id == productoId);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
        productoExistente.subtotal = productoExistente.precio * productoExistente.cantidad;
    } else {
        const nuevoProducto = {
            id: productoId,
            nombre: nombre,
            precio: parseFloat(precio) || 0,
            cantidad: 1,
            subtotal: parseFloat(precio) || 0
        };
        carritoCompras.push(nuevoProducto);
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarProductosEnCarrito();
    
    // Feedback visual
    console.log(`✅ Agregado: ${nombre} x1`);
}

// ELIMINAR PRODUCTO DEL CARRITO
function eliminarDelCarrito(productoId) {
    const indiceProducto = carritoCompras.findIndex(item => item.id == productoId);
    
    if (indiceProducto !== -1) {
        carritoCompras.splice(indiceProducto, 1);
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    }
}

// REDUCIR CANTIDAD
function reducirCantidad(productoId) {
    const producto = carritoCompras.find(item => item.id == productoId);
    
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

// CALCULAR TOTAL DEL CARRITO
function calcularTotalCarrito() {
    let totalGeneral = 0;
    
    carritoCompras.forEach(item => {
        const subtotal = item.subtotal || 0;
        totalGeneral += subtotal;
    });
    
    const elementoTotal = document.getElementById('total-carrito');
    if (elementoTotal) {
        elementoTotal.textContent = totalGeneral.toLocaleString('es-CO');
    }
    
    return totalGeneral;
}

// VACIAR EL CARRITO
function vaciarCarrito() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        carritoCompras = [];
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarProductosEnCarrito();
    }
}

// ========== MODAL DEL CLIENTE ==========

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

// ========== ENVÍO DEL PEDIDO AL SERVIDOR ==========

async function enviarformulario(event) {
    event.preventDefault();
    
    if (carritoCompras.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }

    const nombreCliente = document.getElementById('nombre-cliente').value.trim();
    const telefonoCliente = document.getElementById('telefono-cliente').value.trim();
    const direccionCliente = document.getElementById('direccion-cliente').value.trim();

    if (!nombreCliente || !telefonoCliente || !direccionCliente) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const productos = carritoCompras.map(item => ({
        id: parseInt(item.id),
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

    console.log("📦 Enviando pedido al servidor:", JSON.stringify(pedido, null, 2));

    // Mostrar spinner
    mostrarSpinner('Enviando tu pedido...');
    
    // Cerrar modal antes del spinner
    cerrarModalCliente();

    const API_URL = window.API_URL || 'http://localhost:8080/api';
    const urlPedidos = `${API_URL}/pedidos`;

    try {
        const response = await fetch(urlPedidos, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        });

        ocultarSpinner();

        if (response.ok) {
            const resultado = await response.json();
            console.log('✅ Pedido creado:', resultado);
            
            alert(`¡Pedido #${resultado.pedidoId} enviado con éxito!\n\nTotal: $${resultado.total.toLocaleString('es-CO')}\n\nGracias por tu compra.`);
            
            // Limpiar carrito
            carritoCompras = [];
            guardarCarrito();
            actualizarContadorCarrito();
            mostrarProductosEnCarrito();
            
            // Opcional: Redirigir a página de confirmación
            // window.location.href = 'confirmacion.html';
        } else {
            const error = await response.json();
            console.error('❌ Error del servidor:', error);
            alert('Error al procesar tu pedido: ' + (error.error || 'Inténtalo de nuevo'));
        }
    } catch (error) {
        ocultarSpinner();
        console.error('❌ Error de conexión:', error);
        alert('Error de conexión con el servidor. Verifica que el backend esté funcionando.');
    }
}

// ========== MOSTRAR PRODUCTOS EN LA PÁGINA DEL CARRITO ==========

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
            
            const precioValido = item.precio || 0;
            const subtotalValido = item.subtotal || 0;
            
            itemDiv.innerHTML = `
                <div class="info-producto">
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${precioValido.toLocaleString('es-CO')}</p>
                </div>
                <div class="controles-cantidad">
                    <button onclick="reducirCantidad('${item.id}')">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="añadirAlCarrito('${item.id}', ${precioValido}, '${item.nombre}')">+</button>
                </div>
                <div class="subtotal-producto">
                    <p>$${subtotalValido.toLocaleString('es-CO')}</p>
                    <button onclick="eliminarDelCarrito('${item.id}')" class="btn-eliminar">Eliminar</button>
                </div>
            `;
            
            listaProductos.appendChild(itemDiv);
        });
        
        calcularTotalCarrito();
    }
}

// ========== VERIFICAR DISPONIBILIDAD DE PRODUCTOS ==========

async function verificarDisponibilidad() {
    const API_URL = window.API_URL || 'http://localhost:8080/api';
    
    try {
        const response = await fetch(`${API_URL}/productos/disponibles`);
        
        if (!response.ok) {
            return true; // Si falla, permitir continuar
        }
        
        const disponibles = await response.json();
        const idsDisponibles = disponibles.map(p => p.id);
        
        const carritoValido = carritoCompras.every(item => 
            idsDisponibles.includes(parseInt(item.id))
        );
        
        if (!carritoValido) {
            alert('⚠️ Algunos productos en tu carrito ya no están disponibles. Por favor, revisa tu carrito.');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error verificando disponibilidad:', error);
        return true; // En caso de error, permitir continuar
    }
}

// ========== NAVEGACIÓN DINÁMICA SEGÚN ROL ==========

function actualizarNavegacion() {
    const username = sessionStorage.getItem('username');
    const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    
    const navList = document.querySelector('.barraNavegacion ul');
    const loginLink = navList ? navList.querySelector('a[href="login.html"]') : null;
    
    if (username && loginLink) {
        // Usuario logueado
        loginLink.textContent = `👤 ${username}`;
        loginLink.href = '#';
        loginLink.onclick = (e) => {
            e.preventDefault();
            mostrarMenuUsuario();
        };
        
        // Si es ADMIN, agregar enlace a gestión
        if (roles.includes('ADMIN') && navList) {
            // Verificar si ya existe el enlace
            const existeGestion = navList.querySelector('a[href="gestionPedidos.html"]');
            
            if (!existeGestion) {
                const adminLi = document.createElement('li');
                adminLi.innerHTML = '<a href="gestionPedidos.html">📋 Gestión</a>';
                navList.insertBefore(adminLi, loginLink.parentElement);
            }
        }
    }
}

function mostrarMenuUsuario() {
    if (confirm('¿Deseas cerrar sesión?')) {
        sessionStorage.clear();
        alert('Sesión cerrada correctamente');
        window.location.href = 'index.html';
    }
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎸 Rockxy - Sistema Iniciado');
    
    // Cargar carrito guardado
    cargarCarrito();
    
    // Cargar productos del backend
    mostrarCatalogoAPI();
    
    // Actualizar navegación según usuario
    actualizarNavegacion();
    
    // Event listener para botones de "Añadir al carrito"
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('AñadirCarrito')) {
            const productoId = e.target.getAttribute('data-producto');
            const precio = e.target.getAttribute('data-precio');
            const nombre = e.target.getAttribute('data-nombre');
            
            añadirAlCarrito(productoId, precio, nombre);
        }
    });
    
    // Mostrar productos en la página del carrito
    if (document.getElementById('lista-productos')) {
        mostrarProductosEnCarrito();
    }
    
    console.log('✅ Sistema listo');
});