package com.university.library.dto.response.dashboard;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DashBoardResponse {
    private long totalBook;
    private long totalUsers;
    private long totalBorrow;
    private List<StatisticResponse> statisticResponse;


    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class StatisticResponse {
        private int numberBorrows;
        private int numberReturns;
        private LocalDate date;
        private Integer month;
    }

}
