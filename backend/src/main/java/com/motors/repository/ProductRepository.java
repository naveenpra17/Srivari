package com.motors.repository;

import com.motors.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.images WHERE p.slug = :slug")
    Optional<Product> findBySlugWithImages(@Param("slug") String slug);

    @EntityGraph(attributePaths = {"category"})
    List<Product> findByFeaturedTrueAndActiveTrueOrderBySortOrderAsc();

    List<Product> findByActiveTrueOrderBySortOrderAsc();

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByActiveTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = {"category"})
    @Query(
            value = "SELECT p FROM Product p WHERE p.active = true AND " +
                    "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(COALESCE(p.shortDescription, '')) LIKE LOWER(CONCAT('%', :search, '%')))",
            countQuery = "SELECT COUNT(p) FROM Product p WHERE p.active = true AND " +
                    "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                    "LOWER(COALESCE(p.shortDescription, '')) LIKE LOWER(CONCAT('%', :search, '%')))"
    )
    Page<Product> searchActive(@Param("search") String search, Pageable pageable);

    long countByActiveTrue();

    long countByActiveFalse();

    @Query("""
            SELECT c.name, COUNT(p)
            FROM Product p
            JOIN p.category c
            GROUP BY c.name
            ORDER BY COUNT(p) DESC
            """)
    List<Object[]> countProductsByCategoryName();

    boolean existsBySlug(String slug);
}
