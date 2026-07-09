package com.motors.service;

import com.motors.dto.response.*;
import com.motors.entity.Setting;
import com.motors.mapper.CategoryMapper;
import com.motors.mapper.EntityMapper;
import com.motors.mapper.ProductMapper;
import com.motors.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicService {

    private final HeroSliderRepository heroSliderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IndustryRepository industryRepository;
    private final TestimonialRepository testimonialRepository;
    private final GalleryRepository galleryRepository;
    private final SettingRepository settingRepository;
    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;
    private final EntityMapper entityMapper;

    @Cacheable("homePageData")
    public Map<String, Object> getHomePageData() {
        Map<String, Object> data = new HashMap<>();
        data.put("heroSlides", entityMapper.toHeroSliderList(
                heroSliderRepository.findPublishedActive(Instant.now())));
        data.put("featuredProducts", productMapper.toResponseList(
                productRepository.findByFeaturedTrueAndActiveTrueOrderBySortOrderAsc()));
        data.put("categories", categoryMapper.toResponseList(
                categoryRepository.findByActiveTrueOrderBySortOrderAsc()));
        data.put("industries", entityMapper.toIndustryList(
                industryRepository.findByActiveTrueOrderBySortOrderAsc()));
        data.put("testimonials", entityMapper.toTestimonialList(
                testimonialRepository.findByActiveTrueOrderBySortOrderAsc()));
        data.put("gallery", entityMapper.toGalleryList(
                galleryRepository.findByActiveTrueOrderBySortOrderAsc()));
        data.put("settings", getPublicSettings());
        return data;
    }

    public Map<String, String> getPublicSettings() {
        Map<String, String> settings = new HashMap<>();
        settingRepository.findAllByOrderBySettingKeyAsc()
                .forEach(s -> settings.put(s.getSettingKey(), s.getSettingValue()));
        return settings;
    }

    public List<HeroSliderResponse> getHeroSlides() {
        return entityMapper.toHeroSliderList(
                heroSliderRepository.findPublishedActive(Instant.now()));
    }

    public List<IndustryResponse> getIndustries() {
        return entityMapper.toIndustryList(
                industryRepository.findByActiveTrueOrderBySortOrderAsc());
    }

    public List<TestimonialResponse> getTestimonials() {
        return entityMapper.toTestimonialList(
                testimonialRepository.findByActiveTrueOrderBySortOrderAsc());
    }

    public List<GalleryResponse> getGallery() {
        return entityMapper.toGalleryList(
                galleryRepository.findByActiveTrueOrderBySortOrderAsc());
    }
}
