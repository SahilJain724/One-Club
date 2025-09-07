package com.oneClub.gateway.filters;

import com.nimbusds.jose.shaded.gson.JsonObject;
import com.oneClub.gateway.services.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthFilter implements GlobalFilter, Ordered {

    private final JwtService jwtService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().toString();
        log.info("[Gateway] Incoming request: {}", request.getURI());
        log.debug("[Gateway] Request headers: {}", request.getHeaders());

        if (path.startsWith("/auth/") || path.startsWith("/eureka") || path.startsWith("/actuator")) {
            log.debug("[Gateway] Skipping auth for path: {}", path);
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("[Gateway] Missing or invalid Authorization header");
            return unauthorizedResponse(exchange, "Missing or invalid Authorization header");
        }

        try {
            String token = authHeader.substring(7);
            log.info("[Gateway] JWT token received");

            jwtService.debugToken(token); //prints detailed breakdown

            String email = jwtService.extractUserName(token);
            String role = jwtService.extractRole(token);
            Integer userId = jwtService.extractUserId(token);

            log.info("[Gateway] Authenticated user -> ID: {}, Email: {}, Role: {}", userId, email, role);

            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User-Id", userId.toString())
                    .header("X-User-Email", email)
                    .header("X-Roles", role)
                    .build();

            log.debug("[Gateway] Modified headers: {}", modifiedRequest.getHeaders());

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            log.error("[Gateway] JWT processing error: {}", e.getMessage(), e);
            return unauthorizedResponse(exchange, "Invalid token: " + e.getMessage());
        }
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        log.warn("[Gateway] Unauthorized access attempt: {}", message);
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        JsonObject errorResponse = new JsonObject();
        errorResponse.addProperty("status", HttpStatus.UNAUTHORIZED.value());
        errorResponse.addProperty("error", "Unauthorized");
        errorResponse.addProperty("message", message);

        DataBuffer buffer = response.bufferFactory()
                .wrap(errorResponse.toString().getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
