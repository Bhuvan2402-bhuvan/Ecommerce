package com.shopsphere;

import com.shopsphere.entity.User;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Cart;
import com.shopsphere.entity.CartItem;
import com.shopsphere.repository.*;
import com.shopsphere.service.CartService;
import com.shopsphere.dto.request.CartItemRequest;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CartServiceTest {

    @Autowired CartService cartService;
    @Autowired UserRepository userRepository;
    @Autowired ProductRepository productRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired CartRepository cartRepository;
    @Autowired PasswordEncoder passwordEncoder;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setup() {
        // Clean up
        cartRepository.findByUserId(999999L).ifPresent(cartRepository::delete);
        userRepository.findByEmail("carttest@shopsphere.com").ifPresent(u -> {
            cartRepository.findByUserId(u.getId()).ifPresent(cartRepository::delete);
            userRepository.delete(u);
        });

        // Setup category
        Category category = categoryRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name("Test Category").slug("test-cat").build()));

        // Setup user
        testUser = User.builder()
                .firstName("Cart").lastName("Test")
                .email("carttest@shopsphere.com")
                .password(passwordEncoder.encode("password"))
                .role(User.Role.CUSTOMER)
                .build();
        testUser = userRepository.save(testUser);

        // Setup product
        testProduct = Product.builder()
                .name("Test Product for Cart")
                .price(new BigDecimal("999.00"))
                .stockQuantity(100)
                .active(true)
                .category(category)
                .build();
        testProduct = productRepository.save(testProduct);
    }

    @AfterEach
    void cleanup() {
        cartRepository.findByUserId(testUser.getId()).ifPresent(cartRepository::delete);
        productRepository.delete(testProduct);
        userRepository.delete(testUser);
    }

    @Test
    @Order(1)
    void shouldReturnEmptyCartForNewUser() {
        var cart = cartService.getCart(testUser.getId());
        assertThat(cart.getItems()).isEmpty();
        assertThat(cart.getTotalPrice()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @Order(2)
    void shouldAddItemToCart() {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(testProduct.getId());
        req.setQuantity(2);

        var cart = cartService.addToCart(testUser.getId(), req);

        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(2);
        assertThat(cart.getTotalPrice()).isEqualByComparingTo(new BigDecimal("1998.00"));
    }

    @Test
    @Order(3)
    void shouldAccumulateQuantityForSameProduct() {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(testProduct.getId());
        req.setQuantity(2);
        cartService.addToCart(testUser.getId(), req);
        cartService.addToCart(testUser.getId(), req);

        var cart = cartService.getCart(testUser.getId());
        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(4);
    }

    @Test
    @Order(4)
    void shouldThrowWhenStockInsufficient() {
        CartItemRequest req = new CartItemRequest();
        req.setProductId(testProduct.getId());
        req.setQuantity(999); // more than stock (100)

        assertThatThrownBy(() -> cartService.addToCart(testUser.getId(), req))
                .isInstanceOf(com.shopsphere.exception.InsufficientStockException.class);
    }
}
