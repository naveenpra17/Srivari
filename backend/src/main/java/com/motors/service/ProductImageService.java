package com.motors.service;

import com.motors.dto.request.ProductImageRequest;
import com.motors.dto.response.ProductImageResponse;
import com.motors.entity.Product;
import com.motors.entity.ProductImage;
import com.motors.exception.ResourceNotFoundException;
import com.motors.repository.ProductImageRepository;
import com.motors.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final AuditLogService auditLogService;

    public List<ProductImageResponse> getByProductId(Long productId) {
        verifyProductExists(productId);
        return productImageRepository.findByProductIdOrderBySortOrderAsc(productId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public ProductImageResponse create(Long productId, ProductImageRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            clearPrimaryFlags(productId);
        }

        int sortOrder = request.getSortOrder() != null
                ? request.getSortOrder()
                : (int) productImageRepository.countByProductId(productId);

        boolean isPrimary = Boolean.TRUE.equals(request.getIsPrimary())
                || productImageRepository.countByProductId(productId) == 0;

        ProductImage image = ProductImage.builder()
                .product(product)
                .imageUrl(request.getImageUrl())
                .altText(request.getAltText())
                .sortOrder(sortOrder)
                .isPrimary(isPrimary)
                .build();

        ProductImage saved = productImageRepository.save(image);
        if (isPrimary) {
            product.setImageUrl(saved.getImageUrl());
            productRepository.save(product);
        }

        auditLogService.log("CREATE", "ProductImage", saved.getId(), null,
                Map.of("productId", productId, "imageUrl", saved.getImageUrl()));
        return toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public ProductImageResponse update(Long productId, Long imageId, ProductImageRequest request) {
        ProductImage image = findImage(productId, imageId);
        String oldUrl = image.getImageUrl();

        if (request.getImageUrl() != null) image.setImageUrl(request.getImageUrl());
        if (request.getAltText() != null) image.setAltText(request.getAltText());
        if (request.getSortOrder() != null) image.setSortOrder(request.getSortOrder());

        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            clearPrimaryFlags(productId);
            image.setIsPrimary(true);
        } else if (Boolean.FALSE.equals(request.getIsPrimary())) {
            image.setIsPrimary(false);
        }

        ProductImage saved = productImageRepository.save(image);
        if (Boolean.TRUE.equals(saved.getIsPrimary())) {
            Product product = image.getProduct();
            product.setImageUrl(saved.getImageUrl());
            productRepository.save(product);
        }

        auditLogService.log("UPDATE", "ProductImage", saved.getId(),
                Map.of("imageUrl", oldUrl), Map.of("imageUrl", saved.getImageUrl()));
        return toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public ProductImageResponse setPrimary(Long productId, Long imageId) {
        ProductImage image = findImage(productId, imageId);
        clearPrimaryFlags(productId);
        image.setIsPrimary(true);
        ProductImage saved = productImageRepository.save(image);

        Product product = image.getProduct();
        product.setImageUrl(saved.getImageUrl());
        productRepository.save(product);

        auditLogService.log("UPDATE", "ProductImage", saved.getId(), null,
                Map.of("isPrimary", true, "productId", productId));
        return toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public void delete(Long productId, Long imageId) {
        ProductImage image = findImage(productId, imageId);
        boolean wasPrimary = Boolean.TRUE.equals(image.getIsPrimary());
        auditLogService.log("DELETE", "ProductImage", imageId,
                Map.of("productId", productId, "imageUrl", image.getImageUrl()), null);
        productImageRepository.delete(image);

        if (wasPrimary) {
            List<ProductImage> remaining = productImageRepository.findByProductIdOrderBySortOrderAsc(productId);
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
            if (!remaining.isEmpty()) {
                ProductImage next = remaining.get(0);
                next.setIsPrimary(true);
                productImageRepository.save(next);
                product.setImageUrl(next.getImageUrl());
            } else {
                product.setImageUrl(null);
            }
            productRepository.save(product);
        }
    }

    private void clearPrimaryFlags(Long productId) {
        productImageRepository.findByProductIdOrderBySortOrderAsc(productId).forEach(img -> {
            if (Boolean.TRUE.equals(img.getIsPrimary())) {
                img.setIsPrimary(false);
                productImageRepository.save(img);
            }
        });
    }

    private ProductImage findImage(Long productId, Long imageId) {
        return productImageRepository.findByIdAndProductId(imageId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found: " + imageId));
    }

    private void verifyProductExists(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found: " + productId);
        }
    }

    private ProductImageResponse toResponse(ProductImage image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .altText(image.getAltText())
                .sortOrder(image.getSortOrder())
                .isPrimary(image.getIsPrimary())
                .build();
    }
}
