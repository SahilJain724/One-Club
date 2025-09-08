package com.oneClub.payments_service.services;

import com.oneClub.payments_service.dtos.PaymentRequestDTO;
import com.oneClub.payments_service.dtos.PaymentResponseDTO;
import com.oneClub.payments_service.feignClient.CartServiceClient;
import com.oneClub.payments_service.feignClient.OrderServiceClient;
import com.oneClub.payments_service.mappers.PaymentMapper;
import com.oneClub.payments_service.models.Payment;
import com.oneClub.payments_service.repositories.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CartServiceClient cartServiceClient;
    private final OrderServiceClient orderServiceClient;

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;


    public PaymentResponseDTO createPayment(PaymentRequestDTO dto) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", dto.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);

        Payment payment = PaymentMapper.toEntity(dto, razorpayOrder.get("id"));
        paymentRepository.save(payment);

        return PaymentMapper.toDTO(payment);
    }

    @Transactional
    public void handlePaymentSuccess(Integer userId, String roles, Integer paymentId, String razorpayPaymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + paymentId));

        payment.setRazorpayPaymentId(razorpayPaymentId);
        paymentRepository.save(payment);

        orderServiceClient.handlePaymentSuccess(
                payment.getOrderId(),
                razorpayPaymentId,
                roles
        );


        cartServiceClient.clearCart(userId, roles);
    }



    @Transactional
    public void handlePaymentFailed(String roles, Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + paymentId));


        orderServiceClient.handlePaymentFailed(payment.getOrderId(), roles);


    }
}
