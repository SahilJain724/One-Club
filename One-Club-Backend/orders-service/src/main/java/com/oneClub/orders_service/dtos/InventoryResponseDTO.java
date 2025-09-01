package com.oneClub.orders_service.dtos;

import lombok.Data;

@Data
public class InventoryResponseDTO {
    private Integer productId;
    private String title;
    private Float price;
    private String description;
    private String image;
    private Float rating;
    private Character gender;
    private String categoryName;
    private String subcategoryName;
    private Integer quantity;
}

