package com.oneClub.user_service.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorResponseDTO {
    private UserDTO userDTO;
    private  Integer unitsSold;
    private LocalDateTime createdAt;
}
