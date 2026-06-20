package com.inventory.payment;

import com.inventory.dto.PaymentDtos;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.model.Payment;
import com.inventory.repository.PaymentRepository;
import com.inventory.repository.SaleRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class MpesaPaymentService {

	private final PaymentRepository paymentRepository;
	private final SaleRepository saleRepository;

	public MpesaPaymentService(PaymentRepository paymentRepository, SaleRepository saleRepository) {
		this.paymentRepository = paymentRepository;
		this.saleRepository = saleRepository;
	}

	public PaymentDtos.MpesaPaymentResponse requestPayment(PaymentDtos.MpesaPaymentRequest request) {
		saleRepository.findById(request.saleId()).orElseThrow(() -> new ResourceNotFoundException("Sale not found"));

		Payment payment = new Payment();
		payment.setSaleId(request.saleId());
		payment.setMethod("M-Pesa");
		payment.setPhoneNumber(request.phoneNumber());
		payment.setAmount(request.amount());
		payment.setStatus("PENDING");
		payment.setProviderReference("MPESA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
		payment.setProviderResponse("Payment request sent successfully");
		Payment saved = paymentRepository.save(payment);

		return new PaymentDtos.MpesaPaymentResponse(
			saved.getId(),
			saved.getProviderReference(),
			saved.getStatus(),
			"STK push requested"
		);
	}

	public Payment markPaymentConfirmed(String providerReference) {
		Payment payment = paymentRepository.findByProviderReference(providerReference)
			.orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
		payment.setStatus("COMPLETED");
		payment.setProviderResponse("Payment confirmed");
		Payment saved = paymentRepository.save(payment);

		saleRepository.findById(saved.getSaleId()).ifPresent(sale -> {
			sale.setPaymentStatus("PAID");
			saleRepository.save(sale);
		});

		return saved;
	}
}
