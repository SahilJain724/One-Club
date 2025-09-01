package com.oneClub.auth_service.dtos;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private RoleDTO role;
    private List<AddressDTO> addresses = new ArrayList<>();
}



