package com.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SyncDtos {

	public record SyncBatchRequest(
		@Valid List<ProductDtos.ProductRequest> products,
		@Valid List<CustomerDtos.CustomerRequest> customers,
		@Valid List<SaleDtos.SaleRequest> sales
	) {
	}

	public record SyncBatchResponse(
		int productsSaved,
		int customersSaved,
		int salesSaved
	) {
	}
}
