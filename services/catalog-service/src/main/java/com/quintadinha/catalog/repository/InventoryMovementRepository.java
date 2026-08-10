package com.quintadinha.catalog.repository;

import com.quintadinha.catalog.model.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, UUID> {
    List<InventoryMovement> findByProductIdOrderByCreatedAtDesc(UUID productId);
    List<InventoryMovement> findAllByOrderByCreatedAtDesc();
}
