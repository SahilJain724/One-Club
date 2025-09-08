package com.oneClub.product_inventory_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ProductInventoryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductInventoryServiceApplication.class, args);
	}

}
