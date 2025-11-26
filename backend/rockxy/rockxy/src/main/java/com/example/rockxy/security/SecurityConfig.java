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
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/api/productos/**").permitAll()
                                                .requestMatchers("/api/pedidos").permitAll()
                                                .requestMatchers("/h2-console/**").permitAll()
                                                .requestMatchers("/api/pedidos/{id}/**").hasRole("ADMIN")
                                                .requestMatchers("/api/usuarios").hasRole("ADMIN")
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers("/api/pedidos/mis-pedidos").authenticated()
                                                .requestMatchers("/api/usuarios/perfil/**").authenticated()
                                                .requestMatchers("/api/usuarios/cambiar-password").authenticated()
                                                .anyRequest().authenticated())
                                .headers(headers -> headers
                                                .frameOptions(frame -> frame.disable()));

                http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // ✅ PERMITIR TODOS LOS ORÍGENES (para desarrollo)
                configuration.setAllowedOriginPatterns(Arrays.asList("*"));

                // O específicos:
                // configuration.setAllowedOrigins(Arrays.asList(
                // "http://localhost:5500",
                // "http://127.0.0.1:5500",
                // "https://rockxy-frontend.railway.app",
                // "https://*.railway.app"
                // ));

                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                configuration.setExposedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type"));

                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}