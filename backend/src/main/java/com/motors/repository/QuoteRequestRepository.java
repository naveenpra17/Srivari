package com.motors.repository;

import com.motors.entity.QuoteRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {

    Page<QuoteRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByIsReadFalse();
}
