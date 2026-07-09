package com.motors.repository;

import com.motors.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {

    Optional<Setting> findBySettingKey(String settingKey);

    List<Setting> findAllByOrderBySettingKeyAsc();
}
