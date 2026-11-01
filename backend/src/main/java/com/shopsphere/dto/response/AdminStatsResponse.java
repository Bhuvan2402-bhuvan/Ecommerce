package com.shopsphere.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminStatsResponse {
    private long totalProducts;
    private long totalCategories;
    private long totalCustomers;
    private long totalOrders;
    private long pendingOrders;
    private long processingOrders;
    private long deliveredOrders;
    private BigDecimal totalRevenue;
}
