package com.motors.service;

import com.motors.dto.request.LoginRequest;
import com.motors.dto.request.PasswordChangeRequest;
import com.motors.dto.request.ProfileUpdateRequest;
import com.motors.dto.request.RefreshTokenRequest;
import com.motors.dto.response.AuthResponse;
import com.motors.entity.User;
import com.motors.exception.BusinessException;
import com.motors.repository.UserRepository;
import com.motors.security.JwtTokenProvider;
import com.motors.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(principal);

        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new BusinessException("User not found"));
        user.setRefreshToken(refreshToken);
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        log.info("User logged in: {}", principal.getEmail());

        return buildAuthResponse(accessToken, refreshToken, principal);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        User user = userRepository.findByRefreshToken(request.getRefreshToken())
                .orElseThrow(() -> new BusinessException("Invalid refresh token"));

        UserPrincipal principal = new UserPrincipal(user);
        String accessToken = jwtTokenProvider.generateAccessToken(principal);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(principal);

        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return buildAuthResponse(accessToken, newRefreshToken, principal);
    }

    public AuthResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new BusinessException("User not found"));
        return AuthResponse.builder()
                .user(buildUserResponse(user))
                .build();
    }

    @Transactional
    public AuthResponse updateProfile(ProfileUpdateRequest request) {
        UserPrincipal principal = getCurrentPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        userRepository.save(user);

        return AuthResponse.builder().user(buildUserResponse(user)).build();
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        UserPrincipal principal = getCurrentPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserPrincipal getCurrentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }

    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal principal) {
            userRepository.findByEmail(principal.getEmail()).ifPresent(user -> {
                user.setRefreshToken(null);
                userRepository.save(user);
            });
        }
        SecurityContextHolder.clearContext();
    }

    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, UserPrincipal principal) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration())
                .user(buildUserResponse(principal))
                .build();
    }

    private AuthResponse.UserResponse buildUserResponse(UserPrincipal principal) {
        User user = userRepository.findByEmail(principal.getEmail()).orElse(null);
        return user != null ? buildUserResponse(user) : AuthResponse.UserResponse.builder()
                .id(principal.getId())
                .email(principal.getEmail())
                .firstName(principal.getFirstName())
                .lastName(principal.getLastName())
                .roles(principal.getAuthorities().stream()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .collect(Collectors.toSet()))
                .build();
    }

    private AuthResponse.UserResponse buildUserResponse(User user) {
        return AuthResponse.UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName())
                        .collect(Collectors.toSet()))
                .build();
    }
}
