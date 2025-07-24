package com.university.library.service.query;

import com.university.library.entity.Campus;
import com.university.library.repository.CampusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampusQueryService {
    private final CampusRepository campusRepository;

    public List<Campus> getAllCampuses() {
        log.info("CampusQueryService: getAllCampuses");
        return campusRepository.findAll();
    }

    public Campus getCampusById(UUID campusId) {
        log.info("CampusQueryService: getCampusById: {}", campusId);
        return campusRepository.findByCampusId(campusId).orElse(null);
    }
} 

