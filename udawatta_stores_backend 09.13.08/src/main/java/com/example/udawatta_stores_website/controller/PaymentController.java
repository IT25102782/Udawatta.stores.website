package com.example.udawatta_stores_website.controller;

import com.example.udawatta_stores_website.model.Order;
import com.example.udawatta_stores_website.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final OrderRepository orderRepository;


    @Value("${payhere.merchant-id}")
    private String merchantId;


    @Value("${payhere.merchant-secret}")
    private String merchantSecret;


    @Value("${payhere.checkout-url}")
    private String checkoutUrl;


    @Value("${payhere.currency}")
    private String currency;


    @Value("${payhere.notify-url}")
    private String notifyUrl;


    public PaymentController(
            OrderRepository orderRepository
    ) {
        this.orderRepository = orderRepository;
    }


    // =========================================================
    // MD5 HELPER
    // =========================================================

    private String md5(
            String input
    ) {

        try {

            MessageDigest md =
                    MessageDigest
                            .getInstance("MD5");


            byte[] digest =
                    md.digest(
                            input.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );


            StringBuilder result =
                    new StringBuilder();


            for (byte b : digest) {

                result.append(
                        String.format(
                                "%02X",
                                b
                        )
                );
            }


            return result.toString();


        } catch (Exception e) {

            throw new RuntimeException(
                    "Could not generate MD5 hash",
                    e
            );
        }
    }
}