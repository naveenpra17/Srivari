package com.motors.service;

import com.motors.dto.response.GalleryResponse;
import com.motors.entity.Gallery;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.EntityMapper;
import com.motors.repository.GalleryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryRepository galleryRepository;
    private final EntityMapper entityMapper;
    private final AuditLogService auditLogService;

    public List<GalleryResponse> getActive() {
        return entityMapper.toGalleryList(
                galleryRepository.findByActiveTrueOrderBySortOrderAsc());
    }

    public List<GalleryResponse> getAll() {
        return entityMapper.toGalleryList(galleryRepository.findAll());
    }

    public GalleryResponse getById(Long id) {
        return galleryRepository.findById(id)
                .map(entityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found: " + id));
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public GalleryResponse create(Gallery gallery) {
        Gallery saved = galleryRepository.save(gallery);
        auditLogService.log("CREATE", "Gallery", saved.getId(), null,
                Map.of("title", saved.getTitle() != null ? saved.getTitle() : ""));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public GalleryResponse update(Long id, Gallery gallery) {
        Gallery existing = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found: " + id));
        String oldTitle = existing.getTitle();
        existing.setTitle(gallery.getTitle());
        existing.setDescription(gallery.getDescription());
        existing.setImageUrl(gallery.getImageUrl());
        existing.setCategory(gallery.getCategory());
        existing.setSortOrder(gallery.getSortOrder());
        if (gallery.getActive() != null) existing.setActive(gallery.getActive());
        Gallery saved = galleryRepository.save(existing);
        auditLogService.log("UPDATE", "Gallery", saved.getId(),
                Map.of("title", oldTitle != null ? oldTitle : ""),
                Map.of("title", saved.getTitle() != null ? saved.getTitle() : ""));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public void delete(Long id) {
        Gallery gallery = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found: " + id));
        auditLogService.log("DELETE", "Gallery", id,
                Map.of("title", gallery.getTitle() != null ? gallery.getTitle() : ""), null);
        galleryRepository.deleteById(id);
    }
}
