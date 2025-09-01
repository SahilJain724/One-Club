package com.oneClub.product_inventory_service.controllers;

import com.oneClub.product_inventory_service.dtos.AdminProductResponseDTO;
import com.oneClub.product_inventory_service.dtos.ProductRequestDTO;
import com.oneClub.product_inventory_service.dtos.ProductResponseDTO;
import com.oneClub.product_inventory_service.services.FavouritesService;
import com.oneClub.product_inventory_service.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final FavouritesService favProductService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getProducts());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<AdminProductResponseDTO>> getAllAdminProducts() {
        return ResponseEntity.ok(productService.getAdminProducts());
    }

    @GetMapping("/{prodId}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Integer prodId) {
        ProductResponseDTO product = productService.getProductById(prodId);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> addProduct(
            @RequestBody ProductRequestDTO dto,
            @RequestHeader("X-User-Id") Integer userId,
            @RequestHeader("X-Roles") String role) {
        validateVendorOrAdmin(role);
        ProductResponseDTO createdProduct = productService.addProduct(dto,userId);
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{prodId}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Integer prodId,
            @RequestBody ProductRequestDTO dto,
            @RequestHeader("X-User-Id") Integer userId,
            @RequestHeader("X-Roles") String role) {
        ProductResponseDTO updatedProduct = productService.updateProduct(prodId, dto);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{prodId}")
    public ResponseEntity<ProductResponseDTO> deleteProduct(
            @PathVariable Integer prodId,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Roles") String role) {
        ProductResponseDTO deletedProduct = productService.deleteProduct(prodId);
        return ResponseEntity.ok(deletedProduct);
    }

    @DeleteMapping("/vendor/{vendorId}")
    public ResponseEntity<Void> deleteAllProductsByVendor(@PathVariable Integer vendorId) {
        productService.deleteProductsByVendorId(vendorId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/price/{prodId}")
    public Float getProductPrice(@PathVariable Integer prodId) {
        return productService.getProductPriceById(prodId);
    }

    @GetMapping("/fav")
    public ResponseEntity<List<ProductResponseDTO>> getAllFavourites(
            @RequestHeader("X-User-Id") Integer userId) {
        return ResponseEntity.ok(favProductService.getFavouritesByUserId(userId));
    }

    @GetMapping("/fav/ids")
    public ResponseEntity<List<Integer>> getFavouriteProductIds(
            @RequestHeader("X-User-Id") Integer userId) {
        return ResponseEntity.ok(favProductService.getFavouriteProductIdsByUserId(userId));
    }

    @PutMapping("/fav/{prodId}")
    public ResponseEntity<?> toggleFavourite(
            @RequestHeader("X-User-Id") Integer userId,
            @PathVariable Integer prodId) {
        return ResponseEntity.ok(favProductService.toggleFavourite(userId, prodId));
    }

    @GetMapping("/vendor")
    public ResponseEntity<List<AdminProductResponseDTO>> getProductsByVendor(
            @RequestHeader("X-User-Id") Integer vendorId,
            @RequestHeader("X-Roles") String role) {
        validateVendorOrAdmin(role);
        return ResponseEntity.ok(productService.getProductsByVendorId(vendorId));
    }

    private void validateVendorOrAdmin(String role) {
        if (!("ROLE_VENDOR".equals(role) || "ROLE_ADMIN".equals(role))) {
            throw new IllegalStateException("Only vendors or admins can perform this action");
        }
    }
}
