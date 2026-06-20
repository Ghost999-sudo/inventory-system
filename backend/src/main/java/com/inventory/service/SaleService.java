package com.inventory.service;

import com.inventory.dto.SaleDtos;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.model.Product;
import com.inventory.model.Sale;
import com.inventory.model.SaleItem;
import com.inventory.repository.CustomerRepository;
import com.inventory.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

// This class is a Spring service that handles sale-related operations, such as creating and retrieving sales.
@Service
public class SaleService {

	private final SaleRepository saleRepository;
	private final ProductService productService;
	private final CustomerRepository customerRepository;
	private final StockNotificationService stockNotificationService;

	public SaleService(SaleRepository saleRepository, ProductService productService, CustomerRepository customerRepository, StockNotificationService stockNotificationService) {
		this.saleRepository = saleRepository;
		this.productService = productService;
		this.customerRepository = customerRepository;
		this.stockNotificationService = stockNotificationService;
	}

	@Transactional
	public SaleDtos.SaleResponse createSale(SaleDtos.SaleRequest request) {
		if (request.items() == null || request.items().isEmpty()) {
			throw new BadRequestException("Sale requires at least one item");
		}

		Sale sale = new Sale();
		sale.setReceiptNumber(generateReceiptNumber());
		sale.setCashierName(request.cashierName());
		sale.setCustomerName(request.customerName());
		sale.setPaymentMethod(request.paymentMethod());
		sale.setDiscount(defaultValue(request.discount()));
		sale.setTax(defaultValue(request.tax()));

		BigDecimal subtotal = BigDecimal.ZERO;
		for (SaleDtos.SaleItemRequest itemRequest : request.items()) {
			Product product = productService.findProductOrThrow(itemRequest.productId());
			if (product.getQuantity() < itemRequest.quantity()) {
				throw new BadRequestException("Insufficient stock for " + product.getName());
			}

			productService.adjustStock(product.getId(), -itemRequest.quantity());

			BigDecimal lineTotal = product.getSellingPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
			subtotal = subtotal.add(lineTotal);

			SaleItem item = new SaleItem();
			item.setProductId(product.getId());
			item.setProductName(product.getName());
			item.setQuantity(itemRequest.quantity());
			item.setUnitPrice(product.getSellingPrice());
			item.setLineTotal(lineTotal);
			sale.addItem(item);
		}

		sale.setSubtotal(subtotal);
		BigDecimal total = subtotal
			.subtract(defaultValue(request.discount()))
			.add(defaultValue(request.tax()))
			.setScale(2, RoundingMode.HALF_UP);
		sale.setTotal(total);
		sale.setPaymentStatus("M-Pesa".equalsIgnoreCase(request.paymentMethod()) ? "PENDING" : "PAID");
		Sale saved = saleRepository.save(sale);

		if (request.customerName() != null && !request.customerName().isBlank()) {
			customerRepository.findByNameIgnoreCase(request.customerName())
				.ifPresent(customer -> {
					customer.setTotalPurchases(customer.getTotalPurchases().add(total));
					customer.setLoyaltyPoints(customer.getLoyaltyPoints() + total.intValue() / 100);
					customerRepository.save(customer);
				});
		}

		SaleDtos.SaleResponse response = toResponse(saved);
		TransactionHooks.afterCommit(() -> stockNotificationService.broadcastSaleCreated(response));
		return response;
	}

	@Transactional(readOnly = true)
	public List<SaleDtos.SaleResponse> getAllSales() {
		return saleRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public SaleDtos.SaleResponse getSale(Long id) {
		return toResponse(saleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Sale not found")));
	}

	@Transactional(readOnly = true)
	public long countPendingSales() {
		return saleRepository.countByPaymentStatus("PENDING");
	}

	@Transactional(readOnly = true)
	public BigDecimal todaySalesTotal(Instant start, Instant end) {
		return saleRepository.findByCreatedAtBetween(start, end).stream()
			.map(Sale::getTotal)
			.reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	private SaleDtos.SaleResponse toResponse(Sale sale) {
		return new SaleDtos.SaleResponse(
			sale.getId(),
			sale.getReceiptNumber(),
			sale.getPaymentMethod(),
			sale.getPaymentStatus(),
			sale.getSubtotal(),
			sale.getDiscount(),
			sale.getTax(),
			sale.getTotal(),
			sale.getCreatedAt(),
			sale.getItems().stream()
				.map(item -> new SaleDtos.SaleItemResponse(
					item.getProductId(),
					item.getProductName(),
					item.getQuantity(),
					item.getUnitPrice(),
					item.getLineTotal()
				))
				.toList()
		);
	}

	private BigDecimal defaultValue(BigDecimal value) {
		return value == null ? BigDecimal.ZERO : value;
	}

	private String generateReceiptNumber() {
		return "R-" + System.currentTimeMillis();
	}
}
