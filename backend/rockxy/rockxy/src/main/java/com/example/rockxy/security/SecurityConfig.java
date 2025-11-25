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
                // Configurar CORS primero
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Deshabilitar CSRF (necesario para APIs REST)
                .csrf(csrf -> csrf.disable())

                // Política de sesión stateless (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Configuración de autorización
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos - NO requieren autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/productos/**").permitAll()
                        .requestMatchers("/api/pedidos").permitAll() // POST crear pedido anónimo

                        // Consola H2 - COMPLETAMENTE PÚBLICA (solo para desarrollo)
                        .requestMatchers("/h2-console/**").permitAll()

                        // Endpoints que requieren rol ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/pedidos/{id}/**").hasRole("ADMIN")
                        .requestMatchers("/api/usuarios").hasRole("ADMIN")

                        // Endpoints que requieren autenticación (USER o ADMIN)
                        .requestMatchers("/api/pedidos/mis-pedidos").authenticated()
                        .requestMatchers("/api/usuarios/perfil").authenticated()
                        .requestMatchers("/api/usuarios/perfil/**").authenticated()
                        .requestMatchers("/api/usuarios/cambiar-password").authenticated()

                        // Cualquier otra request requiere autenticación
                        .anyRequest().authenticated())

                // Deshabilitar frameOptions para H2 Console
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()));

        // Agregar filtro JWT antes del filtro de autenticación estándar
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir múltiples orígenes
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5500",
                "http://127.0.0.1:5500",
                "http://localhost:8080",
                "http://127.0.0.1:8080"));

        // Permitir todos los métodos HTTP
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Permitir todos los headers
        configuration.setAllowedHeaders(List.of("*"));

        // Permitir credenciales
        configuration.setAllowCredentials(true);

        // Exponer headers de autorización
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type"));

        // Tiempo de cache para preflight requests
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}