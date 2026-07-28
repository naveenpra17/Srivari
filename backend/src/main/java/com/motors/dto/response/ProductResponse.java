package com.motors.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private String imageUrl;
    private String catalogImageUrl;
    private String brochureUrl;
    private BigDecimal price;
    private Boolean featured;
    private Boolean active;
    private Integer sortOrder;
    private Map<String, String> specifications;
    private List<ProductImageResponse> images;
    private Instant createdAt;
    private Instant updatedAt;
}
