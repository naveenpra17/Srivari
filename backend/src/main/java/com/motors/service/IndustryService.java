package com.motors.service;

import com.motors.dto.response.IndustryResponse;
import com.motors.entity.Industry;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.EntityMapper;
import com.motors.repository.IndustryRepository;
import com.motors.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class IndustryService {

    private final IndustryRepository industryRepository;
    private final EntityMapper entityMapper;
    private final AuditLogService auditLogService;

    public List<IndustryResponse> getActive() {
        return entityMapper.toIndustryList(
                industryRepository.findByActiveTrueOrderBySortOrderAsc());
    }

    public List<IndustryResponse> getAll() {
        return entityMapper.toIndustryList(industryRepository.findAll());
    }

    public IndustryResponse getById(Long id) {
        return industryRepository.findById(id)
                .map(entityMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Industry not found: " + id));
    }

    @Transactional
    public IndustryResponse create(Industry industry) {
        industry.setSlug(generateUniqueSlug(industry.getName()));
        Industry saved = industryRepository.save(industry);
        auditLogService.log("CREATE", "Industry", saved.getId(), null,
                Map.of("name", saved.getName()));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    public IndustryResponse update(Long id, Industry industry) {
        Industry existing = industryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Industry not found: " + id));
        String oldName = existing.getName();
        existing.setName(industry.getName());
        existing.setDescription(industry.getDescription());
        existing.setIcon(industry.getIcon());
        existing.setImageUrl(industry.getImageUrl());
        existing.setSortOrder(industry.getSortOrder());
        if (industry.getActive() != null) existing.setActive(industry.getActive());
        Industry saved = industryRepository.save(existing);
        auditLogService.log("UPDATE", "Industry", saved.getId(),
                Map.of("name", oldName), Map.of("name", saved.getName()));
        return entityMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Industry industry = industryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Industry not found: " + id));
        auditLogService.log("DELETE", "Industry", id, Map.of("name", industry.getName()), null);
        industryRepository.deleteById(id);
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = SlugUtil.toSlug(name);
        String slug = baseSlug;
        int counter = 1;
        while (industryRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
