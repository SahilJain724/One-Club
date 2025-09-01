package com.oneClub.product_inventory_service.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @Column(name = "prod_id")
    private Integer productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "prod_id")
    private Product product;

    @Column(name = "vendor_id", nullable = false)
    private Integer vendorId;   // vendorId comes from another service, so no relation

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "units_sold", nullable = false)
    private Integer unitsSold = 0;   // new field to track how many units have been sold
}
