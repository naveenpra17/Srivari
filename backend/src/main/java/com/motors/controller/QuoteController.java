package com.motors.controller;

import com.motors.dto.request.QuoteRequestDto;
import com.motors.dto.response.ApiResponse;
import com.motors.dto.response.QuoteResponse;
import com.motors.service.QuoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/quotes")
@RequiredArgsConstructor
@Tag(name = "Quotes")
public class QuoteController {

    private final QuoteService quoteService;

    @PostMapping
    @Operation(summary = "Submit quote request")
    public ResponseEntity<ApiResponse<QuoteResponse>> submit(@Valid @RequestBody QuoteRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Quote request submitted successfully", quoteService.submit(request)));
    }
}
