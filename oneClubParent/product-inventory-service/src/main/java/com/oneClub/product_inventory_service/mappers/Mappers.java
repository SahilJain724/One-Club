package com.oneClub.product_inventory_service.mappers;

import com.oneClub.product_inventory_service.dtos.AdminProductResponseDTO;
import com.oneClub.product_inventory_service.dtos.InventoryResponseDTO;
import com.oneClub.product_inventory_service.dtos.ProductRequestDTO;
import com.oneClub.product_inventory_service.dtos.ProductResponseDTO;
import com.oneClub.product_inventory_service.models.Category;
import com.oneClub.product_inventory_service.models.Inventory;
import com.oneClub.product_inventory_service.models.Product;
import com.oneClub.product_inventory_service.models.Subcategory;


public class Mappers {


    public static Product toEntity(ProductRequestDTO dto, Category category, Subcategory subcategory) {
        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setImage(dto.getImage());
        product.setRating(dto.getRating());
        product.setGender(dto.getGender());
        product.setCategory(category);
        product.setSubcategory(subcategory);
        return product;
    }


    public static ProductResponseDTO toDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setPrice(product.getPrice());
        dto.setDescription(product.getDescription());
        dto.setImage(product.getImage());
        dto.setRating(product.getRating());
        dto.setGender(product.getGender());

        if (product.getCategory() != null)
            dto.setCategoryName(product.getCategory().getCategoryName());

        if (product.getSubcategory() != null)
            dto.setSubcategoryName(product.getSubcategory().getSubcategoryName());

        if (product.getInventory() != null)
            dto.setQuantity(product.getInventory().getQuantity());

        return dto;
    }

    public static AdminProductResponseDTO toAdminDTO(Product product) {
      ProductResponseDTO dto= toDTO(product);
        return new AdminProductResponseDTO(
                dto,
                product.getInventory().getUnitsSold(),
                product.getInventory().getVendorId());
    }

    static public InventoryResponseDTO toInventoryResponseDTO(Inventory inventory) {
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
