package com.quintadinha.catalog.controller;

import com.quintadinha.catalog.model.InventoryMovement;
import com.quintadinha.catalog.repository.InventoryMovementRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryMovementRepository movementRepository;

    public InventoryController(InventoryMovementRepository movementRepository) {
        this.movementRepository = movementRepository;
    }

    @GetMapping("/movements")
    public ResponseEntity<List<InventoryMovement>> getAllMovements() {
        return ResponseEntity.ok(movementRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/movements/product/{productId}")
    public ResponseEntity<List<InventoryMovement>> getProductMovements(@PathVariable UUID productId) {
        return ResponseEntity.ok(movementRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }
}
