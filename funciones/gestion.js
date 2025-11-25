// ====================================================
// SISTEMA DE GESTIÓN DE PEDIDOS - ROCKXY
// ====================================================

const API_URL = 'http://localhost:8080/api';
let todosLosPedidos = [];
let pedidosFiltrados = [];

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

// ========== VERIFICAR AUTENTICACIÓN ==========
function verificarAcceso() {
    const token = sessionStorage.getItem('token');
    const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
    
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página');
        window.location.href = 'login.html';
        return false;
    }
    
    // Verificar que sea ADMIN
    if (!roles.includes('ADMIN')) {
        alert('No tienes permisos de administrador para acceder a esta página');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// ========== CARGAR PEDIDOS ==========
async function cargarPedidos() {
    const token = sessionStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    mostrarSpinner('Cargando pedidos...');
    
    try {
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 403 || response.status === 401) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            window.location.href = 'login.html';
            return;
        }
        
        if (response.ok) {
            todosLosPedidos = await response.json();
            pedidosFiltrados = [...todosLosPedidos];
            
            console.log('✅ Pedidos cargados:', todosLosPedidos.length);
            
            actualizarEstadisticas();
            mostrarPedidos(pedidosFiltrados);
        } else {
            console.error('❌ Error al cargar pedidos:', response.status);
            alert('Error al cargar los pedidos');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error de conexión. Verifica que el backend esté corriendo.');
    } finally {
        ocultarSpinner();
    }
}

// ========== ACTUALIZAR ESTADÍSTICAS ==========
function actualizarEstadisticas() {
    const pendientes = todosLosPedidos.filter(p => p.estado === 'PENDIENTE').length;
    const enProceso = todosLosPedidos.filter(p => p.estado === 'EN_PROCESO').length;
    const completados = todosLosPedidos.filter(p => p.estado === 'COMPLETADO').length;
    const total = todosLosPedidos.length;
    
    document.getElementById('total-pendientes').textContent = pendientes;
    document.getElementById('total-proceso').textContent = enProceso;
    document.getElementById('total-completados').textContent = completados;
    document.getElementById('total-pedidos').textContent = total;
}

