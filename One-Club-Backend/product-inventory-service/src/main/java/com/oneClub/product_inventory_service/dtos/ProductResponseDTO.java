package com.oneClub.product_inventory_service.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductResponseDTO {
    private Integer id;
    private String title;
    private Float price;
    private String description;
    private String image;
    private Float rating;
    private Character gender;
    private String categoryName;
    private String subcategoryName;
    private Integer quantity; // from inventory
}