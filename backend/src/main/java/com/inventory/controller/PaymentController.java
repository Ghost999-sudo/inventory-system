package com.inventory.controller;

import com.inventory.dto.PaymentDtos;
import com.inventory.payment.MpesaPaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// This class is a Spring REST controller that handles HTTP requests related to payments, specifically for Mpesa payment processing.
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

	private final MpesaPaymentService mpesaPaymentService;

	public PaymentController(MpesaPaymentService mpesaPaymentService) {
		this.mpesaPaymentService = mpesaPaymentService;
	}

	@PostMapping("/mpesa/request")
	public ResponseEntity<PaymentDtos.MpesaPaymentResponse> requestMpesa(@Valid @RequestBody PaymentDtos.MpesaPaymentRequest request) {
		return ResponseEntity.ok(mpesaPaymentService.requestPayment(request));
	}

	@PostMapping("/mpesa/{reference}/confirm")
	public ResponseEntity<?> confirmMpesa(@PathVariable String reference) {
		return ResponseEntity.ok(mpesaPaymentService.markPaymentConfirmed(reference));
	}
}
