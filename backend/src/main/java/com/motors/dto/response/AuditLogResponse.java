package com.motors.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;
    private Long userId;
    private String action;
    private String entityType;
    private Long entityId;
    private Map<String, Object> oldValue;
    private Map<String, Object> newValue;
    private String ipAddress;
    private Instant createdAt;
}
