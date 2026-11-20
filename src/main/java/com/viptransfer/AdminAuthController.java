package com.viptransfer;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminAuthController {

    @GetMapping("/admin/auth-check")
    public ResponseEntity<Void> checkAdminAccess() {
        // Spring Security verifies ADMIN before this method runs.
        return ResponseEntity.noContent().build();
    }
}
