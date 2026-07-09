package com.motors.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductImageRequest {

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String altText;

    private Integer sortOrder;

    private Boolean isPrimary;
}
