package com.motors.service;

import com.motors.dto.request.ContactRequest;
import com.motors.dto.response.ContactMessageResponse;
import com.motors.dto.response.PageResponse;
import com.motors.entity.ContactMessage;
import com.motors.exception.ResourceNotFoundException;
import com.motors.mapper.EntityMapper;
import com.motors.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final EntityMapper entityMapper;
    private final EmailService emailService;
    private final AuditLogService auditLogService;

    @Transactional
    public ContactMessageResponse submit(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();

        ContactMessage saved = contactMessageRepository.save(message);
        log.info("New contact message from: {}", request.getEmail());

        emailService.sendContactNotification(saved);

        return entityMapper.toResponse(saved);
    }

    public PageResponse<ContactMessageResponse> getAll(Pageable pageable) {
        return PageResponse.from(
                contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable)
                        .map(entityMapper::toResponse));
    }

    @Transactional
    public ContactMessageResponse markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + id));
        message.setIsRead(true);
        return entityMapper.toResponse(contactMessageRepository.save(message));
    }

    @Transactional
    public void delete(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + id));
        auditLogService.log("DELETE", "ContactMessage", id,
                Map.of("email", message.getEmail(), "name", message.getName()), null);
        contactMessageRepository.deleteById(id);
    }
}
