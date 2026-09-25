package com.example.udawatta_stores_website.repository;

import com.example.udawatta_stores_website.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    User findByUsername(String username);
}
