package com.example.udawatta_stores_website.repository;

import com.example.udawatta_stores_website.model.Review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByProductIdOrderByCreatedAtDesc(
            Long productId
    );

    List<Review> findAllByOrderByCreatedAtDesc();
}