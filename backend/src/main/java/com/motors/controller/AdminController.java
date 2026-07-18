package com.motors.controller;

import com.motors.dto.response.ApiResponse;
import com.motors.dto.response.*;
import com.motors.service.AuditLogService;
import com.motors.service.CloudinaryService;
import com.motors.service.ContactService;
import com.motors.service.DashboardService;
import com.motors.service.QuoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'EDITOR', 'VIEWER')")
@Tag(name = "Admin")
public class AdminController {

    private final DashboardService dashboardService;
    private final ContactService contactService;
    private final QuoteService quoteService;
    private final AuditLogService auditLogService;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/products/by-category")
    @Operation(summary = "Get product counts grouped by category")
    public ResponseEntity<ApiResponse<List<ChartCountResponse>>> productsByCategory() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getProductsByCategory()));
    }

    @GetMapping("/products/status-distribution")
    @Operation(summary = "Get active vs inactive product counts")
    public ResponseEntity<ApiResponse<StatusDistributionResponse>> productStatusDistribution() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getProductStatusDistribution()));
    }

    @GetMapping("/inquiries/monthly")
    @Operation(summary = "Get monthly contact and quote inquiry counts")
    public ResponseEntity<ApiResponse<List<ChartCountResponse>>> monthlyInquiries() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getMonthlyInquiries()));
    }

    @GetMapping("/industries/top")
    @Operation(summary = "Get top industries for dashboard chart")
    public ResponseEntity<ApiResponse<List<ChartCountResponse>>> topIndustries() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTopIndustries()));
    }

    @GetMapping("/messages")
    @Operation(summary = "Get contact messages")
    public ResponseEntity<ApiResponse<PageResponse<?>>> messages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(contactService.getAll(pageable)));
    }

    @PatchMapping("/messages/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Mark message as read")
    public ResponseEntity<ApiResponse<?>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(contactService.markAsRead(id)));
    }

    @DeleteMapping("/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete contact message")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted", null));
    }

    @GetMapping("/quotes")
    @Operation(summary = "Get quote requests")
    public ResponseEntity<ApiResponse<PageResponse<QuoteResponse>>> quotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(quoteService.getAll(pageable)));
    }

    @PatchMapping("/quotes/{id}/read")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Mark quote as read")
    public ResponseEntity<ApiResponse<QuoteResponse>> markQuoteRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(quoteService.markAsRead(id)));
    }

    @DeleteMapping("/quotes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete quote request")
    public ResponseEntity<ApiResponse<Void>> deleteQuote(@PathVariable Long id) {
        quoteService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Quote deleted", null));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    @Operation(summary = "Upload image to Cloudinary")
    public ResponseEntity<ApiResponse<ImageUploadResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String folder) {
        return ResponseEntity.ok(ApiResponse.success(cloudinaryService.uploadImage(file, folder)));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get audit logs")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> auditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getAll(pageable)));
    }
}
