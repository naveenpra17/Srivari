package com.motors.service;

import com.motors.dto.response.PageResponse;
import com.motors.dto.response.TestimonialResponse;
import com.motors.entity.Testimonial;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.EntityMapper;
import com.motors.repository.TestimonialRepository;
import com.motors.util.SlugUtil;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository testimonialRepository;
    private final EntityMapper entityMapper;
    private final AuditLogService auditLogService;

    public List<TestimonialResponse> getActive() {
        return entityMapper.toTestimonialList(
                testimonialRepository.findByActiveTrueOrderBySortOrderAsc());
    }

    public List<TestimonialResponse> getFeatured() {
        return entityMapper.toTestimonialList(
                testimonialRepository.findByActiveTrueAndFeaturedTrueOrderByLikesDesc());
    }

    public List<String> getCategories() {
        return testimonialRepository.findDistinctActiveCategories();
    }

    public PageResponse<TestimonialResponse> search(String query, String category, Integer rating,
                                                     String sort, Pageable pageable) {
        Specification<Testimonial> spec = buildSpecification(query, category, rating);
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                resolveSort(sort));
        Page<Testimonial> page = testimonialRepository.findAll(spec, sortedPageable);
        return PageResponse.from(page.map(entityMapper::toResponse));
    }

    public TestimonialResponse getBySlug(String slug) {
        return testimonialRepository.findBySlugAndActiveTrue(slug)
                .map(entityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + slug));
    }

    public List<TestimonialResponse> getRelated(String slug) {
        Testimonial current = testimonialRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + slug));
        String category = current.getCategory() != null ? current.getCategory() : "General";
        return entityMapper.toTestimonialList(
                testimonialRepository.findTop4ByActiveTrueAndCategoryAndIdNotOrderByLikesDesc(
                        category, current.getId()));
    }

    public List<TestimonialResponse> getAll() {
        return entityMapper.toTestimonialList(testimonialRepository.findAll());
    }

    public TestimonialResponse getById(Long id) {
        return testimonialRepository.findById(id)
                .map(entityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + id));
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public TestimonialResponse like(Long id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + id));
        testimonial.setLikes((testimonial.getLikes() != null ? testimonial.getLikes() : 0) + 1);
        return entityMapper.toResponse(testimonialRepository.save(testimonial));
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public TestimonialResponse create(Testimonial testimonial) {
        if (testimonial.getSlug() == null || testimonial.getSlug().isBlank()) {
            testimonial.setSlug(generateUniqueSlug(testimonial.getClientName()));
        }
        if (testimonial.getFullStory() == null || testimonial.getFullStory().isBlank()) {
            testimonial.setFullStory(testimonial.getContent());
        }
        Testimonial saved = testimonialRepository.save(testimonial);
        auditLogService.log("CREATE", "Testimonial", saved.getId(), null,
                Map.of("clientName", saved.getClientName()));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public TestimonialResponse update(Long id, Testimonial testimonial) {
        Testimonial existing = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + id));
        String oldName = existing.getClientName();
        existing.setClientName(testimonial.getClientName());
        existing.setDesignation(testimonial.getDesignation());
        existing.setCompany(testimonial.getCompany());
        existing.setCategory(testimonial.getCategory());
        existing.setContent(testimonial.getContent());
        existing.setFullStory(testimonial.getFullStory() != null ? testimonial.getFullStory() : testimonial.getContent());
        existing.setImageUrl(testimonial.getImageUrl());
        existing.setVideoUrl(testimonial.getVideoUrl());
        existing.setRating(testimonial.getRating());
        existing.setSortOrder(testimonial.getSortOrder());
        if (testimonial.getFeatured() != null) existing.setFeatured(testimonial.getFeatured());
        if (testimonial.getVerified() != null) existing.setVerified(testimonial.getVerified());
        if (testimonial.getActive() != null) existing.setActive(testimonial.getActive());
        if (testimonial.getSlug() != null && !testimonial.getSlug().isBlank()) {
            existing.setSlug(testimonial.getSlug());
        }
        Testimonial saved = testimonialRepository.save(existing);
        auditLogService.log("UPDATE", "Testimonial", saved.getId(),
                Map.of("clientName", oldName), Map.of("clientName", saved.getClientName()));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public void delete(Long id) {
        Testimonial testimonial = testimonialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial not found: " + id));
        auditLogService.log("DELETE", "Testimonial", id,
                Map.of("clientName", testimonial.getClientName()), null);
        testimonialRepository.deleteById(id);
    }

    private Specification<Testimonial> buildSpecification(String query, String category, Integer rating) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));
            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("clientName")), pattern),
                        cb.like(cb.lower(root.get("content")), pattern),
                        cb.like(cb.lower(root.get("company")), pattern),
                        cb.like(cb.lower(root.get("category")), pattern)
                ));
            }
            if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (rating != null && rating > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), rating));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Sort resolveSort(String sort) {
        if ("popular".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.DESC, "likes");
        }
        if ("oldest".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.ASC, "createdAt");
        }
        return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = SlugUtil.toSlug(name);
        String slug = baseSlug;
        int counter = 1;
        while (testimonialRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
