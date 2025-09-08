package com.oneClub.user_service.repositories;

import com.oneClub.user_service.models.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Integer> {
    List<Address> findByUserId(Integer userId);

}
