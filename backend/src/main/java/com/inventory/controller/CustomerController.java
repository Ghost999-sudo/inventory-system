package com.inventory.controller; 

import com.inventory.dto.CustomerDtos;
import com.inventory.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// This class is a Spring REST controller that handles HTTP requests related to customers.
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	private final CustomerService customerService;

	public CustomerController(CustomerService customerService) {
		this.customerService = customerService;
	}

	@GetMapping
	public ResponseEntity<List<CustomerDtos.CustomerResponse>> getAll() {
		return ResponseEntity.ok(customerService.getAllCustomers());
	}

	@PostMapping
	public ResponseEntity<CustomerDtos.CustomerResponse> create(@Valid @RequestBody CustomerDtos.CustomerRequest request) {
		return ResponseEntity.ok(customerService.create(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CustomerDtos.CustomerResponse> update(@PathVariable Long id, @Valid @RequestBody CustomerDtos.CustomerRequest request) {
		return ResponseEntity.ok(customerService.update(id, request));
	}
}
