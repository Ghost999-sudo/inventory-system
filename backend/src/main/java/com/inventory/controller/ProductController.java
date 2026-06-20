package com.inventory.controller;

import com.inventory.dto.ProductDtos;
import com.inventory.exception.BadRequestException;
import com.inventory.model.Product;
import com.inventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

// This class is a Spring REST controller that handles HTTP requests related to products.
@RestController
@RequestMapping("/api/products")
public class ProductController {

	private final ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping
	public ResponseEntity<List<ProductDtos.ProductResponse>> getAll() {
		return ResponseEntity.ok(productService.getAllProducts());
	}

	@GetMapping("/low-stock")
	public ResponseEntity<List<ProductDtos.ProductResponse>> getLowStock() {
		return ResponseEntity.ok(productService.getLowStockProducts());
	}

	@PostMapping
	public ResponseEntity<ProductDtos.ProductResponse> create(@Valid @RequestBody ProductDtos.ProductRequest request) {
		return ResponseEntity.ok(productService.createProduct(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProductDtos.ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductDtos.ProductRequest request) {
		return ResponseEntity.ok(productService.updateProduct(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		productService.deleteProduct(id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{id}/stock")
	public ResponseEntity<ProductDtos.ProductResponse> adjustStock(@PathVariable Long id, @RequestBody ProductDtos.StockAdjustmentRequest request) {
		if (request.productId() != null && !request.productId().equals(id)) {
			throw new BadRequestException("Product ID mismatch");
		}
		Product product = productService.adjustStock(id, request.delta());
		return ResponseEntity.ok(new ProductDtos.ProductResponse(
			product.getId(),
			product.getName(),
			product.getCategory(),
			product.getBarcode(),
			product.getBuyingPrice(),
			product.getSellingPrice(),
			product.getQuantity(),
			product.getExpiryDate(),
			product.getReorderLevel(),
			product.getSupplierName(),
			product.getStatus()
		));
	}
}
