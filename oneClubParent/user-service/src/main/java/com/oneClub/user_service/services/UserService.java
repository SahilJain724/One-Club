package com.oneClub.user_service.services;

import com.oneClub.user_service.dtos.*;
import com.oneClub.user_service.feignClients.ProductInventoryClient;
import com.oneClub.user_service.models.Address;
import com.oneClub.user_service.models.Role;
import com.oneClub.user_service.models.User;
import com.oneClub.user_service.repositories.AddressRepository;
import com.oneClub.user_service.repositories.RoleRepository;
import com.oneClub.user_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UsersRepository usersRepo;
    private final RoleRepository roleRepo;
    private final AddressRepository addressRepo;
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

    public AddressResponseDTO getAddressById(Integer id) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));

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

    public AddressResponseDTO addAddress(Integer userId, AddressRequestDTO dto) {
        if (dto.getStreet() == null || dto.getStreet().trim().isEmpty())
            throw new RuntimeException("Street is required");
        if (dto.getCity() == null || dto.getCity().trim().isEmpty())
            throw new RuntimeException("City is required");
        if (dto.getState() == null || dto.getState().trim().isEmpty())
            throw new RuntimeException("State is required");
        if (dto.getCountry() == null || dto.getCountry().trim().isEmpty())
            throw new RuntimeException("Country is required");
        if (dto.getZip() == null || dto.getZip().trim().isEmpty())
            throw new RuntimeException("Zip is required");

        Optional<User> user = usersRepo.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Address address = new Address();
        address.setUser(user.get());
        address.setStreet(dto.getStreet());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZip(dto.getZip());
        address.setCountry(dto.getCountry());
        address.setDefaultAddress(dto.getIsDefault());
        address.setLandmarks(dto.getLandmarks());

        Address saved = addressRepo.save(address);

        // ✅ Build AddressDTO to return
        AddressResponseDTO response = new AddressResponseDTO();
        response.setId(saved.getId());
        response.setUserId(userId);
        response.setCity(saved.getCity());
        response.setState(saved.getState());
        response.setZip(saved.getZip());
        response.setCountry(saved.getCountry());
        response.setStreet(saved.getStreet());
        response.setIsDefault(saved.getDefaultAddress());
        System.out.println("🚨 addAddress called with: " + dto);

        return response;
    }

    public UserDTO updateUser(Integer userId,UserRequestDTO dto){
        User user = usersRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());

        usersRepo.save(user);
        return mapToUserDTO(user);
    }

    public List<VendorResponseDTO> getAllVendors() {
        // Find the vendor role
        Role vendorRole = roleRepo.findByName("ROLE_VENDOR")
                .orElseThrow(() -> new RuntimeException("Vendor role not found"));

        // Fetch all users with vendor role
        List<User> users = usersRepo.findByRole(vendorRole);

        List<VendorUnitsSoldDTO> unitsSoldList = productInventoryClient.getTotalUnitsSoldPerVendor();

        Map<Integer, Long> vendorUnitsSoldMap = unitsSoldList.stream()
                .collect(Collectors.toMap(
                        VendorUnitsSoldDTO::getVendorId,
                        VendorUnitsSoldDTO::getTotalUnitsSold
                ));

        return users.stream()
                .map(user -> {
                    Long totalUnitsSoldLong = vendorUnitsSoldMap.getOrDefault(user.getId(), 0L);
                    Integer totalUnitsSold = totalUnitsSoldLong.intValue();
                    return mapToVendorDTO(user,totalUnitsSold);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public HttpStatus updateAddress(AddressRequestDTO dto) {
        Optional<Address> addressOpt = addressRepo.findById(dto.getId());

        if (addressOpt.isEmpty()) {
            return HttpStatus.NOT_FOUND;
        }

        Address updatedAddress = addressOpt.get();

        if (dto.getStreet() != null) updatedAddress.setStreet(dto.getStreet());
        if (dto.getCity() != null) updatedAddress.setCity(dto.getCity());
        if (dto.getState() != null) updatedAddress.setState(dto.getState());
        if (dto.getCountry() != null) updatedAddress.setCountry(dto.getCountry());
        if (dto.getZip() != null) updatedAddress.setZip(dto.getZip());
        if (dto.getLandmarks() != null) updatedAddress.setLandmarks(dto.getLandmarks());
        Integer isDefault = dto.getIsDefault();
        if (isDefault != null && !isDefault.equals(updatedAddress.getDefaultAddress())) {
            updatedAddress.setDefaultAddress(isDefault);
        }

        addressRepo.save(updatedAddress);
        return HttpStatus.OK;
    }

    public List<Address> getAllAddresses(Integer userId) {
        return new ArrayList<>(addressRepo.findByUserId(userId));
    }

    public HttpStatus deleteAddressById(Integer addressId) {
        Optional<Address> address = addressRepo.findById(addressId);

        if (address.isEmpty()) {
            return HttpStatus.NOT_FOUND;
        }

        addressRepo.deleteById(addressId);
        return HttpStatus.OK;
    }

    @Transactional
    public HttpStatus setDefaultAddress(Integer userId, Integer addressId) {
        List<Address> userAddresses = addressRepo.findByUserId(userId);

        if (userAddresses.isEmpty()) {
            return HttpStatus.NOT_FOUND;
        }

        boolean found = false;

        for (Address address : userAddresses) {
            if (address.getId().equals(addressId)) {
                address.setDefaultAddress(1);
                found = true;
            } else {
                address.setDefaultAddress(0);
            }
            addressRepo.save(address);
        }

        return found ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    }

    public UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().getName());
        dto.setPhone(user.getPhone());
        return dto;
    }

    public VendorResponseDTO mapToVendorDTO(User user, Integer totalUnitsSoldLong) {
        return  new VendorResponseDTO(mapToUserDTO(user),totalUnitsSoldLong,user.getCreatedAt());
    }

    @SuppressWarnings("CallToPrintStackTrace")
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
            e.printStackTrace();
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }
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



}

