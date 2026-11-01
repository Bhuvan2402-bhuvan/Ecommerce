package com.shopsphere;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import com.shopsphere.service.OrderService;
import com.shopsphere.dto.request.*;
import com.shopsphere.service.CartService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class OrderServiceTest {

    @Autowired OrderService orderService;
    @Autowired CartService cartService;
    @Autowired UserRepository userRepository;
    @Autowired ProductRepository productRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired CartRepository cartRepository;
    @Autowired OrderRepository orderRepository;
    @Autowired PasswordEncoder passwordEncoder;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setup() {
        userRepository.findByEmail("ordertest@shopsphere.com").ifPresent(u -> {
            cartRepository.findByUserId(u.getId()).ifPresent(cartRepository::delete);
            orderRepository.findByUserIdOrderByCreatedAtDesc(u.getId()).forEach(orderRepository::delete);
            userRepository.delete(u);
        });

        Category category = categoryRepository.findAll().stream().findFirst()
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name("Order Test Category").slug("ord-test-cat").build()));

        testUser = userRepository.save(User.builder()
                .firstName("Order").lastName("Test")
                .email("ordertest@shopsphere.com")
                .password(passwordEncoder.encode("password"))
                .role(User.Role.CUSTOMER)
                .build());

        testProduct = productRepository.save(Product.builder()
                .name("Order Test Product")
                .price(new BigDecimal("500.00"))
                .stockQuantity(10)
                .active(true)
                .category(category)
                .build());
    }

    @AfterEach
    void cleanup() {
        if (testUser != null && testUser.getId() != null) {
            cartRepository.findByUserId(testUser.getId()).ifPresent(cartRepository::delete);
            orderRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId()).forEach(orderRepository::delete);
        }
        if (testProduct != null && testProduct.getId() != null) {
            productRepository.delete(testProduct);
        }
        if (testUser != null && testUser.getId() != null) {
            userRepository.delete(testUser);
        }
    }

    @Test
    void shouldCreateOrderAndDeductStock() {
        // Add to cart
        CartItemRequest cartReq = new CartItemRequest();
        cartReq.setProductId(testProduct.getId());
        cartReq.setQuantity(3);
        cartService.addToCart(testUser.getId(), cartReq);

        // Checkout
        CheckoutRequest checkout = new CheckoutRequest();
        checkout.setFirstName("John");
        checkout.setLastName("Doe");
        checkout.setEmail("john@test.com");
        checkout.setAddress("123 Main St");
        checkout.setCity("Mumbai");
        checkout.setState("Maharashtra");
        checkout.setZipCode("400001");
        checkout.setCountry("India");

        var order = orderService.checkout(testUser.getId(), checkout);

        assertThat(order).isNotNull();
        assertThat(order.getOrderNumber()).startsWith("SS-");
        assertThat(order.getTotalAmount()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(order.getItems()).hasSize(1);

        // Verify stock deducted
        Product updated = productRepository.findById(testProduct.getId()).orElseThrow();
        assertThat(updated.getStockQuantity()).isEqualTo(7); // 10 - 3

        // Verify cart cleared
        var cart = cartService.getCart(testUser.getId());
        assertThat(cart.getItems()).isEmpty();
    }

    @Test
    void shouldFailCheckoutWithEmptyCart() {
        CheckoutRequest checkout = new CheckoutRequest();
        checkout.setFirstName("John");
        checkout.setLastName("Doe");
        checkout.setEmail("john@test.com");
        checkout.setAddress("123 Main St");
        checkout.setCity("Mumbai");
        checkout.setState("Maharashtra");
        checkout.setZipCode("400001");
        checkout.setCountry("India");

        assertThatThrownBy(() -> orderService.checkout(testUser.getId(), checkout))
                .isInstanceOf(com.shopsphere.exception.BadRequestException.class)
                .hasMessageContaining("empty");
    }

    @Test
    void shouldReturnUserOrders() {
        var orders = orderService.getUserOrders(testUser.getId());
        assertThat(orders).isNotNull();
    }
}
