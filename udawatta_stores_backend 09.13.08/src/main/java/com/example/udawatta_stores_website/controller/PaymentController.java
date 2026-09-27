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
    // 1. GENERATE PAYHERE PAYMENT HASH
    // =========================================================

    @GetMapping("/hash/{orderId}")
    public ResponseEntity<?> generatePaymentHash(
            @PathVariable Long orderId
    ) {

        Order order = orderRepository
                .findById(orderId)
                .orElse(null);


        if (order == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "error",
                                    "Order not found"
                            )
                    );
        }


        String amountFormatted =
                String.format(
                        Locale.US,
                        "%.2f",
                        order.getTotalAmount()
                );


        String hashedSecret =
                md5(merchantSecret);


        String hash =
                md5(
                        merchantId
                                + order.getId()
                                + amountFormatted
                                + currency
                                + hashedSecret
                );


        Map<String, String> response =
                new HashMap<>();


        response.put(
                "merchantId",
                merchantId
        );

        response.put(
                "orderId",
                order.getId().toString()
        );

        response.put(
                "amount",
                amountFormatted
        );

        response.put(
                "currency",
                currency
        );

        response.put(
                "hash",
                hash
        );

        response.put(
                "checkoutUrl",
                checkoutUrl
        );

        response.put(
                "notifyUrl",
                notifyUrl
        );


        return ResponseEntity.ok(response);
    }



    // =========================================================
    // 2. PAYHERE PAYMENT NOTIFICATION
    // =========================================================

    @PostMapping(
            value = "/notify",
            consumes =
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public ResponseEntity<String> handlePaymentNotification(
            @RequestParam Map<String, String> params
    ) {

        String receivedMerchantId =
                params.get("merchant_id");

        String orderId =
                params.get("order_id");

        String paymentId =
                params.get("payment_id");

        String payhereAmount =
                params.get("payhere_amount");

        String payhereCurrency =
                params.get("payhere_currency");

        String statusCode =
                params.get("status_code");

        String receivedMd5sig =
                params.get("md5sig");


        if (
                receivedMerchantId == null ||
                        orderId == null ||
                        payhereAmount == null ||
                        payhereCurrency == null ||
                        statusCode == null ||
                        receivedMd5sig == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Missing payment information"
                    );
        }


        // =============================
        // Generate local checksum
        // =============================

        String hashedSecret =
                md5(merchantSecret);


        String localMd5sig =
                md5(
                        receivedMerchantId
                                + orderId
                                + payhereAmount
                                + payhereCurrency
                                + statusCode
                                + hashedSecret
                );


        // =============================
        // Verify PayHere notification
        // =============================

        if (
                !localMd5sig.equalsIgnoreCase(
                        receivedMd5sig
                )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid payment signature"
                    );
        }


        Long databaseOrderId;

        try {

            databaseOrderId =
                    Long.parseLong(orderId);

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Invalid order ID"
                    );
        }


        Order order =
                orderRepository
                        .findById(databaseOrderId)
                        .orElse(null);


        if (order == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Order not found"
                    );
        }


        // =============================
        // PAYMENT STATUS
        // =============================

        switch (statusCode) {

            // PAYMENT SUCCESS
            case "2":

                order.setPaymentStatus("PAID");

                order.setPaymentMethod(
                        "ONLINE"
                );

                order.setPaymentId(
                        paymentId
                );

                break;


            // PAYMENT PENDING
            case "0":

                order.setPaymentStatus(
                        "PENDING"
                );

                order.setPaymentMethod(
                        "ONLINE"
                );

                break;


            // PAYMENT CANCELLED
            case "-1":

                order.setPaymentStatus(
                        "CANCELLED"
                );

                order.setPaymentMethod(
                        "ONLINE"
                );

                break;


            // PAYMENT FAILED
            case "-2":

                order.setPaymentStatus(
                        "FAILED"
                );

                order.setPaymentMethod(
                        "ONLINE"
                );

                break;


            // CHARGEBACK
            case "-3":

                order.setPaymentStatus(
                        "CHARGEDBACK"
                );

                order.setPaymentMethod(
                        "ONLINE"
                );

                break;


            default:

                order.setPaymentStatus(
                        "UNKNOWN"
                );

                order.setPaymentMethod(
                        "ONLINE"
                );
        }


        orderRepository.save(order);


        return ResponseEntity.ok(
                "Payment notification processed"
        );
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