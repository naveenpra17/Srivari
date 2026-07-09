package com.motors.security;

public final class SecurityConstants {

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_EDITOR = "EDITOR";
    public static final String ROLE_VIEWER = "VIEWER";

    public static final String[] PUBLIC_ENDPOINTS = {
            "/v1/auth/**",
            "/v1/public/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/actuator/health"
    };

    private SecurityConstants() {}
}
