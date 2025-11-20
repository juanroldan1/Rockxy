
package com.example.rockxy.controllers;

import com.example.rockxy.model.Usuario;
import com.example.rockxy.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = { "http://localhost:8080", "http://127.0.0.1:5500" })
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // GET - Obtener todos los usuarios (SOLO ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // GET - Obtener perfil del usuario autenticado
    @GetMapping("/perfil")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> obtenerPerfil(Authentication authentication) {
        try {
            String username = authentication.getName();
            Usuario usuario = usuarioService.obtenerPorUsername(username);

            // No enviar la contraseña al frontend
            usuario.setPassword(null);

            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // PUT - Actualizar perfil del usuario
    @PutMapping("/perfil")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> actualizarPerfil(@RequestBody Usuario datosActualizados, Authentication authentication) {
        try {
            String username = authentication.getName();
            Usuario usuario = usuarioService.actualizarPerfil(username, datosActualizados);

            // No enviar la contraseña
            usuario.setPassword(null);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Perfil actualizado exitosamente");
            response.put("usuario", usuario);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // PUT - Cambiar contraseña
    @PutMapping("/cambiar-password")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String username = authentication.getName();
            String nuevaPassword = body.get("nuevaPassword");

            if (nuevaPassword == null || nuevaPassword.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "La nueva contraseña es requerida");
                return ResponseEntity.badRequest().body(error);
            }

            usuarioService.cambiarPassword(username, nuevaPassword);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Contraseña cambiada exitosamente");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // GET - Obtener usuario por username (SOLO ADMIN)
    @GetMapping("/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerPorUsername(@PathVariable String username) {
        try {
            Usuario usuario = usuarioService.obtenerPorUsername(username);
            usuario.setPassword(null); // No enviar contraseña
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}