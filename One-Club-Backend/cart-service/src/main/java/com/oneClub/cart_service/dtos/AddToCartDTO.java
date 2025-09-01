package com.oneClub.cart_service.dtos;

import lombok.Data;

@Data
public class AddToCartDTO {
    private Integer prodId;
    private Integer quantity=1;
}
