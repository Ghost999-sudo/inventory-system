package com.inventory.controller;

import com.inventory.dto.SaleDtos;
import com.inventory.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// This class is a Spring REST controller that handles HTTP requests related to sales, providing endpoints for retrieving and creating sales records.
@RestController
@RequestMapping("/api/sales")
public class SaleController {

	private final SaleService saleService;

	public SaleController(SaleService saleService) {
		this.saleService = saleService;
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER','ACCOUNTANT','CASHIER')")
	public ResponseEntity<List<SaleDtos.SaleResponse>> getAll() {
		return ResponseEntity.ok(saleService.getAllSales());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER','ACCOUNTANT','CASHIER')")
	public ResponseEntity<SaleDtos.SaleResponse> getOne(@PathVariable Long id) {
		return ResponseEntity.ok(saleService.getSale(id));
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER','CASHIER')")
	public ResponseEntity<SaleDtos.SaleResponse> create(@Valid @RequestBody SaleDtos.SaleRequest request) {
		return ResponseEntity.ok(saleService.createSale(request));
	}
}
