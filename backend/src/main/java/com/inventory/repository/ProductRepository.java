package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
	Optional<Product> findByBarcode(String barcode);
	List<Product> findByQuantityLessThanEqual(Integer quantity);
	List<Product> findByNameContainingIgnoreCase(String name);
}
