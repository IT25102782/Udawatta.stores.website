package com.example.udawatta_stores_website.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String address;

    private String phone;

    private Double totalAmount;

    private LocalDateTime orderDate;

    // Order delivery status
    // Example: PENDING, SHIPPED, DELIVERED
    private String status;

    private Long userId;

    private String postalCode;


    @Column(length = 1000)
    private String orderItems;


    // ==============================
    // PAYMENT FIELDS
    // ==============================

    // Example: COD / ONLINE
    private String paymentMethod;

    // Example: PENDING / PAID / FAILED
    private String paymentStatus;

    // PayHere payment ID
    // COD orders can keep this null
    private String paymentId;


    // ==============================
    // DEFAULT CONSTRUCTOR
    // ==============================

    public Order() {
    }


