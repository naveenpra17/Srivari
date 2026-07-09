package com.motors.controller;

import com.motors.dto.response.ApiResponse;
import com.motors.dto.response.*;
import com.motors.entity.*;
import com.motors.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Content Management")
public class ContentController {

    private final IndustryService industryService;
    private final HeroSliderService heroSliderService;
    private final GalleryService galleryService;
    private final TestimonialService testimonialService;
    private final SettingService settingService;

    // Industries
    @GetMapping("/v1/industries")
    @Operation(summary = "List active industries")
    public ResponseEntity<ApiResponse<List<IndustryResponse>>> industries() {
        return ResponseEntity.ok(ApiResponse.success(industryService.getActive()));
    }

    @GetMapping("/v1/industries/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    @Operation(summary = "List all industries (admin)")
    public ResponseEntity<ApiResponse<List<IndustryResponse>>> industriesAll() {
        return ResponseEntity.ok(ApiResponse.success(industryService.getAll()));
    }

    @PostMapping("/v1/industries")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<IndustryResponse>> createIndustry(@RequestBody Industry industry) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(industryService.create(industry)));
    }

    @PutMapping("/v1/industries/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<IndustryResponse>> updateIndustry(@PathVariable Long id, @RequestBody Industry industry) {
        return ResponseEntity.ok(ApiResponse.success(industryService.update(id, industry)));
    }

    @DeleteMapping("/v1/industries/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteIndustry(@PathVariable Long id) {
        industryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // Hero Slider
    @GetMapping("/v1/hero-slider")
    public ResponseEntity<ApiResponse<List<HeroSliderResponse>>> heroSlides() {
        return ResponseEntity.ok(ApiResponse.success(heroSliderService.getActive()));
    }

    @GetMapping("/v1/hero-slider/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<HeroSliderResponse>>> heroSlidesAll() {
        return ResponseEntity.ok(ApiResponse.success(heroSliderService.getAll()));
    }

    @PostMapping("/v1/hero-slider")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<HeroSliderResponse>> createSlide(@RequestBody HeroSlider slide) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(heroSliderService.create(slide)));
    }

    @PutMapping("/v1/hero-slider/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<HeroSliderResponse>> updateSlide(@PathVariable Long id, @RequestBody HeroSlider slide) {
        return ResponseEntity.ok(ApiResponse.success(heroSliderService.update(id, slide)));
    }

    @DeleteMapping("/v1/hero-slider/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSlide(@PathVariable Long id) {
        heroSliderService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // Gallery
    @GetMapping("/v1/gallery")
    public ResponseEntity<ApiResponse<List<GalleryResponse>>> gallery() {
        return ResponseEntity.ok(ApiResponse.success(galleryService.getActive()));
    }

    @GetMapping("/v1/gallery/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<GalleryResponse>>> galleryAll() {
        return ResponseEntity.ok(ApiResponse.success(galleryService.getAll()));
    }

    @PostMapping("/v1/gallery")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<GalleryResponse>> createGallery(@RequestBody Gallery gallery) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(galleryService.create(gallery)));
    }

    @PutMapping("/v1/gallery/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<GalleryResponse>> updateGallery(@PathVariable Long id, @RequestBody Gallery gallery) {
        return ResponseEntity.ok(ApiResponse.success(galleryService.update(id, gallery)));
    }

    @DeleteMapping("/v1/gallery/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteGallery(@PathVariable Long id) {
        galleryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // Testimonials
    @GetMapping("/v1/testimonials")
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> testimonials() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getActive()));
    }

    @GetMapping("/v1/testimonials/featured")
    @Operation(summary = "Get featured testimonials")
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> featuredTestimonials() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getFeatured()));
    }

    @GetMapping("/v1/testimonials/categories")
    @Operation(summary = "Get testimonial categories")
    public ResponseEntity<ApiResponse<List<String>>> testimonialCategories() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getCategories()));
    }

    @GetMapping("/v1/testimonials/search")
    @Operation(summary = "Search and filter testimonials")
    public ResponseEntity<ApiResponse<PageResponse<TestimonialResponse>>> searchTestimonials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer rating,
            @RequestParam(defaultValue = "latest") String sort) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(
                testimonialService.search(q, category, rating, sort, pageable)));
    }

    @GetMapping("/v1/testimonials/slug/{slug}")
    @Operation(summary = "Get testimonial by slug")
    public ResponseEntity<ApiResponse<TestimonialResponse>> testimonialBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getBySlug(slug)));
    }

    @GetMapping("/v1/testimonials/slug/{slug}/related")
    @Operation(summary = "Get related testimonials")
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> relatedTestimonials(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getRelated(slug)));
    }

    @PostMapping("/v1/testimonials/{id}/like")
    @Operation(summary = "Like a testimonial")
    public ResponseEntity<ApiResponse<TestimonialResponse>> likeTestimonial(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.like(id)));
    }

    @GetMapping("/v1/testimonials/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
    public ResponseEntity<ApiResponse<List<TestimonialResponse>>> testimonialsAll() {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.getAll()));
    }

    @PostMapping("/v1/testimonials")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<TestimonialResponse>> createTestimonial(@RequestBody Testimonial testimonial) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(testimonialService.create(testimonial)));
    }

    @PutMapping("/v1/testimonials/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<TestimonialResponse>> updateTestimonial(@PathVariable Long id, @RequestBody Testimonial testimonial) {
        return ResponseEntity.ok(ApiResponse.success(testimonialService.update(id, testimonial)));
    }

    @DeleteMapping("/v1/testimonials/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTestimonial(@PathVariable Long id) {
        testimonialService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    // Settings
    @GetMapping("/v1/settings")
    public ResponseEntity<ApiResponse<List<Setting>>> settings() {
        return ResponseEntity.ok(ApiResponse.success(settingService.getAll()));
    }

    @PutMapping("/v1/settings")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody Map<String, String> settings) {
        settingService.updateBulk(settings);
        return ResponseEntity.ok(ApiResponse.success("Settings updated", null));
    }
}
