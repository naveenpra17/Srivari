package com.motors.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndustryResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private String imageUrl;
    private Integer sortOrder;
    private Boolean active;
}
