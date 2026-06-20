package com.inventory.controller;

import com.inventory.dto.ReportDtos;
import com.inventory.report.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// This class is a Spring REST controller that handles HTTP requests related to reports, specifically for generating dashboard reports.
@RestController
@RequestMapping("/api/reports")
public class ReportController {

	private final ReportService reportService;

	public ReportController(ReportService reportService) {
		this.reportService = reportService;
	}

	@GetMapping("/dashboard")
	public ResponseEntity<ReportDtos.DashboardReportResponse> dashboard() {
		return ResponseEntity.ok(reportService.getDashboardReport());
	}
}