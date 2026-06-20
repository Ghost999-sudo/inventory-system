package com.inventory.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String category;

	@Column(nullable = false, unique = true)
	private String barcode;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal buyingPrice;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal sellingPrice;

	@Column(nullable = false)
	private Integer quantity;

	private LocalDate expiryDate;

	@Column(nullable = false)
	private Integer reorderLevel = 20;

	@Column(nullable = false)
	private String supplierName;

	@Column(nullable = false)
	private String status = "Available";

	@Column(nullable = false, updatable = false)
	private Instant createdAt = Instant.now();

	@Column(nullable = false)
	private Instant updatedAt = Instant.now();

	@PrePersist
	@PreUpdate
	void refreshStatus() {
		updatedAt = Instant.now();
		status = quantity != null && quantity <= reorderLevel ? "Low Stock" : "Available";
	}
}
