package com.oneClub.product_inventory_service.models;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prod_id")
    private Integer id;

    @Column(name = "prod_title", nullable = false)
    private String title;

    @Column(name = "prod_price", nullable = false)
    private Float price;

    @Column(name = "prod_description", length = 2000)
    private String description;

    @Column(name = "prod_image")
    private String image;

    @Column(name = "prod_rating")
    private Float rating;

    @Column(name = "gender", length = 1)
    private Character gender;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private Subcategory subcategory;


    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL,optional = false)
    private Inventory inventory;

}
