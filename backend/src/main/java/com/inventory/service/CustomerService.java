package com.inventory.service;

import com.inventory.dto.CustomerDtos;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.model.Customer;
import com.inventory.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

// This class is a Spring service that handles customer-related operations, such as creating, updating, and retrieving customer information.
@Service
public class CustomerService {

	private final CustomerRepository customerRepository;

	public CustomerService(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}

	public List<CustomerDtos.CustomerResponse> getAllCustomers() {
		return customerRepository.findAll().stream().map(this::toResponse).toList();
	}

	public CustomerDtos.CustomerResponse create(CustomerDtos.CustomerRequest request) {
		Customer customer = new Customer();
		customer.setName(request.name());
		customer.setPhone(request.phone());
		customer.setEmail(request.email());
		return toResponse(customerRepository.save(customer));
	}

	public CustomerDtos.CustomerResponse upsert(CustomerDtos.CustomerRequest request) {
		return customerRepository.findByEmailIgnoreCase(request.email() == null ? "" : request.email())
			.map(existing -> update(existing.getId(), request))
			.orElseGet(() -> create(request));
	}

	public CustomerDtos.CustomerResponse update(Long id, CustomerDtos.CustomerRequest request) {
		Customer customer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
		customer.setName(request.name());
		customer.setPhone(request.phone());
		customer.setEmail(request.email());
		return toResponse(customerRepository.save(customer));
	}

	public void applyPurchase(Customer customer, BigDecimal total) {
		customer.setTotalPurchases(customer.getTotalPurchases().add(total));
		customer.setLoyaltyPoints(customer.getLoyaltyPoints() + total.intValue() / 100);
		customerRepository.save(customer);
	}

	private CustomerDtos.CustomerResponse toResponse(Customer customer) {
		return new CustomerDtos.CustomerResponse(
			customer.getId(),
			customer.getName(),
			customer.getPhone(),
			customer.getEmail(),
			customer.getLoyaltyPoints(),
			customer.getBalance(),
			customer.getTotalPurchases()
		);
	}
}
