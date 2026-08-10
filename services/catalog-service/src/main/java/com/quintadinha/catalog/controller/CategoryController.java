package com.quintadinha.catalog.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final List<Map<String, String>> categories = List.of(
        Map.of("id", "c1111111-1111-1111-1111-111111111111", "name", "Frutas Frescas", "slug", "frutas"),
        Map.of("id", "c2222222-2222-2222-2222-222222222222", "name", "Verduras e Folhas", "slug", "verduras"),
        Map.of("id", "c3333333-3333-3333-3333-333333333333", "name", "Legumes e Tubérculos", "slug", "legumes"),
        Map.of("id", "c4444444-4444-4444-4444-444444444444", "name", "Temperos e Ervas", "slug", "temperos")
    );

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getCategories() {
        return ResponseEntity.ok(categories);
    }
}
