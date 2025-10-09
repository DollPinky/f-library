package com.university.library.serviceImpl;

import com.university.library.dto.response.dashboard.DashBoardResponse;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.BorrowingRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.AdminDashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminDashBoardServiceImpl implements AdminDashBoardService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BorrowingRepository borrowingRepository;
    @Autowired
    private BookCopyRepository bookCopyRepository;


    @Override
    public DashBoardResponse getAdminDashBoard(int month, int year) {
      long numberUser = userRepository.countByIsActive(true);
      long numberBorrow = borrowingRepository.count();
      long numberOfBook = bookCopyRepository.count();
        List<DashBoardResponse.StatisticResponse> statisticResponse = new ArrayList<>();
      if(month == 0 && year == 0){

          month = LocalDate.now().getMonthValue();
          year = LocalDate.now().getYear();
          LocalDate startDate = LocalDate.of(year, month, 1);
          LocalDate endDate = LocalDate.now().plusDays(1);
          statisticResponse = statisticResponseFollowDate(startDate, endDate);
      }
      else if((month >= 1 && month <=12) ){

          if(year == 0 )
          {
              year = LocalDate.now().getYear();
          }
          LocalDate startDate = LocalDate.of(year, month, 1);
          LocalDate endDate = LocalDate.of( year, month, 1).withDayOfMonth(LocalDate.of(year, month, 1).lengthOfMonth());
          statisticResponse = statisticResponseFollowDate(startDate, endDate);

      }
      else if( year >= 1900 )
      {
          statisticResponse = statisticResponseFollowMonth(year);
      }
      DashBoardResponse dashBoardResponse = DashBoardResponse.builder()
              .statisticResponse(statisticResponse)
              .totalBook(numberOfBook)
              .totalUsers(numberUser)
              .totalBorrow(numberBorrow)
              .build();
        return dashBoardResponse;
    }
    public List<DashBoardResponse.StatisticResponse> statisticResponseFollowDate(LocalDate startDate, LocalDate endDate) {
        List<DashBoardResponse.StatisticResponse> statisticResponse = new ArrayList<>();
        while(startDate.isBefore(endDate)){
            int numberofborrow = borrowingRepository.countByBorrowedDateIsBetween(startDate.atStartOfDay(),LocalDateTime.of(startDate, LocalTime.of(23,59,0)));
            int numberofreutrn = borrowingRepository.countByReturnedDateIsBetween(startDate.atStartOfDay(),LocalDateTime.of(startDate, LocalTime.of(23,59,0)));
            DashBoardResponse.StatisticResponse response = DashBoardResponse.StatisticResponse
                    .builder()
                    .date(startDate)
                    .numberReturns(numberofreutrn)
                    .numberBorrows(numberofborrow)
                    .build();
            statisticResponse.add(response);
            startDate = startDate.plusDays(1);
        }
        return statisticResponse;
    }
    public List<DashBoardResponse.StatisticResponse> statisticResponseFollowMonth(int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        List<DashBoardResponse.StatisticResponse> statisticResponse = new ArrayList<>();
        Integer month = null;
        if(year == LocalDate.now().getYear())
        {
            month  = LocalDate.now().getMonthValue();
        }
        while(startDate.getYear() == year)
        {
            LocalDate endquery = startDate.withDayOfMonth(startDate.lengthOfMonth());
            int numberofborrow = borrowingRepository.countByBorrowedDateIsBetween(startDate.atStartOfDay(),LocalDateTime.of(endquery, LocalTime.of(23,59,0)));
            int numberofreutrn = borrowingRepository.countByReturnedDateIsBetween(startDate.atStartOfDay(),LocalDateTime.of(endquery, LocalTime.of(23,59,0)));
            DashBoardResponse.StatisticResponse response = DashBoardResponse.StatisticResponse
                    .builder()
                    .month(startDate.getMonthValue())
                    .numberReturns(numberofreutrn)
                    .numberBorrows(numberofborrow)
                    .build();
            statisticResponse.add(response);
            startDate = startDate.plusMonths(1);
            if(month != null && startDate.getMonth().getValue() > month)
            {
                break;
            }
        }

        return statisticResponse;
    }


}
