package com.motors.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "First name is required")
    @Size(max = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100)
    private String lastName;

    @Pattern(regexp = "^[+]?[0-9\\s-]{7,20}$", message = "Invalid phone number")
    private String phone;

    private Boolean active;

    private java.util.Set<String> roles;
}
