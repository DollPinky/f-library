package com.university.library.service.query;

import com.university.library.base.PagedResponse;
import com.university.library.dto.LibraryResponse;
import com.university.library.dto.StaffResponse;
import com.university.library.entity.Staff;
import com.university.library.mapper.StaffMapper;
import com.university.library.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffQueryService {
    private final StaffRepository staffRepository;
    private final StaffMapper staffMapper;

    public PagedResponse<StaffResponse> getAllStaffs(int page, int size) {
        log.info("StaffQueryService: getAllStaffs");
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Staff> staffPage = staffRepository.findAll(pageable);

        Page<StaffResponse> mappedPage = staffPage.map(StaffResponse::fromEntity);

        return PagedResponse.fromPage(mappedPage);
    }

}


