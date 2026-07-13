package com.motors.service;

import com.motors.dto.request.ProductRequest;
import com.motors.dto.response.PageResponse;
import com.motors.dto.response.ProductResponse;
import com.motors.entity.Category;
import com.motors.entity.Product;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.ProductMapper;
import com.motors.repository.CategoryRepository;
import com.motors.repository.ProductRepository;
import com.motors.util.ProductResponseEnricher;
import com.motors.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final ProductResponseEnricher productEnricher;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    @Cacheable("featuredProducts")
    public List<ProductResponse> getFeaturedProducts() {
        return productMapper.toResponseList(
                productRepository.findByFeaturedTrueAndActiveTrueOrderBySortOrderAsc());
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getActiveProducts(Pageable pageable) {
        Page<Product> page = productRepository.findByActiveTrue(pageable);
        return PageResponse.from(page.map(productMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> page = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        return PageResponse.from(page.map(productMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> searchProducts(String query, Pageable pageable) {
        Page<Product> page = productRepository.searchActive(query.trim(), pageable);
        return PageResponse.from(page.map(productMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public ProductResponse getBySlug(String slug) {
        Product product = productRepository.findBySlugWithImages(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slug));
        return productEnricher.toResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return productEnricher.toResponse(product);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getAllProducts(Pageable pageable) {
        return PageResponse.from(productRepository.findAll(pageable).map(productEnricher::toResponse));
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public ProductResponse create(ProductRequest request) {
        Product product = mapRequestToEntity(new Product(), request);
        product.setSlug(generateUniqueSlug(request.getName()));
        Product saved = productRepository.save(product);
        auditLogService.log("CREATE", "Product", saved.getId(), null,
                Map.of("name", saved.getName(), "slug", saved.getSlug()));
        return productEnricher.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        String oldName = product.getName();
        mapRequestToEntity(product, request);
        Product saved = productRepository.save(product);
        auditLogService.log("UPDATE", "Product", saved.getId(),
                Map.of("name", oldName), Map.of("name", saved.getName()));
        return productEnricher.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"featuredProducts", "homePageData"}, allEntries = true)
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        auditLogService.log("DELETE", "Product", id, Map.of("name", product.getName()), null);
        productRepository.deleteById(id);
    }

    private Product mapRequestToEntity(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setBrochureUrl(request.getBrochureUrl());
        product.setPrice(request.getPrice());
        if (request.getFeatured() != null) product.setFeatured(request.getFeatured());
        if (request.getActive() != null) product.setActive(request.getActive());
        if (request.getSortOrder() != null) product.setSortOrder(request.getSortOrder());
        product.setSpecifications(request.getSpecifications());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }
        return product;
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = SlugUtil.toSlug(name);
        String slug = baseSlug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
