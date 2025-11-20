package com.example.rockxy.controllers;

import com.example.rockxy.dtos.PedidoRequest;
import com.example.rockxy.model.Pedido;
import com.example.rockxy.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = { "http://localhost:8080", "http://127.0.0.1:5500" })
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // POST - Crear pedido (autenticado o anónimo)
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody PedidoRequest pedidoRequest, Authentication authentication) {
        try {
            String username = (authentication != null) ? authentication.getName() : null;
            Pedido pedido = pedidoService.crearPedido(pedidoRequest, username);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pedido creado exitosamente");
            response.put("pedidoId", pedido.getId());
            response.put("total", pedido.getTotal());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear pedido: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET - Obtener todos los pedidos (SOLO ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Pedido>> obtenerTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodos());
    }

    // GET - Obtener pedidos del usuario autenticado
    @GetMapping("/mis-pedidos")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Pedido>> obtenerMisPedidos(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(pedidoService.obtenerPorUsuario(username));
    }

    // GET - Obtener pedido por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Pedido pedido = pedidoService.obtenerPorId(id);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // PUT - Cambiar estado del pedido (SOLO ADMIN)
    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String estadoStr = body.get("estado");
            Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(estadoStr);
            Pedido pedido = pedidoService.cambiarEstado(id, nuevoEstado);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Estado actualizado exitosamente");
            response.put("pedidoId", pedido.getId());
            response.put("nuevoEstado", pedido.getEstado());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Estado inválido. Use: PENDIENTE, EN_PROCESO, COMPLETADO, CANCELADO");
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}