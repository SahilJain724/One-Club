package com.oneClub.product_inventory_service.models;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.*;
import lombok.*;

@Table(name="categories")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "category_name", unique = true)
    private String categoryName;
}
