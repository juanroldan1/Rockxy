package com.example.rockxy.filter;

import com.example.rockxy.model.RequestLog;
import com.example.rockxy.repository.RequestLogRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class RequestLoggingFilter implements Filter {

    @Autowired
    private RequestLogRepository logRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Crear log de la petición
        RequestLog log = new RequestLog();
        log.setMethod(httpRequest.getMethod());
        log.setPath(httpRequest.getRequestURI());
        log.setIp(httpRequest.getRemoteAddr());
        log.setTimestamp(LocalDateTime.now());

        // Guardar en base de datos
        try {
            logRepository.save(log);
        } catch (Exception e) {
            // Si falla el guardado, no interrumpir la petición
            System.err.println("Error guardando log: " + e.getMessage());
        }

        // Continuar con la petición
        chain.doFilter(request, response);
    }
}