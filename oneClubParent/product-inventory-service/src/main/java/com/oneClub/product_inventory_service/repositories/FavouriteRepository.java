package com.oneClub.product_inventory_service.repositories;

import com.oneClub.product_inventory_service.models.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends JpaRepository<Favourite, Integer> {

    List<Favourite> findByUserId(Integer userId);

    // Find if a favourite exists by userId and productId
    Optional<Favourite> findByUserIdAndProdId(Integer userId, Integer prodId);
}
