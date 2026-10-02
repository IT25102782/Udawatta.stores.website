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
}
