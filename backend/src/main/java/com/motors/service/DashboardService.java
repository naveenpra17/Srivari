package com.motors.service;

import com.motors.dto.response.DashboardStatsResponse;
import com.motors.entity.Setting;
import com.motors.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IndustryRepository industryRepository;
    private final TestimonialRepository testimonialRepository;
    private final GalleryRepository galleryRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final UserRepository userRepository;
    private final SettingRepository settingRepository;

    public DashboardStatsResponse getStats() {
        Map<String, String> siteStats = new HashMap<>();
        List<Setting> settings = settingRepository.findAllByOrderBySettingKeyAsc();
        settings.stream()
                .filter(s -> s.getSettingKey().startsWith("years_")
                        || s.getSettingKey().startsWith("happy_")
                        || s.getSettingKey().startsWith("products_delivered")
                        || s.getSettingKey().startsWith("countries_"))
                .forEach(s -> siteStats.put(s.getSettingKey(), s.getSettingValue()));

        return DashboardStatsResponse.builder()
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalIndustries(industryRepository.count())
                .totalTestimonials(testimonialRepository.count())
                .totalGalleryItems(galleryRepository.count())
                .unreadMessages(contactMessageRepository.countByIsReadFalse())
                .totalUsers(userRepository.count())
                .siteStats(siteStats)
                .build();
    }
}
