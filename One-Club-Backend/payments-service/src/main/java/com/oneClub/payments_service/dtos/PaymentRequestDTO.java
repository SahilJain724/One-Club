package com.oneClub.payments_service.dtos;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequestDTO {
    private Integer orderId;
    private BigDecimal amount;
}

