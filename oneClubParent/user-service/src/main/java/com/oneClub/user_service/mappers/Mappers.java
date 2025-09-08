package com.oneClub.user_service.mappers;

import com.oneClub.user_service.dtos.UserDTO;
import com.oneClub.user_service.dtos.VendorResponseDTO;
import com.oneClub.user_service.models.User;

public class Mappers {
    public static UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().getName());
        dto.setPhone(user.getPhone());
        return dto;
    }

    public static VendorResponseDTO mapToVendorDTO(User user, Integer totalUnitsSoldLong) {
        return  new VendorResponseDTO(mapToUserDTO(user),totalUnitsSoldLong,user.getCreatedAt());
    }
}
