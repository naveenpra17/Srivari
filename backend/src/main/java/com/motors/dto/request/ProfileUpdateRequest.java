package com.motors.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;

    @Pattern(regexp = "^[+]?[0-9\\s-]{7,20}$", message = "Invalid phone number")
    private String phone;

    private String avatarUrl;
}
