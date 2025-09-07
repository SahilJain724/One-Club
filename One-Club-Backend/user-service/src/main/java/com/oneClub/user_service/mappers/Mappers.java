package com.oneClub.user_service.mappers;

import com.oneClub.user_service.dtos.AddressResponseDTO;
import com.oneClub.user_service.dtos.UserDTO;
import com.oneClub.user_service.dtos.VendorResponseDTO;
import com.oneClub.user_service.models.Address;
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

    public static AddressResponseDTO mapToAddressDTO(Address address) {
        AddressResponseDTO dto = new AddressResponseDTO();
        dto.setId(address.getId());
        dto.setUserId(address.getUser().getId());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZip(address.getZip());
        dto.setCountry(address.getCountry());
        dto.setIsDefault(address.getDefaultAddress());
        dto.setLandmarks(address.getLandmarks());
        return dto;
    }
}
