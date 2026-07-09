package com.motors.service;

import com.motors.entity.Setting;
import com.motors.exception.ResourceNotFoundException;
import com.motors.repository.SettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;
    private final AuditLogService auditLogService;

    public List<Setting> getAll() {
        return settingRepository.findAllByOrderBySettingKeyAsc();
    }

    public Setting getByKey(String key) {
        return settingRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found: " + key));
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public Setting update(String key, String value) {
        Setting setting = settingRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found: " + key));
        String oldValue = setting.getSettingValue();
        setting.setSettingValue(value);
        Setting saved = settingRepository.save(setting);
        auditLogService.log("UPDATE", "Setting", saved.getId(),
                Map.of(key, oldValue != null ? oldValue : ""), Map.of(key, value));
        return saved;
    }

    @Transactional
    @CacheEvict(value = "homePageData", allEntries = true)
    public void updateBulk(Map<String, String> settings) {
        settings.forEach((key, value) -> {
            settingRepository.findBySettingKey(key).ifPresent(setting -> {
                String oldValue = setting.getSettingValue();
                setting.setSettingValue(value);
                Setting saved = settingRepository.save(setting);
                auditLogService.log("UPDATE", "Setting", saved.getId(),
                        Map.of(key, oldValue != null ? oldValue : ""),
                        Map.of(key, value));
            });
        });
    }
}
