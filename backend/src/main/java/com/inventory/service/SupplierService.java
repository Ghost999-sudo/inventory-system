package com.inventory.service;

import com.inventory.dto.SupplierDtos;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.model.Supplier;
import com.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import java.util.List;

// This class is a Spring service that handles supplier-related operations, such as creating, updating, and retrieving supplier information.
@Service
public class SupplierService {

	private final SupplierRepository supplierRepository;

	public SupplierService(SupplierRepository supplierRepository) {
		this.supplierRepository = supplierRepository;
	}

	public List<SupplierDtos.SupplierResponse> getAllSuppliers() {
		return supplierRepository.findAll().stream().map(this::toResponse).toList();
	}

	public SupplierDtos.SupplierResponse create(SupplierDtos.SupplierRequest request) {
		Supplier supplier = new Supplier();
		applyRequest(supplier, request);
		return toResponse(supplierRepository.save(supplier));
	}

	public SupplierDtos.SupplierResponse update(Long id, SupplierDtos.SupplierRequest request) {
		Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
		applyRequest(supplier, request);
		return toResponse(supplierRepository.save(supplier));
	}

	public void delete(Long id) {
		Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
		supplierRepository.delete(supplier);
	}

	private void applyRequest(Supplier supplier, SupplierDtos.SupplierRequest request) {
		supplier.setName(request.name());
		supplier.setPhone(request.phone());
		supplier.setEmail(request.email());
		supplier.setAddress(request.address());
		supplier.setDeliveryStatus(request.deliveryStatus() != null ? request.deliveryStatus() : "Active");
		supplier.setNotes(request.notes());
	}

	private SupplierDtos.SupplierResponse toResponse(Supplier supplier) {
		return new SupplierDtos.SupplierResponse(
			supplier.getId(),
			supplier.getName(),
			supplier.getPhone(),
			supplier.getEmail(),
			supplier.getAddress(),
			supplier.getDeliveryStatus(),
			supplier.getNotes()
		);
	}
}
