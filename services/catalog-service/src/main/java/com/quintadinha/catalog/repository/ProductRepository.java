package com.quintadinha.catalog.repository;

import com.quintadinha.catalog.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<UUID> findByCategoryId(UUID categoryId);
    List<Product> findByNameContainingIgnoreCase(String name);
}
