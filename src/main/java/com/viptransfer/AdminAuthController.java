package com.viptransfer;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminAuthController {

    @GetMapping("/admin/auth-check")
    public ResponseEntity<Void> checkAdminAccess(Authentication authentication) {
        // Return an ordinary 401 for anonymous sessions. A Spring Security
        // HTTP Basic challenge can trigger a browser credential prompt and
        // leave the SPA's initial session check waiting indefinitely.
        boolean isAdmin = authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                && authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        return isAdmin ? ResponseEntity.noContent().build() : ResponseEntity.status(401).build();
    }
}
