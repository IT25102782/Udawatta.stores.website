package com.example.udawatta_stores_website.controller;

import com.example.udawatta_stores_website.model.Product;
import com.example.udawatta_stores_website.repository.ProductRepository;
import com.example.udawatta_stores_website.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/products")
public class ProductController {


    @Autowired
    private ProductService productService;


    @Autowired
    private ProductRepository productRepository;


    // =========================================================
    // GET ALL PRODUCTS
    // =========================================================

    @GetMapping
    public List<Product> getProducts() {

        return productService.getAllProducts();
    }


    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @PathVariable Long id
    ) {

        Optional<Product> product =
                productRepository.findById(id);


        if (product.isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Product not found."
                            )
                    );
        }


        return ResponseEntity.ok(
                product.get()
        );
    }


    // =========================================================
    // DASHBOARD STATISTICS
    // =========================================================

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {

        List<Product> products =
                productService.getAllProducts();


        long totalProducts =
                products.size();


        long lowStockCount =
                products.stream()
                        .filter(
                                product ->
                                        product.getStock() > 0 &&
                                                product.getStock() < 5
                        )
                        .count();


        long outOfStockCount =
                products.stream()
                        .filter(
                                product ->
                                        product.getStock() == 0
                        )
                        .count();


        long totalUnits =
                products.stream()
                        .mapToLong(
                                Product::getStock
                        )
                        .sum();


        Map<String, Long> stats =
                new HashMap<>();


        stats.put(
                "totalProducts",
                totalProducts
        );

        stats.put(
                "lowStock",
                lowStockCount
        );

        stats.put(
                "outOfStock",
                outOfStockCount
        );

        stats.put(
                "totalUnits",
                totalUnits
        );


        return stats;
    }


    // =========================================================
    // ADD PRODUCT
    // =========================================================

    @PostMapping
    public ResponseEntity<?> addProduct(
            @RequestBody Product product
    ) {


        // Validate input
        String validationError =
                validateProduct(product);


        if (validationError != null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    validationError
                            )
                    );
        }


        // Clean text input
        cleanProductData(product);


        // Check duplicate product name
        Optional<Product> existingProduct =
                productRepository
                        .findByNameIgnoreCase(
                                product.getName()
                        );


        if (existingProduct.isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "A product with this name already exists."
                            )
                    );
        }


        Product savedProduct =
                productService
                        .saveProduct(product);


        return ResponseEntity.ok(
                savedProduct
        );
    }


    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product productDetails
    ) {


        Optional<Product> existingProductOptional =
                productRepository.findById(id);


        if (existingProductOptional.isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Product not found."
                            )
                    );
        }


        // Validate new values
        String validationError =
                validateProduct(
                        productDetails
                );


        if (validationError != null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    validationError
                            )
                    );
        }


        cleanProductData(
                productDetails
        );


        // Check whether another product
        // already uses this name
        Optional<Product> sameNameProduct =
                productRepository
                        .findByNameIgnoreCase(
                                productDetails.getName()
                        );


        if (
                sameNameProduct.isPresent() &&
                        !sameNameProduct
                                .get()
                                .getId()
                                .equals(id)
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Another product with this name already exists."
                            )
                    );
        }


        Product product =
                existingProductOptional.get();


        product.setName(
                productDetails.getName()
        );

        product.setDescription(
                productDetails.getDescription()
        );

        product.setPrice(
                productDetails.getPrice()
        );

        product.setCategory(
                productDetails.getCategory()
        );

        product.setStock(
                productDetails.getStock()
        );

        product.setImage(
                productDetails.getImage()
        );


        Product updatedProduct =
                productRepository.save(
                        product
                );


        return ResponseEntity.ok(
                updatedProduct
        );
    }


    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id
    ) {


        if (
                !productRepository.existsById(id)
        ) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Product not found."
                            )
                    );
        }


        productRepository.deleteById(
                id
        );


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Product deleted successfully."
                )
        );
    }


    // =========================================================
    // PRODUCT VALIDATION
    // =========================================================

    private String validateProduct(
            Product product
    ) {


        // Product name
        if (
                product.getName() == null ||
                        product.getName().isBlank()
        ) {

            return "Product name is required.";
        }


        if (
                product.getName()
                        .trim()
                        .length() < 2
        ) {

            return "Product name must contain at least 2 characters.";
        }


        if (
                product.getName()
                        .trim()
                        .length() > 100
        ) {

            return "Product name cannot exceed 100 characters.";
        }


        // Price
        if (
                !Double.isFinite(
                        product.getPrice()
                ) ||
                        product.getPrice() <= 0
        ) {

            return "Product price must be greater than 0.";
        }


        // Stock
        if (
                product.getStock() < 0
        ) {

            return "Product stock cannot be negative.";
        }


        // Category
        if (
                product.getCategory() == null ||
                        product.getCategory().isBlank()
        ) {

            return "Product category is required.";
        }


        if (
                product.getCategory()
                        .trim()
                        .length() > 50
        ) {

            return "Product category cannot exceed 50 characters.";
        }


        // Description
        if (
                product.getDescription() != null &&
                        product.getDescription()
                                .length() > 2000
        ) {

            return "Product description cannot exceed 2000 characters.";
        }


        // Image URL is optional.
        // But if provided, require HTTP/HTTPS.
        if (
                product.getImage() != null &&
                        !product.getImage()
                                .isBlank()
        ) {

            String image =
                    product.getImage()
                            .trim()
                            .toLowerCase();


            if (
                    !image.startsWith("http://") &&
                            !image.startsWith("https://")
            ) {

                return "Product image must be a valid HTTP or HTTPS URL.";
            }
        }


        return null;
    }


    // =========================================================
    // CLEAN PRODUCT TEXT
    // =========================================================

    private void cleanProductData(
            Product product
    ) {


        product.setName(
                product.getName()
                        .trim()
        );


        product.setCategory(
                product.getCategory()
                        .trim()
        );


        if (
                product.getDescription() != null
        ) {

            product.setDescription(
                    product.getDescription()
                            .trim()
            );
        }


        if (
                product.getImage() != null
        ) {

            product.setImage(
                    product.getImage()
                            .trim()
            );
        }
    }
}