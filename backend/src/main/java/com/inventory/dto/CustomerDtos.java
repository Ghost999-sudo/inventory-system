package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CustomerDtos {

	public record CustomerRequest(
		@NotBlank String name,
		String phone,
		String email
	) {
	}

	public record CustomerResponse(
		Long id,
		String name,
		String phone,
		String email,
		Integer loyaltyPoints,
		BigDecimal balance,
		BigDecimal totalPurchases
	) {
	}
}
