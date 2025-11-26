package com.example.rockxy.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
                return authConfig.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // ✅ CORS configurado primero
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                // ✅ CSRF deshabilitado para APIs REST
                                .csrf(csrf -> csrf.disable())

                                // ✅ Sesiones stateless (JWT)
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // ✅ CONFIGURACIÓN DE AUTORIZACIÓN - CORREGIDA
                                .authorizeHttpRequests(auth -> auth
                                                // 🔓 Endpoints PÚBLICOS (sin autenticación)
                                                .requestMatchers("/api/auth/**").permitAll() // Login y registro
                                                .requestMatchers("/api/productos/**").permitAll() // Ver productos
                                                .requestMatchers("/api/pedidos").permitAll() // Crear pedido anónimo
                                                                                             // (POST)
                                                .requestMatchers("/h2-console/**").permitAll() // Consola H2

                                                // 🔒 Endpoints que requieren ROL ADMIN
                                                .requestMatchers("/api/pedidos/{id}/**").hasRole("ADMIN")
                                                .requestMatchers("/api/usuarios").hasRole("ADMIN") // Listar usuarios
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                                                // 🔐 Endpoints que requieren autenticación (USER o ADMIN)
                                                .requestMatchers("/api/pedidos/mis-pedidos").authenticated()
                                                .requestMatchers("/api/usuarios/perfil/**").authenticated()
                                                .requestMatchers("/api/usuarios/cambiar-password").authenticated()

                                                // ⚠️ Cualquier otra petición requiere autenticación
                                                .anyRequest().authenticated())

                                // ✅ Headers para H2 Console
                                .headers(headers -> headers
                                                .frameOptions(frame -> frame.disable()));

                // ✅ Agregar filtro JWT
                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // ✅ Permitir orígenes de desarrollo Y producción
                configuration.setAllowedOrigins(Arrays.asList(
                                "http://localhost:5500",
                                "http://127.0.0.1:5500",
                                "http://localhost:8080",
                                "http://127.0.0.1:8080",
                                "https://rockxy-frontend.onrender.com", // Tu frontend en Render
                                "https://*.onrender.com" // Cualquier subdominio de Render
                ));

                // ✅ Métodos HTTP permitidos
                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

                // ✅ Headers permitidos
                configuration.setAllowedHeaders(List.of("*"));

                // ✅ Credenciales permitidas
                configuration.setAllowCredentials(true);

                // ✅ Headers expuestos
                configuration.setExposedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type"));

                // ✅ Cache de preflight
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
