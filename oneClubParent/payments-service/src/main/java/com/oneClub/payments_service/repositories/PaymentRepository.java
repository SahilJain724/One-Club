package com.oneClub.payments_service.repositories;

import com.oneClub.payments_service.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PaymentRepository extends JpaRepository<Payment, Integer> {

}
