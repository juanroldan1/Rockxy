package com.example.rockxy.service;

import com.example.rockxy.dtos.RegisterRequest;
import com.example.rockxy.model.Usuario;
import com.example.rockxy.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Registrar nuevo usuario
    public Usuario registrarUsuario(RegisterRequest request) {
        // Verificar si el usuario ya existe
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEmail(request.getEmail());
        usuario.setNombre(request.getNombre());
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());

        // Rol por defecto: USER
        Set<String> roles = new HashSet<>();
        roles.add("USER");
        usuario.setRoles(roles);

        return usuarioRepository.save(usuario);
    }

    // Obtener todos los usuarios (ADMIN)
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Obtener usuario por username
    public Usuario obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Actualizar perfil
    public Usuario actualizarPerfil(String username, Usuario datosActualizados) {
        Usuario usuario = obtenerPorUsername(username);

        if (datosActualizados.getNombre() != null) {
            usuario.setNombre(datosActualizados.getNombre());
        }
        if (datosActualizados.getEmail() != null) {
            usuario.setEmail(datosActualizados.getEmail());
        }
        if (datosActualizados.getTelefono() != null) {
            usuario.setTelefono(datosActualizados.getTelefono());
        }
        if (datosActualizados.getDireccion() != null) {
            usuario.setDireccion(datosActualizados.getDireccion());
        }

        return usuarioRepository.save(usuario);
    }

    // Cambiar contraseña
    public void cambiarPassword(String username, String nuevaPassword) {
        Usuario usuario = obtenerPorUsername(username);
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }
}