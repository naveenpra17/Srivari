package com.motors.service;

import com.motors.dto.request.QuoteRequestDto;
import com.motors.dto.response.PageResponse;
import com.motors.dto.response.QuoteResponse;
import com.motors.entity.Product;
import com.motors.entity.QuoteRequest;
import com.motors.exception.ResourceNotFoundException;
import com.motors.repository.ProductRepository;
import com.motors.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final AuditLogService auditLogService;

    @Transactional
    public QuoteResponse submit(QuoteRequestDto dto) {
        QuoteRequest quote = QuoteRequest.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .company(dto.getCompany())
                .quantity(dto.getQuantity())
                .message(dto.getMessage())
                .build();

        if (dto.getProductId() != null) {
            Product product = productRepository.findById(dto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            quote.setProduct(product);
            quote.setProductName(product.getName());
        }

        QuoteRequest saved = quoteRequestRepository.save(quote);
        log.info("New quote request from {} for product {}", dto.getEmail(), quote.getProductName());
        try {
            emailService.sendQuoteNotification(saved);
        } catch (Exception e) {
            log.warn("Quote saved but email notification failed for {}: {}", dto.getEmail(), e.getMessage());
        }
        return toResponse(saved);
    }

    public PageResponse<QuoteResponse> getAll(Pageable pageable) {
        return PageResponse.from(
                quoteRequestRepository.findAllByOrderByCreatedAtDesc(pageable)
                        .map(this::toResponse));
    }

    @Transactional
    public QuoteResponse markAsRead(Long id) {
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found: " + id));
        quote.setIsRead(true);
        return toResponse(quoteRequestRepository.save(quote));
    }

    @Transactional
    public void delete(Long id) {
        QuoteRequest quote = quoteRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote not found: " + id));
        auditLogService.log("DELETE", "QuoteRequest", id,
                Map.of("email", quote.getEmail(), "product", quote.getProductName() != null ? quote.getProductName() : ""), null);
        quoteRequestRepository.deleteById(id);
    }

    public long countUnread() {
        return quoteRequestRepository.countByIsReadFalse();
    }

    private QuoteResponse toResponse(QuoteRequest quote) {
        return QuoteResponse.builder()
                .id(quote.getId())
                .productId(quote.getProduct() != null ? quote.getProduct().getId() : null)
                .productName(quote.getProductName())
                .name(quote.getName())
                .email(quote.getEmail())
                .phone(quote.getPhone())
                .company(quote.getCompany())
                .quantity(quote.getQuantity())
                .message(quote.getMessage())
                .isRead(quote.getIsRead())
                .createdAt(quote.getCreatedAt())
                .build();
    }
}
