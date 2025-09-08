package com.oneClub.user_service.services;

import com.oneClub.user_service.dtos.AddressRequestDTO;
import com.oneClub.user_service.dtos.AddressResponseDTO;
import com.oneClub.user_service.models.Address;
import com.oneClub.user_service.models.User;
import com.oneClub.user_service.repositories.AddressRepository;
import com.oneClub.user_service.repositories.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepo;
    private final UsersRepository usersRepo;

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


}
