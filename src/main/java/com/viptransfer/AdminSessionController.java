package com.viptransfer;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AdminSessionController {
    private final SecurityContextRepository contextRepository;

    public AdminSessionController(SecurityContextRepository contextRepository) {
        this.contextRepository = contextRepository;
    }

    @PostMapping("/admin/session/login")
    public ResponseEntity<Void> login(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        // HTTP Basic verifies credentials only for this login request. Never persist the password.
        if (request.getSession(false) != null) {
            request.changeSessionId();
        } else {
            request.getSession(true);
        }
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        contextRepository.saveContext(context, request, response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/session/csrf")
    public Map<String, String> csrf(CsrfToken token) {
        // Token is returned to the SPA, never stored in localStorage.
        return Map.of("token", token.getToken());
    }

    @PostMapping("/admin/session/logout")
    public ResponseEntity<Void> logout(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ResponseEntity.noContent().build();
    }
}
