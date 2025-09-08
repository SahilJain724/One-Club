package com.oneClub.payments_service.controllers;

import com.oneClub.payments_service.dtos.PaymentRequestDTO;
import com.oneClub.payments_service.dtos.PaymentResponseDTO;
import com.oneClub.payments_service.services.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO dto) {
        try {
            PaymentResponseDTO paymentResponse = paymentService.createPayment(dto);
            return ResponseEntity.ok(paymentResponse);
        } catch (RazorpayException e) {
            return ResponseEntity.status(502).body("Razorpay error: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal error: " + e.getMessage());
        }
    }

    @PatchMapping("/success/{paymentId}")
    public ResponseEntity<String> handlePaymentSuccess(
            @RequestHeader("X-User-Id") Integer userId,
            @RequestHeader("X-Roles") String roles,
            @PathVariable Integer paymentId,
            @RequestParam String razorpayPaymentId) {

        paymentService.handlePaymentSuccess(userId, roles, paymentId, razorpayPaymentId);
        return ResponseEntity.ok("Payment marked as successful");
    }

    @PatchMapping("/failed/{paymentId}")
    public ResponseEntity<String> handlePaymentFailed(
            @RequestHeader("X-Roles") String roles,
            @PathVariable Integer paymentId) {

        paymentService.handlePaymentFailed(roles,paymentId);
        return ResponseEntity.ok("Payment marked as failed and order cancelled");
    }
}
