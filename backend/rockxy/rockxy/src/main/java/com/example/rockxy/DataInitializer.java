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
             Producto longBeach = new Producto();
            longBeach.setNombre("Long beach");
            longBeach.setCategoria("Coctelería");
            longBeach.setIngredientes("Tequila - Ron - Ginebra - Vodka - Limón - Coca Cola - Sirope - Triple sec");
            longBeach.setPrecio(37000.0);
            longBeach.setDisponible(true);
            longBeach.setImagenUrl("https://www.supergoldenbakes.com/wordpress/wp-content/uploads/2019/07/Long_island_iced_tea-1-4s.jpg");
            productoRepository.save(longBeach);

            // Margarita Beer Cereza
            Producto margaritaBeerCereza = new Producto();
            margaritaBeerCereza.setNombre("Margarita Beer Cereza");
            margaritaBeerCereza.setCategoria("Coctelería");
            margaritaBeerCereza.setIngredientes("Compuesto Tequila - Cereza - Limón en una Corona");
            margaritaBeerCereza.setPrecio(35000.0);
            margaritaBeerCereza.setDisponible(true);
            margaritaBeerCereza.setImagenUrl("https://realhousemoms.com/wp-content/uploads/Cherry-Beer-Margaritas-IC-3.jpg");
            productoRepository.save(margaritaBeerCereza);

            // Jagger Bomba
            Producto jaggerBomba = new Producto();
            jaggerBomba.setNombre("Jagger Bomba");
            jaggerBomba.setCategoria("Coctelería");
            jaggerBomba.setIngredientes("Jäggermeister - RedBull");
            jaggerBomba.setPrecio(35000.0);
            jaggerBomba.setDisponible(true);
            jaggerBomba.setImagenUrl("https://sugarandcloth.com/wp-content/uploads/2023/05/Jagger-bomb-recipe-8-scaled.jpg");
            productoRepository.save(jaggerBomba);

            // Jagger DRY
            Producto jaggerDRY = new Producto();
            jaggerDRY.setNombre("Jagger DRY");
            jaggerDRY.setCategoria("Coctelería");
            jaggerDRY.setIngredientes("Jäggermeister - Ginger - Limón");
            jaggerDRY.setPrecio(30000.0);
            jaggerDRY.setDisponible(true);
            jaggerDRY.setImagenUrl("https://i0.wp.com/onthesauceagain.com/wp-content/uploads/2017/10/jagermeister-lcw1.jpg?resize=709%2C471&ssl=1");
            productoRepository.save(jaggerDRY);

            // De La Casa
            Producto deLaCasa = new Producto();
            deLaCasa.setNombre("De La Casa");
            deLaCasa.setCategoria("Coctelería");
            deLaCasa.setIngredientes("Base de Whisky - Naranja - Coca Cola");
            deLaCasa.setPrecio(30000.0);
            deLaCasa.setDisponible(true);
            productoRepository.save(deLaCasa);

            // Gin Tonic
            Producto ginTonic = new Producto();
            ginTonic.setNombre("Gin Tonic");
            ginTonic.setCategoria("Coctelería");
            ginTonic.setIngredientes("Ginebra - Agua Tónica - Frutos");
            ginTonic.setPrecio(28000.0);
            ginTonic.setDisponible(true);
            ginTonic.setImagenUrl("https://www.thespruceeats.com/thmb/0noKFvArOC2N2Eg4pA7uwc0bC30=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gin-and-tonic-recipe-759300-hero-01-aa12e6504f944c54b8b9c589cc1d0ac6.jpg");
            productoRepository.save(ginTonic);

            // Margarita
            Producto margarita = new Producto();
            margarita.setNombre("Margarita");
            margarita.setCategoria("Coctelería");
            margarita.setIngredientes("Tequila - Triple Sec - (opción Fresa o Blue)");
            margarita.setPrecio(28000.0);
            margarita.setDisponible(true);
            margarita.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNFSw2s2Eogeo_DqufWxgTFrsSRzW7DZpBIw&s");
            productoRepository.save(margarita);

            // Martini
            Producto martini = new Producto();
            martini.setNombre("Martini");
            martini.setCategoria("Coctelería");
            martini.setIngredientes("Vodka con un chorro de Vermount Seco y Aceituna");
            martini.setPrecio(28000.0);
            martini.setDisponible(true);
            martini.setImagenUrl("https://www.splashoftaste.com/wp-content/uploads/2022/05/dirty-martini-featured.jpg");
            productoRepository.save(martini);

            // Mojito
            Producto mojito = new Producto();
            mojito.setNombre("Mojito");
            mojito.setCategoria("Coctelería");
            mojito.setIngredientes("Ron Blanco - Cítricos - Soda (opción Blue)");
            mojito.setPrecio(28000.0);
            mojito.setDisponible(true);
            mojito.setImagenUrl("https://images.immediate.co.uk/production/volatile/sites/30/2020/08/mojito-cocktails-150961e.jpg");
            productoRepository.save(mojito);

            // Cuba Libre
            Producto cubaLibre = new Producto();
            cubaLibre.setNombre("Cuba Libre");
            cubaLibre.setCategoria("Coctelería");
            cubaLibre.setIngredientes("Compuesto Ron - Limón - Coca Cola");
            cubaLibre.setPrecio(28000.0);
            cubaLibre.setDisponible(true);
            cubaLibre.setImagenUrl("https://www.liquor.com/thmb/cpSgrrmR7SDnFDfvI150WYsF-Fo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__liquor__2018__01__02105149__Cuba-Libre-720x720-recipe-673b48bbef034d89b6b5149b8417c7d5.jpg");
            productoRepository.save(cubaLibre);

            // Calle 65
            Producto calle65 = new Producto();
            calle65.setNombre("Calle 65");
            calle65.setCategoria("Coctelería");
            calle65.setIngredientes("Compuesto Vino Tinto - Coca Cola - Naranja");
            calle65.setPrecio(28000.0);
            calle65.setDisponible(true);
            productoRepository.save(calle65);

            // Dragon Verde
            Producto dragonVerde = new Producto();
            dragonVerde.setNombre("Dragon Verde");
            dragonVerde.setCategoria("Coctelería");
            dragonVerde.setIngredientes("Compuesto Vodka - menta - Triple Sec");
            dragonVerde.setPrecio(28000.0);
            dragonVerde.setDisponible(true);
            dragonVerde.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRmHF74YBqkwcHPHthHFGddSrPjpSEo2wyvA&s");
            productoRepository.save(dragonVerde);

            // Sunrise
            Producto sunrise = new Producto();
            sunrise.setNombre("Sunrise");
            sunrise.setCategoria("Coctelería");
            sunrise.setIngredientes("Compuesto Vodka - Granadina - Naranja");
            sunrise.setPrecio(28000.0);
            sunrise.setDisponible(true);
            sunrise.setImagenUrl("https://www.allrecipes.com/thmb/zL0-Fqh_E_Z9vuMMhiV8hbNumTc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/222510-Tequila-Sunrise-Cocktail-ddmfs-4x3-0872-7ddefb6ec8ed40d0930e5b92f178e2cf.jpg");
            productoRepository.save(sunrise);

            // Ruso (Shot)
            Producto ruso = new Producto();
            ruso.setNombre("Ruso");
            ruso.setCategoria("Coctelería");
            ruso.setIngredientes("Vodka - Limón - Azucar - Café (shot)");
            ruso.setPrecio(15000.0);
            ruso.setDisponible(true);
            productoRepository.save(ruso);

            // Sin Licor
            Producto sinLicor = new Producto();
            sinLicor.setNombre("Sin Licor");
            sinLicor.setCategoria("Coctelería");
            sinLicor.setIngredientes("Gengibre - Limón - Silope - Menta - Hierbabuena - Cereza - Canada Dry");
            sinLicor.setPrecio(22000.0);
            sinLicor.setDisponible(true);
            productoRepository.save(sinLicor);

            // Licores
            Producto whiskyBuchanans = new Producto();
            whiskyBuchanans.setNombre("Whisky Buchanans");
            whiskyBuchanans.setCategoria("Licores");
            whiskyBuchanans.setIngredientes(null); // No tiene ingredientes específicos
            whiskyBuchanans.setPrecioBotella(360000.0);
            whiskyBuchanans.setPrecioMedia(210000.0);
            whiskyBuchanans.setDisponible(true);
            whiskyBuchanans.setImagenUrl("https://http2.mlstatic.com/D_NQ_NP_987124-MLA75819816157_042024-O.webp");
            productoRepository.save(whiskyBuchanans);

            // Whisky Jack Daniels
            Producto whiskyJackDaniels = new Producto();
            whiskyJackDaniels.setNombre("Whisky jack Daniels 007 / Honey / Fire / Apple");
            whiskyJackDaniels.setCategoria("Licores");
            whiskyJackDaniels.setIngredientes(null);
            whiskyJackDaniels.setPrecioBotella(295000.0);
            whiskyJackDaniels.setPrecioMedia(170000.0);
            whiskyJackDaniels.setPrecioShot(25000.0);
            whiskyJackDaniels.setDisponible(true);
            whiskyJackDaniels.setImagenUrl("https://qualityliquorstore.com/cdn/shop/files/jack-daniels-jack-daniels-4-pack-combo__22362.jpg?v=1687291064&width=860");
            productoRepository.save(whiskyJackDaniels);

            // Whisky Something Special
            Producto whiskySomethingSpecial = new Producto();
            whiskySomethingSpecial.setNombre("Whisky Something Special");
            whiskySomethingSpecial.setCategoria("Licores");
            whiskySomethingSpecial.setIngredientes(null);
            whiskySomethingSpecial.setPrecioBotella(165000.0);
            whiskySomethingSpecial.setPrecioMedia(110000.0);
            whiskySomethingSpecial.setDisponible(true);
            whiskySomethingSpecial.setImagenUrl("https://media.falabella.com/falabellaCO/143973416_01/w=1500,h=1500,fit=pad");
            productoRepository.save(whiskySomethingSpecial);

            // Whisky Sello Rojo
            Producto whiskySelloRojo = new Producto();
            whiskySelloRojo.setNombre("Whisky Sello Rojo");
            whiskySelloRojo.setCategoria("Licores");
            whiskySelloRojo.setIngredientes(null);
            whiskySelloRojo.setPrecioBotella(160000.0);
            whiskySelloRojo.setPrecioMedia(100000.0);
            whiskySelloRojo.setDisponible(true);
            whiskySelloRojo.setImagenUrl("https://tulicorera.online/wp-content/uploads/2019/09/19.LT-SELLO-ROJO.jpg");
            productoRepository.save(whiskySelloRojo);

            // Whisky Passport Scotch
            Producto whiskyPassportScotch = new Producto();
            whiskyPassportScotch.setNombre("Whisky Passport Scotch");
            whiskyPassportScotch.setCategoria("Licores");
            whiskyPassportScotch.setIngredientes(null);
            whiskyPassportScotch.setPrecioBotella(140000.0);
            whiskyPassportScotch.setPrecioShot(20000.0);
            whiskyPassportScotch.setDisponible(true);
            whiskyPassportScotch.setImagenUrl("https://megatiendas.vtexassets.com/arquivos/ids/155888-800-450?v=638284059941970000&width=800&height=450&aspect=true");
            productoRepository.save(whiskyPassportScotch);

            // Crema de Whisky Baileys (Solo Shot)
            Producto cremaWhiskyBaileys = new Producto();
            cremaWhiskyBaileys.setNombre("Crema de Whisky Baileys");
            cremaWhiskyBaileys.setCategoria("Licores");
            cremaWhiskyBaileys.setIngredientes(null);
            cremaWhiskyBaileys.setPrecioShot(20000.0);
            cremaWhiskyBaileys.setDisponible(true);
            cremaWhiskyBaileys.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBu3iW5cX80Vd4rbOwLINFwtXriJ7cs3p3Rw&s");
            productoRepository.save(cremaWhiskyBaileys);

            // Jäggermeister
            Producto jaggermeister = new Producto();
            jaggermeister.setNombre("Jäggermeister");
            jaggermeister.setCategoria("Licores");
            jaggermeister.setIngredientes(null);
            jaggermeister.setPrecioBotella(280000.0);
            jaggermeister.setPrecioMedia(165000.0);
            jaggermeister.setPrecioShot(25000.0);
            jaggermeister.setDisponible(true);
            jaggermeister.setImagenUrl("https://exitocol.vtexassets.com/arquivos/ids/27142312/Licor-De-Hierbas-Jagermeister-X-700-ml-227392_a.jpg?v=638790343830230000");
            productoRepository.save(jaggermeister);

            // Ginebra Gordon
            Producto ginebraGordon = new Producto();
            ginebraGordon.setNombre("Ginebra Gordon");
            ginebraGordon.setCategoria("Licores");
            ginebraGordon.setIngredientes(null);
            ginebraGordon.setPrecioBotella(180000.0);
            ginebraGordon.setDisponible(true);
            ginebraGordon.setImagenUrl("https://mercaldas.vtexassets.com/arquivos/ids/1301447-800-auto?v=638077616481330000&width=800&height=auto&aspect=true");
            productoRepository.save(ginebraGordon);

            // Vodka Absolut
            Producto vodkaAbsolut = new Producto();
            vodkaAbsolut.setNombre("Vodka Absolut");
            vodkaAbsolut.setCategoria("Licores");
            vodkaAbsolut.setIngredientes(null);
            vodkaAbsolut.setPrecioBotella(210000.0);
            vodkaAbsolut.setPrecioMedia(125000.0);
            vodkaAbsolut.setDisponible(true);
            vodkaAbsolut.setImagenUrl("https://licoresjunior.com/wp-content/uploads/2023/12/VODKA-ABSOLUT-700-Ml-web-1024x1024-1-1024x1024-1.jpg");
            productoRepository.save(vodkaAbsolut);

            // Tequila Jimador Reposado
            Producto tequilaJimador = new Producto();
            tequilaJimador.setNombre("Tequila Jimador Reposado");
            tequilaJimador.setCategoria("Licores");
            tequilaJimador.setIngredientes(null);
            tequilaJimador.setPrecioBotella(250000.0);
            tequilaJimador.setPrecioMedia(160000.0);
            tequilaJimador.setDisponible(true);
            tequilaJimador.setImagenUrl("https://licoresjunior.com/wp-content/uploads/2023/12/TEQUILA-JIMADOR-REPOSADO-750-ML-Web-1024x1024-1.jpg");
            productoRepository.save(tequilaJimador);

            // Tequila Jose Cuervo Especial
            Producto tequilaJoseCuervo = new Producto();
            tequilaJoseCuervo.setNombre("Tequila Jose Cuervo Especial");
            tequilaJoseCuervo.setCategoria("Licores");
            tequilaJoseCuervo.setIngredientes(null);
            tequilaJoseCuervo.setPrecioBotella(230000.0);
            tequilaJoseCuervo.setPrecioMedia(140000.0);
            tequilaJoseCuervo.setPrecioShot(20000.0);
            tequilaJoseCuervo.setDisponible(true);
            tequilaJoseCuervo.setImagenUrl("https://cdn1.totalcommerce.cloud/mercacentro/product-zoom/es/tequila-jose-cuervo-x-375-ml-especial-2.webp");
            productoRepository.save(tequilaJoseCuervo);

            // Tequila Olmeca
            Producto tequilaOlmeca = new Producto();
            tequilaOlmeca.setNombre("Tequila Olmeca");
            tequilaOlmeca.setCategoria("Licores");
            tequilaOlmeca.setIngredientes(null);
            tequilaOlmeca.setPrecioBotella(170000.0);
            tequilaOlmeca.setPrecioMedia(110000.0);
            tequilaOlmeca.setDisponible(true);
            tequilaOlmeca.setImagenUrl("https://lalico.com.co/cdn/shop/files/IMAGENESLICORES1_79_1200x.png?v=1710434048");
            productoRepository.save(tequilaOlmeca);

            // Ron Medellín Añejo
            Producto ronMedellin = new Producto();
            ronMedellin.setNombre("Ron Medellín Añejo");
            ronMedellin.setCategoria("Licores");
            ronMedellin.setIngredientes(null);
            ronMedellin.setPrecioBotella(160000.0);
            ronMedellin.setPrecioMedia(100000.0);
            ronMedellin.setDisponible(true);
            ronMedellin.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvyvwDyh8phg9CSPEZDJsKN80rmL03_P-Ppg&s");
            productoRepository.save(ronMedellin);

            // Ron Viejo De Caldas
            Producto ronViejoCaldas = new Producto();
            ronViejoCaldas.setNombre("Ron Viejo De Caldas");
            ronViejoCaldas.setCategoria("Licores");
            ronViejoCaldas.setIngredientes(null);
            ronViejoCaldas.setPrecioBotella(160000.0);
            ronViejoCaldas.setPrecioMedia(100000.0);
            ronViejoCaldas.setDisponible(true);
            ronViejoCaldas.setImagenUrl("https://lacaretalicores.com/cdn/shop/files/WhatsAppImage2024-05-21at4.36.35PM_2_6bbd3ba2-d5d9-491d-ab90-1a72914fbf73.jpg?v=1740776990");
            productoRepository.save(ronViejoCaldas);

            // Ron Bacardi Carta Blanca
            Producto ronBacardi = new Producto();
            ronBacardi.setNombre("Ron Bacardi Carta Blanca");
            ronBacardi.setCategoria("Licores");
            ronBacardi.setIngredientes(null);
            ronBacardi.setPrecioBotella(130000.0);
            ronBacardi.setDisponible(true);
            ronBacardi.setImagenUrl("https://licoreslarebaja.com/wp-content/uploads/2021/01/1009-BACARDI-CARTA-BLANCA.jpg");
            productoRepository.save(ronBacardi);

            // Vino Tinto Gato Negro
            Producto vinoGatoNegro = new Producto();
            vinoGatoNegro.setNombre("Vino Tinto Gato Negro");
            vinoGatoNegro.setCategoria("Licores");
            vinoGatoNegro.setIngredientes(null);
            vinoGatoNegro.setPrecioBotella(100000.0);
            vinoGatoNegro.setPrecioMedia(55000.0);
            vinoGatoNegro.setPrecioShot(30000.0);
            vinoGatoNegro.setDisponible(true);
            vinoGatoNegro.setImagenUrl("https://licorescasamoreno.com/wp-content/uploads/2022/07/Vino_Gato_negro_Licores_Casa_moreno-1.jpg");
            productoRepository.save(vinoGatoNegro);

            // Aguardiente Amarillo
            Producto aguardienteAmarillo = new Producto();
            aguardienteAmarillo.setNombre("Aguardiente Amarillo");
            aguardienteAmarillo.setCategoria("Licores");
            aguardienteAmarillo.setIngredientes(null);
            aguardienteAmarillo.setPrecioBotella(160000.0);
            aguardienteAmarillo.setDisponible(true);
            aguardienteAmarillo.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTzzNkonV5mZS8NWsJ5Fv03ACE-Cocj87Suw&s");
            productoRepository.save(aguardienteAmarillo);

            // Aguardiente Antioqueño Azul
            Producto aguardienteAntioqueno = new Producto();
            aguardienteAntioqueno.setNombre("Aguardiente Antioqueño Azul");
            aguardienteAntioqueno.setCategoria("Licores");
            aguardienteAntioqueno.setIngredientes(null);
            aguardienteAntioqueno.setPrecioBotella(130000.0);
            aguardienteAntioqueno.setPrecioMedia(80000.0);
            aguardienteAntioqueno.setDisponible(true);
            aguardienteAntioqueno.setImagenUrl("https://newyorkstore.com.co/wp-content/uploads/20-3.jpg");
            productoRepository.save(aguardienteAntioqueno);

            // Aguardiente Nectar Verde
            Producto aguardienteNectar = new Producto();
            aguardienteNectar.setNombre("Aguardiente Nectar Verde");
            aguardienteNectar.setCategoria("Licores");
            aguardienteNectar.setIngredientes(null);
            aguardienteNectar.setPrecioBotella(115000.0);
            aguardienteNectar.setPrecioMedia(70000.0);
            aguardienteNectar.setPrecioShot(15000.0);
            aguardienteNectar.setDisponible(true);
            aguardienteNectar.setImagenUrl("https://newyorkstore.com.co/wp-content/uploads/Aguardiente-Nectar-Verde-1-Litro.jpg");
            productoRepository.save(aguardienteNectar);

            // Cervezas
            // Jarra Litro Poker
            Producto jarraPoker = new Producto();
            jarraPoker.setNombre("Jarra Litro Poker");
            jarraPoker.setCategoria("Cervezas");
            jarraPoker.setIngredientes(null);
            jarraPoker.setPrecio(20000.0);
            jarraPoker.setDisponible(true);
            jarraPoker.setImagenUrl("https://d2j6dbq0eux0bg.cloudfront.net/images/82294765/3313787256.jpg");
            productoRepository.save(jarraPoker);

            // Stella Artois
            Producto stellaArtois = new Producto();
            stellaArtois.setNombre("Stella Artois");
            stellaArtois.setCategoria("Cervezas");
            stellaArtois.setIngredientes(null);
            stellaArtois.setPrecio(17000.0);
            stellaArtois.setDisponible(true);
            stellaArtois.setImagenUrl("https://lacaretalicores.com/cdn/shop/products/WhatsAppImage2022-03-25at10.21.03PM.jpg?v=1738706500&width=1000");
            productoRepository.save(stellaArtois);

            // Corona 330ML
            Producto corona = new Producto();
            corona.setNombre("Corona 330ML");
            corona.setCategoria("Cervezas");
            corona.setIngredientes(null);
            corona.setPrecio(13000.0);
            corona.setDisponible(true);
            corona.setImagenUrl("https://images.pexels.com/photos/2286972/pexels-photo-2286972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
            productoRepository.save(corona);

            // Club Negra / Roja / Dorada 330ML
            Producto club = new Producto();
            club.setNombre("Club Negra / Roja / Dorada 330ML");
            club.setCategoria("Cervezas");
            club.setIngredientes(null);
            club.setPrecio(9000.0);
            club.setDisponible(true);
            club.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4GiKxfXnzPrqe-hHvhAp2k6IGuAGSuVZAQ&s");
            productoRepository.save(club);

            // Aguila Cero / Light 330ML
            Producto aguilaCeroLight = new Producto();
            aguilaCeroLight.setNombre("Aguila Cero / Light 330ML");
            aguilaCeroLight.setCategoria("Cervezas");
            aguilaCeroLight.setIngredientes(null);
            aguilaCeroLight.setPrecio(9000.0);
            aguilaCeroLight.setDisponible(true);
            aguilaCeroLight.setImagenUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9dgirqFlXaGcomhtJZcSzIfg2QkLr7bTGmA&s");
            productoRepository.save(aguilaCeroLight);

            // Aguila / Poker 330ML
            Producto aguilaPoker = new Producto();
            aguilaPoker.setNombre("Aguila / Poker 330ML");
            aguilaPoker.setCategoria("Cervezas");
            aguilaPoker.setIngredientes(null);
            aguilaPoker.setPrecio(7000.0);
            aguilaPoker.setDisponible(true);
            aguilaPoker.setImagenUrl("https://d2yoo3qu6vrk5d.cloudfront.net/pulzo-lite/images-resized/PP3628601A-h-o.jpg");
            productoRepository.save(aguilaPoker);

            // Budweiser 250ML
            Producto budweiser = new Producto();
            budweiser.setNombre("Budweiser 250ML");
            budweiser.setCategoria("Cervezas");
            budweiser.setIngredientes(null);
            budweiser.setPrecio(7000.0);
            budweiser.setDisponible(true);
            budweiser.setImagenUrl("https://bevgo.com.co/wp-content/uploads/2020/12/6737-1.jpg");
            productoRepository.save(budweiser);

            // Michelar Cerveza
            Producto michelar = new Producto();
            michelar.setNombre("Michelar Cerveza");
            michelar.setCategoria("Cervezas");
            michelar.setIngredientes(null);
            michelar.setPrecio(3000.0);
            michelar.setDisponible(true);
            michelar.setImagenUrl("https://i.ytimg.com/vi/ixtWpLJObbY/maxresdefault.jpg");
            productoRepository.save(michelar);

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