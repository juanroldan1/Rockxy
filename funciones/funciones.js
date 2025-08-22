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

// Clase Coctel
class Coctel {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  mostrarInfo() {
    console.log(`Este coctel es ${this.nombre} y cuesta ${this.precio}$.`);
  }
}

// Objetos de la clase Coctel
const Long_Island = new Coctel('Long Island', 37000);
const Margarita_Beer_Cereza = new Coctel('Margarita Beer Cereza', 35000);
const Jagger_Bomba = new Coctel('Jagger Bomba', 35000);
const Jagger_DRY = new Coctel('Jagger DRY', 30000);
const De_La_Casa = new Coctel('De La Casa', 30000);
const Gin_Tonic = new Coctel('Gin Tonic', 28000);
const Margarita = new Coctel('Margarita', 28000);
const Martini = new Coctel('Martini',28000);
const Mojito = new Coctel('Mojito', 28000);
const Cuba_Libre = new Coctel('Cuba Libre', 28000);
const Calle_65 = new Coctel('Calle 65', 28000);
const Dragon_Verde = new Coctel('Dragon Verde', 28000);
const Sunrise = new Coctel('Sunrise', 28000);
const Ruso = new Coctel('Ruso', 15000);
const Sin_Licor = new Coctel('Sin Licor', 22000);

// Clase Bebida con Alcohol
class Bebida {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  mostrarInfo() {
    console.log(`Esta bebida es ${this.nombre} y cuesta ${this.precio}$.`);
  }
}

const Whisky_Buchanans_Botella = new Bebida('Whisky Buchanans Botella', 360000);
const Whisky_Buchanans_media = new Bebida('Whisky Buchanans Media', 210000);
const Whiskey_Jack_Botella = new Bebida('Whisky Jack Daniels 007/ Honey/ Fire/ Apple Botella', 295000);
const Whiskey_Jack_Media = new Bebida('Whisky Jack Daniels 007/ Honey/ Fire/ Apple Media', 170000);
const Whisky_Jack_Shot = new Bebida('Whisky Jack Daniels 007/ Honey/ Fire/ Apple Shot', 25000);
const Whisky_Something_Special_Botella = new Bebida('Whisky Something Special Botella', 165000);
const Whisky_Something_Special_Media = new Bebida('Whisky Something Special Media', 110000);
const Whisky_Sello_Rojo_Botella = new Bebida('Whisky Sello Rojo Botella', 160000);
const Whisky_Sello_Rojo_Media = new Bebida('Whisky Sello Rojo Media', 100000);
const Whisky_Passport_Scotch_Botella = new Bebida('Whisky Passport Scotch Botella', 140000);
const Whisky_Passport_Scotch_Shot = new Bebida('Whisky Passport Scotch Shot', 20000);
const Crema_Whisky_Baileys_Shot = new Bebida('Crema de Whisky Baileys Shot', 20000);
const Jaggermeister_Botella = new Bebida('Jaggermeister Botella', 280000);
const Jaggermeister_Media = new Bebida('Jaggermeister Media', 165000);
const Jaggermeister_Shot = new Bebida("Jaggermeister Shot", 25000);
const Ginebra_Gordon_Botella = new Bebida('Ginebra Gordon Botella', 180000);
const Vodka_Absolut_Botella = new Bebida('Vodka Absolut Botella', 210000);
const Vodka_Absolut_Media = new Bebida('Vodka Absolut Media', 125000);
const Tequila_Jimador_Botella = new Bebida('Tequila Jimador Reposado Botella', 250000);
const Tequila_Jimador_Media = new Bebida('Tequila Jimador Reposado Media', 160000);
const Tequila_Jose_Cuervo_Botella = new Bebida('Tequila Jose Cuervo Especial Botella', 230000);
const Tequila_Jose_Cuervo_Media = new Bebida('Tequila Jose Cuervo Especial Media', 140000);
const Tequila_Jose_Cuervo_Shot = new Bebida('Tequila Jose Cuervo Especial Shot', 20000);
const Tequila_Olmeca_Botella = new Bebida('Tequila Olmeca Botella', 170000);
const Tequila_Olmeca_Media = new Bebida('Tequila Olmeca Media', 110000);
const Ron_Medellin_Botella = new Bebida('Ron Medellín Añejo Botella', 160000);
const Ron_Medellin_Media = new Bebida('Ron Medellín Añejo Media', 100000);
const Ron_Viejo_Caldas_Botella = new Bebida('Ron Viejo de Caldas Botella', 160000);
const Ron_Viejo_Caldas_Media = new Bebida('Ron Viejo de Caldas Media', 100000);
const Ron_Bacarcdi_Carta_Blanca_Botella = new Bebida('Ron Bacardi Carta Blanca Botella', 130000);
const Vino_Gato_Negro_Botella = new Bebida('Vino Tinto Gato Negro Botella', 100000);
const Vino_Gato_Negro_Media = new Bebida('Vino Tinto Gato Negro Media', 55000);
const Vino_Gato_Negro_Copa = new Bebida('Vino Tinto Gato Negro Copa', 30000);
const Aguardiente_Amarillo_Botella = new Bebida('Aguardiente Amarillo Botella', 160000);
const Aguardiente_Antioqueno_Azul_Botella = new Bebida('Aguardiente Antioqueño Azul Botella', 130000);
const Aguardiente_Antioqueno_Azul_Media = new Bebida('Aguardiente Antioqueño Azul Media', 80000);
const Aguardiente_Nectar_Verde_Botella = new Bebida('Aguardiente Nectar Verde Botella', 115000);
const Aguardiente_Nectar_Verde_Media = new Bebida('Aguardiente Nectar Verde Media', 70000);
const Aguardiente_Nectar_Verde_Shot = new Bebida('Aguardiente Nectar Verde Shot', 15000);
const Jarra_Litro_Poker = new Bebida('Jarra Litro Poker', 20000);
const Stella = new Bebida('Stella Artois', 17000);
const Corona = new Bebida('Corona 330ML', 13000);
const Club = new Bebida('Club Negra/Roja/Dorada 330ML', 9000);
const Aguila_Cero = new Bebida('Aguila Cero/Light', 9000);
const Aguila_Poker = new Bebida('Aguila/Poker 330ML', 7000);
const Budweiser = new Bebida('Budweiser 250ML', 7000);
const Michelar = new Bebida('Michelar Cerveza', 3000);
const Smirnoff_ICE = new Bebida('Smirnoff ICE', 20000);

// Clase Bebida Sin Alcohol
class Bebida_SA {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  mostrarInfo() {
    console.log(`Esta bebida es ${this.nombre} y cuesta ${this.precio}$.`);
  }
}

const Redbull = new Bebida("Redbull", 20000);
const Capuchino = new Bebida("Capuchino", 14000);
const Aromatica= new Bebida("Aromatica Frutos-Hierbas", 5000);
const Limonada_Cerezada = new Bebida("Limonada Cerezada", 9000);
const Limonada_Natural = new Bebida("Limonada Natural", 8000);
const Gaseosa = new Bebida("Gaseosa Bretaña", 8000);
const Agua = new Bebida("Agua con y sin gas", 5000);
const Tinto = new Bebida("Tinto", 20000);