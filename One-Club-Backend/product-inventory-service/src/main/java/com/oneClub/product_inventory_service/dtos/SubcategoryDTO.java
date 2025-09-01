package com.oneClub.product_inventory_service.dtos;

import com.oneClub.product_inventory_service.models.Category;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SubcategoryDTO {
    private Integer subcategoryId;
    private String subcategoryName;
    private Category category;
}