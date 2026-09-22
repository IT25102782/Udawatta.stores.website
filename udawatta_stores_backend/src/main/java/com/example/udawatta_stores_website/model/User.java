package com.example.udawatta_stores_website.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;

    private String lastName;

    @Column(unique = true)
    private String username;


    // Password can be received from requests,
    // but will NOT be returned in JSON responses.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;


    // ADMIN or CUSTOMER
    private String role;


}
