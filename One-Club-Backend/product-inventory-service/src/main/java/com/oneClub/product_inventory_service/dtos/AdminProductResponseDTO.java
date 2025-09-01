package com.oneClub.product_inventory_service.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AdminProductResponseDTO {
    private ProductResponseDTO responseDTO;
    private Integer unitsSold;
    private Integer vendorId;
}
