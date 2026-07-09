package com.motors.controller;

import com.motors.dto.request.ProductImageRequest;
import com.motors.dto.request.ProductRequest;
import com.motors.dto.response.ApiResponse;
import com.motors.dto.response.PageResponse;
import com.motors.dto.response.ProductImageResponse;
import com.motors.dto.response.ProductResponse;
import com.motors.service.ProductImageService;
import com.motors.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products")
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    @GetMapping
    @Operation(summary = "List products with pagination and search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "sortOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));
        PageResponse<ProductResponse> result;

        if (search != null && !search.isBlank()) {
            result = productService.searchProducts(search, pageable);
        } else if (categoryId != null) {
            result = productService.getProductsByCategory(categoryId, pageable);
        } else {
            result = productService.getActiveProducts(pageable);
        }

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> featured() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    @Operation(summary = "List all products (admin)")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "sortOrder") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy));
        return ResponseEntity.ok(ApiResponse.success(productService.getAllProducts(pageable)));
    }

    @GetMapping("/{productId}/images")
    @Operation(summary = "List product gallery images")
    public ResponseEntity<ApiResponse<List<ProductImageResponse>>> listImages(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(productImageService.getByProductId(productId)));
    }

    @PostMapping("/{productId}/images")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Add product gallery image")
    public ResponseEntity<ApiResponse<ProductImageResponse>> addImage(
            @PathVariable Long productId, @Valid @RequestBody ProductImageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Image added", productImageService.create(productId, request)));
    }

    @PutMapping("/{productId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Update product gallery image")
    public ResponseEntity<ApiResponse<ProductImageResponse>> updateImage(
            @PathVariable Long productId, @PathVariable Long imageId,
            @Valid @RequestBody ProductImageRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Image updated",
                productImageService.update(productId, imageId, request)));
    }

    @PatchMapping("/{productId}/images/{imageId}/primary")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Set product gallery image as primary")
    public ResponseEntity<ApiResponse<ProductImageResponse>> setPrimaryImage(
            @PathVariable Long productId, @PathVariable Long imageId) {
        return ResponseEntity.ok(ApiResponse.success("Primary image set",
                productImageService.setPrimary(productId, imageId)));
    }

    @DeleteMapping("/{productId}/images/{imageId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Delete product gallery image")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.delete(productId, imageId);
        return ResponseEntity.ok(ApiResponse.success("Image deleted", null));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get product by slug")
    public ResponseEntity<ApiResponse<ProductResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(productService.getBySlug(slug)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Create product")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", productService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Update product")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated", productService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }
}
