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
public class TestimonialResponse {

    private Long id;
    private String slug;
    private String clientName;
    private String designation;
    private String company;
    private String category;
    private String content;
    private String fullStory;
    private String imageUrl;
    private String videoUrl;
    private Integer rating;
    private Integer likes;
    private Boolean featured;
    private Boolean verified;
    private Integer sortOrder;
    private Boolean active;
    private Instant createdAt;
}
