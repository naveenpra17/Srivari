package com.motors.config;

import com.motors.entity.Role;
import com.motors.entity.Setting;
import com.motors.entity.User;
import com.motors.repository.RoleRepository;
import com.motors.repository.SettingRepository;
import com.motors.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private static final String INVALID_SEED_PASSWORD_HASH =
            "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oXH5qK5qK5qK";
    private static final String DEFAULT_ADMIN_EMAIL = "admin@motors.com";
    private static final String DEFAULT_ADMIN_PASSWORD = "Admin@123";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final SettingRepository settingRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData() {
        return args -> {
            initRoles();
            initAdminUser();
            initDefaultSettings();
        };
    }

    private void initRoles() {
        createRoleIfNotExists("ADMIN", "Full system access");
        createRoleIfNotExists("EDITOR", "Content management access");
        createRoleIfNotExists("VIEWER", "Read-only admin access");
    }

    private void createRoleIfNotExists(String name, String description) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder().name(name).description(description).build());
            log.info("Created role: {}", name);
        }
    }

    private void initAdminUser() {
        userRepository.findByEmail(DEFAULT_ADMIN_EMAIL).ifPresentOrElse(user -> {
            if (INVALID_SEED_PASSWORD_HASH.equals(user.getPassword())) {
                user.setPassword(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD));
                userRepository.save(user);
                log.warn("Reset admin password — replaced invalid seed placeholder hash");
            }
        }, () -> {
            Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
            User admin = User.builder()
                    .email(DEFAULT_ADMIN_EMAIL)
                    .password(passwordEncoder.encode(DEFAULT_ADMIN_PASSWORD))
                    .firstName("System")
                    .lastName("Administrator")
                    .phone("+91-9876543210")
                    .active(true)
                    .roles(Set.of(adminRole))
                    .build();
            userRepository.save(admin);
            log.info("Created default admin user: {}", DEFAULT_ADMIN_EMAIL);
        });
    }

    private void initDefaultSettings() {
        createSettingIfNotExists("company_name", "Sri Vaari", "STRING", "Company display name");
        createSettingIfNotExists("company_tagline", "Where Innovation Meets Reliability", "STRING", "Company tagline");
        createSettingIfNotExists("company_phone", "+91-9876543210", "STRING", "Primary contact phone");
        createSettingIfNotExists("company_email", "info@motors.com", "STRING", "Primary contact email");
        createSettingIfNotExists("company_address", "123 Industrial Estate, Mumbai, Maharashtra 400001, India", "STRING", "Company address");
        createSettingIfNotExists("company_working_hours", "Mon - Sat: 9:00 AM - 6:00 PM", "STRING", "Working hours");
        createSettingIfNotExists("years_experience", "25", "NUMBER", "Years of experience");
        createSettingIfNotExists("happy_clients", "1500", "NUMBER", "Happy clients");
        createSettingIfNotExists("products_delivered", "5000", "NUMBER", "Products delivered");
        createSettingIfNotExists("countries_served", "50", "NUMBER", "Countries served");
        createSettingIfNotExists("about_mission", "To deliver world-class industrial motors and pumps that power industries globally.", "TEXT", "Mission");
        createSettingIfNotExists("about_vision", "To be the most trusted name in industrial motor solutions worldwide.", "TEXT", "Vision");
        createSettingIfNotExists("about_history", "Founded in 1999, Sri Vaari has grown to a global leader in industrial motor manufacturing.", "TEXT", "History");
        createSettingIfNotExists("about_achievements", "ISO 9001:2015 Certified | CE Marked | 25+ Industry Awards", "TEXT", "Achievements");
        createSettingIfNotExists("chat_provider", "whatsapp", "STRING", "Active chat provider (whatsapp, tawk, crisp, intercom, none)");
        createSettingIfNotExists("chat_widget_enabled", "true", "BOOLEAN", "Show floating chat widget on public site");
        createSettingIfNotExists("whatsapp_phone", "", "STRING", "WhatsApp number digits only (empty uses company phone)");
        createSettingIfNotExists("whatsapp_tooltip", "Chat with us on WhatsApp", "STRING", "Chat widget tooltip text");
        createSettingIfNotExists("whatsapp_message_general", "Hello, I would like to know more about your products.", "TEXT", "Default WhatsApp message");
        createSettingIfNotExists("whatsapp_message_product", "Hello, I am interested in {productName}. Please share more details.", "TEXT", "WhatsApp message on product pages");
        createSettingIfNotExists("whatsapp_message_contact", "Hello, I would like to get in touch with Sri Vaari.", "TEXT", "WhatsApp message on contact section");
    }

    private void createSettingIfNotExists(String key, String value, String type, String description) {
        if (settingRepository.findBySettingKey(key).isEmpty()) {
            settingRepository.save(Setting.builder()
                    .settingKey(key)
                    .settingValue(value)
                    .settingType(type)
                    .description(description)
                    .build());
        }
    }
}
