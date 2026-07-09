package com.motors.service;

import com.motors.dto.response.CategoryResponse;
import com.motors.entity.Category;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.CategoryMapper;
import com.motors.repository.CategoryRepository;
import com.motors.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final AuditLogService auditLogService;

    public List<CategoryResponse> getActiveCategories() {
        return categoryMapper.toResponseList(
                categoryRepository.findByActiveTrueOrderBySortOrderAsc());
    }

    public List<CategoryResponse> getAll() {
        return categoryMapper.toResponseList(categoryRepository.findAll());
    }

    public CategoryResponse getById(Long id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
    }

    @Transactional
    public CategoryResponse create(Category category) {
        category.setSlug(generateUniqueSlug(category.getName()));
        Category saved = categoryRepository.save(category);
        auditLogService.log("CREATE", "Category", saved.getId(), null,
                Map.of("name", saved.getName()));
        return categoryMapper.toResponse(saved);
    }

    @Transactional
    public CategoryResponse update(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        String oldName = existing.getName();
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setImageUrl(category.getImageUrl());
        existing.setSortOrder(category.getSortOrder());
        if (category.getActive() != null) existing.setActive(category.getActive());
        Category saved = categoryRepository.save(existing);
        auditLogService.log("UPDATE", "Category", saved.getId(),
                Map.of("name", oldName), Map.of("name", saved.getName()));
        return categoryMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        auditLogService.log("DELETE", "Category", id, Map.of("name", category.getName()), null);
        categoryRepository.deleteById(id);
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = SlugUtil.toSlug(name);
        String slug = baseSlug;
        int counter = 1;
        while (categoryRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
