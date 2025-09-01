package com.oneClub.orders_service.feignClients;

import com.oneClub.orders_service.dtos.CartItemDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "cart-service")
public interface CartServiceClient {
    @GetMapping("/cart")
    List<CartItemDTO> getCartItems(@RequestHeader("X-User-Id") Integer userId,
                                   @RequestHeader("X-Roles") String roles);

}

