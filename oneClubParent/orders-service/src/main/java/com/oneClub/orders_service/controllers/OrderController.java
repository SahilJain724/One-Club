package com.oneClub.orders_service.controllers;

import com.oneClub.orders_service.dtos.OrderRequestDTO;
import com.oneClub.orders_service.dtos.OrderResponseDTO;
import com.oneClub.orders_service.dtos.PaymentResponseDTO;
import com.oneClub.orders_service.models.Order;
import com.oneClub.orders_service.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.oneClub.orders_service.utils.RoleValidator.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders(@RequestHeader("X-Roles") String roles) {
        if (!isAdmin(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only admins can view all orders."));
        }

        try {
            List<OrderResponseDTO> dtos = orderService.getAllOrdersForAdmin();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch all orders."));
        }
    }

    @PatchMapping("/{orderId}/delivery-status")
    public ResponseEntity<?> updateDeliveryStatus(@PathVariable Integer orderId,
                                                  @RequestParam String status,
                                                  @RequestHeader("X-Roles") String roles) {
        if (!isAdmin(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only admins can update delivery status."));
        }

        try {
            orderService.updateDeliveryStatus(orderId, status);
            return ResponseEntity.ok(Map.of("message", "Delivery status updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update delivery status."));
        }
    }



    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestHeader("X-User-Id") Integer userId,
                                        @RequestHeader("X-Roles") String roles,
                                        @RequestBody OrderRequestDTO dto) {

        if (!isUser(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only users can place orders."));
        }

        try {
            PaymentResponseDTO responseDTO = orderService.placeOrder(userId, dto, roles);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong while placing the order."));
        }
    }

    /**
     * Update the shipping address of an order.
     */
    @PatchMapping("/{orderId}/address")
    public ResponseEntity<?> updateShippingAddress(@PathVariable Integer orderId,
                                                   @RequestBody OrderRequestDTO newAddress,
                                                   @RequestHeader("X-User-Id") Integer userId,
                                                   @RequestHeader("X-Roles") String roles) {

        if (!isUser(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only users can update shipping address."));
        }

        try {
            OrderResponseDTO updatedOrder = orderService.updateOrderAddress(orderId, newAddress, userId);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update address."));
        }
    }

    /**
     * Get user's order history.
     */
    @GetMapping("/history")
    public ResponseEntity<?> getOrderHistory(@RequestHeader("X-User-Id") Integer userId,
                                             @RequestHeader("X-Roles") String roles) {

        if (!isUserOrAdmin(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only users and admins can view order history."));
        }

        try {
            List<OrderResponseDTO> orderHistory = orderService.getOrderHistory(userId);
            return ResponseEntity.ok(orderHistory);
        } catch (Exception e) {
            //noinspection CallToPrintStackTrace
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch order history."));
        }
    }

    @PostMapping("/payment-success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestParam Integer orderId,
                                                  @RequestParam String razorpayPaymentId,
                                                  @RequestHeader("X-Roles") String roles) {
        if (!isUser(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Only users are authorized to confirm payment."));
        }

        try {
            orderService.handlePaymentSuccess(orderId, razorpayPaymentId);
            return ResponseEntity.ok(Map.of("message", "Payment confirmed. Order marked as PAID."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to confirm payment."));
        }
    }


    /**
     * ✅ New: Handle payment failure → releases reserved stock and deletes order.
     * Called by frontend/payment service.
     */
    @PostMapping("/payment-failed")
    public ResponseEntity<?> handlePaymentFailed(@RequestParam Integer orderId,
                                                 @RequestHeader("X-Roles") String roles) {

        if (!isUser(roles)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Unauthorized to cancel payment."));
        }

        try {
            orderService.handlePaymentFailed(orderId);
            return ResponseEntity.ok(Map.of("message", "Payment failed. Order cancelled and stock released."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to cancel order."));
        }
    }
}
