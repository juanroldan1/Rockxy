package com.example.rockxy;

import com.example.rockxy.model.Producto;
import com.example.rockxy.model.Usuario;
import com.example.rockxy.repository.ProductoRepository;
import com.example.rockxy.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario admin si no existe
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@rockxy.com");
            admin.setNombre("Administrador Rockxy");
            admin.setTelefono("3001234567");
            admin.setDireccion("Rockxy Bar - Chapinero");

            Set<String> rolesAdmin = new HashSet<>();
            rolesAdmin.add("ADMIN");
            rolesAdmin.add("USER");
            admin.setRoles(rolesAdmin);

            usuarioRepository.save(admin);
            System.out.println("✅ Usuario ADMIN creado - Username: admin, Password: admin123");
        }

        // Crear usuario de prueba si no existe
        if (!usuarioRepository.existsByUsername("testuser")) {
            Usuario testUser = new Usuario();
            testUser.setUsername("testuser");
            testUser.setPassword(passwordEncoder.encode("123456"));
            testUser.setEmail("test@rockxy.com");
            testUser.setNombre("Usuario de Prueba");
            testUser.setTelefono("3009876543");
            testUser.setDireccion("Calle 72 #10-20");

            Set<String> rolesUser = new HashSet<>();
            rolesUser.add("USER");
            testUser.setRoles(rolesUser);

            usuarioRepository.save(testUser);
            System.out.println("✅ Usuario TEST creado - Username: testuser, Password: 123456");
        }

        // Crear productos de prueba si no existen
        if (productoRepository.count() == 0) {
            // Cócteles
            Producto mojito = new Producto();
            mojito.setNombre("Mojito");
            mojito.setCategoria("Coctelería");
            mojito.setIngredientes("Ron blanco, menta, limón, azúcar, soda");
            mojito.setPrecio(18000.0);
            mojito.setDisponible(true);
            productoRepository.save(mojito);

            Producto margarita = new Producto();
            margarita.setNombre("Margarita");
            margarita.setCategoria("Coctelería");
            margarita.setIngredientes("Tequila, triple sec, limón");
            margarita.setPrecio(20000.0);
            margarita.setDisponible(true);
            productoRepository.save(margarita);

            Producto pinaColada = new Producto();
            pinaColada.setNombre("Piña Colada");
            pinaColada.setCategoria("Coctelería");
            pinaColada.setIngredientes("Ron, crema de coco, jugo de piña");
            pinaColada.setPrecio(22000.0);
            pinaColada.setDisponible(true);
            productoRepository.save(pinaColada);

            // Licores
            Producto whisky = new Producto();
            whisky.setNombre("Whisky Jack Daniels");
            whisky.setCategoria("Licores");
            whisky.setIngredientes("Whisky Tennessee");
            whisky.setPrecioBotella(180000.0);
            whisky.setPrecioShot(15000.0);
            whisky.setPrecioMedia(25000.0);
            whisky.setDisponible(true);
            productoRepository.save(whisky);

            Producto vodka = new Producto();
            vodka.setNombre("Vodka Absolut");
            vodka.setCategoria("Licores");
            vodka.setIngredientes("Vodka premium");
            vodka.setPrecioBotella(150000.0);
            vodka.setPrecioShot(12000.0);
            vodka.setPrecioMedia(20000.0);
            vodka.setDisponible(true);
            productoRepository.save(vodka);

            Producto ron = new Producto();
            ron.setNombre("Ron Viejo de Caldas");
            ron.setCategoria("Licores");
            ron.setIngredientes("Ron colombiano");
            ron.setPrecioBotella(120000.0);
            ron.setPrecioShot(10000.0);
            ron.setPrecioMedia(18000.0);
            ron.setDisponible(true);
            productoRepository.save(ron);

            // Cervezas
            Producto coronaExtra = new Producto();
            coronaExtra.setNombre("Corona Extra");
            coronaExtra.setCategoria("Cervezas");
            coronaExtra.setIngredientes("Cerveza premium mexicana");
            coronaExtra.setPrecio(8000.0);
            coronaExtra.setDisponible(true);
            productoRepository.save(coronaExtra);

            Producto poker = new Producto();
            poker.setNombre("Poker");
            poker.setCategoria("Cervezas");
            poker.setIngredientes("Cerveza colombiana");
            poker.setPrecio(4500.0);
            poker.setDisponible(true);
            productoRepository.save(poker);

            Producto club = new Producto();
            club.setNombre("Club Colombia");
            club.setCategoria("Cervezas");
            club.setIngredientes("Cerveza premium colombiana");
            club.setPrecio(6000.0);
            club.setDisponible(true);
            productoRepository.save(club);

            System.out.println("✅ Productos de prueba creados: " + productoRepository.count() + " productos");
        }

        System.out.println("=================================================");
        System.out.println("🎸 ROCKXY API - Sistema iniciado correctamente 🎸");
        System.out.println("=================================================");
        System.out.println("Total usuarios: " + usuarioRepository.count());
        System.out.println("Total productos: " + productoRepository.count());
        System.out.println("=================================================");
    }
}