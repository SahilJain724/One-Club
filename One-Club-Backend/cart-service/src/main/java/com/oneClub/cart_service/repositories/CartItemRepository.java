package com.oneClub.cart_service.repositories;

import com.oneClub.cart_service.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserId(Integer userId);
    Optional<CartItem> findByUserIdAndProdId(Integer userId, Integer prodId);
    void deleteByUserId(Integer userId);
}

