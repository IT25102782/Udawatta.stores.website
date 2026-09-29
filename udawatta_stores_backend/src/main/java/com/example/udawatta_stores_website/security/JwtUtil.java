package com.example.udawatta_stores_website.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;


@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;


    @Value("${jwt.expiration}")
    private long jwtExpiration;


    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }


    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            String username,
            String role,
            Long userId
    ) {

        Date now =
                new Date();


        Date expiry =
                new Date(
                        now.getTime()
                                + jwtExpiration
                );


        return Jwts.builder()

                .subject(username)

                .claim(
                        "role",
                        role
                )

                .claim(
                        "userId",
                        userId
                )

                .issuedAt(now)

                .expiration(expiry)

                .signWith(
                        getSigningKey()
                )

                .compact();
    }


    // ==========================================
    // GET USERNAME
    // ==========================================

    public String getUsername(
            String token
    ) {

        return getClaims(token)
                .getSubject();
    }


    // ==========================================
    // GET ROLE
    // ==========================================

    public String getRole(
            String token
    ) {

        return getClaims(token)
                .get(
                        "role",
                        String.class
                );
    }


    // ==========================================
    // GET USER ID
    // ==========================================

    public Long getUserId(
            String token
    ) {

        Number userId =
                getClaims(token)
                        .get(
                                "userId",
                                Number.class
                        );


        return userId.longValue();
    }


    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean validateToken(
            String token
    ) {

        try {

            getClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }


    // ==========================================
    // READ CLAIMS
    // ==========================================

    private Claims getClaims(
            String token
    ) {

        return Jwts.parser()

                .verifyWith(
                        getSigningKey()
                )

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}