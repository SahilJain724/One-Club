package com.oneClub.payments_service.mappers;

import com.oneClub.payments_service.dtos.PaymentRequestDTO;
import com.oneClub.payments_service.dtos.PaymentResponseDTO;
import com.oneClub.payments_service.models.Payment;

import java.time.LocalDateTime;

public class PaymentMapper {

    // Build Payment entity from request DTO and Razorpay order ID
    public static Payment toEntity(PaymentRequestDTO dto, String razorpayOrderId) {
        Payment payment = new Payment();
        payment.setOrderId(dto.getOrderId());
        payment.setAmount(dto.getAmount());
        payment.setRazorpayOrderId(razorpayOrderId);
        payment.setRazorpayPaymentId("PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        return payment;
    }

    // Build Response DTO from Payment entity
    public static PaymentResponseDTO toDTO(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderId(payment.getOrderId());
        dto.setAmount(payment.getAmount());
        dto.setRazorpayOrderId(payment.getRazorpayOrderId());
        dto.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }
}
