package com.oneClub.orders_service.dtos;

import lombok.*;

@Data
public class CartItemDTO {
    private Integer id;
    private Integer userId;
    private Integer prodId;
    private Integer quantity;
    private Float price;
}

