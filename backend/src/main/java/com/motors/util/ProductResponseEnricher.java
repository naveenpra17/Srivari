package com.motors.util;

import com.motors.dto.response.ProductImageResponse;
import com.motors.dto.response.ProductResponse;
import com.motors.entity.Product;
import com.motors.entity.ProductImage;
import com.motors.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductResponseEnricher {

    private final ProductMapper productMapper;

    public ProductResponse toResponse(Product product) {
        ProductResponse response = productMapper.toResponse(product);
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImages(mapImages(product.getImages()));
        }
        return response;
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private List<ProductImageResponse> mapImages(List<ProductImage> images) {
        return images.stream()
                .sorted(Comparator.comparing(ProductImage::getSortOrder))
                .map(img -> ProductImageResponse.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .altText(img.getAltText())
                        .sortOrder(img.getSortOrder())
                        .isPrimary(img.getIsPrimary())
                        .build())
                .collect(Collectors.toList());
    }
}
