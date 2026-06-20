package com.inventory.service;

import com.inventory.dto.ProductDtos;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

// This class is a Spring service that handles product-related operations, such as creating, updating, and retrieving product information.
@Service
public class ProductService {

	private final ProductRepository productRepository;
	private final StockNotificationService stockNotificationService;

	public ProductService(ProductRepository productRepository, StockNotificationService stockNotificationService) {
		this.productRepository = productRepository;
		this.stockNotificationService = stockNotificationService;
	}

	public List<ProductDtos.ProductResponse> getAllProducts() {
		return productRepository.findAll().stream().map(this::toResponse).toList();
	}

	public List<ProductDtos.ProductResponse> getLowStockProducts() {
		return productRepository.findByQuantityLessThanEqual(20).stream().map(this::toResponse).toList();
	}

	public ProductDtos.ProductResponse createProduct(ProductDtos.ProductRequest request) {
		if (productRepository.findByBarcode(request.barcode()).isPresent()) {
			throw new BadRequestException("Barcode already exists");
		}

		Product product = new Product();
		applyRequest(product, request);
		Product saved = productRepository.save(product);
		TransactionHooks.afterCommit(() -> stockNotificationService.broadcastStockUpdate(saved));
		return toResponse(saved);
	}

	public ProductDtos.ProductResponse upsertProduct(ProductDtos.ProductRequest request) {
		return productRepository.findByBarcode(request.barcode())
			.map(existing -> {
				applyRequest(existing, request);
				Product saved = productRepository.save(existing);
				TransactionHooks.afterCommit(() -> stockNotificationService.broadcastStockUpdate(saved));
				return toResponse(saved);
			})
			.orElseGet(() -> createProduct(request));
	}

	public ProductDtos.ProductResponse updateProduct(Long id, ProductDtos.ProductRequest request) {
		Product product = productRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		applyRequest(product, request);
		Product saved = productRepository.save(product);
		stockNotificationService.broadcastStockUpdate(saved);
		return toResponse(saved);
	}

	public void deleteProduct(Long id) {
		Product product = productRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		productRepository.delete(product);
	}

	@Transactional
	public Product adjustStock(Long productId, int delta) {
		Product product = productRepository.findById(productId)
			.orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		int updatedQuantity = product.getQuantity() + delta;
		if (updatedQuantity < 0) {
			throw new BadRequestException("Insufficient stock for adjustment");
		}
		product.setQuantity(updatedQuantity);
		Product saved = productRepository.save(product);
		TransactionHooks.afterCommit(() -> stockNotificationService.broadcastStockUpdate(saved));
		return saved;
	}

	public Product findProductOrThrow(Long id) {
		return productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
	}

	private void applyRequest(Product product, ProductDtos.ProductRequest request) {
		product.setName(request.name());
		product.setCategory(request.category());
		product.setBarcode(request.barcode());
		product.setBuyingPrice(request.buyingPrice());
		product.setSellingPrice(request.sellingPrice());
		product.setQuantity(request.quantity());
		product.setExpiryDate(request.expiryDate());
		product.setSupplierName(request.supplierName());
		product.setReorderLevel(request.reorderLevel() != null ? request.reorderLevel() : 20);
	}

	private ProductDtos.ProductResponse toResponse(Product product) {
		return new ProductDtos.ProductResponse(
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
		);
	}
}
