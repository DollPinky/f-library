package com.university.library.service;

import com.university.library.entity.Campus;

import java.util.List;
import java.util.UUID;

public interface CampusService {
    List<Campus> getAllCampuses();
    Campus getCampusById(UUID campusId);
}
