package com.oneClub.auth_service.services;

import com.oneClub.auth_service.dtos.LoginDTO;
import com.oneClub.auth_service.dtos.RegisterDTO;
import com.oneClub.auth_service.dtos.RegisterVendorDTO;
import com.oneClub.auth_service.dtos.UserDTO;
import com.oneClub.auth_service.feignClients.UserServiceClient;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserServiceClient userServiceClient;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private SecretKey secretKey;
    private final String secretKeyStr = "LmnT1J7Xw7VYI9lFbMf7VmMWdCEskF2BOJZxMfWFeH4";

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secretKeyStr);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public UserDTO register(RegisterDTO dto) {
        String role = dto.getRole().toUpperCase();

        if ("ADMIN".equals(role) && !isCompanyEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Only company emails can register as admin.");
        }

        return userServiceClient.createUser(dto).getBody();
    }

    public UserDTO registerVendor(RegisterVendorDTO vendorDto){
        String role = vendorDto.getRole().toUpperCase();

        if ("ADMIN".equals(role) && !isCompanyEmail(vendorDto.getEmail())) {
            throw new IllegalArgumentException("Only company emails can register as admin.");
        }
        return userServiceClient.createVendor(vendorDto).getBody();

    }


    public Map<String, String> login(LoginDTO dto) {
        UserDTO user = userServiceClient.validateLogin(dto).getBody();

        if (user == null || !encoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid login credentials");
        }

        String token = generateToken(user.getId(), user.getEmail(), user.getRole().getName());

        return Map.of(
                "token", token,
                "role", user.getRole().getName()
        );
    }

    private String generateToken(Integer userId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);

        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 6)) // 6 hours
                .signWith(secretKey)
                .compact();

        log.info("Generated token for userId: {}, username: {}, role: {}", userId, username, role);
        return token;
    }

    private boolean isCompanyEmail(String email) {
        return email.toLowerCase().endsWith("@oneclub.com");
    }

}
