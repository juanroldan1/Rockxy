package com.example.rockxy.controllers;

import com.example.rockxy.model.Producto;
import com.example.rockxy.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = { "http://localhost:8080", "http://127.0.0.1:5500" })
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // GET - Obtener todos los productos
    @GetMapping
    public ResponseEntity<List<Producto>> obtenerTodos() {
        return ResponseEntity.ok(productoService.obtenerTodos());
    }

    // GET - Obtener productos por categoría
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> obtenerPorCategoria(@PathVariable String categoria) {
        return ResponseEntity.ok(productoService.obtenerPorCategoria(categoria));
    }

    // GET - Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET - Obtener productos disponibles
    @GetMapping("/disponibles")
    public ResponseEntity<List<Producto>> obtenerDisponibles() {
        return ResponseEntity.ok(productoService.obtenerDisponibles());
    }

    // POST - Crear producto (SOLO ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            Producto nuevoProducto = productoService.crearProducto(producto);
            return ResponseEntity.ok(nuevoProducto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear producto: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT - Actualizar producto (SOLO ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        try {
            Producto productoActualizado = productoService.actualizarProducto(id, producto);
            return ResponseEntity.ok(productoActualizado);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // PUT - Cambiar disponibilidad (SOLO ADMIN)
    @PutMapping("/{id}/disponibilidad")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarDisponibilidad(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        try {
            Boolean disponible = body.get("disponible");
            Producto producto = productoService.cambiarDisponibilidad(id, disponible);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar producto (SOLO ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        try {
            productoService.eliminarProducto(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Producto eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar producto: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}