package com.example.rockxy;

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

    private double precio;
    private double precioBotella;
    private double precioShot;
    private double precioMedia;

    // constructor vacio
    public Producto() {

    }

    public Producto(String nombre, String categoria, String ingredientes, String imagen, double precio,
            double precioBotella, double precioShot, double precioMedia) {
        this.nombre = nombre;
        this.categoria = categoria;
        this.ingredientes = ingredientes;
        this.imagen = imagen;
        this.precio = precio;
        this.precioBotella = precioBotella;
        this.precioShot = precioShot;
        this.precioMedia = precioMedia;
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

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public double getPrecioBotella() {
        return precioBotella;
    }

    public void setPrecioBotella(double precioBotella) {
        this.precioBotella = precioBotella;
    }

    public double getPrecioShot() {
        return precioShot;
    }

    public void setPrecioShot(double precioShot) {
        this.precioShot = precioShot;
    }

    public double getPrecioMedia() {
        return precioMedia;
    }

    public void setPrecioMedia(double precioMedia) {
        this.precioMedia = precioMedia;
    }

}
