package com.oneClub.product_inventory_service.repositories;

import com.oneClub.product_inventory_service.dtos.VendorUnitsSoldDTO;
import com.oneClub.product_inventory_service.models.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    Optional<Inventory> findByProductId(Integer id);

    @Query("SELECT new com.oneClub.product_inventory_service.dtos.VendorUnitsSoldDTO(i.vendorId, SUM(i.unitsSold)) " +
            "FROM Inventory i GROUP BY i.vendorId")
    List<VendorUnitsSoldDTO> getTotalUnitsSoldPerVendor();

}

