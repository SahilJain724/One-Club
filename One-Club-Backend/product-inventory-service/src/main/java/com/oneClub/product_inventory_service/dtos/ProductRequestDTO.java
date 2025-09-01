package com.oneClub.product_inventory_service.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductRequestDTO {
    private String title;
    private Float price;
    private String description;
    private String image;
    private Float rating;
    private Character gender;
    private Integer categoryId;
    private Integer subcategoryId;
    private Integer quantity; // this is the inventory quantity
}

