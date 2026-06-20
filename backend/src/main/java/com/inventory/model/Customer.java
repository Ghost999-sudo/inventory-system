package com.inventory.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	private String phone;
	private String email;

	@Column(nullable = false)
	private Integer loyaltyPoints = 0;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal balance = BigDecimal.ZERO;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal totalPurchases = BigDecimal.ZERO;

	@Column(nullable = false, updatable = false)
	private Instant createdAt = Instant.now();
}
