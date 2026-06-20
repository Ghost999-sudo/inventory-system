package com.inventory.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductDtos {

	public record ProductRequest(
		@NotBlank String name,
		@NotBlank String category,
		@NotBlank String barcode,
		@NotNull @DecimalMin("0.0") BigDecimal buyingPrice,
		@NotNull @DecimalMin("0.0") BigDecimal sellingPrice,
		@NotNull @Min(0) Integer quantity,
		LocalDate expiryDate,
		@NotBlank String supplierName,
		Integer reorderLevel
	) {
	}

	public record ProductResponse(
		Long id,
		String name,
		String category,
		String barcode,
		BigDecimal buyingPrice,
		BigDecimal sellingPrice,
		Integer quantity,
		LocalDate expiryDate,
		Integer reorderLevel,
		String supplierName,
		String status
	) {
	}

	public record StockAdjustmentRequest(
		@NotNull Long productId,
		@NotNull Integer delta
	) {
	}
}
