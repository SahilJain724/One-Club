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

    /**
     * Creates a new payment order in Razorpay, saves in DB, returns payment response DTO.
     */
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

    /**
     * Handles payment success:
     * - Updates payment with Razorpay payment ID
     * - Notifies order service to mark order as PAID & confirm stock
     * - Clears user's cart
     */
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


    /**
     * Handles payment failure:
     * - Notifies order service to cancel order and release reserved stock
     */
    @Transactional
    public void handlePaymentFailed(String roles, Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + paymentId));

        // notify order service to cancel and delete order
        orderServiceClient.handlePaymentFailed(payment.getOrderId(), roles);

        // optionally: mark payment as failed or delete payment record
        // paymentRepository.delete(payment);
    }
}