// ========== MOSTRAR PEDIDOS ==========
function mostrarPedidos(pedidos) {
    const container = document.getElementById('lista-pedidos');
    
    if (!container) return;
    
    if (pedidos.length === 0) {
        container.innerHTML = `
            <div class="sin-pedidos">
                <h3>No hay pedidos que mostrar</h3>
                <p>No se encontraron pedidos con los filtros seleccionados</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    // Ordenar por fecha (más recientes primero)
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    pedidos.forEach(pedido => {
        const pedidoCard = crearTarjetaPedido(pedido);
        container.appendChild(pedidoCard);
    });
}

// ========== CREAR TARJETA DE PEDIDO ==========
function crearTarjetaPedido(pedido) {
    const div = document.createElement('div');
    div.className = 'pedido-card';
    
    const fecha = new Date(pedido.fecha).toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const estadoClass = {
        'PENDIENTE': 'estado-pendiente',
        'EN_PROCESO': 'estado-proceso',
        'COMPLETADO': 'estado-completado',
        'CANCELADO': 'estado-cancelado'
    }[pedido.estado] || '';
    
    const nombreUsuario = pedido.usuario ? pedido.usuario.nombre : 'Cliente Anónimo';
    const usernameUsuario = pedido.usuario ? `(@${pedido.usuario.username})` : '';
    
    div.innerHTML = `
        <div class="pedido-header">
            <div>
                <h3>Pedido #${pedido.id}</h3>
                <p class="pedido-fecha">📅 ${fecha}</p>
            </div>
            <span class="pedido-estado ${estadoClass}">${pedido.estado.replace('_', ' ')}</span>
        </div>
        
        <div class="pedido-body">
            <div class="pedido-info">
                <p><strong>👤 Cliente:</strong> ${pedido.nombreCliente} ${usernameUsuario}</p>
                <p><strong>📱 Teléfono:</strong> ${pedido.telefonoCliente}</p>
                <p><strong>📍 Dirección:</strong> ${pedido.direccionCliente}</p>
                <p><strong>🛍️ Total:</strong> <span class="pedido-total">$${pedido.total.toLocaleString()}</span></p>
            </div>
        </div>
        
        <div class="pedido-actions">
            <button class="btn-detalle" onclick="verDetallePedido(${pedido.id})">👁️ Ver Detalles</button>
            
            ${pedido.estado === 'PENDIENTE' ? 
                `<button class="btn-proceso" onclick="cambiarEstado(${pedido.id}, 'EN_PROCESO')">▶️ Marcar En Proceso</button>` : ''}
            
            ${pedido.estado === 'EN_PROCESO' ? 
                `<button class="btn-completar" onclick="cambiarEstado(${pedido.id}, 'COMPLETADO')">✅ Marcar Completado</button>` : ''}
            
            ${pedido.estado !== 'CANCELADO' && pedido.estado !== 'COMPLETADO' ? 
                `<button class="btn-cancelar" onclick="confirmarCancelar(${pedido.id})">❌ Cancelar</button>` : ''}
        </div>
    `;
    
    return div;
}

// ========== FILTRAR PEDIDOS ==========
function filtrarPedidos() {
    const filtroEstado = document.getElementById('filtro-estado').value;
    const filtroCliente = document.getElementById('filtro-cliente').value.toLowerCase();
    
    pedidosFiltrados = todosLosPedidos.filter(pedido => {
        const cumpleEstado = filtroEstado === 'TODOS' || pedido.estado === filtroEstado;
        const cumpleCliente = pedido.nombreCliente.toLowerCase().includes(filtroCliente);
        
        return cumpleEstado && cumpleCliente;
    });
    
    mostrarPedidos(pedidosFiltrados);
}

// ========== CAMBIAR ESTADO DEL PEDIDO ==========
async function cambiarEstado(pedidoId, nuevoEstado) {
    const token = sessionStorage.getItem('token');
    
    if (!confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado.replace('_', ' ')}?`)) {
        return;
    }
    
    mostrarSpinner('Actualizando estado...');
    
    try {
        const response = await fetch(`${API_URL}/pedidos/${pedidoId}/estado`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (response.ok) {
            console.log('✅ Estado actualizado');
            alert('Estado actualizado correctamente');
            await cargarPedidos();
        } else {
            alert('Error al actualizar el estado');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error de conexión');
    } finally {
        ocultarSpinner();
    }
}

// ========== CONFIRMAR CANCELACIÓN ==========
function confirmarCancelar(pedidoId) {
    if (confirm('⚠️ ¿Estás seguro de CANCELAR este pedido?\n\nEsta acción no se puede deshacer.')) {
        cambiarEstado(pedidoId, 'CANCELADO');
    }
}

// ========== VER DETALLE DEL PEDIDO ==========
async function verDetallePedido(pedidoId) {
    const token = sessionStorage.getItem('token');
    
    mostrarSpinner('Cargando detalles...');
    
    try {
        const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const pedido = await response.json();
            mostrarModalDetalle(pedido);
        } else {
            alert('Error al cargar los detalles del pedido');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error de conexión');
    } finally {
        ocultarSpinner();
    }
}

// ========== MOSTRAR MODAL CON DETALLES ==========
function mostrarModalDetalle(pedido) {
    const modal = document.getElementById('modal-detalle');
    const container = document.getElementById('detalle-pedido');
    
    if (!modal || !container) return;
    
    const fecha = new Date(pedido.fecha).toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let itemsHTML = '';
    if (pedido.items && pedido.items.length > 0) {
        itemsHTML = `
            <div class="items-pedido">
                <h3>Productos del Pedido:</h3>
                ${pedido.items.map(item => `
                    <div class="item-detalle">
                        <p><strong>${item.producto.nombre}</strong></p>
                        <p>Cantidad: ${item.cantidad} x $${item.precioUnitario.toLocaleString()}</p>
                        <p class="item-subtotal">Subtotal: $${item.subtotal.toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="detalle-info">
            <p><strong>Pedido #:</strong> ${pedido.id}</p>
            <p><strong>Estado:</strong> <span class="estado-${pedido.estado.toLowerCase()}">${pedido.estado.replace('_', ' ')}</span></p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <hr>
            <p><strong>Cliente:</strong> ${pedido.nombreCliente}</p>
            <p><strong>Teléfono:</strong> ${pedido.telefonoCliente}</p>
            <p><strong>Dirección:</strong> ${pedido.direccionCliente}</p>
            ${pedido.usuario ? `<p><strong>Usuario registrado:</strong> ${pedido.usuario.username}</p>` : ''}
            <hr>
            ${itemsHTML}
            <hr>
            <p class="total-detalle"><strong>TOTAL:</strong> $${pedido.total.toLocaleString()}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// ========== CERRAR MODAL ==========
function cerrarModalDetalle() {
    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modal-detalle');
    if (event.target === modal) {
        cerrarModalDetalle();
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Verificar acceso
    if (!verificarAcceso()) {
        return;
    }
    
    // Cargar pedidos
    cargarPedidos();
    
    // Recargar cada 30 segundos
    setInterval(cargarPedidos, 30000);
    
    console.log('🎸 Sistema de Gestión de Pedidos - Rockxy');
    console.log('👤 Usuario:', sessionStorage.getItem('username'));
});