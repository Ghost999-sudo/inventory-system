package com.inventory.controller;

import com.inventory.dto.SupplierDtos;
import com.inventory.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

	private final SupplierService supplierService;

	public SupplierController(SupplierService supplierService) {
		this.supplierService = supplierService;
	}

	@GetMapping
	public ResponseEntity<List<SupplierDtos.SupplierResponse>> getAll() {
		return ResponseEntity.ok(supplierService.getAllSuppliers());
	}

	@PostMapping
	public ResponseEntity<SupplierDtos.SupplierResponse> create(@Valid @RequestBody SupplierDtos.SupplierRequest request) {
		return ResponseEntity.ok(supplierService.create(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<SupplierDtos.SupplierResponse> update(@PathVariable Long id, @Valid @RequestBody SupplierDtos.SupplierRequest request) {
		return ResponseEntity.ok(supplierService.update(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		supplierService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
