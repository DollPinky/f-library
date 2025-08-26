package com.university.library.dto;

import com.university.library.entity.User;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAccountRoleRequest {
    @NotNull(message = "Vai trò không được để trống")
    private User.AccountRole role;
}
