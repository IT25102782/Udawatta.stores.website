package com.example.udawatta_stores_website.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    private Long userId;

    private String customerName;

    private String productName;

    private int rating;

    @Column(length = 1000)
    private String comment;

    private LocalDateTime createdAt;


}
