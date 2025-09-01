package com.oneClub.orders_service.dtos;

import lombok.Data;

@Data
public class OrderRequestDTO {
    private Integer id;
    private String city;
    private String state;
    private String country;
    private String zip;
    private Integer isDefault = 0;
    private String street;
    private String landmarks;
    private String receiverName;
    private String receiverPhone;
}
