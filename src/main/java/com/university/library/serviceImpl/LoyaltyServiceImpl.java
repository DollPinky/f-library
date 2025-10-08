package com.university.library.serviceImpl;

import com.university.library.dto.response.account.AccountResponse;
import com.university.library.dto.response.loyalty.LoyaltyHistoryResponse;
import com.university.library.dto.response.loyalty.LoyaltyTopResponse;
import com.university.library.entity.BookCopy;
import com.university.library.entity.LoyaltyHistory;
import com.university.library.entity.User;
import com.university.library.repository.BookCopyRepository;
import com.university.library.repository.LoyaltyHistoryRepository;
import com.university.library.repository.UserRepository;
import com.university.library.service.LoyaltyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyServiceImpl implements LoyaltyService {
    private final UserRepository userRepository;
    private final LoyaltyHistoryRepository loyaltyHistoryRepository;
    private final BookCopyRepository bookCopyRepository;

    @Override
    @Transactional
    public LoyaltyHistoryResponse updateLoyaltyPoint(UUID bookCopyId, LoyaltyHistory.LoyaltyAction action, UUID userId) {
        int points;
        String note;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        BookCopy bookCopy = bookCopyRepository.findByBookCopyId(bookCopyId);
        if (bookCopy == null) {
            throw new RuntimeException("Book Copy not found with id: " + bookCopyId);
        }
        log.info("Updating loyalty for user: {} , action: {}", user.getUsername(), action);
        switch (action) {
            case BORROWED :
                points = 5;
                note = user.getFullName() + " borrowed a book: " + bookCopy.getBook().getTitle();
               break;
            case RETURNED :
                points = 10;
                note =  user.getFullName() + " returned on time a book: " + bookCopy.getBook().getTitle();
                break;
            case OVERDUE :
                points = -5;
                note =  user.getFullName() + " had an overdue book: " + bookCopy.getBook().getTitle();
                break;
            case LOST  :
                points = -10;
                note =  user.getFullName() + " lost a book: " + bookCopy.getBook().getTitle();
                break;
            case COMMENT_REVIEW  :
                points = 2;
                note =  user.getFullName() + " commented/reviewed a book: " + bookCopy.getBook().getTitle();
                break;
            case DONATE_BOOK:
                points = 10;
                note =  user.getFullName() + " donated a book: " + bookCopy.getBook().getTitle();
                break;
            default:
                throw new IllegalArgumentException("Invalid loyalty action: " + action);
        }

        LoyaltyHistory history = createLoyaltyHistory(user, action, points, note);
        updateUserPoints(user, points);

        log.info("User {}  has {} points", user.getUsername(), user.getTotalLoyaltyPoints());
        return LoyaltyHistoryResponse.fromEntity(loyaltyHistoryRepository.save(history));
    }

    private LoyaltyHistory createLoyaltyHistory(User user, LoyaltyHistory.LoyaltyAction action, int points, String note) {
        LoyaltyHistory history = new LoyaltyHistory();
        history.setUser(user);
        history.setAction(action);
        history.setLoyaltyPoint(points);
        history.setNote(note);
        return history;
    }

    private void updateUserPoints(User user, int points) {
        if (user.getTotalLoyaltyPoints() == null) {
            user.setTotalLoyaltyPoints(0);
        }
        user.setTotalLoyaltyPoints(user.getTotalLoyaltyPoints() + points);
        userRepository.save(user);
    }


    @Override
    @Transactional
    public void deleteOldLoyaltyHistories() {
        LocalDateTime sixMonths = LocalDateTime.now().minusMonths(6);
        int deletedLoyaltyHistory= loyaltyHistoryRepository.deleteByCreatedAtBefore(sixMonths);
        log.info("Deleted loyalty history for user with quantity: {}", deletedLoyaltyHistory);
    }

    @Override
    public List<LoyaltyTopResponse> getTop5LoyaltyUsersByMonth(int month, int year) {
        List<Object[]> results = loyaltyHistoryRepository.findTopUsersByMonth(month, year);

        return results.stream()
                .map(obj -> new LoyaltyTopResponse(
                        (UUID) obj[0],
                        (String) obj[1],
                        (String) obj[2],
                        ((Number) obj[3]).intValue(),
                        ((Number) obj[4]).intValue(),
                        ((Number) obj[5]).intValue(),
                        ((Number) obj[6]).intValue()
                ))
                .toList();
    }


}
