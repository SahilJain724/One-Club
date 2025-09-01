package com.oneClub.cart_service.services;

import com.oneClub.cart_service.feignClients.ProductInventoryClient;
import com.oneClub.cart_service.models.CartItem;
import com.oneClub.cart_service.repositories.CartItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartRepo;
    private final ProductInventoryClient productInventoryClient;

    public List<CartItem> getCartItems(Integer userId) {
        return currentCart(userId);
    }

    public CartItem addToCart(Integer userId, Integer productId, Integer quantity) {
        int available = productInventoryClient.checkQuantityById(productId);
        if (quantity > available) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }

        float price = productInventoryClient.getProductPrice(productId);

        Optional<CartItem> existingItem = cartRepo.findByUserIdAndProdId(userId, productId);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int updatedQuantity = item.getQuantity() + quantity;
            if (updatedQuantity > available) {
                throw new RuntimeException("Total quantity exceeds available stock");
            }

            item.setQuantity(updatedQuantity);
            item.setPrice(price);
            return cartRepo.save(item);
        }

        CartItem newItem = new CartItem();
        newItem.setUserId(userId);
        newItem.setProdId(productId);
        newItem.setQuantity(quantity);
        newItem.setPrice(price);
        return cartRepo.save(newItem);
    }

    public CartItem increaseQuantity( Integer cartItemId) {
        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        int available = productInventoryClient.checkQuantityById(item.getProdId());
        if (item.getQuantity() + 1 > available) {
            throw new RuntimeException("Not enough stock to increase quantity");
        }

        float price = productInventoryClient.getProductPrice(item.getProdId());

        item.setQuantity(item.getQuantity() + 1);
        item.setPrice(price);
        return cartRepo.save(item);
    }

    public CartItem decreaseQuantity( Integer cartItemId) {
        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        int updatedQuantity = item.getQuantity() - 1;
        if (updatedQuantity < 1) {
            cartRepo.delete(item);
            return null;
        }

        item.setQuantity(updatedQuantity);
        return cartRepo.save(item);
    }

    public void removeFromCart( Integer cartItemId) {
        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found"));
        cartRepo.delete(item);
    }

    @Transactional
    public void clearCart(Integer userId) {
        cartRepo.deleteByUserId(userId);
    }

    @Transactional
    public List<CartItem>currentCart(Integer userId) {
        List<CartItem> items = cartRepo.findByUserId(userId);
        for (CartItem item : items) {
            float latestPrice = productInventoryClient.getProductPrice(item.getProdId());
            item.setPrice(latestPrice);
        }
       return cartRepo.saveAll(items);
    }
}
