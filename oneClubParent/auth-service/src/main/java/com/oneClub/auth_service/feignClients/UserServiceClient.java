package com.oneClub.auth_service.feignClients;


import com.oneClub.auth_service.dtos.LoginDTO;
import com.oneClub.auth_service.dtos.RegisterDTO;
import com.oneClub.auth_service.dtos.RegisterVendorDTO;
import com.oneClub.auth_service.dtos.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service", path = "/users")
public interface UserServiceClient {

    @PostMapping("/create")
    ResponseEntity<UserDTO> createUser(@RequestBody RegisterDTO dto);

    @PostMapping("/create/vendor")
    ResponseEntity<UserDTO> createVendor(@RequestBody RegisterVendorDTO dto);

    @PostMapping("/validate")
    ResponseEntity<UserDTO> validateLogin(@RequestBody LoginDTO dto);
}
