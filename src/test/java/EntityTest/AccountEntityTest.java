package EntityTest;

import com.university.library.entity.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class AccountEntityTest {
    private Account reader;

    @BeforeEach
    void setUp() {
        reader = Account.builder()
                .accountId(UUID.randomUUID())
                .username("reader1")
                .email("reader1@example.com")
                .passwordHash("hashedPwd")
                .fullName("Reader One")
                .userType(Account.UserType.READER)
                .status(Account.AccountStatus.ACTIVE)
                .maxBorrowLimit(3)
                .currentBorrowCount(1)
                .fineAmount(0.0)
                .build();
    }

    @Test
    void canBorrow_shouldReturnTrue_whenEligible() {
        assertThat(reader.canBorrow()).isTrue();
    }

    @Test
    void canBorrow_shouldReturnFalse_whenBlocked() {
        reader.setStatus(Account.AccountStatus.BLOCKED);
        assertThat(reader.canBorrow()).isFalse();
    }

    @Test
    void canBorrow_shouldReturnFalse_whenExceedsLimit() {
        reader.setCurrentBorrowCount(3);
        assertThat(reader.canBorrow()).isFalse();
    }

    @Test
    void canBorrow_shouldReturnFalse_whenHasFine() {
        reader.setFineAmount(10.0);
        assertThat(reader.canBorrow()).isFalse();
    }


    @Test
    void decrementBorrowCount_shouldDecreaseCurrentCount() {
        reader.decrementBorrowCount();
        assertThat(reader.getCurrentBorrowCount()).isEqualTo(0);
    }

    @Test
    void addFine_shouldIncreaseFineAmount() {
        reader.addFine(20.0);
        assertThat(reader.getFineAmount()).isEqualTo(20.0);
    }

    @Test
    void clearFine_shouldResetFineAmount() {
        reader.addFine(10.0);
        reader.clearFine();
        assertThat(reader.getFineAmount()).isEqualTo(0.0);
    }

    @Test
    void updateLastLogin_shouldSetLastLoginAt() {
        reader.updateLastLogin();
        assertThat(reader.getLastLoginAt()).isNotNull();
    }

    @Test
    void isStaff_shouldReturnFalse_forReader() {
        assertThat(reader.isStaff()).isFalse();
    }

    @Test
    void isReader_shouldReturnTrue_forReader() {
        assertThat(reader.isReader()).isTrue();
    }

    @Test
    void isAccountNonExpired_shouldBeTrue_whenActive() {
        assertThat(reader.isAccountNonExpired()).isTrue();
    }

    @Test
    void isAccountNonLocked_shouldBeTrue_whenNotBlocked() {
        assertThat(reader.isAccountNonLocked()).isTrue();
    }

    @Test
    void isCredentialsNonExpired_shouldAlwaysBeTrue() {
        assertThat(reader.isCredentialsNonExpired()).isTrue();
    }

    @Test
    void isEnabled_shouldBeTrue_whenActive() {
        assertThat(reader.isEnabled()).isTrue();
    }

    @Test
    void getAuthorities_shouldReturnRoleReader() {
        assertThat(reader.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_READER");
    }

    @Test
    void getPassword_shouldReturnPasswordHash() {
        assertThat(reader.getPassword()).isEqualTo("hashedPwd");
    }

    @Test
    void toString_shouldContainClassNameAndFields() {
        Account acc = Account.builder()
                .accountId(UUID.randomUUID())
                .username("user")
                .email("user@mail.com")
                .passwordHash("pw")
                .fullName("User")
                .userType(Account.UserType.READER)
                .status(Account.AccountStatus.ACTIVE)
                .build();

        String toStr = acc.toString();

        assertThat(toStr).contains("Account");
        assertThat(toStr).contains("username=user");
    }

    @Test
    void incrementBorrowCount_shouldIncreaseCurrentAndTotal() {
        Account acc = Account.builder()
                .userType(Account.UserType.READER)
                .currentBorrowCount(0)
                .totalBorrowCount(0)
                .build();

        acc.incrementBorrowCount();

        assertThat(acc.getCurrentBorrowCount()).isEqualTo(1);
        assertThat(acc.getTotalBorrowCount()).isEqualTo(1);
    }


}
