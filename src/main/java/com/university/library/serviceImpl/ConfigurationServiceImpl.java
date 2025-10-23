package com.university.library.serviceImpl;

import com.university.library.constants.BookCopyConstants;
import com.university.library.dto.response.configuration.ConfigurationResponse;
import com.university.library.entity.BookCopy;
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
        List<String> shelfLocation = Arrays.stream(BookCopy.ShelfLocation.values())
                .map(Enum::name)
                .toList();

        List<ConfigurationResponse.CampusResponse> listCampus = new ArrayList<>();

        List<Campus> getALl = campusRepository.findAll();
        for (Campus campu : getALl) {
            ConfigurationResponse.CampusResponse campusResponse = ConfigurationResponse.CampusResponse.builder()
                    .campusCode(campu.getCode())
                    .campusName(campu.getName())
                    .build();
            listCampus.add(campusResponse);

        }
        ConfigurationResponse response = ConfigurationResponse.builder()
                                                              .shelfLocations(shelfLocation)
                                                              .campus(listCampus)
                                                              .build();
        return response;
    }
}
