package com.university.library.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort;

import java.io.IOException;

@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        mapper.registerModule(new JavaTimeModule());
        
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        SimpleModule sortModule = new SimpleModule();
        sortModule.addSerializer(Sort.class, new SortSerializer());
        mapper.registerModule(sortModule);
        
        return mapper;
    }
    
    public static class SortSerializer extends JsonSerializer<Sort> {
        @Override
        public void serialize(Sort sort, JsonGenerator gen, SerializerProvider serializers) throws IOException {
            if (sort == null || sort.isUnsorted()) {
                gen.writeStartObject();
                gen.writeStringField("sorted", "false");
                gen.writeEndObject();
            } else {
                gen.writeStartObject();
                gen.writeStringField("sorted", "true");
                gen.writeArrayFieldStart("orders");
                for (Sort.Order order : sort) {
                    gen.writeStartObject();
                    gen.writeStringField("property", order.getProperty());
                    gen.writeStringField("direction", order.getDirection().name());
                    gen.writeEndObject();
                }
                gen.writeEndArray();
                gen.writeEndObject();
            }
        }
    }
} 

