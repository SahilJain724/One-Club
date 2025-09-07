package com.oneClub.product_inventory_service.services;

import com.oneClub.product_inventory_service.dtos.InventoryResponseDTO;
import com.oneClub.product_inventory_service.dtos.VendorUnitsSoldDTO;
import com.oneClub.product_inventory_service.mappers.Mappers;
import com.oneClub.product_inventory_service.models.Inventory;
import com.oneClub.product_inventory_service.repositories.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepo;

    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryRepo.findAll().stream()
                .map(Mappers::toInventoryResponseDTO)
                .collect(Collectors.toList());
    }

    public InventoryResponseDTO getInventoryByProductId(Integer prodId) {
        return inventoryRepo.findById(prodId)
                .map(Mappers::toInventoryResponseDTO)
                .orElse(null);
    }

    public InventoryResponseDTO updateInventoryByProdId(Integer prodId, Integer quantity) {
        Inventory current = inventoryRepo.findById(prodId).orElse(null);
        if (current == null) return null;
        current.setQuantity(current.getQuantity()-quantity); // overwrites quantity
        inventoryRepo.save(current);
        return Mappers.toInventoryResponseDTO(current);
    }

    public Integer checkQuantityById(Integer prodId) {
        return inventoryRepo.findById(prodId).map(Inventory::getQuantity).orElse(0);
    }

    @Transactional
    public void reserveStock(Integer prodId, Integer quantity) {
        Inventory inventory = inventoryRepo.findById(prodId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }
        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventory.setUnitsSold(inventory.getUnitsSold() + quantity);
        inventoryRepo.save(inventory);
    }

    @Transactional
    public void releaseReservedStock(Integer prodId, Integer quantity) {
        Inventory inventory = inventoryRepo.findById(prodId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        inventory.setQuantity(inventory.getQuantity() + quantity);
        inventory.setUnitsSold(inventory.getUnitsSold() - quantity);
        inventoryRepo.save(inventory);
    }

    public List<VendorUnitsSoldDTO> getTotalUnitsSoldPerVendor() {
        return inventoryRepo.getTotalUnitsSoldPerVendor();
    }
}
