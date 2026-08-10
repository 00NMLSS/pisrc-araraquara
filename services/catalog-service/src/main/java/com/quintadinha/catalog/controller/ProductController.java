package com.quintadinha.catalog.controller;

import com.quintadinha.catalog.model.InventoryMovement;
import com.quintadinha.catalog.model.Product;
import com.quintadinha.catalog.repository.InventoryMovementRepository;
import com.quintadinha.catalog.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final InventoryMovementRepository movementRepository;

    public ProductController(ProductRepository productRepository, InventoryMovementRepository movementRepository) {
        this.productRepository = productRepository;
        this.movementRepository = movementRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId) {
        
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCase(search);
        } else {
            products = productRepository.findAll();
        }

        if (categoryId != null) {
            products = products.stream()
                .filter(p -> categoryId.equals(p.getCategoryId()))
                .toList();
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            product.setSlug(product.getName().toLowerCase().replaceAll("[^a-z0-9]", "-"));
        }
        Product saved = productRepository.save(product);

        if (product.getStockQuantity() != null && product.getStockQuantity() > 0) {
            InventoryMovement movement = new InventoryMovement();
            movement.setProductId(saved.getId());
            movement.setMovementType("IN");
            movement.setQuantity(product.getStockQuantity());
            movement.setPreviousStock(0);
            movement.setNewStock(product.getStockQuantity());
            movement.setNotes("Estoque inicial no cadastro");
            movementRepository.save(movement);
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID id, @RequestBody Product payload) {
        return productRepository.findById(id).map(existing -> {
            existing.setName(payload.getName());
            existing.setDescription(payload.getDescription());
            existing.setPrice(payload.getPrice());
            existing.setUnit(payload.getUnit());
            existing.setIsOrganic(payload.getIsOrganic());
            existing.setCategoryId(payload.getCategoryId());
            if (payload.getSlug() != null) existing.setSlug(payload.getSlug());
            Product updated = productRepository.save(existing);
            return ResponseEntity.ok(updated);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> payload) {
        
        Integer targetStock = (Integer) payload.get("stockQuantity");
        String notes = (String) payload.getOrDefault("notes", "Ajuste manual via Painel Admin");

        if (targetStock == null || targetStock < 0) {
            return ResponseEntity.badRequest().build();
        }

        return productRepository.findById(id).map(product -> {
            int previous = product.getStockQuantity();
            int diff = targetStock - previous;

            product.setStockQuantity(targetStock);
            Product saved = productRepository.save(product);

            InventoryMovement movement = new InventoryMovement();
            movement.setProductId(saved.getId());
            movement.setMovementType(diff >= 0 ? "IN" : "OUT");
            movement.setQuantity(Math.abs(diff));
            movement.setPreviousStock(previous);
            movement.setNewStock(targetStock);
            movement.setNotes(notes);
            movementRepository.save(movement);

            return ResponseEntity.ok(saved);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
