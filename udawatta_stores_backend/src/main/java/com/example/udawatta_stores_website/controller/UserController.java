package com.example.udawatta_stores_website.controller;

import com.example.udawatta_stores_website.model.User;
import com.example.udawatta_stores_website.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.udawatta_stores_website.security.JwtUtil;

import java.util.HashMap;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;


    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {

        // =============================
        // FIRST NAME
        // =============================

        if (
                user.getFirstName() == null ||
                        user.getFirstName().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("First name is required.");
        }

        String firstName =
                user.getFirstName().trim();

        if (
                firstName.length() < 2 ||
                        firstName.length() > 50
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "First name must contain between 2 and 50 characters."
                    );
        }

        if (
                !firstName.matches(
                        "[\\p{L} .'-]+"
                )
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "First name contains invalid characters."
                    );
        }


        // =============================
        // LAST NAME
        // =============================

        if (
                user.getLastName() == null ||
                        user.getLastName().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Last name is required.");
        }

        String lastName =
                user.getLastName().trim();

        if (
                lastName.length() < 2 ||
                        lastName.length() > 50
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Last name must contain between 2 and 50 characters."
                    );
        }

        if (
                !lastName.matches(
                        "[\\p{L} .'-]+"
                )
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Last name contains invalid characters."
                    );
        }


        // =============================
        // USERNAME
        // =============================

        if (
                user.getUsername() == null ||
                        user.getUsername().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Username is required.");
        }

        String username =
                user.getUsername().trim();

        if (
                username.length() < 3 ||
                        username.length() > 30
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Username must contain between 3 and 30 characters."
                    );
        }

        if (
                !username.matches(
                        "^[A-Za-z0-9._]+$"
                )
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Username can only contain letters, numbers, dots and underscores."
                    );
        }


        // =============================
        // PASSWORD
        // =============================

        if (
                user.getPassword() == null ||
                        user.getPassword().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Password is required.");
        }

        String password =
                user.getPassword();

        if (
                password.length() < 8 ||
                        password.length() > 64
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Password must contain between 8 and 64 characters."
                    );
        }

        if (
                !password.matches(
                        "^(?=.*[A-Za-z])(?=.*\\d)\\S{8,64}$"
                )
        ) {
            return ResponseEntity
                    .badRequest()
                    .body(
                            "Password must contain at least one letter and one number, with no spaces."
                    );
        }


        // =============================
        // DUPLICATE USERNAME
        // =============================

        if (
                userRepository
                        .findByUsernameIgnoreCase(
                                username
                        ) != null
        ) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            "Username already exists."
                    );
        }


        // Clean data
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);


        // User cannot register as ADMIN
        user.setRole("CUSTOMER");


        // BCrypt password
        user.setPassword(
                passwordEncoder.encode(
                        password
                )
        );


        User savedUser =
                userRepository.save(
                        user
                );


        return ResponseEntity.ok(
                createSafeUserResponse(
                        savedUser
                )
        );
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User loginData
    ) {

        if (
                loginData.getUsername() == null ||
                        loginData.getPassword() == null
        ) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid username or password"
                    );
        }


        User user =
                userRepository.findByUsername(
                        loginData.getUsername()
                );


        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid username or password"
                    );
        }


        String storedPassword =
                user.getPassword();


        boolean passwordMatches = false;


        // =====================================================
        // CHECK WHETHER PASSWORD IS ALREADY BCRYPT
        // =====================================================

        boolean bcryptPassword =
                storedPassword != null &&
                        (
                                storedPassword.startsWith("$2a$") ||
                                        storedPassword.startsWith("$2b$") ||
                                        storedPassword.startsWith("$2y$")
                        );


        if (bcryptPassword) {

            // Normal secure login
            passwordMatches =
                    passwordEncoder.matches(
                            loginData.getPassword(),
                            storedPassword
                    );

        } else {

            /*
             * Existing/old users may still have
             * plain-text passwords.
             *
             * Allow one successful login and then
             * automatically convert password to BCrypt.
             */

            passwordMatches =
                    storedPassword != null &&
                            storedPassword.equals(
                                    loginData.getPassword()
                            );


            if (passwordMatches) {

                user.setPassword(
                        passwordEncoder.encode(
                                loginData.getPassword()
                        )
                );


                userRepository.save(
                        user
                );
            }
        }


        if (!passwordMatches) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid username or password"
                    );
        }


        // Return safe user details.
        // Password is NEVER returned.
        String token =
                jwtUtil.generateToken(
                        user.getUsername(),
                        user.getRole(),
                        user.getId()
                );


        Map<String, Object> response =
                createSafeUserResponse(user);


        response.put(
                "token",
                token
        );


        return ResponseEntity.ok(
                response
        );
    }


    // =========================================================
    // SAFE USER RESPONSE
    // =========================================================

    private Map<String, Object> createSafeUserResponse(
            User user
    ) {

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "id",
                user.getId()
        );

        response.put(
                "firstName",
                user.getFirstName()
        );

        response.put(
                "lastName",
                user.getLastName()
        );

        response.put(
                "username",
                user.getUsername()
        );

        response.put(
                "role",
                user.getRole()
        );


        return response;
    }
}