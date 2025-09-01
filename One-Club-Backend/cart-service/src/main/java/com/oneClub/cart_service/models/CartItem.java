package com.oneClub.cart_service.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "prod_id", nullable = false)
    private Integer prodId;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Float price;
}
