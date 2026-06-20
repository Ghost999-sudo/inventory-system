package com.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class SaleDtos {

	public record SaleItemRequest(
		@NotNull Long productId,
		@NotNull Integer quantity
	) {
	}

	public record SaleRequest(
		String customerName,
		String cashierName,
		@NotBlank String paymentMethod,
		BigDecimal discount,
		BigDecimal tax,
		@NotNull @Valid List<SaleItemRequest> items
	) {
	}

	public record SaleItemResponse(
		Long productId,
		String productName,
		Integer quantity,
		BigDecimal unitPrice,
		BigDecimal lineTotal
	) {
	}

	public record SaleResponse(
		Long id,
		String receiptNumber,
		String paymentMethod,
		String paymentStatus,
		BigDecimal subtotal,
		BigDecimal discount,
		BigDecimal tax,
		BigDecimal total,
		Instant createdAt,
		List<SaleItemResponse> items
	) {
	}
}
