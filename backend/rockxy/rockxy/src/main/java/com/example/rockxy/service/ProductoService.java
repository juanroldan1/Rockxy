package com.example.rockxy.service;

import com.example.rockxy.model.Producto;
import com.example.rockxy.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Obtener todos los productos
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    // Obtener productos por categoría
    public List<Producto> obtenerPorCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria);
    }

    // Obtener producto por ID
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    // Crear nuevo producto
    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    // Actualizar producto
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(productoActualizado.getNombre());
                    producto.setCategoria(productoActualizado.getCategoria());
                    producto.setIngredientes(productoActualizado.getIngredientes());
                    producto.setImagenUrl(productoActualizado.getImagenUrl());
                    producto.setPrecio(productoActualizado.getPrecio());
                    producto.setPrecioBotella(productoActualizado.getPrecioBotella());
                    producto.setPrecioShot(productoActualizado.getPrecioShot());
                    producto.setPrecioMedia(productoActualizado.getPrecioMedia());
                    producto.setDisponible(productoActualizado.getDisponible());
                    return productoRepository.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    // Eliminar producto
    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    // Cambiar disponibilidad
    public Producto cambiarDisponibilidad(Long id, Boolean disponible) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setDisponible(disponible);
                    return productoRepository.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // Buscar productos disponibles
    public List<Producto> obtenerDisponibles() {
        return productoRepository.findByDisponible(true);
    }
}