package com.example.rockxy.dtos;

import java.util.List;

public class PedidoRequest {
    private String nombreCliente;
    private String telefonoCliente;
    private String direccionCliente;
    private List<ItemPedidoDTO> productos;
    private Double total;

    // Constructor vacío
    public PedidoRequest() {
    }

    // Getters y Setters
    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getTelefonoCliente() {
        return telefonoCliente;
    }

    public void setTelefonoCliente(String telefonoCliente) {
        this.telefonoCliente = telefonoCliente;
    }

    public String getDireccionCliente() {
        return direccionCliente;
    }

    public void setDireccionCliente(String direccionCliente) {
        this.direccionCliente = direccionCliente;
    }

    public List<ItemPedidoDTO> getProductos() {
        return productos;
    }

    public void setProductos(List<ItemPedidoDTO> productos) {
        this.productos = productos;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public static class ItemPedidoDTO {
        private Long id;
        private Integer cantidad;
        private Double precio;

        // Constructor vacío
        public ItemPedidoDTO() {
        }

        // Getters y Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }

        public Double getPrecio() {
            return precio;
        }

        public void setPrecio(Double precio) {
            this.precio = precio;
        }
    }
}