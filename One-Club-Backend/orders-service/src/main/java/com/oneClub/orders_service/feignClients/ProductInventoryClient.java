package com.oneClub.orders_service.feignClients;

import com.oneClub.orders_service.dtos.ProductResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "product-inventory-service")
public interface ProductInventoryClient {

    @GetMapping("/inventory/check-quantity/{prodId}")
    Integer checkQuantityById(@PathVariable("prodId") Integer prodId);

    @PostMapping("/inventory/reserve")
    void reserveStock(@RequestParam("prodId") Integer prodId,
                      @RequestParam("quantity") Integer quantity);

    @PostMapping("/inventory/release")
    void releaseReservedStock(@RequestParam("prodId") Integer prodId,
                              @RequestParam("quantity") Integer quantity);

    @GetMapping("/products/{prodId}")
    ProductResponseDTO getProductById(@PathVariable("prodId") Integer prodId);
}
