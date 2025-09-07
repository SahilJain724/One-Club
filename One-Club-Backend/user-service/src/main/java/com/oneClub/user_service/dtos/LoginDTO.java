package com.oneClub.user_service.dtos;



import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginDTO {
    private String email;
    private String password;
}

