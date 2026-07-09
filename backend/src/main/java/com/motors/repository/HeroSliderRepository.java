package com.motors.repository;

import com.motors.entity.HeroSlider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface HeroSliderRepository extends JpaRepository<HeroSlider, Long> {

    List<HeroSlider> findByActiveTrueOrderBySortOrderAsc();

    @Query("""
            SELECT h FROM HeroSlider h
            WHERE h.active = true
              AND (h.publishAt IS NULL OR h.publishAt <= :now)
            ORDER BY h.sortOrder ASC
            """)
    List<HeroSlider> findPublishedActive(Instant now);
}
