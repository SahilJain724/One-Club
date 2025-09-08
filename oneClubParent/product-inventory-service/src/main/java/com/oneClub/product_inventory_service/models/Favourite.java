package com.oneClub.product_inventory_service.models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favourites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"prod_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fav_id")
    private Integer favId;

    @Column(name = "prod_id", nullable = false)
    private Integer prodId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;


}
