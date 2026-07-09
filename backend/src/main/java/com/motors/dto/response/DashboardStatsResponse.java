package com.motors.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalProducts;
    private long totalCategories;
    private long totalIndustries;
    private long totalTestimonials;
    private long totalGalleryItems;
    private long unreadMessages;
    private long totalUsers;
    private Map<String, String> siteStats;
}
