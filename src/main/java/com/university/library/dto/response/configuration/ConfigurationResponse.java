package com.university.library.dto.response.configuration;

import lombok.Builder;
import lombok.Data;
import org.apache.catalina.LifecycleState;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ConfigurationResponse {
    private List<CampusResponse> campus;
    private List<String> shelfLocations;

    @Builder
    @Data
    public static class  CampusResponse{
        private String campusCode;
        private String campusName;
    }

}
