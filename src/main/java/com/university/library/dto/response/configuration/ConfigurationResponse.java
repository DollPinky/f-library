package com.university.library.dto.response.configuration;

import lombok.Builder;
import lombok.Data;
import org.apache.catalina.LifecycleState;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class ConfigurationResponse {
    private Map<String, List<String>> campus;
    private List<String> shelfLocations;
}
