package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PaymentDtos {

	public record MpesaPaymentRequest(
		@NotNull Long saleId,
		@NotBlank String phoneNumber,
		@NotNull BigDecimal amount
	) {
	}

	public record MpesaPaymentResponse(
		Long paymentId,
		String checkoutRequestId,
		String status,
		String message
	) {
	}
}
