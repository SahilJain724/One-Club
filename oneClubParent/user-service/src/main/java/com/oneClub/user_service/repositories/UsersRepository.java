package com.oneClub.user_service.repositories;

import com.oneClub.user_service.models.Role;
import com.oneClub.user_service.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<User,Integer> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    Optional<User> findByName(String username);
}
