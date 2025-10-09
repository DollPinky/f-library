package com.university.library.controller;

import com.university.library.base.StandardResponse;
import com.university.library.dto.response.dashboard.DashBoardResponse;
import com.university.library.service.AdminDashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminDashBoardController {
    @Autowired
    private AdminDashBoardService adminDashBoardService;
    @GetMapping("/dashboard")
    public ResponseEntity<StandardResponse<DashBoardResponse>> dashboard(
            @RequestParam(defaultValue = "0") int month, @RequestParam( defaultValue = "0") int year
    ) {

        return ResponseEntity.ok(StandardResponse.
                success(adminDashBoardService.getAdminDashBoard(month, year)));
    }
}
