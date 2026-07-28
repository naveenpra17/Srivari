package com.motors.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequest {

    private Long categoryId;

    @NotBlank(message = "Product name is required")
    @Size(max = 200)
    private String name;

    @Size(max = 500)
    private String shortDescription;

    private String description;

    private String imageUrl;

    private String catalogImageUrl;

    private String brochureUrl;

    private java.math.BigDecimal price;

    private Boolean featured;

    private Boolean active;

    private Integer sortOrder;

    private java.util.Map<String, String> specifications;
}
