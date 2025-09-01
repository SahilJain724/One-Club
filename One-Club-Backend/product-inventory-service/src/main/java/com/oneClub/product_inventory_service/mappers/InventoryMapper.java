package com.oneClub.product_inventory_service.mappers;


import com.oneClub.product_inventory_service.dtos.InventoryResponseDTO;
import com.oneClub.product_inventory_service.models.Inventory;

public class InventoryMapper {
    static public InventoryResponseDTO mapToDTO(Inventory inventory) {
        return new InventoryResponseDTO(
                inventory.getProductId(),
                inventory.getProduct().getTitle(),
                inventory.getProduct().getPrice(),
                inventory.getProduct().getDescription(),
                inventory.getProduct().getImage(),
                inventory.getProduct().getRating(),
                inventory.getProduct().getGender(),
                inventory.getProduct().getCategory().getCategoryName(),
                inventory.getProduct().getSubcategory().getSubcategoryName(),
                inventory.getQuantity()
        );
    }

}
