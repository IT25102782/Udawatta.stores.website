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
}
