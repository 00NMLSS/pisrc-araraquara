package com.quintadinha.order.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        String orderId = UUID.randomUUID().toString();
        
        Map<String, Object> order = Map.of(
            "id", orderId,
            "userId", payload.getOrDefault("userId", UUID.randomUUID().toString()),
            "totalAmount", payload.getOrDefault("totalAmount", 0.0),
            "status", "PENDING",
            "paymentMethod", payload.getOrDefault("paymentMethod", "PIX"),
            "shippingAddress", payload.getOrDefault("shippingAddress", "Rua das Flores, 123"),
            "orderDate", Instant.now().toString()
        );

        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getOrdersByUser(@PathVariable String userId) {
        List<Map<String, Object>> mockOrders = List.of(
            Map.of(
                "id", UUID.randomUUID().toString(),
                "userId", userId,
                "totalAmount", 34.50,
                "status", "DELIVERED",
                "paymentMethod", "PIX",
                "shippingAddress", "Av. Brasil, 450",
                "orderDate", Instant.now().minusSeconds(86400).toString()
            )
        );

        return ResponseEntity.ok(mockOrders);
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "order-service"));
    }
}
