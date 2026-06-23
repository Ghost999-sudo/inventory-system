package com.inventory.controller;

import com.inventory.dto.SupplierDtos;
import com.inventory.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER','STORE_KEEPER','WAREHOUSE')")
	public ResponseEntity<List<SupplierDtos.SupplierResponse>> getAll() {
		return ResponseEntity.ok(supplierService.getAllSuppliers());
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER','STORE_KEEPER','WAREHOUSE')")
	public ResponseEntity<SupplierDtos.SupplierResponse> create(@Valid @RequestBody SupplierDtos.SupplierRequest request) {
		return ResponseEntity.ok(supplierService.create(request));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER','STORE_KEEPER','WAREHOUSE')")
	public ResponseEntity<SupplierDtos.SupplierResponse> update(@PathVariable Long id, @Valid @RequestBody SupplierDtos.SupplierRequest request) {
		return ResponseEntity.ok(supplierService.update(id, request));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		supplierService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
