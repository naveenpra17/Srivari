package com.motors.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class QuoteRequestDto {

    private Long productId;

    @NotBlank(message = "Name is required")
    @Size(max = 150)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[+]?[0-9\\s-]{7,20}$", message = "Invalid phone number")
    private String phone;

    @Size(max = 150)
    private String company;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @Size(max = 2000)
    private String message;
}
