package com.oneClub.orders_service.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Integer paymentId;
    private Integer orderId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
}
