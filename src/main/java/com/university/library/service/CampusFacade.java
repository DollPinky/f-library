package com.university.library.service;

import com.university.library.entity.Campus;
import com.university.library.service.query.CampusQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampusFacade {
    private final CampusQueryService campusQueryService;

    public List<Campus> getAllCampuses() {
        return campusQueryService.getAllCampuses();
    }

    public Campus getCampusById(UUID campusId) {
        return campusQueryService.getCampusById(campusId);
    }
} 