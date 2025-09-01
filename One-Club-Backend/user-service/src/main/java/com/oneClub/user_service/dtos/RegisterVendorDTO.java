package com.oneClub.user_service.dtos;

import lombok.Data;

@Data
public class RegisterVendorDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;
}
