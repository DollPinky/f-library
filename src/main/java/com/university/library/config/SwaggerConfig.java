package com.university.library.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI libraryManagementOpenAPI() {
        Server localServer = new Server();
        String appPublicBaseUrl = "http://localhost:8080";
        localServer.setUrl(appPublicBaseUrl);
        localServer.setDescription("Local Development Server");

        Server dockerServer = new Server();
        dockerServer.setUrl(appPublicBaseUrl);
        dockerServer.setDescription("Docker Development Server");

        Contact contact = new Contact();
        contact.setName("Library Management Team");
        contact.setEmail("support@library.edu.vn");

        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("Library Management System API")
                .version("1.0.0")
                .description("""
                        Hệ thống quản lý thư viện đại học multi-campus với Spring Boot 3.2.0.
                        
                        ## Tính năng chính:
                        - Quản lý phân hiệu và thư viện
                        - Quản lý sách và bản sao
                        - Hệ thống mượn/trả sách
                        - Quản lý độc giả và nhân viên
                        - Tracking QR code
                        - Tính phạt quá hạn
                        
                        ## Tech Stack:
                        - Java 21 + Spring Boot 3.2.0
                        - PostgreSQL + Redis Cache
                        - Apache Kafka
                        - Docker + Docker Compose
                        
                    
                        """)
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer, dockerServer));
    }
} 

