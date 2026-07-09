package com.motors.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String name;
    private String email;
    private String phone;
    private String company;
    private Integer quantity;
    private String message;
    private Boolean isRead;
    private Instant createdAt;
}
