package com.oneClub.orders_service.feignClients;


import com.oneClub.orders_service.dtos.PaymentRequestDTO;
import com.oneClub.orders_service.dtos.PaymentResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@FeignClient(name = "payments-service" )
public interface PaymentServiceClient {

    @PostMapping("/payments")
    PaymentResponseDTO createPayment(@RequestBody PaymentRequestDTO dto);
}
