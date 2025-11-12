package com.example.rockxy.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String categoria;
    private String ingredientes;
    private String imagen;

    private Double precio;
    private Double precioBotella;
    private Double precioShot;
    private Double precioMedia;

    @Column(nullable = false)
    private Boolean disponible = true;

    // Constructor vacío
    public Producto() {
    }

    // Constructor con parámetros básicos
    public Producto(String nombre, String categoria, Double precio) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(String ingredientes) {
        this.ingredientes = ingredientes;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Double getPrecioBotella() {
        return precioBotella;
    }

    public void setPrecioBotella(Double precioBotella) {
        this.precioBotella = precioBotella;
    }

    public Double getPrecioShot() {
        return precioShot;
    }

    public void setPrecioShot(Double precioShot) {
        this.precioShot = precioShot;
    }

    public Double getPrecioMedia() {
        return precioMedia;
    }

    public void setPrecioMedia(Double precioMedia) {
        this.precioMedia = precioMedia;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
}