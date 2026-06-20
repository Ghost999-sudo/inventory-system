package com.inventory.dto;

import java.math.BigDecimal;
import java.util.List;

public class ReportDtos {

	public record ReportMetric(
		String label,
		BigDecimal value
	) {
	}

	public record TopProductResponse(
		String name,
		Long quantity,
		BigDecimal revenue
	) {
	}

	public record DashboardReportResponse(
		BigDecimal todaySales,
		BigDecimal profit,
		Long lowStockCount,
		Long pendingOrders,
		List<TopProductResponse> topProducts
	) {
	}
}
