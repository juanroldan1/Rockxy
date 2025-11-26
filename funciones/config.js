

// Detectar automáticamente el entorno
const API_URL = (() => {
    const hostname = window.location.hostname;
    
    // Desarrollo local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080/api';
    }
    
    return 'rockxy-production.up.railway.app';
})();

// Exportar globalmente
window.API_URL = API_URL;

// Log para debug
console.log('🔧 Configuración de API:');
console.log('   Hostname:', window.location.hostname);
console.log('   API URL:', API_URL);