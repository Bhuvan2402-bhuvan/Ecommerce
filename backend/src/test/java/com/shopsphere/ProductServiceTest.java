package com.shopsphere;

import com.shopsphere.entity.*;
import com.shopsphere.repository.*;
import com.shopsphere.service.ProductService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ProductServiceTest {

    @Autowired ProductService productService;
    @Autowired CategoryRepository categoryRepository;

    @Test
    void shouldReturnPaginatedProducts() {
        // Ensure category exists
        Category cat = categoryRepository.findAll().stream().findFirst()
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name("Test Category Products").slug("test-prod-cat").build()));

        var page = productService.getProducts(null, null, null, null, "name", "asc", 0, 10);
        assertThat(page).isNotNull();
        assertThat(page.getContent()).isNotNull();
    }

    @Test
    void shouldFilterBySearch() {
        var page = productService.getProducts("nonexistentproductxyz123", null, null, null, "name", "asc", 0, 10);
        assertThat(page.getContent()).isEmpty();
    }

    @Test
    void shouldReturnFeaturedProducts() {
        var featured = productService.getFeatured();
        assertThat(featured).isNotNull();
    }
}
