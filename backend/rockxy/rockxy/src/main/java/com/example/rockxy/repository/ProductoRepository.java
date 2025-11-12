package com.example.rockxy.repository;

import com.example.rockxy.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoria(String categoria);

    List<Producto> findByDisponible(Boolean disponible);
}