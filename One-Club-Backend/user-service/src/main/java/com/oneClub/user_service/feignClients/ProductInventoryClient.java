package com.oneClub.user_service.feignClients;

import com.oneClub.user_service.dtos.ProductResponseDTO;
import com.oneClub.user_service.dtos.VendorUnitsSoldDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "product-inventory-service")
public interface ProductInventoryClient {

    @DeleteMapping("/products/vendor/{vendorId}")
    void deleteAllProductsByVendor(@PathVariable("vendorId") Integer vendorId);

    @GetMapping("/inventory/vendors/units-sold")
    List<VendorUnitsSoldDTO> getTotalUnitsSoldPerVendor();
}
