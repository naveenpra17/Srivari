package com.motors.service;

import com.motors.dto.response.HeroSliderResponse;
import com.motors.entity.HeroSlider;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.EntityMapper;
import com.motors.repository.HeroSliderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HeroSliderService {

    private final HeroSliderRepository heroSliderRepository;
    private final EntityMapper entityMapper;
    private final AuditLogService auditLogService;

    public List<HeroSliderResponse> getActive() {
        return entityMapper.toHeroSliderList(
                heroSliderRepository.findPublishedActive(Instant.now()));
    }

    public List<HeroSliderResponse> getAll() {
        return entityMapper.toHeroSliderList(heroSliderRepository.findAll());
    }

    public HeroSliderResponse getById(Long id) {
        return heroSliderRepository.findById(id)
                .map(entityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Hero slide not found: " + id));
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public HeroSliderResponse create(HeroSlider slide) {
        HeroSlider saved = heroSliderRepository.save(slide);
        auditLogService.log("CREATE", "HeroSlider", saved.getId(), null,
                Map.of("title", saved.getTitle() != null ? saved.getTitle() : ""));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public HeroSliderResponse update(Long id, HeroSlider slide) {
        HeroSlider existing = heroSliderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hero slide not found: " + id));
        String oldTitle = existing.getTitle();
        existing.setTitle(slide.getTitle());
        existing.setSubtitle(slide.getSubtitle());
        existing.setDescription(slide.getDescription());
        existing.setImageUrl(slide.getImageUrl());
        existing.setVideoUrl(slide.getVideoUrl());
        existing.setCtaText(slide.getCtaText());
        existing.setCtaLink(slide.getCtaLink());
        existing.setSecondaryCtaText(slide.getSecondaryCtaText());
        existing.setSecondaryCtaLink(slide.getSecondaryCtaLink());
        existing.setSortOrder(slide.getSortOrder());
        if (slide.getActive() != null) existing.setActive(slide.getActive());
        existing.setPublishAt(slide.getPublishAt());
        HeroSlider saved = heroSliderRepository.save(existing);
        auditLogService.log("UPDATE", "HeroSlider", saved.getId(),
                Map.of("title", oldTitle != null ? oldTitle : ""),
                Map.of("title", saved.getTitle() != null ? saved.getTitle() : ""));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public void delete(Long id) {
        HeroSlider slide = heroSliderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hero slide not found: " + id));
        auditLogService.log("DELETE", "HeroSlider", id,
                Map.of("title", slide.getTitle() != null ? slide.getTitle() : ""), null);
        heroSliderRepository.deleteById(id);
    }
}
