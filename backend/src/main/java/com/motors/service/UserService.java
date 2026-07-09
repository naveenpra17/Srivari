package com.motors.service;

import com.motors.dto.request.UserRequest;
import com.motors.dto.response.UserResponse;
import com.motors.entity.Role;
import com.motors.entity.User;
import com.motors.exception.BusinessException;
import com.motors.exception.ResourceNotFoundException;
import com.motors.repository.RoleRepository;
import com.motors.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getById(Long id) {
        return userRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already in use");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BusinessException("Password is required for new users");
        }
        if (request.getRoles() == null || request.getRoles().isEmpty()) {
            throw new BusinessException("At least one role is required");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .active(request.getActive() != null ? request.getActive() : true)
                .roles(resolveRoles(request.getRoles()))
                .build();

        User saved = userRepository.save(user);
        auditLogService.log("CREATE", "User", saved.getId(), null,
                Map.of("email", saved.getEmail()));
        return toResponse(saved);
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already in use");
        }

        String oldEmail = user.getEmail();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        if (request.getActive() != null) user.setActive(request.getActive());
        if (request.getRoles() != null) user.setRoles(resolveRoles(request.getRoles()));
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User saved = userRepository.save(user);
        auditLogService.log("UPDATE", "User", saved.getId(),
                Map.of("email", oldEmail), Map.of("email", saved.getEmail()));
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        if (user.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName()))) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getActive() && u.getRoles().stream().anyMatch(r -> "ADMIN".equals(r.getName())))
                    .count();
            if (adminCount <= 1) {
                throw new BusinessException("Cannot delete the last active admin user");
            }
        }
        auditLogService.log("DELETE", "User", id, Map.of("email", user.getEmail()), null);
        userRepository.deleteById(id);
    }

    public List<String> getAvailableRoles() {
        return roleRepository.findAll().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
    }

    private Set<Role> resolveRoles(Set<String> roleNames) {
        Set<Role> roles = new HashSet<>();
        for (String name : roleNames) {
            Role role = roleRepository.findByName(name)
                    .orElseThrow(() -> new BusinessException("Invalid role: " + name));
            roles.add(role);
        }
        return roles;
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .active(user.getActive())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
