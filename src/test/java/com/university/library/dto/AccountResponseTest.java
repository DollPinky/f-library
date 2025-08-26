package com.university.library.dto;

import com.university.library.entity.User;
import com.university.library.entity.Campus;
import com.university.library.dto.AccountResponse.CampusResponse;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AccountResponseTest {

    @Test
    void testFromEntityMapsAllFieldsCorrectly() {
        UUID accountId = UUID.randomUUID();
        String fullName = "John Doe";
        String email = "john.doe@example.com";
        String phone = "1234567890";
        String department = "IT";
        String position = "Developer";
        String employeeCode = "EMP123";
        User.AccountRole role = User.AccountRole.LIBRARIAN;
        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now();

        Campus campus = mock(Campus.class);
        UUID campusId = UUID.randomUUID();
        when(campus.getCampusId()).thenReturn(campusId);
        when(campus.getName()).thenReturn("Main Campus");
        when(campus.getCode()).thenReturn("MC001");
        when(campus.getAddress()).thenReturn("123 Main St");

        User account = mock(User.class);
        when(account.getAccountId()).thenReturn(accountId);
        when(account.getFullName()).thenReturn(fullName);
        when(account.getEmail()).thenReturn(email);
        when(account.getPhone()).thenReturn(phone);
        when(account.getDepartment()).thenReturn(department);
        when(account.getPosition()).thenReturn(position);
        when(account.getEmployeeCode()).thenReturn(employeeCode);
        when(account.getRole()).thenReturn(role);
        when(account.getCampus()).thenReturn(campus);
        when(account.getCreatedAt()).thenReturn(createdAt);
        when(account.getUpdatedAt()).thenReturn(updatedAt);

        AccountResponse response = AccountResponse.fromEntity(account);

        assertNotNull(response);
        assertEquals(accountId, response.getAccountId());
        assertEquals(fullName, response.getFullName());
        assertEquals(email, response.getEmail());
        assertEquals(phone, response.getPhone());
        assertEquals(department, response.getDepartment());
        assertEquals(position, response.getPosition());
        assertEquals(employeeCode, response.getEmployeeCode());
        assertEquals(role, response.getRole());
        assertEquals(createdAt, response.getCreatedAt());
        assertEquals(updatedAt, response.getUpdatedAt());

        assertNotNull(response.getCampus());
        assertEquals(campusId, response.getCampus().getCampusId());
        assertEquals("Main Campus", response.getCampus().getName());
        assertEquals("MC001", response.getCampus().getCode());
        assertEquals("123 Main St", response.getCampus().getAddress());
    }

    @Test
    void testCampusResponseFromEntityMapsAllFieldsCorrectly() {
        UUID campusId = UUID.randomUUID();
        String name = "Science Campus";
        String code = "SC002";
        String address = "456 Science Rd";

        Campus campus = mock(Campus.class);
        when(campus.getCampusId()).thenReturn(campusId);
        when(campus.getName()).thenReturn(name);
        when(campus.getCode()).thenReturn(code);
        when(campus.getAddress()).thenReturn(address);

        CampusResponse response = CampusResponse.fromEntity(campus);

        assertNotNull(response);
        assertEquals(campusId, response.getCampusId());
        assertEquals(name, response.getName());
        assertEquals(code, response.getCode());
        assertEquals(address, response.getAddress());
    }

    @Test
    void testFromEntityIncludesCampusResponseWhenCampusPresent() {
        User account = mock(User.class);
        Campus campus = mock(Campus.class);

        when(account.getCampus()).thenReturn(campus);
        when(campus.getCampusId()).thenReturn(UUID.randomUUID());
        when(campus.getName()).thenReturn("Central Campus");
        when(campus.getCode()).thenReturn("CC003");
        when(campus.getAddress()).thenReturn("789 Central Ave");

        AccountResponse response = AccountResponse.fromEntity(account);

        assertNotNull(response);
        assertNotNull(response.getCampus());
        assertEquals("Central Campus", response.getCampus().getName());
        assertEquals("CC003", response.getCampus().getCode());
        assertEquals("789 Central Ave", response.getCampus().getAddress());
    }

    @Test
    void testFromEntityReturnsNullOnNullInput() {
        AccountResponse response = AccountResponse.fromEntity(null);
        assertNull(response);
    }

    @Test
    void testFromEntityHandlesNullCampus() {
        User account = mock(User.class);
        when(account.getCampus()).thenReturn(null);

        AccountResponse response = AccountResponse.fromEntity(account);

        assertNotNull(response);
        assertNull(response.getCampus());
    }

    @Test
    void testFromEntityHandlesNullOptionalFields() {
        User account = mock(User.class);
        when(account.getAccountId()).thenReturn(UUID.randomUUID());
        when(account.getFullName()).thenReturn("Jane Smith");
        when(account.getEmail()).thenReturn("jane.smith@example.com");
        when(account.getPhone()).thenReturn("0987654321");
        when(account.getDepartment()).thenReturn(null);
        when(account.getPosition()).thenReturn(null);
        when(account.getEmployeeCode()).thenReturn("EMP456");
        when(account.getRole()).thenReturn(User.AccountRole.READER);
        when(account.getCampus()).thenReturn(null);
        when(account.getCreatedAt()).thenReturn(Instant.now());
        when(account.getUpdatedAt()).thenReturn(Instant.now());

        AccountResponse response = AccountResponse.fromEntity(account);

        assertNotNull(response);
        assertNull(response.getDepartment());
        assertNull(response.getPosition());
        assertNull(response.getCampus());
        assertEquals("Jane Smith", response.getFullName());
        assertEquals("jane.smith@example.com", response.getEmail());
        assertEquals("0987654321", response.getPhone());
        assertEquals("EMP456", response.getEmployeeCode());
        assertEquals(User.AccountRole.READER, response.getRole());
    }
}