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