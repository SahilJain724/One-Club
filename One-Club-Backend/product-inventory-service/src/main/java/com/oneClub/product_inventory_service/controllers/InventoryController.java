package com.oneClub.product_inventory_service.controllers;

import com.oneClub.product_inventory_service.dtos.InventoryResponseDTO;
import com.oneClub.product_inventory_service.dtos.VendorUnitsSoldDTO;
import com.oneClub.product_inventory_service.services.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventory() {
        List<InventoryResponseDTO> inventoryList = inventoryService.getAllInventory();
        return ResponseEntity.ok(inventoryList);
    }

    @GetMapping("/{prodId}")
    public ResponseEntity<InventoryResponseDTO> getInventoryById(@PathVariable Integer prodId) {
        InventoryResponseDTO inventory = inventoryService.getInventoryByProductId(prodId);
        return inventory != null
                ? ResponseEntity.ok(inventory)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/check-quantity/{prodId}")
    public ResponseEntity<Integer> checkQuantityById(@PathVariable Integer prodId) {
        Integer quantity = inventoryService.checkQuantityById(prodId);
        return ResponseEntity.ok(quantity);
    }

    @PutMapping("/update/{prodId}")
    public ResponseEntity<InventoryResponseDTO> updateStock(@PathVariable Integer prodId,
                                                            @RequestParam int quantity) {
        InventoryResponseDTO updated = inventoryService.updateInventoryByProdId(prodId, quantity);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.notFound().build();
    }

    @PostMapping("/reserve")
    public ResponseEntity<Void> reserveStock(@RequestParam Integer prodId,
                                             @RequestParam Integer quantity) {
        inventoryService.reserveStock(prodId, quantity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/release")
    public ResponseEntity<Void> releaseReservedStock(@RequestParam Integer prodId,
                                                     @RequestParam Integer quantity) {
        inventoryService.releaseReservedStock(prodId, quantity);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vendors/units-sold")
    public ResponseEntity<List<VendorUnitsSoldDTO>> getUnitsSoldByVendor() {
        return ResponseEntity.ok(inventoryService.getTotalUnitsSoldPerVendor());
    }



}
