package com.university.library.service;

import com.university.library.dto.response.dashboard.DashBoardResponse;

public interface AdminDashBoardService {

    DashBoardResponse getAdminDashBoard(int month , int year);
}
