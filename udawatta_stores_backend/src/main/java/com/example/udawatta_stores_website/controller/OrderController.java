package com.example.udawatta_stores_website.controller;

import com.example.udawatta_stores_website.model.Order;
import com.example.udawatta_stores_website.model.Product;

import com.example.udawatta_stores_website.repository.OrderRepository;
import com.example.udawatta_stores_website.repository.ProductRepository;

import com.example.udawatta_stores_website.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.time.LocalDateTime;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/orders")
public class OrderController {


    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private ProductRepository productRepository;


    @Autowired
    private JwtUtil jwtUtil;


    // Example:
    // Carrot (x2), Milk (x1)
    private static final Pattern ORDER_ITEM_PATTERN =
            Pattern.compile(
                    "(.+?)\\s*\\(x(\\d+)\\)(?:,\\s*|$)"
            );


    // =========================================================
    // PLACE ORDER
    // =========================================================

    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(
            @RequestBody Order order,
            @RequestHeader("Authorization")
            String authorizationHeader
    ) {


        // =====================================================
        // 1. GET USER ID FROM JWT
        // =====================================================

        String token =
                extractToken(
                        authorizationHeader
                );


        Long loggedInUserId =
                jwtUtil.getUserId(
                        token
                );


        // Ignore userId sent by frontend
        order.setUserId(
                loggedInUserId
        );


        // =====================================================
        // 2. VALIDATE CUSTOMER INFORMATION
        // =====================================================

        String customerValidationError =
                validateCustomerInformation(
                        order
                );


        if (
                customerValidationError != null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    customerValidationError
                            )
                    );
        }


        cleanOrderInformation(
                order
        );


        // =====================================================
        // 3. CHECK ORDER ITEMS
        // =====================================================

        if (
                order.getOrderItems() == null ||
                        order.getOrderItems().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Order does not contain any products."
                            )
                    );
        }


        // =====================================================
        // 4. PARSE PRODUCTS + QUANTITIES
        // =====================================================

        Map<String, Integer> requestedItems =
                new LinkedHashMap<>();


        Matcher matcher =
                ORDER_ITEM_PATTERN.matcher(
                        order.getOrderItems()
                );


        while (
                matcher.find()
        ) {

            String productName =
                    matcher.group(1)
                            .trim();


            int quantity;

            try {

                quantity =
                        Integer.parseInt(
                                matcher.group(2)
                        );

            } catch (
                    NumberFormatException exception
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid product quantity."
                                )
                        );
            }


            if (
                    quantity <= 0
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid quantity for "
                                                + productName
                                )
                        );
            }


            // Prevent excessively large quantity
            if (
                    quantity > 100
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Maximum quantity per product is 100."
                                )
                        );
            }


            requestedItems.merge(
                    productName,
                    quantity,
                    Integer::sum
            );
        }


        if (
                requestedItems.isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Unable to read order items."
                            )
                    );
        }


        // =====================================================
        // 5. VALIDATE PRODUCTS
        // =====================================================

        List<Product> products =
                new ArrayList<>();


        Map<Long, Integer> quantitiesByProductId =
                new LinkedHashMap<>();


        BigDecimal serverTotal =
                BigDecimal.ZERO;


        for (
                Map.Entry<String, Integer> entry
                        : requestedItems.entrySet()
        ) {


            String productName =
                    entry.getKey();


            int requestedQuantity =
                    entry.getValue();


            Product product =
                    productRepository
                            .findByNameIgnoreCase(
                                    productName
                            )
                            .orElse(null);


            // Product missing
            if (
                    product == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        productName
                                                + " is no longer available."
                                )
                        );
            }


            // Out of stock
            if (
                    product.getStock() <= 0
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        product.getName()
                                                + " is out of stock."
                                )
                        );
            }


            // Not enough stock
            if (
                    product.getStock()
                            < requestedQuantity
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Only "
                                                + product.getStock()
                                                + " "
                                                + product.getName()
                                                + " available in stock."
                                )
                        );
            }


            // Calculate using DB price
            BigDecimal productPrice =
                    BigDecimal.valueOf(
                            product.getPrice()
                    );


            BigDecimal itemTotal =
                    productPrice.multiply(
                            BigDecimal.valueOf(
                                    requestedQuantity
                            )
                    );


            serverTotal =
                    serverTotal.add(
                            itemTotal
                    );


            products.add(
                    product
            );


            quantitiesByProductId.put(
                    product.getId(),
                    requestedQuantity
            );
        }


        // =====================================================
        // 6. REDUCE STOCK
        // =====================================================

        for (
                Product product : products
        ) {

            int quantity =
                    quantitiesByProductId.get(
                            product.getId()
                    );


            product.setStock(
                    product.getStock()
                            - quantity
            );
        }


        productRepository.saveAll(
                products
        );


