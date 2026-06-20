package com.inventory.repository;

import com.inventory.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
	Optional<Customer> findByNameIgnoreCase(String name);
	Optional<Customer> findByEmailIgnoreCase(String email);
}
