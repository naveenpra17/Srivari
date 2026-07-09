package com.motors.repository;

import com.motors.entity.Industry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IndustryRepository extends JpaRepository<Industry, Long> {

    Optional<Industry> findBySlug(String slug);

    List<Industry> findByActiveTrueOrderBySortOrderAsc();

    boolean existsBySlug(String slug);
}
