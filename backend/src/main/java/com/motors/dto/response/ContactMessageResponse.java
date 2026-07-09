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
public class ContactMessageResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
    private Boolean isRead;
    private Boolean isReplied;
    private Instant createdAt;
}
