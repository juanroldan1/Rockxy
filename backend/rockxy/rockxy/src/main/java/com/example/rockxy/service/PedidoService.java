package main.java.com.example.rockxy.service;

import com.example.rockxy.dto.PedidoRequest;
import com.example.rockxy.model.ItemPedido;
import com.example.rockxy.model.Pedido;
import com.example.rockxy.model.Producto;
import com.example.rockxy.model.Usuario;
import com.example.rockxy.repository.PedidoRepository;
import com.example.rockxy.repository.ProductoRepository;
import com.example.rockxy.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear pedido
    @Transactional
    public Pedido crearPedido(PedidoRequest request, String username) {
        // Buscar usuario (opcional, si está autenticado)
        Usuario usuario = null;
        if (username != null) {
            usuario = usuarioRepository.findByUsername(username).orElse(null);
        }

        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setNombreCliente(request.getNombreCliente());
        pedido.setTelefonoCliente(request.getTelefonoCliente());
        pedido.setDireccionCliente(request.getDireccionCliente());
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);

        // Calcular total y crear items
        double total = 0.0;

        for (PedidoRequest.ItemPedidoDTO itemDTO : request.getProductos()) {
            Producto producto = productoRepository.findById(itemDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemDTO.getId()));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemDTO.getCantidad());
            item.setPrecioUnitario(itemDTO.getPrecio());
            item.setSubtotal(itemDTO.getPrecio() * itemDTO.getCantidad());

            pedido.getItems().add(item);
            total += item.getSubtotal();
        }

        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    // Obtener todos los pedidos (ADMIN)
    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    // Obtener pedidos por usuario
    public List<Pedido> obtenerPorUsuario(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return pedidoRepository.findByUsuarioId(usuario.getId());
    }

    // Obtener pedido por ID
    public Pedido obtenerPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    // Cambiar estado del pedido
    public Pedido cambiarEstado(Long id, Pedido.EstadoPedido nuevoEstado) {
        Pedido pedido = obtenerPorId(id);
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }
}