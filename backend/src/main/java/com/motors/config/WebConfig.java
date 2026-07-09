package com.motors.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.WebContentInterceptor;

import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebContentInterceptor publicCache = new WebContentInterceptor();
        publicCache.addCacheMapping(CacheControl.maxAge(5, TimeUnit.MINUTES).cachePublic(), "/v1/public/**");
        publicCache.addCacheMapping(CacheControl.maxAge(5, TimeUnit.MINUTES).cachePublic(), "/v1/products");
        publicCache.addCacheMapping(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic(), "/v1/categories");
        publicCache.addCacheMapping(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic(), "/v1/industries");
        registry.addInterceptor(publicCache);
    }
}
