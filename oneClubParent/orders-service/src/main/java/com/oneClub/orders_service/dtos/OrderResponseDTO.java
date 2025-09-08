package com.oneClub.orders_service.dtos;

import com.oneClub.orders_service.models.OrderItem;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private Integer id;
    private String paymentStatus;
    private String deliveryStatus;
    private BigDecimal totalAmount;
    private LocalDateTime orderDate;
    private String paymentId;
    private AddressResponseDTO shippingAddress;
    private UserDTO user;
    private String receiverName;
    private String receiverPhone;
    private Integer freeDelivery;
    private List<OrderItem> items;
}
