package com.oneClub.orders_service.mappers;

import com.oneClub.orders_service.dtos.AddressResponseDTO;
import com.oneClub.orders_service.dtos.OrderResponseDTO;
import com.oneClub.orders_service.dtos.UserDTO;
import com.oneClub.orders_service.models.Order;

public class OrderMapper {

    // Converts an Order entity into a complete response DTO
    public static OrderResponseDTO mapToDTO(Order order, AddressResponseDTO address, UserDTO user) {
        if (address != null && user != null) {
            address.setUserId(user.getId());
        }

        return OrderResponseDTO.builder()
                .id(order.getId())
                .paymentStatus(order.getPaymentStatus().name())        // new field
                .deliveryStatus(order.getDeliveryStatus().name())      // new field
                .totalAmount(order.getTotalAmount())
                .orderDate(order.getOrderDate())
                .shippingAddress(address)
                .user(user)
                .items(order.getItems())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .freeDelivery(order.getFreeDelivery())
                .paymentId(order.getPaymentId())           // include paymentId if present
                .build();
    }
}
