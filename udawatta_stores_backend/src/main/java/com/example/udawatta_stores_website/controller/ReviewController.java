package com.example.udawatta_stores_website.controller;

import com.example.udawatta_stores_website.model.Product;
import com.example.udawatta_stores_website.model.Review;
import com.example.udawatta_stores_website.model.User;

import com.example.udawatta_stores_website.repository.ProductRepository;
import com.example.udawatta_stores_website.repository.ReviewRepository;
import com.example.udawatta_stores_website.repository.UserRepository;

import com.example.udawatta_stores_website.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {


    @Autowired
    private ReviewRepository reviewRepository;


    @Autowired
    private ProductRepository productRepository;


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private JwtUtil jwtUtil;


    // =========================================================
    // GET ALL REVIEWS
    // Used by Home page
    // =========================================================

    @GetMapping
    public List<Review> getAllReviews() {

        return reviewRepository
                .findAllByOrderByCreatedAtDesc();
    }


    // =========================================================
    // GET REVIEWS FOR ONE PRODUCT
    // =========================================================

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(
            @PathVariable Long productId
    ) {

        return reviewRepository
                .findByProductIdOrderByCreatedAtDesc(
                        productId
                );
    }


    // =========================================================
    // ADD REVIEW
    // =========================================================

    @PostMapping
    public ResponseEntity<?> addReview(
            @RequestBody Review review,
            @RequestHeader("Authorization")
            String authorizationHeader
    ) {


        String token =
                extractToken(
                        authorizationHeader
                );


        Long userId =
                jwtUtil.getUserId(
                        token
                );


        if (
                review.getProductId() == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Product is required."
                            )
                    );
        }


        Product product =
                productRepository
                        .findById(
                                review.getProductId()
                        )
                        .orElse(null);


        if (
                product == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Product not found."
                            )
                    );
        }


        if (
                review.getRating() < 1 ||
                        review.getRating() > 5
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Rating must be between 1 and 5."
                            )
                    );
        }


        if (
                review.getComment() == null ||
                        review.getComment().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Review comment is required."
                            )
                    );
        }


        String comment =
                review.getComment()
                        .trim();


        if (
                comment.length() < 3 ||
                        comment.length() > 1000
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Review must contain between 3 and 1000 characters."
                            )
                    );
        }


        User user =
                userRepository
                        .findById(userId)
                        .orElse(null);


        if (
                user == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "User not found."
                            )
                    );
        }


        review.setUserId(
                userId
        );


        review.setCustomerName(
                user.getFirstName()
                        + " "
                        + user.getLastName()
        );


        review.setProductName(
                product.getName()
        );


        review.setComment(
                comment
        );


        review.setCreatedAt(
                LocalDateTime.now()
        );


        Review savedReview =
                reviewRepository.save(
                        review
                );


        return ResponseEntity.ok(
                savedReview
        );
    }


    // =========================================================
    // ADMIN DELETE REVIEW
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long id
    ) {


        if (
                !reviewRepository.existsById(id)
        ) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Review not found."
                            )
                    );
        }


        reviewRepository.deleteById(
                id
        );


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Review deleted successfully."
                )
        );
    }


    private String extractToken(
            String authorizationHeader
    ) {

        if (
                authorizationHeader == null ||
                        !authorizationHeader
                                .startsWith("Bearer ")
        ) {

            throw new RuntimeException(
                    "Invalid authorization header"
            );
        }


        return authorizationHeader
                .substring(7);
    }
}