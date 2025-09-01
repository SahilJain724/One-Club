package com.oneClub.auth_service.controllers;

import com.oneClub.auth_service.dtos.LoginDTO;
import com.oneClub.auth_service.dtos.RegisterDTO;

import com.oneClub.auth_service.dtos.RegisterVendorDTO;
import com.oneClub.auth_service.dtos.UserDTO;
import com.oneClub.auth_service.services.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    final private AuthService service;

    @PostMapping("/register")
    public UserDTO register(@RequestBody RegisterDTO registerDTO) {
        return service.register(registerDTO);
    }

    @PostMapping("/register/vendor")
    public UserDTO register(@RequestBody RegisterVendorDTO registervendorDTO) {
        return service.registerVendor(registervendorDTO);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginDTO loginDTO) {
        return service.login(loginDTO);
    }
}

