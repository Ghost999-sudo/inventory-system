package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public class SupplierDtos {

	public record SupplierRequest(
		@NotBlank String name,
		String phone,
		String email,
		String address,
		String deliveryStatus,
		String notes
	) {
	}

	public record SupplierResponse(
		Long id,
		String name,
		String phone,
		String email,
		String address,
		String deliveryStatus,
		String notes
	) {
	}
}
