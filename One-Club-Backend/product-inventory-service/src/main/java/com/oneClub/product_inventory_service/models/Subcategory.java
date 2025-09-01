package com.oneClub.product_inventory_service.models;

import jakarta.persistence.*;
import lombok.*;

@Table(name="subcategories")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subcategory_id")
    private Integer subcategoryId;

    @Column(name = "subcategory_name", unique = true)
    private String subcategoryName;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}