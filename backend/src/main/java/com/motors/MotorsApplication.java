package com.motors;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MotorsApplication {

    public static void main(String[] args) {
        SpringApplication.run(MotorsApplication.class, args);
    }
}
