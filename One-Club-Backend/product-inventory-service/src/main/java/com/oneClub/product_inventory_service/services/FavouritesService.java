package com.oneClub.product_inventory_service.services;
import com.oneClub.product_inventory_service.dtos.ProductResponseDTO;
import com.oneClub.product_inventory_service.mappers.Mappers;
import com.oneClub.product_inventory_service.models.Favourite;
import com.oneClub.product_inventory_service.repositories.FavouriteRepository;
import com.oneClub.product_inventory_service.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavouritesService {

    private final FavouriteRepository favouriteRepository;
    private final ProductRepository productRepository; // you need this to fetch Product details

    public List<ProductResponseDTO> getFavouritesByUserId(Integer userId) {
        List<Favourite> favs = favouriteRepository.findByUserId(userId);
        return favs.stream()
                .map(fav -> productRepository.findById(fav.getProdId())
                        .map(Mappers::toDTO)
                        .orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    public List<Integer> getFavouriteProductIdsByUserId(Integer userId) {
        return favouriteRepository.findByUserId(userId)
                .stream()
                .map(Favourite::getProdId)
                .toList();
    }


    public boolean toggleFavourite(Integer userId, Integer prodId) {
        Optional<Favourite> existing = favouriteRepository.findByUserIdAndProdId(userId, prodId);
        if (existing.isPresent()) {
            favouriteRepository.deleteById(existing.get().getFavId());
            return false;
        } else {
            Favourite fav = new Favourite();
            fav.setUserId(userId);
            fav.setProdId(prodId);
            favouriteRepository.save(fav);
            return true;
        }
    }
}

