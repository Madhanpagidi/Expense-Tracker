package com.example.expensetracker.service;

import com.example.expensetracker.entity.User;
import com.example.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // In a real app, we would hash the password here
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User loginUser(String email, String password) {
        System.out.println("UserService checking email: " + email); // DEBUG
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            System.out.println("User found: " + user.get().getEmail()); // DEBUG
            if (user.get().getPassword().equals(password)) {
                System.out.println("Password match!"); // DEBUG
                return user.get();
            } else {
                System.out.println("Password mismatch! Input: " + password + ", Stored: " + user.get().getPassword()); // DEBUG
            }
        } else {
            System.out.println("User NOT found for email: " + email); // DEBUG
        }
        return null;
    }
}
