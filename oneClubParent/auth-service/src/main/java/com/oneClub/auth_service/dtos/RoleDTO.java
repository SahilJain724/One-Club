package com.oneClub.auth_service.dtos;

import lombok.*;

@Data
public class RoleDTO {
    private Integer id;
    private String name; // e.g., ROLE_ADMIN, ROLE_USER
}

