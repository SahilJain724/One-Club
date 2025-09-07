package com.oneClub.gateway.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    private final String secretkey = "LmnT1J7Xw7VYI9lFbMf7VmMWdCEskF2BOJZxMfWFeH4";


    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Integer extractUserId(String token) {
        Integer userId = (Integer) extractClaim(token, claims -> claims.get("userId"));
        log.debug("Extracted userId: {}", userId);
        return userId;
    }

    public String extractUserName(String token) {
        String username = extractClaim(token, Claims::getSubject);
        log.debug("Extracted username: {}", username);
        return username;
    }

    public String extractRole(String token) {
        String role = extractAllClaims(token).get("role", String.class);
        log.debug("Extracted role: {}", role);
        return role;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            log.debug("Extracted claims: {}", claims);
            return claims;
        } catch (Exception e) {
            log.error("Failed to extract claims: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void debugToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            log.info("Debug JWT -> Subject: {}", claims.getSubject());
            log.info("Debug JWT -> IssuedAt: {}", claims.getIssuedAt());
            log.info("Debug JWT -> Expiration: {}", claims.getExpiration());
            log.info("Debug JWT -> Role: {}", claims.get("role"));
            log.info("Debug JWT -> UserId: {}", claims.get("userId"));
        } catch (Exception e) {
            log.error("Token debug failed: {}", e.getMessage(), e);
        }
    }
}
