package com.university.library.service;

import com.university.library.config.CohereConfig;
import com.university.library.config.GeminiConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiFacade {
    private final GeminiConfig geminiConfig;
    private final CohereConfig cohereConfig;

    private final WebClient webClient = WebClient.builder().build();


    public float[] generateEmbeddingWithCohere(String text) {
        String url = cohereConfig.getBaseUrl() + "/v1/embed";

        Map<String, Object> request = Map.of(
                "model", cohereConfig.getEmbeddingModel(),
                "texts", List.of(text),
                "input_type", "search_document" // hoặc "classification", tùy use case
        );

        try {
            Map<String, Object> response = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + cohereConfig.getApiKey())
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            System.out.println(">> Cohere embedding response = " + response);

            List<List<Double>> embeddings = (List<List<Double>>) response.get("embeddings");

            if (embeddings == null || embeddings.isEmpty()) {
                throw new RuntimeException("Cohere embedding result is null or empty");
            }

            List<Double> embeddingList = embeddings.get(0);
            float[] embedding = new float[embeddingList.size()];
            for (int i = 0; i < embeddingList.size(); i++) {
                embedding[i] = embeddingList.get(i).floatValue();
            }

            return embedding;

        } catch (Exception e) {
            throw new RuntimeException("Error generating embedding from Cohere: " + e.getMessage(), e);
        }
    }



    public String generateReply(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt must not be empty or null");
        }

        String url = geminiConfig.getBaseUrl() + "?key=" + geminiConfig.getApiKey();

        Map<String, Object> request = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        try {
            Map<String, Object> response = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            System.out.println(">> Gemini chat response = " + response);

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");

            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return parts.get(0).get("text").toString();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error generating reply: " + e.getMessage(), e);
        }

        return "Xin lỗi, tôi không thể phản hồi được";
    }
}