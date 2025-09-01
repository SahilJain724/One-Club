package com.oneClub.cart_service.controllers;

import com.oneClub.cart_service.dtos.AddToCartDTO;
import com.oneClub.cart_service.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader("X-User-Id") Integer userId,
                                     @RequestHeader("X-Roles") String roles) {
      //  if (!isUserRole(roles)) return unauthorizedResponse();
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("X-User-Id") Integer userId,
                                       @RequestHeader("X-Roles") String roles,
                                       @RequestBody AddToCartDTO request) {
        if (!isUserRole(roles)) return unauthorizedResponse();
        return ResponseEntity.ok(cartService.addToCart(userId, request.getProdId(), request.getQuantity()));
    }

    @PatchMapping("/increase/{cartItemId}")
    public ResponseEntity<?> increaseQuantity(@RequestHeader("X-User-Id") Integer userId,
                                              @RequestHeader("X-Roles") String roles,
                                              @PathVariable Integer cartItemId) {
        if (!isUserRole(roles)) return unauthorizedResponse();
        return ResponseEntity.ok(cartService.increaseQuantity( cartItemId));
    }

    @PatchMapping("/decrease/{cartItemId}")
    public ResponseEntity<?> decreaseQuantity(@RequestHeader("X-User-Id") Integer userId,
                                              @RequestHeader("X-Roles") String roles,
                                              @PathVariable Integer cartItemId) {
        if (!isUserRole(roles)) return unauthorizedResponse();
        return ResponseEntity.ok(cartService.decreaseQuantity( cartItemId));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeItem(@RequestHeader("X-User-Id") Integer userId,
                                        @RequestHeader("X-Roles") String roles,
                                        @PathVariable Integer cartItemId) {
        if (!isUserRole(roles)) return unauthorizedResponse();
        cartService.removeFromCart( cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("X-User-Id") Integer userId,
                                       @RequestHeader("X-Roles") String roles) {
        if (!isUserRole(roles)) return unauthorizedResponse();
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    // === PRIVATE HELPERS ===

    private boolean isUserRole(String rolesHeader) {
        return "ROLE_USER".equalsIgnoreCase(rolesHeader.trim());
    }

    private ResponseEntity<Map<String, Object>> unauthorizedResponse() {
        Map<String, Object> error = new HashMap<>();
        error.put("status", 401);
        error.put("error", "Unauthorized");
        error.put("message", "Access denied. USER role is required to perform this action.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
