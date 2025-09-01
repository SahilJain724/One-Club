package com.oneClub.payments_service.feignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;


@FeignClient(name = "cart-service")
public interface CartServiceClient {

    @DeleteMapping("/cart/clear")
    void clearCart(@RequestHeader("X-User-Id") Integer userId,
                   @RequestHeader("X-Roles") String roles);
}

