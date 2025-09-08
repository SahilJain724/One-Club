package com.oneClub.product_inventory_service.repositories;

import com.oneClub.product_inventory_service.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategory_CategoryNameInAndSubcategory_SubcategoryNameIn(
            List<String> categoryNames,
            List<String> subcategoryNames);

    List<Product> findAllByInventoryVendorId(Integer vendorId);

    List<Product> findByTitleContainingIgnoreCase(String keyword);

    List<Product> findByGender(char gender);

    List<Product> findByPriceBetween(Double min, Double max);
}
