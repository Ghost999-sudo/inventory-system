package com.inventory.report;

import com.inventory.dto.ReportDtos;
import com.inventory.service.SaleService;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {

	private final SaleService saleService;
	private final SaleRepository saleRepository;
	private final ProductRepository productRepository;

	public ReportService(SaleService saleService, SaleRepository saleRepository, ProductRepository productRepository) {
		this.saleService = saleService;
		this.saleRepository = saleRepository;
		this.productRepository = productRepository;
	}

	@Transactional(readOnly = true)
	public ReportDtos.DashboardReportResponse getDashboardReport() {
		Instant start = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
		Instant end = start.plusSeconds(86400);

		BigDecimal todaySales = saleService.todaySalesTotal(start, end);
		BigDecimal profit = calculateProfit(start, end);
		long lowStockCount = productRepository.findByQuantityLessThanEqual(20).size();
		long pendingOrders = saleService.countPendingSales();

		Map<String, Long> quantities = saleRepository.findByCreatedAtBetween(start, end).stream()
			.flatMap(sale -> sale.getItems().stream())
			.collect(Collectors.groupingBy(
				item -> item.getProductName(),
				Collectors.summingLong(item -> item.getQuantity() == null ? 0 : item.getQuantity())
			));

		Map<String, BigDecimal> revenues = saleRepository.findByCreatedAtBetween(start, end).stream()
			.flatMap(sale -> sale.getItems().stream())
			.collect(Collectors.groupingBy(
				item -> item.getProductName(),
				Collectors.reducing(BigDecimal.ZERO, item -> item.getLineTotal(), BigDecimal::add)
			));

		List<ReportDtos.TopProductResponse> topProducts = quantities.entrySet().stream()
			.sorted(Map.Entry.<String, Long>comparingByValue().reversed())
			.limit(5)
			.map(entry -> new ReportDtos.TopProductResponse(
				entry.getKey(),
				entry.getValue(),
				revenues.getOrDefault(entry.getKey(), BigDecimal.ZERO)
			))
			.toList();

		return new ReportDtos.DashboardReportResponse(todaySales, profit, lowStockCount, pendingOrders, topProducts);
	}

	private BigDecimal calculateProfit(Instant start, Instant end) {
		return saleRepository.findByCreatedAtBetween(start, end).stream()
			.flatMap(sale -> sale.getItems().stream())
			.map(item -> item.getUnitPrice().subtract(item.getUnitPrice().multiply(new BigDecimal("0.2"))).multiply(BigDecimal.valueOf(item.getQuantity())))
			.reduce(BigDecimal.ZERO, BigDecimal::add)
			.setScale(2, RoundingMode.HALF_UP);
	}
}
