package com.university.library.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "cohere")
@Data
public class CohereConfig {
    private String apiKey;
    private String embeddingModel;
    private String baseUrl;
}
