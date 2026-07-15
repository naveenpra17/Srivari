package com.motors.config;

import com.motors.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class CategoryCatalogInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    private static final Map<String, String> DEFAULT_IMAGES = Map.of(
            "motors", "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=85",
            "pumps", "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=85",
            "pipes", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=85",
            "accessories", "https://images.unsplash.com/photo-1565193567171-5a81f4e0f3c7?w=600&q=85"
    );

    @Override
    @Transactional
    public void run(String... args) {
        categoryRepository.findAll().forEach(category -> {
            if ((category.getImageUrl() == null || category.getImageUrl().isBlank())
                    && DEFAULT_IMAGES.containsKey(category.getSlug())) {
                category.setImageUrl(DEFAULT_IMAGES.get(category.getSlug()));
                categoryRepository.save(category);
                log.info("Set default image for category: {}", category.getSlug());
            }
        });
    }
}
