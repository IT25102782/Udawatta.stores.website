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
import java.util.Set;

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


    private static final Set<String> ALLOWED_STATUSES =
            Set.of(
                    "PENDING",
                    "SHIPPED",
                    "DELIVERED"
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
        //
        // IMPORTANT:
        // Do NOT reduce stock inside this validation loop.
        // First validate every product.
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
        //
        // All products are valid now.
        // Safe to reduce stock.
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


        // =====================================================
        // 7. SERVER-SIDE TOTAL
        // =====================================================

        serverTotal =
                serverTotal.setScale(
                        2,
                        RoundingMode.HALF_UP
                );


        // Ignore totalAmount sent by frontend
        order.setTotalAmount(
                serverTotal.doubleValue()
        );


        // =====================================================
        // 8. PREPARE ORDER
        // =====================================================

        order.setOrderDate(
                LocalDateTime.now()
        );


        // Frontend cannot choose order status
        order.setStatus(
                "PENDING"
        );


        // Current localhost payment option
        order.setPaymentMethod(
                "COD"
        );


        order.setPaymentStatus(
                "PENDING"
        );


        // =====================================================
        // 9. SAVE ORDER
        // =====================================================

        Order savedOrder =
                orderRepository.save(
                        order
                );


        return ResponseEntity.ok(
                savedOrder
        );
    }


    // =========================================================
    // GET LOGGED-IN USER'S ORDERS
    // =========================================================

    @GetMapping("/my-orders")
    public List<Order> getMyOrders(
            @RequestHeader("Authorization")
            String authorizationHeader
    ) {


        String token =
                extractToken(
                        authorizationHeader
                );


        Long loggedInUserId =
                jwtUtil.getUserId(
                        token
                );


        return orderRepository
                .findByUserId(
                        loggedInUserId
                );
    }


    // =========================================================
    // ADMIN - GET ALL ORDERS
    // =========================================================

    @GetMapping
    public List<Order> getAllOrders() {

        return orderRepository
                .findAll();
    }


    // =========================================================
    // CUSTOMER INFORMATION VALIDATION
    // =========================================================

    private String validateCustomerInformation(
            Order order
    ) {


        // Full name
        if (
                order.getCustomerName() == null ||
                        order.getCustomerName().isBlank()
        ) {

            return "Customer name is required.";
        }


        String customerName =
                order.getCustomerName()
                        .trim();


        if (
                customerName.length() < 2 ||
                        customerName.length() > 100
        ) {

            return "Customer name must contain between 2 and 100 characters.";
        }


        // Basic name validation
        if (
                !customerName.matches(
                        "[\\p{L} .'-]+"
                )
        ) {

            return "Customer name contains invalid characters.";
        }


        // Address
        if (
                order.getAddress() == null ||
                        order.getAddress().isBlank()
        ) {

            return "Delivery address is required.";
        }


        String address =
                order.getAddress()
                        .trim();


        if (
                address.length() < 5 ||
                        address.length() > 300
        ) {

            return "Delivery address must contain between 5 and 300 characters.";
        }


        // Postal code
        if (
                order.getPostalCode() == null ||
                        order.getPostalCode().isBlank()
        ) {

            return "Postal code is required.";
        }


        String postalCode =
                order.getPostalCode()
                        .trim();


        if (
                !postalCode.matches(
                        "\\d{5}"
                )
        ) {

            return "Postal code must contain exactly 5 digits.";
        }


        // Phone
        if (
                order.getPhone() == null ||
                        order.getPhone().isBlank()
        ) {

            return "Phone number is required.";
        }


        String normalizedPhone =
                normalizePhone(
                        order.getPhone()
                );


        /*
         * Accept:
         *
         * 0771234567
         * +94771234567
         */
        if (
                !normalizedPhone.matches(
                        "^(?:0\\d{9}|\\+94\\d{9})$"
                )
        ) {

            return "Please enter a valid Sri Lankan phone number.";
        }


        return null;
    }


    // =========================================================
    // CLEAN ORDER INFORMATION
    // =========================================================

    private void cleanOrderInformation(
            Order order
    ) {


        order.setCustomerName(
                order.getCustomerName()
                        .trim()
        );


        order.setAddress(
                order.getAddress()
                        .trim()
        );


        order.setPostalCode(
                order.getPostalCode()
                        .trim()
        );


        order.setPhone(
                normalizePhone(
                        order.getPhone()
                )
        );
    }


    // =========================================================
    // NORMALIZE PHONE
    // =========================================================

    private String normalizePhone(
            String phone
    ) {


        if (
                phone == null
        ) {

            return "";
        }


        return phone
                .trim()
                .replace(" ", "")
                .replace("-", "");
    }


    // =========================================================
    // JWT HELPER
    // =========================================================

    private String extractToken(
            String authorizationHeader
    ) {


        if (
                authorizationHeader == null ||
                        !authorizationHeader.startsWith("Bearer ")
        ) {

            throw new RuntimeException(
                    "Invalid authorization header"
            );
        }


        return authorizationHeader
                .substring(7);
    }
}