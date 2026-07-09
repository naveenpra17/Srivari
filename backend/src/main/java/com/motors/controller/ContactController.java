package com.motors.controller;

import com.motors.dto.request.ContactRequest;
import com.motors.dto.response.ApiResponse;
import com.motors.dto.response.ContactMessageResponse;
import com.motors.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contact")
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/v1/contact")
    @Operation(summary = "Submit contact form")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> submit(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", contactService.submit(request)));
    }
}
