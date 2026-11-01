package com.shopsphere;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.dto.request.LoginRequest;
import com.shopsphere.dto.request.RegisterRequest;
import com.shopsphere.entity.User;
import com.shopsphere.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AuthIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @BeforeEach
    void cleanup() {
        userRepository.findByEmail("testuser@shopsphere.com")
                .ifPresent(u -> userRepository.delete(u));
    }

    @Test
    @Order(1)
    void shouldRegisterNewUser() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Test");
        req.setLastName("User");
        req.setEmail("testuser@shopsphere.com");
        req.setPassword("TestPass@123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists())
                .andExpect(jsonPath("$.data.email").value("testuser@shopsphere.com"))
                .andExpect(jsonPath("$.data.role").value("CUSTOMER"));
    }

    @Test
    @Order(2)
    void shouldFailRegisterWithDuplicateEmail() throws Exception {
        // First create user
        User existing = User.builder()
                .firstName("Existing").lastName("User")
                .email("testuser@shopsphere.com")
                .password(passwordEncoder.encode("password"))
                .role(User.Role.CUSTOMER)
                .build();
        userRepository.save(existing);

        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Another");
        req.setLastName("User");
        req.setEmail("testuser@shopsphere.com");
        req.setPassword("TestPass@123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(3)
    void shouldLoginWithValidCredentials() throws Exception {
        User user = User.builder()
                .firstName("Test").lastName("User")
                .email("testuser@shopsphere.com")
                .password(passwordEncoder.encode("TestPass@123"))
                .role(User.Role.CUSTOMER)
                .build();
        userRepository.save(user);

        LoginRequest req = new LoginRequest();
        req.setEmail("testuser@shopsphere.com");
        req.setPassword("TestPass@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    @Order(4)
    void shouldFailLoginWithWrongPassword() throws Exception {
        User user = User.builder()
                .firstName("Test").lastName("User")
                .email("testuser@shopsphere.com")
                .password(passwordEncoder.encode("CorrectPassword"))
                .role(User.Role.CUSTOMER)
                .build();
        userRepository.save(user);

        LoginRequest req = new LoginRequest();
        req.setEmail("testuser@shopsphere.com");
        req.setPassword("WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @Order(5)
    void shouldFailRegisterWithShortPassword() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Test");
        req.setLastName("User");
        req.setEmail("shortpass@test.com");
        req.setPassword("short"); // less than 8 chars

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
