package com.oneClub.cart_service.feignClients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-inventory-service")
public interface ProductInventoryClient {

    @GetMapping("/inventory/check-quantity/{prodId}")
    Integer checkQuantityById(@PathVariable Integer prodId);

    @GetMapping("/products/price/{prodId}")
    Float getProductPrice(@PathVariable Integer prodId);
}
