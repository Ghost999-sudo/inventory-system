package com.inventory.repository;

import com.inventory.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
	Optional<Sale> findByReceiptNumber(String receiptNumber);
	List<Sale> findByCreatedAtBetween(Instant start, Instant end);
	long countByPaymentStatus(String paymentStatus);
}
