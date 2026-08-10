package com.quintadinha.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("fullName");
        
        return ResponseEntity.ok(Map.of(
            "id", UUID.randomUUID().toString(),
            "email", email,
            "fullName", name,
            "role", "CUSTOMER"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        return ResponseEntity.ok(Map.of(
            "accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dummy_access_token",
            "refreshToken", UUID.randomUUID().toString(),
            "expiresIn", 900,
            "user", Map.of(
                "id", UUID.randomUUID().toString(),
                "email", email,
                "fullName", "Cliente Quintadinha"
            )
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(Map.of(
            "accessToken", "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.new_dummy_access_token",
            "refreshToken", UUID.randomUUID().toString(),
            "expiresIn", 900
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "auth-service"));
    }
}
