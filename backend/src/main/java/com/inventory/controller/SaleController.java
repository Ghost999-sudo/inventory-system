package com.inventory.controller;

import com.inventory.dto.SaleDtos;
import com.inventory.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<List<SaleDtos.SaleResponse>> getAll() {
		return ResponseEntity.ok(saleService.getAllSales());
	}

	@GetMapping("/{id}")
	public ResponseEntity<SaleDtos.SaleResponse> getOne(@PathVariable Long id) {
		return ResponseEntity.ok(saleService.getSale(id));
	}

	@PostMapping
	public ResponseEntity<SaleDtos.SaleResponse> create(@Valid @RequestBody SaleDtos.SaleRequest request) {
		return ResponseEntity.ok(saleService.createSale(request));
	}
}
