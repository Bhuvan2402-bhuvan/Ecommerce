package com.shopsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private boolean inStock;
    private String imageUrl;
    private String brand;
    private String sku;
    private boolean active;
    private boolean featured;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
}
