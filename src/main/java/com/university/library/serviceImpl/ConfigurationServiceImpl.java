package com.university.library.serviceImpl;

import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.response.configuration.ConfigurationResponse;
import com.university.library.entity.Campus;
import com.university.library.entity.Category;
import com.university.library.repository.CampusRepository;
import com.university.library.repository.CategoryRepository;
import com.university.library.service.ConfigurationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class ConfigurationServiceImpl implements ConfigurationService {
    @Autowired
    private CampusRepository campusRepository;
    @Override
    public ConfigurationResponse getConfiguration() {
        List<String> shelfLocaiton = Arrays.asList( BookCopyConstants.BOOK_COPY_SHELF_LOCATION);
        Map<String, List<String>> campus = new HashMap<>();
        List<Campus> getALl = campusRepository.findAll();
        for (Campus campu : getALl) {
            List<String> values = campus.get(campu.getName());
            if(values == null) {
                values = new ArrayList<>();

            }
                values.add(campu.getCode());
                campus.put(campu.getName(),values );

        }
        ConfigurationResponse response = ConfigurationResponse.builder()
                                                              .shelfLocations(shelfLocaiton)
                                                              .campus(campus)
                                                              .build();
        return response;
    }
}
