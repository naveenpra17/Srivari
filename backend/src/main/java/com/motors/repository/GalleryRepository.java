package com.motors.repository;

import com.motors.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {

    List<Gallery> findByActiveTrueOrderBySortOrderAsc();

    List<Gallery> findByCategoryAndActiveTrueOrderBySortOrderAsc(String category);
}
