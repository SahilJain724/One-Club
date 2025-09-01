package com.oneClub.payments_service.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Integer paymentId;
    private Integer orderId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
}

