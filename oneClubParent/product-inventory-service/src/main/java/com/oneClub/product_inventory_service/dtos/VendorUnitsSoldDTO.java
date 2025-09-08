package com.oneClub.product_inventory_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VendorUnitsSoldDTO {
    private Integer vendorId;
    private Long totalUnitsSold;
}
