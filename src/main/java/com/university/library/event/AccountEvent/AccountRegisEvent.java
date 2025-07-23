package com.university.library.event.AccountEvent;

import com.university.library.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountRegisEvent {
    private UUID accountId;
    private String username;
    private String email;
    private String fullName;
    private Account.UserType userType;
    private Account.AccountStatus status;
    private LocalDateTime createAt;
    private UUID campusId;
}
