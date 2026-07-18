package com.motors.service;

import com.motors.dto.response.ChartCountResponse;
import com.motors.dto.response.DashboardStatsResponse;
import com.motors.dto.response.StatusDistributionResponse;
import com.motors.entity.Setting;
import com.motors.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IndustryRepository industryRepository;
    private final TestimonialRepository testimonialRepository;
    private final GalleryRepository galleryRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final QuoteRequestRepository quoteRequestRepository;
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

    public List<ChartCountResponse> getProductsByCategory() {
        return productRepository.countProductsByCategoryName().stream()
                .map(row -> ChartCountResponse.builder()
                        .category((String) row[0])
                        .count(((Number) row[1]).longValue())
                        .build())
                .collect(Collectors.toList());
    }

    public StatusDistributionResponse getProductStatusDistribution() {
        long active = productRepository.countByActiveTrue();
        long inactive = productRepository.countByActiveFalse();
        return StatusDistributionResponse.builder()
                .active(active)
                .inactive(inactive)
                .build();
    }

    public List<ChartCountResponse> getMonthlyInquiries() {
        Map<YearMonth, Long> counts = new LinkedHashMap<>();
        YearMonth current = YearMonth.now(ZoneOffset.UTC);
        for (int i = 5; i >= 0; i--) {
            counts.put(current.minusMonths(i), 0L);
        }

        Instant since = current.minusMonths(5).atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        contactMessageRepository.findAll().stream()
                .filter(message -> message.getCreatedAt() != null && !message.getCreatedAt().isBefore(since))
                .forEach(message -> incrementMonth(counts, message.getCreatedAt()));
        quoteRequestRepository.findAll().stream()
                .filter(quote -> quote.getCreatedAt() != null && !quote.getCreatedAt().isBefore(since))
                .forEach(quote -> incrementMonth(counts, quote.getCreatedAt()));

        List<ChartCountResponse> result = new ArrayList<>();
        counts.forEach((month, count) -> result.add(ChartCountResponse.builder()
                .month(month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + month.getYear())
                .count(count)
                .build()));
        return result;
    }

    public List<ChartCountResponse> getTopIndustries() {
        return industryRepository.findByActiveTrueOrderBySortOrderAsc().stream()
                .limit(6)
                .map(industry -> ChartCountResponse.builder()
                        .industry(industry.getName())
                        .count(Math.max(1, 6 - industry.getSortOrder()))
                        .build())
                .collect(Collectors.toList());
    }

    private void incrementMonth(Map<YearMonth, Long> counts, Instant createdAt) {
        YearMonth month = YearMonth.from(createdAt.atZone(ZoneOffset.UTC));
        if (counts.containsKey(month)) {
            counts.put(month, counts.get(month) + 1);
        }
    }
}
