package com.oneClub.payments_service.feignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "orders-service")
public interface OrderServiceClient {
    @PostMapping("/orders/payment-success")
    void handlePaymentSuccess(@RequestParam("orderId") Integer orderId,
                              @RequestParam("razorpayPaymentId") String razorpayPaymentId,
                              @RequestHeader("X-Roles") String roles);

    @PostMapping("/orders/payment-failed")
    void handlePaymentFailed(@RequestParam("orderId") Integer orderId,
                             @RequestHeader("X-Roles") String roles);
}
