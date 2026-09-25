package com.example.udawatta_stores_website.service;

import com.example.udawatta_stores_website.model.Product;
import com.example.udawatta_stores_website.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

}