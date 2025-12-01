package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.response.dashboard.DashBoardResponse;
import com.university.library.service.AdminDashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public")
public class HomePageController {
    @Autowired
    private AdminDashBoardService adminDashBoardService;

    @GetMapping("/homepage-stats")
    public ResponseEntity<StandardResponse<DashBoardResponse>> getHomePageStats() {
        // Get current month stats for homepage
        return ResponseEntity.ok(StandardResponse.success(adminDashBoardService.getAdminDashBoard(0, 0)));
    }
}
