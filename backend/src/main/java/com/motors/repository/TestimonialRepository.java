package com.motors.repository;

import com.motors.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long>, JpaSpecificationExecutor<Testimonial> {

    List<Testimonial> findByActiveTrueOrderBySortOrderAsc();

    List<Testimonial> findByActiveTrueAndFeaturedTrueOrderByLikesDesc();

    Optional<Testimonial> findBySlugAndActiveTrue(String slug);

    List<Testimonial> findTop4ByActiveTrueAndCategoryAndIdNotOrderByLikesDesc(String category, Long id);

    boolean existsBySlug(String slug);

    @Query("SELECT DISTINCT t.category FROM Testimonial t WHERE t.active = true AND t.category IS NOT NULL ORDER BY t.category")
    List<String> findDistinctActiveCategories();
}
