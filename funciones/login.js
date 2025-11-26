// URL del backend - CAMBIAR en producción
const API_URL = window.API_URL || 'http://localhost:8080/api';

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

// ========== FUNCIONES DE MENSAJES ==========
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function mostrarExito(mensaje) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = mensaje;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========

function guardarToken(token) {
    sessionStorage.setItem('token', token);
}

function obtenerToken() {
    return sessionStorage.getItem('token');
}

function eliminarToken() {
    sessionStorage.removeItem('token');
}

function estaAutenticado() {
    return obtenerToken() !== null;
}

// ========== LOGIN ==========
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }
    
    mostrarSpinner('Iniciando sesión...');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        ocultarSpinner();
        
        if (response.ok) {
            // ✅ Guardar token y datos del usuario
            guardarToken(data.token);
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('roles', JSON.stringify(data.roles));
            
            console.log('✅ Login exitoso:', data);
            console.log('👤 Usuario:', data.username);
            console.log('🔑 Roles:', data.roles);
            
            // ✅ Redireccionar según el rol
            if (data.roles.includes('ADMIN')) {
                alert('Bienvenido Administrador!');
                window.location.href = 'index.html'; // Cambia a admin.html si tienes esa página
            } else {
                alert('Bienvenido ' + data.username);
                window.location.href = 'index.html';
            }
        } else {
            mostrarError(data.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        ocultarSpinner();
        console.error('Error en login:', error);
        mostrarError('Error de conexión. Verifica que el backend esté corriendo en http://localhost:8080');
    }
}

// ========== REGISTRO ==========
async function handleRegister(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    
    if (!nombre || !username || !email || !password) {
        mostrarError('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    mostrarSpinner('Registrando usuario...');
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                username,
                email,
                password,
                telefono,
                direccion
            })
        });
        
        const data = await response.json();
        
        ocultarSpinner();
        
        if (response.ok) {
            mostrarExito('¡Registro exitoso! Redirigiendo al login...');
            document.getElementById('register-form').reset();
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarError(data.error || 'Error al registrar usuario');
        }
    } catch (error) {
        ocultarSpinner();
        console.error('❌ Error en registro:', error);
        mostrarError('Error de conexión. Verifica que el backend esté corriendo.');
    }
}

// ========== LOGOUT ==========
function logout() {
    eliminarToken();
    sessionStorage.clear();
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html';
}

// ========== VERIFICAR AUTENTICACIÓN ==========
async function verificarAutenticacion() {
    const token = obtenerToken();
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.authenticated;
        } else {
            eliminarToken();
            return false;
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

// ========== OBTENER PERFIL DEL USUARIO ==========
async function obtenerPerfil() {
    const token = obtenerToken();
    
    if (!token) {
        console.error('No hay token de autenticación');
        return null;
    }
    
    try {
        const response = await fetch(`${API_URL}/usuarios/perfil`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const usuario = await response.json();
            console.log('✅ Perfil obtenido:', usuario);
            return usuario;
        } else {
            console.error('❌ Error obteniendo perfil:', response.status);
            return null;
        }
    } catch (error) {
        console.error('❌ Error en obtenerPerfil:', error);
        return null;
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si está en una página que requiere autenticación
    const paginasProtegidas = ['admin.html', 'perfil.html'];
    const paginaActual = window.location.pathname.split('/').pop();
    
    if (paginasProtegidas.includes(paginaActual)) {
        verificarAutenticacion().then(autenticado => {
            if (!autenticado) {
                alert('Debes iniciar sesión para acceder a esta página');
                window.location.href = 'login.html';
            }
        });
    }
    
    // ✅ Mostrar información del usuario si está logueado
    const username = sessionStorage.getItem('username');
    if (username) {
        console.log('👤 Usuario actual:', username);
        const roles = JSON.parse(sessionStorage.getItem('roles') || '[]');
        console.log('🔑 Roles:', roles);
    }
});

// ========== FUNCIONES DE MENSAJES ==========
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function mostrarExito(mensaje) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = mensaje;
        successDiv.style.display = 'block';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========

// Guardar token en sessionStorage
function guardarToken(token) {
    sessionStorage.setItem('token', token);
}

// Obtener token
function obtenerToken() {
    return sessionStorage.getItem('token');
}

// Eliminar token
function eliminarToken() {
    sessionStorage.removeItem('token');
}

// Verificar si está autenticado
function estaAutenticado() {
    return obtenerToken() !== null;
}

// ========== LOGIN ==========
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        mostrarError('Por favor completa todos los campos');
        return;
    }
    
    mostrarSpinner('Iniciando sesión...');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        ocultarSpinner();
        
        if (response.ok) {
            // Guardar token
            guardarToken(data.token);
            
            // Guardar información del usuario
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('roles', JSON.stringify(data.roles));
            
            console.log('Login exitoso:', data);
            
            // Redireccionar según el rol
            if (data.roles.includes('ADMIN')) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            mostrarError(data.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        ocultarSpinner();
        console.error('Error en login:', error);
        mostrarError('Error de conexión. Por favor, intenta de nuevo.');
    }
}

// ========== REGISTRO ==========
async function handleRegister(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    
    if (!nombre || !username || !email || !password) {
        mostrarError('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    mostrarSpinner('Registrando usuario...');
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                username,
                email,
                password,
                telefono,
                direccion
            })
        });
        
        const data = await response.json();
        
        ocultarSpinner();
        
        if (response.ok) {
            mostrarExito('¡Registro exitoso! Redirigiendo al login...');
            
            // Limpiar formulario
            document.getElementById('register-form').reset();
            
            // Redireccionar al login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            mostrarError(data.error || 'Error al registrar usuario');
        }
    } catch (error) {
        ocultarSpinner();
        console.error('Error en registro:', error);
        mostrarError('Error de conexión. Por favor, intenta de nuevo.');
    }
}

// ========== LOGOUT ==========
function logout() {
    eliminarToken();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ========== VERIFICAR AUTENTICACIÓN ==========
async function verificarAutenticacion() {
    const token = obtenerToken();
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.authenticated;
        } else {
            eliminarToken();
            return false;
        }
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si está en una página que requiere autenticación
    const paginasProtegidas = ['admin.html', 'perfil.html'];
    const paginaActual = window.location.pathname.split('/').pop();
    
    if (paginasProtegidas.includes(paginaActual)) {
        verificarAutenticacion().then(autenticado => {
            if (!autenticado) {
                alert('Debes iniciar sesión para acceder a esta página');
                window.location.href = 'login.html';
            }
        });
    }
});