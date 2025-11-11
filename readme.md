# 🎸 Rockxy - Bar de Rock

Proyecto web completo para Rockxy, bar de rock en Chapinero, Bogotá.

## 📋 Descripción

Sistema de catálogo y carrito de compras con autenticación JWT y gestión de pedidos.

## 🏗️ Estructura del Proyecto

- **frontend/**: Aplicación web cliente (HTML, CSS, JavaScript)
- **backend/**: API REST con Spring Boot

## 👥 Equipo Desarrollador

- **Felipe Franco Jaime** - Código: 272153 - Backend Developer
- **Juan David Sanchez Roldán** - Código: 340321 - Frontend Developer

## 🚀 Instalación y Ejecución

### Backend

```bash
cd backend
./mvnw spring-boot:run
# El servidor estará en http://localhost:8080
```

### Frontend

```bash
cd frontend
# Abrir con Live Server en VS Code
# O servir con cualquier servidor HTTP
```

## 🔗 Endpoints Principales

- `GET /api/productos` - Listar productos
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/pedidos` - Crear pedido

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Backend**: Spring Boot 3.5, Java 21, H2 Database
- **Seguridad**: JWT, Spring Security
