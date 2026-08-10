package com.quintadinha.catalog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final List<Map<String, Object>> mockProducts = List.of(
        Map.of(
            "id", "p1111111-1111-1111-1111-111111111111",
            "name", "Maçã Fuji Orgânica",
            "slug", "maca-fuji-organica",
            "description", "Maçãs doces e suculentas produtoras locais.",
            "price", 8.90,
            "unit", "kg",
            "stockQuantity", 150,
            "isOrganic", true,
            "categoryId", "c1111111-1111-1111-1111-111111111111"
        ),
        Map.of(
            "id", "p2222222-2222-2222-2222-222222222222",
            "name", "Banana Prata Orgânica",
            "slug", "banana-prata-organica",
            "description", "Bananas ricas em potássio e sem agrotóxicos.",
            "price", 6.50,
            "unit", "kg",
            "stockQuantity", 200,
            "isOrganic", true,
            "categoryId", "c1111111-1111-1111-1111-111111111111"
        ),
        Map.of(
            "id", "p3333333-3333-3333-3333-333333333333",
            "name", "Alface Crespa Orgânica",
            "slug", "alface-crespa-organica",
            "description", "Maço de alface fresca colhida no dia.",
            "price", 3.90,
            "unit", "maço",
            "stockQuantity", 80,
            "isOrganic", true,
            "categoryId", "c2222222-2222-2222-2222-222222222222"
        ),
        Map.of(
            "id", "p4444444-4444-4444-4444-444444444444",
            "name", "Tomate Italiano Orgânico",
            "slug", "tomate-italiano-organico",
            "description", "Tomates maduros ideais para saladas e molhos.",
            "price", 9.80,
            "unit", "kg",
            "stockQuantity", 120,
            "isOrganic", true,
            "categoryId", "c3333333-3333-3333-3333-333333333333"
        ),
        Map.of(
            "id", "p5555555-5555-5555-5555-555555555555",
            "name", "Cenoura Orgânica",
            "slug", "cenoura-organica",
            "description", "Cenouras crocantes e selecionadas.",
            "price", 5.40,
            "unit", "kg",
            "stockQuantity", 100,
            "isOrganic", true,
            "categoryId", "c3333333-3333-3333-3333-333333333333"
        ),
        Map.of(
            "id", "p6666666-6666-6666-6666-666666666666",
            "name", "Manjericão Fresco",
            "slug", "manjericao-fresco",
            "description", "Erva aromática para seus pratos.",
            "price", 4.20,
            "unit", "maço",
            "stockQuantity", 50,
            "isOrganic", true,
            "categoryId", "c4444444-4444-4444-4444-444444444444"
        )
    );

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryId) {
        
        List<Map<String, Object>> filtered = mockProducts.stream()
            .filter(p -> categoryId == null || categoryId.equals(p.get("categoryId")))
            .filter(p -> search == null || ((String) p.get("name")).toLowerCase().contains(search.toLowerCase()))
            .toList();

        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        return mockProducts.stream()
            .filter(p -> p.get("id").equals(id))
            .findFirst()
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
