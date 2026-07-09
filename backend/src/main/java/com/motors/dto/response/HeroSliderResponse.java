package com.motors.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeroSliderResponse {

    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private String imageUrl;
    private String videoUrl;
    private String ctaText;
    private String ctaLink;
    private String secondaryCtaText;
    private String secondaryCtaLink;
    private Integer sortOrder;
    private Boolean active;
    private java.time.Instant publishAt;
}
