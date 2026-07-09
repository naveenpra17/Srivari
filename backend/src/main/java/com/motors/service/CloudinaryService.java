package com.motors.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.motors.dto.response.ImageUploadResponse;
import com.motors.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${app.cloudinary.cloud-name}") String cloudName,
            @Value("${app.cloudinary.api-key}") String apiKey,
            @Value("${app.cloudinary.api-secret}") String apiSecret) {

        if (cloudName != null && !cloudName.isBlank()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true));
        } else {
            this.cloudinary = null;
        }
    }

    public ImageUploadResponse uploadImage(MultipartFile file, String folder) {
        if (cloudinary == null) {
            throw new BusinessException("Cloudinary is not configured. Set CLOUDINARY environment variables.");
        }

        validateFile(file);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "motors/" + folder, "resource_type", "auto"));

            return ImageUploadResponse.builder()
                    .url((String) result.get("secure_url"))
                    .publicId((String) result.get("public_id"))
                    .format((String) result.get("format"))
                    .bytes(((Number) result.get("bytes")).longValue())
                    .build();
        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new BusinessException("Failed to upload image");
        }
    }

    public void deleteImage(String publicId) {
        if (cloudinary != null && publicId != null) {
            try {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            } catch (IOException e) {
                log.warn("Failed to delete image from Cloudinary: {}", publicId);
            }
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("File is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("Only image files are allowed");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BusinessException("File size must not exceed 10MB");
        }
    }
}
