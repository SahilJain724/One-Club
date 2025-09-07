package com.oneClub.user_service.services;

import com.oneClub.user_service.dtos.*;
import com.oneClub.user_service.feignClients.ProductInventoryClient;
import com.oneClub.user_service.mappers.Mappers;
import com.oneClub.user_service.models.Role;
import com.oneClub.user_service.models.User;
import com.oneClub.user_service.repositories.RoleRepository;
import com.oneClub.user_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsersRepository usersRepo;
    private final RoleRepository roleRepo;
    private final ProductInventoryClient productInventoryClient;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public User createUser(RegisterDTO dto) {
        Role role = roleRepo.findByName("ROLE_" + dto.getRole().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(encoder.encode(dto.getPassword()));
        user.setRole(role);
        return usersRepo.save(user);
    }

    public User createVendor(RegisterVendorDTO dto) {
        Role role = roleRepo.findByName("ROLE_" + dto.getRole().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User vendor = new User();
        vendor.setName(dto.getName());
        vendor.setEmail(dto.getEmail());
        vendor.setPasswordHash(encoder.encode(dto.getPassword()));
        vendor.setPhone(dto.getPhone());
        vendor.setRole(role);

        return usersRepo.save(vendor);
    }

    public User validateLogin(LoginDTO loginDTO) {
        User user = usersRepo.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(loginDTO.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public User getUserById(Integer id) {
        return usersRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public List<VendorResponseDTO> getAllVendors() {

        Role vendorRole = roleRepo.findByName("ROLE_VENDOR")
                .orElseThrow(() -> new RuntimeException("Vendor role not found"));

        List<User> users = usersRepo.findByRole(vendorRole);

        List<VendorUnitsSoldDTO> unitsSoldList = productInventoryClient.getTotalUnitsSoldPerVendor();

        Map<Integer, Long> vendorUnitsSoldMap = unitsSoldList.stream()
                .collect(Collectors.toMap(
                        VendorUnitsSoldDTO::getVendorId,
                        VendorUnitsSoldDTO::getTotalUnitsSold
                ));

        return users.stream()
                .map(user -> {
                    Integer totalUnitsSold = vendorUnitsSoldMap.getOrDefault(user.getId(), 0L).intValue();

                    return Mappers.mapToVendorDTO(user,totalUnitsSold);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public HttpStatus deleteUserById(Integer userId) {
        try {
            if (!usersRepo.existsById(userId)) {
                return HttpStatus.NOT_FOUND;
            }
            productInventoryClient.deleteAllProductsByVendor(userId);

            usersRepo.deleteById(userId);
            return HttpStatus.NO_CONTENT;
        } catch (Exception e) {
            //noinspection CallToPrintStackTrace
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }

}

