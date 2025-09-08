package com.oneClub.orders_service.feignClients;

import com.oneClub.orders_service.dtos.OrderRequestDTO;
import com.oneClub.orders_service.dtos.AddressResponseDTO;
import com.oneClub.orders_service.dtos.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/users")
    UserDTO getUserById(@RequestHeader("X-User-Id") Integer userId);

    @GetMapping("/users/address/{addressId}")
    AddressResponseDTO getAddressById(@PathVariable Integer addressId);

    @PostMapping("/users/add/address")
    AddressResponseDTO addAddress(@RequestHeader("X-User-Id") Integer userId,
                                  @RequestBody OrderRequestDTO dto);

    @PatchMapping("/users/update/address")
    void updateAddress(@RequestBody OrderRequestDTO addressResponseDTO);

}
