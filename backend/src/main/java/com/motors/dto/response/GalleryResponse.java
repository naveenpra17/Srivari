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
public class GalleryResponse {

    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String category;
    private Integer sortOrder;
    private Boolean active;
    private Instant createdAt;
}
