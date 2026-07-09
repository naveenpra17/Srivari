package com.motors.controller;

import com.motors.dto.response.ApiResponse;
import com.motors.service.PublicService;
import com.motors.service.SitemapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/public")
@RequiredArgsConstructor
@Tag(name = "Public")
public class PublicController {

    private final PublicService publicService;
    private final SitemapService sitemapService;

    @GetMapping("/health")
    @Operation(summary = "Health check for deployment probes")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

    @GetMapping("/home")
    @Operation(summary = "Get all homepage data")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHomePageData() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getHomePageData()));
    }

    @GetMapping("/settings")
    @Operation(summary = "Get public site settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(publicService.getPublicSettings()));
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    @Operation(summary = "Generate XML sitemap")
    public ResponseEntity<String> sitemap() {
        return ResponseEntity.ok(sitemapService.generateSitemap());
    }

    @GetMapping(value = "/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    @Operation(summary = "Generate robots.txt")
    public ResponseEntity<String> robots() {
        return ResponseEntity.ok(sitemapService.generateRobotsTxt());
    }
}
